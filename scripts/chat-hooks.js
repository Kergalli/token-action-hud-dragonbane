/**
 * Chat message hooks for Token Action HUD Dragonbane
 * Handles button interactions in chat messages with permission checking
 */

/**
 * Get actor from speaker data
 */
function getActorFromSpeakerData(speakerData) {
  if (speakerData.token && speakerData.scene) {
    const scene = game.scenes.get(speakerData.scene);
    if (scene) {
      const tokenDoc = scene.tokens.get(speakerData.token);
      if (tokenDoc?.actor) {
        return tokenDoc.actor;
      }
    }
  }
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
 * Uses UUID from settings if available, falls back to name-based detection
 * @returns {Promise<void>}
 */
async function rollSevereInjuryTable() {
  try {
    let table = null;

    // Try UUID from settings first
    const tableUuid = game.settings.get(
      "token-action-hud-dragonbane",
      "severeInjuryTableUuid"
    );

    if (tableUuid) {
      try {
        table = await fromUuid(tableUuid);
        if (!table) {
          console.warn(
            `Token Action HUD Dragonbane: Severe Injury table UUID "${tableUuid}" not found, falling back to name detection`
          );
        }
      } catch (error) {
        console.warn(
          `Token Action HUD Dragonbane: Error loading Severe Injury table from UUID "${tableUuid}":`,
          error
        );
      }
    }

    // Fallback to name-based detection
    if (!table) {
      table = game.tables.contents.find(
        (tbl) =>
          tbl.name.toLowerCase().includes("severe injury") ||
          tbl.name.toLowerCase().includes("svår skada")
      );
    }

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
 * Roll on the fear effect table
 * Uses UUID from settings if available, falls back to name-based detection
 * @returns {Promise<void>}
 */
async function rollFearEffectTable() {
  try {
    let table = null;

    // Try UUID from settings first
    const tableUuid = game.settings.get(
      "token-action-hud-dragonbane",
      "fearEffectTableUuid"
    );

    if (tableUuid) {
      try {
        table = await fromUuid(tableUuid);
        if (!table) {
          console.warn(
            `Token Action HUD Dragonbane: Fear Effect table UUID "${tableUuid}" not found, falling back to name detection`
          );
        }
      } catch (error) {
        console.warn(
          `Token Action HUD Dragonbane: Error loading Fear Effect table from UUID "${tableUuid}":`,
          error
        );
      }
    }

    // Fallback to name-based detection
    if (!table) {
      table = game.tables.contents.find(
        (tbl) =>
          tbl.name.toLowerCase().includes("fear") ||
          tbl.name.toLowerCase().includes("skräck")
      );
    }

    if (!table) {
      const message =
        game.i18n.localize(
          "tokenActionHud.dragonbane.messages.fearEffect.tableNotFound"
        ) || "Fear effect table not found";
      ui.notifications.warn(message);
      return;
    }

    // Draw from table (this creates its own chat message)
    await table.draw({ displayChat: true });
  } catch (error) {
    console.error(
      "Token Action HUD Dragonbane: Error rolling fear effect table:",
      error
    );
    const message =
      game.i18n.localize(
        "tokenActionHud.dragonbane.messages.fearEffect.tableFailed"
      ) || "Failed to roll fear effect table";
    ui.notifications.error(message);
  }
}

/**
 * Register chat message hooks
 */
export function registerChatHooks() {
  /**
   * Hook 1: Detect Fear Test failures and create follow-up message
   */
  Hooks.on("createChatMessage", async (message, options, userId) => {
    // Only run for the user who created the message
    if (userId !== game.user.id) return;

    // Check if we're tracking a fear test
    const fearTestData = game.user.getFlag(
      "token-action-hud-dragonbane",
      "fearTestInProgress"
    );

    if (!fearTestData) return;
    if (message.speaker?.actor !== fearTestData.actorId) return;

    // Parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = message.content;
    const skillRollDiv = tempDiv.querySelector(".skill-roll");
    if (!skillRollDiv) return;

    const target = parseInt(skillRollDiv.getAttribute("data-target"));
    const result = parseInt(skillRollDiv.getAttribute("data-result"));
    const isFailed = result > target || result === 20;
    if (!isFailed) return;

    // Clear flag
    await game.user.unsetFlag(
      "token-action-hud-dragonbane",
      "fearTestInProgress"
    );

    // Get actor
    const actor = getActorFromSpeakerData(fearTestData.speaker);
    if (!actor) return;

    // Delayed message creation
    setTimeout(async () => {
      const followUpContent = `
        <div style="border: 2px solid #dc3545; padding: 10px; background: rgba(220,53,69,.1); margin: 5px 0;">
          <p style="margin: 0;">
            ${
              game.i18n.localize(
                "tokenActionHud.dragonbane.messages.fearEffect.instruction"
              ) ||
              "If the <strong>WIL</strong> roll fails, you must roll on the fear table:"
            }
          </p>
          <button class="fear-effect-roll-btn"
                  data-actor-id="${fearTestData.actorId}"
                  data-scene-id="${fearTestData.sceneId}"
                  data-token-id="${fearTestData.tokenId}"
                  style="background: #dc3545; color: #fff; border: 1px solid #b5b3a4; padding: 8px 8px; border-radius: 3px; cursor: pointer; margin-top: 8px; height: 32px; width: 100%; text-align: center; display: block;">
            ${
              game.i18n.localize(
                "tokenActionHud.dragonbane.messages.fearEffect.rollButton"
              ) || "Roll Fear Effect"
            }
          </button>
        </div>
      `;

      await ChatMessage.create({
        author: game.user.id,
        speaker: fearTestData.speaker,
        content: followUpContent,
        whisper: message.whisper,
      });
    }, 4000);
  });

  /**
   * Hook 2: Handle button clicks
   */
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
            ui.notifications.warn(errorMsg);
            return;
          }

          const canClick = actor.isOwner || game.user.isGM;
          if (!canClick) {
            const errorMsg =
              game.i18n.localize(
                "tokenActionHud.dragonbane.messages.severeInjury.noPermission"
              ) || "You do not have permission to roll for this character";
            ui.notifications.warn(errorMsg);
            return;
          }

          await rollSevereInjuryTable();

          $(button)
            .text(
              game.i18n.localize(
                "tokenActionHud.dragonbane.messages.severeInjury.rolled"
              ) || "Severe Injury Rolled"
            )
            .prop("disabled", true)
            .css("opacity", "0.6");
        } catch (error) {
          console.error(
            "Token Action HUD Dragonbane: Error handling severe injury button:",
            error
          );
          const errorMsg =
            game.i18n.localize(
              "tokenActionHud.dragonbane.messages.severeInjury.rollFailed"
            ) || "Failed to roll severe injury";
          ui.notifications.error(errorMsg);
        }
      });
    }

    // Handle fear effect button clicks
    const fearEffectBtn = html.find(".fear-effect-roll-btn");
    if (fearEffectBtn.length > 0) {
      fearEffectBtn.on("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const button = event.currentTarget;
        const actorId = button.dataset.actorId;
        const sceneId = button.dataset.sceneId;
        const tokenId = button.dataset.tokenId;

        try {
          const speakerData = {
            actor: actorId,
            scene: sceneId,
            token: tokenId,
          };
          const actor = getActorFromSpeakerData(speakerData);

          if (!actor) {
            const errorMsg =
              game.i18n.localize(
                "tokenActionHud.dragonbane.messages.fearEffect.actorNotFound"
              ) || "Actor not found";
            ui.notifications.warn(errorMsg);
            return;
          }

          const canClick = actor.isOwner || game.user.isGM;
          if (!canClick) {
            const errorMsg =
              game.i18n.localize(
                "tokenActionHud.dragonbane.messages.fearEffect.noPermission"
              ) || "You do not have permission to roll for this character";
            ui.notifications.warn(errorMsg);
            return;
          }

          await rollFearEffectTable();

          $(button)
            .text(
              game.i18n.localize(
                "tokenActionHud.dragonbane.messages.fearEffect.rolled"
              ) || "Fear Effect Rolled"
            )
            .prop("disabled", true)
            .css("opacity", "0.6");
        } catch (error) {
          console.error(
            "Token Action HUD Dragonbane: Error handling fear effect button:",
            error
          );
          const errorMsg =
            game.i18n.localize(
              "tokenActionHud.dragonbane.messages.fearEffect.rollFailed"
            ) || "Failed to roll fear effect";
          ui.notifications.error(errorMsg);
        }
      });
    }
  });
}
