/**
 * Chat message hooks for Token Action HUD Dragonbane
 * Handles button interactions in chat messages with permission checking
 */

/**
 * Get actor from speaker data (similar to DragonbaneUtils.getActorFromSpeakerData)
 * @param {object} speakerData - Speaker data with actor, scene, token
 * @returns {Actor|null} The actor or null if not found
 */
function getActorFromSpeakerData(speakerData) {
  // Try token first (for unlinked tokens)
  if (speakerData.token && speakerData.scene) {
    const scene = game.scenes.get(speakerData.scene);
    if (scene) {
      const tokenDoc = scene.tokens.get(speakerData.token);
      if (tokenDoc?.actor) {
        return tokenDoc.actor;
      }
    }
  }

  // Try direct actor lookup
  if (speakerData.actor) {
    const actor = game.actors.get(speakerData.actor);
    if (actor) {
      return actor;
    }
  }

  return null;
}

/**
 * Roll on the severe injury table
 * @returns {Promise<void>}
 */
async function rollSevereInjuryTable() {
  try {
    // Find severe injury table - support multiple language variants
    const table = game.tables.contents.find(
      (tbl) =>
        tbl.name.toLowerCase().includes("severe injury") ||
        tbl.name.toLowerCase().includes("svår skada") ||
        tbl.name.toLowerCase().includes("allvarlig skada")
    );

    if (!table) {
      const message =
        game.i18n.localize(
          "tokenActionHud.dragonbane.messages.severeInjury.tableNotFound"
        ) || "Severe Injury roll table not found";
      ui.notifications.warn(message);
      return;
    }

    // Draw from table (this creates its own chat message)
    await table.draw({ displayChat: true });
  } catch (error) {
    console.error(
      "Token Action HUD Dragonbane: Error rolling severe injury table:",
      error
    );
    const message =
      game.i18n.localize(
        "tokenActionHud.dragonbane.messages.severeInjury.tableFailed"
      ) || "Failed to roll severe injury table";
    ui.notifications.error(message);
  }
}

/**
 * Register chat message hooks
 * Called during module initialization
 */
export function registerChatHooks() {
  Hooks.on("renderChatMessage", (message, html, data) => {
    // Handle severe injury button clicks
    const severeInjuryBtn = html.find(".severe-injury-roll-btn");
    if (severeInjuryBtn.length > 0) {
      severeInjuryBtn.on("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const button = event.currentTarget;
        const actorId = button.dataset.actorId;
        const sceneId = button.dataset.sceneId;
        const tokenId = button.dataset.tokenId;

        try {
          // Get the actor using speaker data
          const speakerData = {
            actor: actorId,
            scene: sceneId,
            token: tokenId,
          };

          const actor = getActorFromSpeakerData(speakerData);

          if (!actor) {
            const errorMsg =
              game.i18n.localize(
                "tokenActionHud.dragonbane.messages.severeInjury.actorNotFound"
              ) || "Actor not found";
            console.error(
              "Token Action HUD Dragonbane:",
              errorMsg,
              "Actor ID:",
              actorId
            );
            ui.notifications.error(errorMsg);
            return;
          }

          // Permission check: must be owner OR GM
          if (!actor.isOwner && !game.user.isGM) {
            const noPermissionMsg =
              game.i18n.localize(
                "tokenActionHud.dragonbane.messages.severeInjury.noPermission"
              ) || "You don't have permission to roll for this character";
            ui.notifications.warn(noPermissionMsg);
            return;
          }

          // Roll the severe injury table
          await rollSevereInjuryTable();

          // Update button to show completion
          $(button)
            .text(
              game.i18n.localize(
                "tokenActionHud.dragonbane.messages.severeInjury.tableRolled"
              ) || "Severe Injury Rolled"
            )
            .prop("disabled", true)
            .css("opacity", "0.6");
        } catch (error) {
          console.error(
            "Token Action HUD Dragonbane: Error with severe injury button:",
            error
          );
          const errorMsg =
            game.i18n.localize(
              "tokenActionHud.dragonbane.messages.severeInjury.tableFailed"
            ) || "Failed to roll severe injury table";
          ui.notifications.error(errorMsg);
        }
      });
    }
  });
}
