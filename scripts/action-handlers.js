/**
 * Action handler methods for Token Action HUD Dragonbane
 * All handle* methods that respond to action clicks
 */

import { Utils } from "./utils.js";

export function createActionHandlers(coreModule) {
  return {
    /**
     * Handle stats action
     */
    handleStatsAction: async function (event, statKey) {
      const actor = this.actor;
      if (!actor) return;

      // Use utility function to create and send chat message
      await Utils.createStatsChatMessage(actor, statKey);
    },

    /**
     * Handle currency action
     * @param {object} event The event
     * @param {string} currencyType The type of currency (gold, silver, copper)
     */
    handleCurrencyAction: async function (event, currencyType) {
      const actor = this.actor;
      if (!actor) return;

      // Use utility function to create and send chat message
      await Utils.createCurrencyChatMessage(actor, currencyType);
    },

    /**
     * Handle traits action
     */
    handleTraitsAction: async function (event) {
      const actor = this.actor;

      // Guard: only NPCs and Monsters
      if (actor.type !== "npc" && actor.type !== "monster") {
        const message =
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.messages.traits.onlyForNpcsMonsters"
          ) || "Traits are only available for NPCs and Monsters";
        ui.notifications.warn(message);
        return;
      }

      // Check if traits exist and are not empty
      const traits = actor.system.traits?.trim();
      if (!traits) {
        const message =
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.messages.traits.noTraits"
          ) ||
          game.i18n.localize("DoD.ui.character-sheet.noTraits") ||
          "This actor has no traits.";
        ui.notifications.info(message);
        return;
      }

      try {
        // Get the localized traits label
        const traitsLabel = game.i18n.localize("DoD.ui.character-sheet.traits");

        // Build styled HTML card
        const content = `
                    <div style="border: 2px solid #00604d; padding: 10px; background: #f0e9de; margin: 5px 0;">
                        <h5 style="color: #00604d; border-bottom: 1px solid #00604d; padding-bottom: 5px; margin-top: 0;">
                            ${actor.name} — ${traitsLabel}
                        </h5>
                        <div style="font-size: 14px;">
                            ${traits}
                        </div>
                    </div>
                `;

        // Whisper to GM
        await ChatMessage.create({
          whisper: ChatMessage.getWhisperRecipients("GM"),
          content: content,
          speaker: ChatMessage.getSpeaker({ actor: actor }),
        });
      } catch (error) {
        console.error(
          "Token Action HUD Dragonbane: Error displaying traits:",
          error
        );
        const message =
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.messages.traits.failed"
          ) || "Failed to display traits";
        ui.notifications.error(message);
      }
    },

    handleWeaponAction: async function (event, weapon) {
      // This handler is no longer used for regular weapons
      // Weapons now route through RollHandler for proper right-click support
      console.warn(
        "Token Action HUD Dragonbane: handleWeaponAction called unexpectedly"
      );
    },

    handleSpellAction: async function (event, spell) {
      // This handler is no longer used for regular spells
      // Spells now route through RollHandler for proper right-click support
      console.warn(
        "Token Action HUD Dragonbane: handleSpellAction called unexpectedly"
      );
    },

    handleAbilityAction: async function (event, ability) {
      // This handler is no longer used for regular abilities
      // Abilities now route through RollHandler for proper right-click support
      console.warn(
        "Token Action HUD Dragonbane: handleAbilityAction called unexpectedly"
      );
    },

    handleSkillAction: async function (event, itemId, itemData) {
      const actor = this.actor;

      // Perform skill roll with fallback to sheet
      return this._tryDragonbaneActionOrSheet(itemData, "rollItem");
    },

    handleAttributeAction: async function (event, attributeKey) {
      const actor = this.actor;

      // Try actor sheet method first to show roll dialog with banes and boons
      try {
        if (actor.sheet && typeof actor.sheet._onAttributeRoll === "function") {
          // Create fake event with the attribute key
          const fakeEvent = {
            currentTarget: {
              dataset: {
                attribute: attributeKey,
              },
            },
            preventDefault: () => {},
            stopPropagation: () => {},
          };
          return actor.sheet._onAttributeRoll(fakeEvent);
        } else {
          // Direct fallback to game API (simplified from 3-layer to 2-layer)
          return game.dragonbane.rollAttribute(actor, attributeKey);
        }
      } catch (error) {
        // Silent fallback - attribute rolls are straightforward enough
        return null;
      }
    },

    handleFearTestAction: async function (event) {
      const actor = this.actor;

      // Block monsters
      if (actor.type === "monster") {
        const message =
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.messages.fearTest.notForMonsters"
          ) || "Fear tests are not available for monsters";
        ui.notifications.warn(message);
        return;
      }

      try {
        // Set flag to track this fear test
        await game.user.setFlag(
          "token-action-hud-dragonbane",
          "fearTestInProgress",
          {
            actorId: actor.id,
            actorUuid: actor.uuid,
            tokenId: this.token?.id,
            sceneId: canvas.scene?.id,
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            timestamp: Date.now(),
          }
        );

        // Clear flag after 5 seconds (safety timeout)
        setTimeout(async () => {
          await game.user.unsetFlag(
            "token-action-hud-dragonbane",
            "fearTestInProgress"
          );
        }, 5000);

        // Perform the WIL test
        await this.handleAttributeAction(event, "wil");
      } catch (error) {
        console.error(
          "Token Action HUD Dragonbane: Error with fear test:",
          error
        );
        await game.user.unsetFlag(
          "token-action-hud-dragonbane",
          "fearTestInProgress"
        );

        const message =
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.messages.fearTest.failed"
          ) || "Failed to perform fear test";
        ui.notifications.error(message);
      }
    },

    handleItemAction: async function (event, item) {
      const actor = this.actor;

      // Try to use item if consumable, otherwise open sheet
      if (item.type === "item" && item.system?.consumable) {
        return this._tryDragonbaneActionOrSheet(item, "useItem");
      }

      // For other items, just open the sheet
      return item.sheet?.render(true);
    },

    handleConditionAction: async function (event, condition) {
      const actor = this.actor;

      // For injuries and conditions, always open sheet for management
      return condition.sheet?.render(true);
    },

    handleConditionToggle: async function (
      event,
      effectId,
      attributeKey = null
    ) {
      const actor = this.actor;

      try {
        if (attributeKey) {
          // Handle attribute condition (sheet checkbox)
          const currentValue =
            actor.system?.conditions?.[attributeKey]?.value || false;
          const updateData = {};
          updateData[`system.conditions.${attributeKey}.value`] = !currentValue;

          await actor.update(updateData);
        } else {
          // Handle regular status effect
          await actor.toggleStatusEffect(effectId);
        }

        // Refresh HUD after a short delay
        setTimeout(() => {
          if (ui.TAHHUD) {
            ui.TAHHUD.update();
          }
        }, 100);
      } catch (error) {
        console.error(
          "Token Action HUD Dragonbane: Error toggling condition:",
          error
        );
        const message =
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.messages.conditions.failed"
          ) || "Failed to toggle condition";
        ui.notifications.error(message);
      }
    },

    handleRestAction: async function (event, restType) {
      const actor = this.actor;

      try {
        switch (restType) {
          case "roundRest":
            await actor.restRound();
            break;
          case "stretchRest":
            await actor.restStretch();
            break;
          case "shiftRest":
            await actor.restShift();
            break;
          case "restReset":
            await actor.restReset();
            break;
          default:
            const message =
              coreModule.api.Utils.i18n(
                "tokenActionHud.dragonbane.messages.rest.unknownType"
              ).replace("{restType}", restType) ||
              `Unknown rest type: ${restType}`;
            ui.notifications.warn(message);
        }
      } catch (error) {
        console.error(
          "Token Action HUD Dragonbane: Error with rest action:",
          error
        );
        const message =
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.messages.rest.failed"
          ) || "Failed to perform rest action";
        ui.notifications.error(message);
      }
    },

    /**
     * Handle unavailable rest action - show proper message
     */
    handleRestUnavailableAction: async function (restType) {
      const actor = this.actor;

      // Map rest types to display names
      const restTypeNames = {
        roundRest:
          coreModule.api.Utils.i18n("tokenActionHud.dragonbane.roundRest") ||
          "Round Rest",
        stretchRest:
          coreModule.api.Utils.i18n("tokenActionHud.dragonbane.stretchRest") ||
          "Stretch Rest",
        shiftRest:
          coreModule.api.Utils.i18n("tokenActionHud.dragonbane.shiftRest") ||
          "Shift Rest",
      };

      const restTypeName = restTypeNames[restType] || restType;
      const message =
        coreModule.api.Utils.i18n(
          "tokenActionHud.dragonbane.messages.rest.alreadyTaken"
        )
          .replace("{actor}", actor.name)
          .replace("{restType}", restTypeName) ||
        `${actor.name} has already taken a ${restTypeName}.`;

      // Show as notification only
      ui.notifications.info(message);
    },

    handleLightTestAction: async function (event) {
      const actor = this.actor;

      // Block monsters
      if (actor.type === "monster") {
        const message =
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.messages.lightTest.notForMonsters"
          ) || "Light tests are not available for monsters";
        ui.notifications.warn(message);
        return;
      }

      try {
        // Show light source selection dialog
        const choice = await this.showLightSourceDialog();
        if (!choice) return;

        // Get light source data
        const lightSourceData = this.getLightSourceData(choice);
        if (!lightSourceData) {
          const message =
            coreModule.api.Utils.i18n(
              "tokenActionHud.dragonbane.messages.lightTest.invalidSource"
            ) || "Invalid light source selected";
          ui.notifications.error(message);
          return;
        }

        // Roll the test
        const roll = new Roll(lightSourceData.dice);
        await roll.evaluate();

        const goesOut = roll.total === 1;

        // Create chat message
        const messageKey = goesOut ? "lightTest.out" : "lightTest.lit";
        const message =
          coreModule.api.Utils.i18n(
            `tokenActionHud.dragonbane.messages.${messageKey}`
          )
            ?.replace("{actor}", actor.name)
            ?.replace("{lightSource}", lightSourceData.name) ||
          `${actor.name}'s ${lightSourceData.name} ${
            goesOut ? "goes out!" : "remains lit."
          }`;

        const content = `
                    <div class="dice-roll" style="margin-bottom: 1em;">
                        <div class="dice-result">
                            <div class="dice-formula">${
                              lightSourceData.name
                            } Test (${lightSourceData.dice})</div>
                            <div class="dice-total">${roll.total}</div>
                        </div>
                    </div>
                    <div style="border: 2px solid ${
                      goesOut ? "#dc3545" : "#28a745"
                    }; padding: 10px; background: ${
          goesOut ? "rgba(220,53,69,.1)" : "rgba(40,167,69,.1)"
        }; margin: 5px 0;">
                        <p style="margin: 0;">${message}</p>
                    </div>
                `;

        await ChatMessage.create({
          author: game.user.id,
          speaker: ChatMessage.getSpeaker({ actor: actor }),
          content: content,
          rolls: [roll],
        });
      } catch (error) {
        console.error(
          "Token Action HUD Dragonbane: Error with light test:",
          error
        );
        const message =
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.messages.lightTest.failed"
          ) || "Failed to perform light test";
        ui.notifications.error(message);
      }
    },

    handleSevereInjuryAction: async function (event) {
      const actor = this.actor;

      // Guard: characters only
      if (actor.type !== "character") {
        const message =
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.messages.severeInjury.onlyForCharacters"
          ) || "Severe injury tests are only available for characters";
        ui.notifications.warn(message);
        return;
      }

      try {
        // Check for CON attribute
        const con = actor.system.attributes?.con;
        if (!con) {
          const message =
            coreModule.api.Utils.i18n(
              "tokenActionHud.dragonbane.messages.severeInjury.noConAttribute"
            ) || "Character has no CON attribute";
          ui.notifications.error(message);
          return;
        }

        // Show boons/banes dialog
        const dialogResult = await this.showSevereInjuryDialog(actor);
        if (!dialogResult) return; // Cancelled

        const { boons, banes } = dialogResult;

        // Perform the enhanced roll
        const rollResult = await this.performSevereInjuryRoll(
          actor,
          boons,
          banes
        );

        // Build enhanced chat content
        const speaker = ChatMessage.getSpeaker({ actor: actor });
        const content = await this.buildSevereInjuryChatContent(
          actor,
          rollResult,
          speaker
        );

        const msg = await ChatMessage.create({
          author: game.user.id,
          speaker: speaker,
          content: content,
          rolls: [rollResult.roll],
        });
      } catch (error) {
        console.error(
          "Token Action HUD Dragonbane: Error with severe injury test:",
          error
        );
        const message =
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.messages.severeInjury.failed"
          ) || "Failed to perform severe injury test";
        ui.notifications.error(message);
      }
    },

    handleCombatSkillAction: async function (event, skillKey) {
      const actor = this.actor;

      // Find the skill by localized name
      try {
        if (actor.system.coreSkills) {
          const localizedSkillName = Utils.getLocalizedSkillName(skillKey);
          const skill = actor.system.coreSkills.find(
            (s) => s.name === localizedSkillName
          );
          if (skill) {
            return game.dragonbane.rollItem(skill.name, "skill");
          }
        }

        // If skill not found, show warning
        const localizedSkillName = Utils.getLocalizedSkillName(skillKey);
        const message =
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.messages.skills.notFound"
          )
            ?.replace("{skillName}", localizedSkillName)
            ?.replace("{actor}", actor.name) ||
          `${localizedSkillName} skill not found on ${actor.name}`;
        ui.notifications.warn(message);
      } catch (error) {
        console.warn(
          `Token Action HUD Dragonbane: Could not perform ${skillKey} skill test`,
          error
        );
        const localizedSkillName = Utils.getLocalizedSkillName(skillKey);
        const message =
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.messages.skills.testFailed"
          )?.replace("{skillName}", localizedSkillName) ||
          `Could not perform ${localizedSkillName} skill test`;
        ui.notifications.warn(message);
      }
    },

    handleDeathRollAction: async function (event) {
      const actor = this.actor;

      // Delegate to the sheet's death roll method (handles roll AND updates)
      try {
        if (actor.sheet && typeof actor.sheet._onDeathRoll === "function") {
          // Create fake event for the sheet method
          const fakeEvent = {
            preventDefault: () => {},
            stopPropagation: () => {},
          };
          return actor.sheet._onDeathRoll(fakeEvent);
        } else {
          // Silent fallback if sheet method not available
          const message =
            coreModule.api.Utils.i18n(
              "tokenActionHud.dragonbane.messages.deathRoll.failed"
            ) || "Could not perform death roll";
          ui.notifications.warn(message);
        }
      } catch (error) {
        // Silent fallback - just show user notification
        const message =
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.messages.deathRoll.failed"
          ) || "Could not perform death roll";
        ui.notifications.warn(message);
      }
    },

    /**
     * Handle monster attack action
     * @param {object} event The event
     * @param {string} actionId The action ID ('random' or attack index)
     */
    handleMonsterAttack: async function (event, actionId) {
      const actor = this.actor;

      if (actor.type !== "monster") {
        const message =
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.messages.monster.attacksOnlyForMonsters"
          ) || "Monster attacks can only be used by monsters";
        ui.notifications.warn(message);
        return;
      }

      const attackTable = actor.system.attackTable
        ? fromUuidSync(actor.system.attackTable)
        : null;
      if (!attackTable) {
        ui.notifications.warn(
          game.i18n.localize("DoD.WARNING.missingMonsterAttackTable")
        );
        return;
      }

      try {
        let tableResult = null;
        let roll = null;

        if (actionId === "random") {
          // Use system method to get the table result
          const draw = await actor.drawMonsterAttack(attackTable);
          tableResult = draw.results[0];
          roll = draw.roll;
        } else {
          // Specific attack
          const attackIndex = parseInt(actionId);
          tableResult = attackTable.results.find(
            (result) => result.range[0] === attackIndex
          );
          if (!tableResult) {
            const message =
              coreModule.api.Utils.i18n(
                "tokenActionHud.dragonbane.messages.monster.attackNotFound"
              )?.replace("{attackIndex}", attackIndex) ||
              `Attack ${attackIndex} not found in table`;
            ui.notifications.warn(message);
            return;
          }
        }

        // Create chat message using utility function
        const content = Utils.createMonsterAttackChatContent(
          tableResult,
          attackTable,
          roll
        );

        await ChatMessage.create({
          author: game.user.id,
          speaker: ChatMessage.getSpeaker({ actor: actor }),
          content: content,
          rolls: roll ? [roll] : [],
        });
      } catch (error) {
        console.error("Monster attack error:", error);
        const message =
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.messages.monster.attackFailed"
          ) || "Failed to execute monster attack";
        ui.notifications.error(message);
      }
    },

    /**
     * Handle monster defend action
     * @param {object} event The event
     */
    handleMonsterDefend: async function (event) {
      const actor = this.actor;

      if (actor.type !== "monster") {
        const message =
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.messages.monster.defendOnlyForMonsters"
          ) || "Monster defend can only be used by monsters";
        ui.notifications.warn(message);
        return;
      }

      try {
        return game.dragonbane.monsterDefend(actor);
      } catch (error) {
        console.error("Monster defend error:", error);
        const message =
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.messages.monster.defendFailed"
          ) || "Failed to execute monster defend";
        ui.notifications.error(message);
      }
    },

    /**
     * Handle monster weapon damage action
     * @param {object} event The event
     * @param {object} weapon The weapon item
     */
    handleMonsterWeaponDamage: async function (event, weapon) {
      const actor = this.actor;

      if (actor.type !== "monster") {
        const message =
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.messages.monster.weaponDamageOnlyForMonsters"
          ) || "Monster weapon damage can only be used by monsters";
        ui.notifications.warn(message);
        return;
      }

      try {
        // Import the official Dragonbane damage function
        const { inflictDamageMessage } = await import(
          "/systems/dragonbane/modules/chat.js"
        );

        // Build damage data using official format
        const damageData = {
          actor: actor,
          weapon: weapon,
          damage: weapon.system.damage, // e.g., "2d8"
          damageType: weapon.system.damageType || "DoD.damageTypes.bludgeoning",
          target: null, // No specific target for monster weapon damage rolls
        };

        // Use official Dragonbane damage system
        await inflictDamageMessage(damageData);
      } catch (error) {
        console.error("Monster weapon damage error:", error);
        const message =
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.messages.monster.weaponDamageFailed"
          ) || "Failed to roll weapon damage";
        ui.notifications.error(message);
      }
    },
  };
}
