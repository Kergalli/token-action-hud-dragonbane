export let RollHandler = null;

Hooks.once("tokenActionHudCoreApiReady", async (coreModule) => {
  /**
   * Extends Token Action HUD Core's RollHandler class and handles action events triggered when an action is clicked
   * This serves as a minimal fallback for actions not handled by onClick properties in ActionHandler
   */
  RollHandler = class RollHandler extends coreModule.api.RollHandler {
    /**
     * Handle action click
     * Called by Token Action HUD Core when an action is left or right-clicked
     * @override
     * @param {object} event        The event
     * @param {string} encodedValue The encoded value
     */
    async handleActionClick(event, encodedValue) {
      const [actionTypeId, actionId] = encodedValue.split("|");

      // Combat Actions Handler - MUST BE BEFORE RENDERABLE ITEMS CHECK
      if (actionTypeId === "combatAction") {
        if (this.isRenderItem()) {
          return this.whisperCombatActionRules(actionId);
        } else {
          return this.performCombatAction(actionId);
        }
      }

      // Journey Actions Handler
      if (actionTypeId === "journeyAction") {
        if (this.isRenderItem()) {
          // Right-click: whisper rules summary
          return this.whisperJourneyActionRules(actionId);
        } else {
          // Left-click: perform action
          return this.performJourneyAction(actionId);
        }
      }

      // Handle right-click sheet rendering for items
      const renderable = [
        "weapon",
        "spell",
        "ability",
        "item",
        "armor",
        "helmet",
        "injury",
        "skill",
      ];
      if (renderable.includes(actionTypeId) && this.isRenderItem()) {
        return this.renderItem(this.actor, actionId);
      }

      // Handle left-click actions for items
      if (renderable.includes(actionTypeId)) {
        // Get the item from the actor
        const item = this.actor.items.get(actionId);
        if (!item) {
          console.warn(
            "Token Action HUD Dragonbane: Item not found:",
            actionId
          );
          return;
        }

        try {
          switch (actionTypeId) {
            case "weapon":
              // Check if weapon is broken
              if (item.system?.broken === true) {
                const message =
                  game.i18n.format(
                    "tokenActionHud.dragonbane.messages.weapons.weaponBroken",
                    { weapon: item.name }
                  ) || `${item.name} is broken and cannot be used!`;
                ui.notifications.warn(message);
                return;
              }
              return game.dragonbane.rollItem(item.name, item.type);

            case "spell":
              // Use the exact same logic as action-builders.js to identify Magic Tricks
              let rank = item.system?.rank || 0;
              if (item.system?.school?.toLowerCase() === "general") rank = 0;

              if (rank === 0) {
                // Magic Trick - handle directly like character sheet does
                return this.handleMagicTrick(item);
              } else {
                // Regular spell - use core system
                return game.dragonbane.useItem(item.name, item.type);
              }

            case "ability":
              return game.dragonbane.rollItem(item.name, item.type);

            case "skill":
              return game.dragonbane.rollItem(item.name, item.type);

            default:
              // For other item types, try to use them or open sheet
              if (item.type === "item" && item.system?.consumable) {
                return game.dragonbane.useItem(item.name, item.type);
              }
              return item.sheet?.render(true);
          }
        } catch (error) {
          console.warn(
            "Token Action HUD Dragonbane: Action failed, opening sheet:",
            error
          );
          return item.sheet?.render(true);
        }
      }

      // All other actions are handled by onClick in ActionHandler
      // This is just a fallback in case encodedValue is used instead of onClick
      console.warn(
        `Token Action HUD Dragonbane: Fallback handler called for ${actionTypeId}:${actionId} - consider using onClick instead`
      );
    }

    /**
     * Handle action hover
     * Called by Token Action HUD Core when an action is hovered on or off
     * @override
     * @param {object} event        The event
     * @param {string} encodedValue The encoded value
     */
    async handleActionHover(event, encodedValue) {
      // No hover behavior needed - actions use onClick
    }

    /**
     * Handle magic trick casting with confirmation dialog
     * @param {object} item The magic trick item
     */
    async handleMagicTrick(item) {
      const actor = this.actor;

      // Check if actor has enough WP
      if (actor.type !== "monster" && actor.system.willPoints.value < 1) {
        const warning = game.i18n.localize("DoD.WARNING.notEnoughWPForSpell");
        ui.notifications.warn(warning);
        return;
      }

      // Show confirmation dialog exactly like character sheet
      const title = game.i18n.localize("DoD.ui.dialog.castMagicTrickTitle");
      const content = game.i18n.format("DoD.ui.dialog.castMagicTrickContent", {
        spell: item.name,
      });

      const use = await new Promise((resolve) => {
        const data = {
          title: title,
          content: content,
          buttons: {
            ok: {
              icon: '<i class="fas fa-check"></i>',
              label: game.i18n.localize("Yes"),
              callback: () => resolve(true),
            },
            cancel: {
              icon: '<i class="fas fa-times"></i>',
              label: game.i18n.localize("No"),
              callback: () => resolve(false),
            },
          },
          default: "cancel",
          close: () => resolve(false),
        };
        new Dialog(data, null).render(true);
      });
      if (!use) return;

      // ADDED: Auto-target personal spells (v12/v13 compatible with UI fix)
      if (item.system?.rangeType === "personal") {
        const casterToken =
          canvas.tokens.controlled[0] || actor.getActiveTokens()[0];
        if (casterToken) {
          try {
            // Properly clear existing targets with UI update
            if (game.user.targets.size > 0) {
              const currentTargets = Array.from(game.user.targets);
              currentTargets.forEach((t) => {
                if (t.setTarget) {
                  t.setTarget(false, { user: game.user });
                }
              });
              game.user.targets.clear();
            }

            // Small delay for UI update
            await new Promise((resolve) => setTimeout(resolve, 50));

            // v13: Use the new targeting method
            if (casterToken.object) {
              casterToken.object.setTarget(true, {
                user: game.user,
                releaseOthers: true,
              });
            } else if (casterToken.setTarget) {
              // v12: Direct setTarget
              casterToken.setTarget(true, {
                user: game.user,
                releaseOthers: true,
              });
            } else if (game.user.updateTokenTargets) {
              // Older v12 fallback
              game.user.updateTokenTargets([casterToken.id]);
            }
          } catch (error) {
            console.warn(
              `Token Action HUD: Auto-targeting failed for ${item.name}:`,
              error
            );
          }
        }
      }

      // Handle WP spending and chat message exactly like character sheet
      try {
        if (actor.type !== "monster") {
          const oldWP = actor.system.willPoints.value;
          const newWP = oldWP - 1;
          await actor.update({ "system.willPoints.value": newWP });

          let content =
            "<p>" +
            game.i18n.format("DoD.ui.chat.castMagicTrick", {
              actor: actor.name,
              spell: item.name,
              uuid: item.uuid,
            }) +
            "</p>";

          content += `<div class="damage-details permission-observer" data-actor-id="${
            actor.uuid
          }">
                <i class="fa-solid fa-circle-info"></i>
                <div class="expandable" style="text-align: left; margin-left: 0.5em">
                    <b>${game.i18n.localize(
                      "DoD.ui.character-sheet.wp"
                    )}:</b> ${oldWP} <i class="fa-solid fa-arrow-right"></i> ${newWP}<br>
                </div>
            </div>`;
          ChatMessage.create({
            content: content,
            speaker: ChatMessage.getSpeaker({ actor: actor }),
          });
        } else {
          // Monsters don't spend WP
          const content =
            "<p>" +
            game.i18n.format("DoD.ui.chat.castMagicTrick", {
              actor: actor.name,
              spell: item.name,
              uuid: item.uuid,
            }) +
            "</p>";
          ChatMessage.create({
            content: content,
            speaker: ChatMessage.getSpeaker({ actor: actor }),
          });
        }
      } catch (error) {
        console.error(
          "Token Action HUD Dragonbane: Error casting magic trick",
          error
        );
        ui.notifications.error("Failed to cast magic trick");
      }
    }

    /**
     * Handle group click
     * Called by Token Action HUD Core when a group is right-clicked while the HUD is locked
     * @override
     * @param {object} event The event
     * @param {object} group The group
     */
    async handleGroupClick(event, group) {
      // No group click behavior needed
    }

    /**
     * Whisper combat action rules to the triggering player
     */
    async whisperCombatActionRules(actionId) {
      const rulesKey = `tokenActionHud.dragonbane.combatActionRules.${actionId}`;
      const title = game.i18n.localize(`${rulesKey}.title`);

      if (
        !title ||
        title.includes("tokenActionHud.dragonbane.combatActionRules")
      ) {
        ui.notifications.warn(`Rules not found for combat action: ${actionId}`);
        return;
      }

      // Build content from individual rule keys (same as Combat Assistant)
      let content = "";
      const ruleKeys = this.getCombatActionRuleKeys(actionId);

      for (const ruleKey of ruleKeys) {
        const ruleText = game.i18n.localize(`${rulesKey}.${ruleKey}`);
        if (
          ruleText &&
          !ruleText.includes("tokenActionHud.dragonbane.combatActionRules")
        ) {
          content += `<li>${ruleText}</li>`; // Build as <li> elements like Combat Assistant
        }
      }

      if (!content) {
        ui.notifications.warn(`No rules found for combat action: ${actionId}`);
        return;
      }

      // Use the same structure as Combat Assistant
      const chatContent = `<div class="dragonbane-action-rules"><ul>${content}</ul></div>`;

      // Create speaker alias like Combat Assistant does
      const speakerName =
        game.i18n.format("tokenActionHud.dragonbane.speakers.combatAction", {
          action: title,
        }) || `${title} Rules`;

      await ChatMessage.create({
        content: chatContent,
        speaker: { alias: speakerName },
        whisper: [game.user.id],
        flags: {
          "token-action-hud-dragonbane": {
            combatActionRules: true,
          },
        },
      });
    }

    /**
     * Get the rule keys for each combat action
     */
    getCombatActionRuleKeys(actionId) {
      const ruleKeyMap = {
        dodge: [
          "skill",
          "reaction",
          "declaration",
          "roll",
          "cannotCombine",
          "proneAllowed",
          "initiative",
          "successMovement",
          "monsterAttacks",
        ],
        firstAid: [
          "skill",
          "target",
          "range",
          "action",
          "equipment",
          "attempts",
          "success",
          "cannotSelfHeal",
          "limitation",
        ],
        rallySelf: ["skill", "penalty", "target", "action", "success"],
        rallyOther: [
          "skill",
          "target",
          "range",
          "action",
          "success",
          "limitation",
        ],
        deathRoll: [
          "skill",
          "when",
          "roll",
          "incapacitated",
          "successCondition",
          "failureCondition",
          "dragonBonus",
          "demonPenalty",
          "additionalDamage",
          "combatEnds",
          "recovery",
        ],
      };

      return ruleKeyMap[actionId] || [];
    }

    /**
     * Perform combat action (left-click)
     */
    async performCombatAction(actionId) {
      const actor = this.actor;

      try {
        switch (actionId) {
          case "dodge":
            return this.callSkillAction(actor, "evade");

          case "firstAid":
            return this.callSkillAction(actor, "healing");

          case "rallyOther":
            return this.callSkillAction(actor, "persuasion");

          case "rallySelf":
            try {
              // Do WIL test FIRST
              const rollResult = await this.callAttributeAction(actor, "wil");

              // Only apply action status if roll was completed successfully
              if (rollResult !== false) {
                const actionEffect = CONFIG.statusEffects.find(
                  (e) => e.id === "action1"
                );

                if (
                  actionEffect &&
                  !actor.effects.some((e) => e.statuses?.has("action1"))
                ) {
                  await actor.createEmbeddedDocuments("ActiveEffect", [
                    {
                      name: game.i18n.localize(actionEffect.name), // LOCALIZE the key
                      label: game.i18n.localize(actionEffect.name), // LOCALIZE the key
                      icon: "modules/yze-combat/assets/icons/slow-action.svg", // Use direct path
                      statuses: ["action1"],
                    },
                  ]);
                }
              }

              return rollResult;
            } catch (error) {
              console.error("Rally Self roll failed:", error);
              return false;
            }

          case "deathRoll":
            return this.callDeathRollAction(actor);

          default:
            ui.notifications.warn(`Unknown combat action: ${actionId}`);
        }
      } catch (error) {
        console.error("Error performing combat action:", error);
        ui.notifications.error(`Failed to perform ${actionId} action`);
      }
    }

    /**
     * Call skill action directly
     */
    async callSkillAction(actor, skillKey) {
      const localizedSkillName = game.i18n.localize(
        `tokenActionHud.dragonbane.skillNames.${skillKey}`
      );

      const skill = actor.system.coreSkills.find(
        (s) => s.name === localizedSkillName
      );

      if (skill) {
        return game.dragonbane.rollItem(skill.name, "skill");
      } else {
        ui.notifications.warn(
          `${localizedSkillName} skill not found on ${actor.name}`
        );
      }
    }

    /**
     * Call attribute action directly
     */
    async callAttributeAction(actor, attributeKey) {
      if (actor.sheet && typeof actor.sheet._onAttributeRoll === "function") {
        const fakeEvent = {
          currentTarget: {
            dataset: { attribute: attributeKey },
          },
          preventDefault: () => {},
        };
        return actor.sheet._onAttributeRoll(fakeEvent);
      } else {
        ui.notifications.error(
          "Could not perform attribute roll - sheet method not available"
        );
      }
    }

    /**
     * Call death roll action directly
     */
    async callDeathRollAction(actor) {
      try {
        if (actor.sheet && typeof actor.sheet._onDeathRoll === "function") {
          const fakeEvent = {
            preventDefault: () => {},
            stopPropagation: () => {},
            currentTarget: null,
            target: null,
            type: "click",
          };
          return actor.sheet._onDeathRoll(fakeEvent);
        } else {
          ui.notifications.error(
            "Could not perform death roll - method not available"
          );
        }
      } catch (error) {
        console.error("Error performing death roll:", error);
        ui.notifications.error("Failed to perform death roll");
      }
    }

    /**
     * Whisper journey action rules to the triggering player
     */
    async whisperJourneyActionRules(actionId) {
      const rulesKey = `tokenActionHud.dragonbane.journeyActionRules.${actionId}`;
      const title = game.i18n.localize(`${rulesKey}.title`);

      if (
        !title ||
        title.includes("tokenActionHud.dragonbane.journeyActionRules")
      ) {
        ui.notifications.warn(
          `Rules not found for journey action: ${actionId}`
        );
        return;
      }

      // Build content from individual rule keys
      let content = "";
      const ruleKeys = this.getJourneyActionRuleKeys(actionId);

      for (const ruleKey of ruleKeys) {
        const ruleText = game.i18n.localize(`${rulesKey}.${ruleKey}`);
        if (
          ruleText &&
          !ruleText.includes("tokenActionHud.dragonbane.journeyActionRules")
        ) {
          content += `<li>${ruleText}</li>`;
        }
      }

      if (!content) {
        ui.notifications.warn(`No rules found for journey action: ${actionId}`);
        return;
      }

      const chatContent = `<div class="dragonbane-action-rules"><ul>${content}</ul></div>`;
      const speakerName =
        game.i18n.format("tokenActionHud.dragonbane.speakers.journeyAction", {
          action: title,
        }) || `${title} Rules`;

      await ChatMessage.create({
        content: chatContent,
        speaker: { alias: speakerName },
        whisper: [game.user.id],
        flags: {
          "token-action-hud-dragonbane": {
            journeyActionRules: true,
          },
        },
      });
    }

    /**
     * Get the rule keys for each journey action
     */
    getJourneyActionRuleKeys(actionId) {
      const ruleKeyMap = {
        pathfinder: [
          "skill",
          "whenNeeded",
          "appointment",
          "spyglass",
          "noMap",
          "difficultTerrain",
          "failure",
          "dragonBonus",
        ],
        makeCamp: [
          "skill",
          "sleepRequirement",
          "equipmentPenalty",
          "failure",
          "tentBonus",
          "tentSharing",
          "tentFailure",
          "dangerousAreas",
          "coldWeather",
        ],
        hunt: [
          "skill",
          "equipment",
          "twoStep",
          "animalTable",
          "killTrap",
          "yield",
          "noTravel",
        ],
        fish: ["skill", "equipment", "fishingRod", "fishingNet", "noTravel"],
        forage: ["skill", "winterPenalty", "fallBonus", "success", "noTravel"],
        cook: [
          "skill",
          "rawRisk",
          "rawPlants",
          "capacity",
          "fieldKitchen",
          "properKitchen",
          "failure",
        ],
      };

      return ruleKeyMap[actionId] || [];
    }

    /**
     * Perform journey action (left-click)
     */
    async performJourneyAction(actionId) {
      const actor = this.actor;

      // Map action IDs to skill keys for translation lookup
      const actionToSkillMap = {
        pathfinder: "bushcraft", // pathfinder action → bushcraft skill
        makeCamp: "bushcraft", // makeCamp action → bushcraft skill
        hunt: "huntingfishing", // hunt action → huntingfishing skill
        fish: "huntingfishing", // fish action → huntingfishing skill
        forage: "bushcraft", // forage action → bushcraft skill
        cook: "bushcraft", // cook action → bushcraft skill (or whatever cooking uses)
      };

      const skillKey = actionToSkillMap[actionId];

      if (skillKey) {
        return this.callSkillAction(actor, skillKey);
      } else {
        ui.notifications.warn(`Unknown journey action: ${actionId}`);
      }
    }

    /**
     * Handle group click
     * Called by Token Action HUD Core when a group is right-clicked while the HUD is locked
     * @override
     * @param {object} event The event
     * @param {object} group The group
     */
    async handleGroupClick(event, group) {
      // No group click behavior needed
    }
  };
});
