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
        console.log(
          "Token Action HUD Dragonbane: Right-click detected, opening sheet for:",
          actionTypeId,
          actionId
        );
        return this.renderItem(this.actor, actionId);
      }

      // Handle left-click actions for items
      if (renderable.includes(actionTypeId)) {
        console.log(
          "Token Action HUD Dragonbane: Left-click detected, performing action for:",
          actionTypeId,
          actionId
        );

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

            console.log(
              `Token Action HUD: Auto-targeted ${actor.name} for personal spell: ${item.name}`
            );
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
  };
});
