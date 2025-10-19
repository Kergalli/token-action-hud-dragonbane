import { MODULE } from "./constants.js";

export let Utils = null;

Hooks.once("tokenActionHudCoreApiReady", async (coreModule) => {
  /**
   * Utility functions for Dragonbane Token Action HUD
   */
  Utils = class Utils {
    /**
     * Convert string to title case
     * @param {string} str The string to convert
     * @returns {string} String in title case
     */
    static toTitleCase(str) {
      if (!str) return str;
      return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }

    /**
     * Get attribute conditions map
     * Creates a mapping of localized condition names to attribute keys
     * @returns {object} Map of localized condition names to attribute keys
     */
    static getAttributeConditionsMap() {
      const map = {};

      // Get condition effects from config if available
      const conditionEffects = CONFIG.DoD?.conditionEffects || {};

      // Map each attribute to its localized condition name
      for (const [attributeKey, conditionData] of Object.entries(
        conditionEffects
      )) {
        if (conditionData?.label) {
          const localizedName = game.i18n.localize(conditionData.label);
          map[localizedName] = attributeKey;
        }
      }

      // Fallback: create basic mapping if config not available
      if (Object.keys(map).length === 0) {
        const attributes = ["str", "con", "agl", "int", "wil", "cha"];
        for (const attr of attributes) {
          // Try to get localized condition names
          const conditionKey = `DoD.conditions.${attr}`;
          const localizedName = game.i18n.localize(conditionKey);
          if (localizedName !== conditionKey) {
            map[localizedName] = attr;
          }
        }
      }

      return map;
    }

    /**
     * Get setting
     * @param {string} key               The key
     * @param {string=null} defaultValue The default value
     * @returns {string}                 The setting value
     */
    static getSetting(key, defaultValue = null) {
      let value = defaultValue ?? null;
      try {
        value = game.settings.get(MODULE.ID, key);
      } catch {
        coreModule.api.Logger.debug(`Setting '${key}' not found`);
      }
      return value;
    }

    /**
     * Get localized skill name from language files
     * @param {string} skillKey The skill key (e.g., 'evade', 'healing', 'persuasion')
     * @returns {string} The localized skill name
     */
    static getLocalizedSkillName(skillKey) {
      return (
        coreModule.api.Utils.i18n(
          `tokenActionHud.dragonbane.skillNames.${skillKey}`
        ) || skillKey
      );
    }

    /**
     * Get localized attribute abbreviation from language files
     * @param {string} attributeKey The attribute key (e.g., 'str', 'con', 'agl')
     * @returns {string} The localized attribute abbreviation
     */
    static getLocalizedAttributeAbbreviation(attributeKey) {
      return (
        coreModule.api.Utils.i18n(
          `tokenActionHud.dragonbane.attributeAbbreviations.${attributeKey}`
        ) || attributeKey.toUpperCase()
      );
    }

    /**
     * Get stat status CSS class based on current vs max values
     * @param {number} current Current value
     * @param {number} max Maximum value
     * @returns {string} CSS class name
     */
    static getStatStatus(current, max) {
      if (current >= max) return ""; // Full - no special styling
      if (current < max * 0.5) return "dragonbane-stat-critical"; // < 50% = red
      return "dragonbane-stat-injured"; // < 100% but >= 50% = yellow
    }

    /**
     * Create chat message content for stats
     * @param {object} actor The actor
     * @param {string} statType The stat type (hitpoints, willpoints, movement, encumbrance, ferocity)
     * @returns {string} HTML content for chat message
     */
    static async createStatsChatMessage(actor, statType) {
      if (!actor) return null;

      const actorName = actor.name;
      let content = "";

      try {
        switch (statType) {
          case "hitpoints": {
            const hp = actor.system.hitPoints;
            const current = hp.value || 0;
            const max = hp.max || 0;
            const damage = Math.max(0, max - current);

            if (damage > 0) {
              content =
                game.i18n.format(
                  "tokenActionHud.dragonbane.chat.stats.hitpointsDamaged",
                  {
                    name: actorName,
                    current,
                    max,
                    damage,
                  }
                ) ||
                `<strong>${actorName}</strong> has ${current}/${max} HP (${damage} damage taken).`;
            } else {
              content =
                game.i18n.format(
                  "tokenActionHud.dragonbane.chat.stats.hitpoints",
                  {
                    name: actorName,
                    current,
                    max,
                  }
                ) || `<strong>${actorName}</strong> has ${current}/${max} HP.`;
            }
            break;
          }

          case "willpoints": {
            const wp = actor.system.willPoints;
            const current = wp.value || 0;
            const max = wp.max || 0;
            const spent = Math.max(0, max - current);

            if (spent > 0) {
              content =
                game.i18n.format(
                  "tokenActionHud.dragonbane.chat.stats.willpointsSpent",
                  {
                    name: actorName,
                    current,
                    max,
                    spent,
                  }
                ) ||
                `<strong>${actorName}</strong> has ${current}/${max} WP (${spent} WP spent).`;
            } else {
              content =
                game.i18n.format(
                  "tokenActionHud.dragonbane.chat.stats.willpoints",
                  {
                    name: actorName,
                    current,
                    max,
                  }
                ) || `<strong>${actorName}</strong> has ${current}/${max} WP.`;
            }
            break;
          }

          case "movement": {
            const movement = actor.system.movement.value;
            content =
              game.i18n.format(
                "tokenActionHud.dragonbane.chat.stats.movement",
                {
                  name: actorName,
                  movement,
                }
              ) ||
              `<strong>${actorName}</strong> has a Movement of ${movement}.`;
            break;
          }

          case "encumbrance": {
            const enc = actor.system.encumbrance;
            const current = Math.round(100 * enc.value) / 100;
            const max = actor.system.maxEncumbrance?.value || 0;
            const overEncumbered = current > max;

            let baseContent =
              game.i18n.format(
                "tokenActionHud.dragonbane.chat.stats.encumbrance",
                {
                  name: actorName,
                  current,
                  max,
                }
              ) ||
              `<strong>${actorName}</strong> is carrying ${current}/${max} items.`;

            if (overEncumbered) {
              const overNote =
                game.i18n.localize(
                  "tokenActionHud.dragonbane.chat.stats.overEncumbered"
                ) || "Over-encumbered!";
              content = `${baseContent} <em>${overNote}</em>`;
            } else {
              content = baseContent;
            }
            break;
          }

          case "ferocity": {
            const ferocity =
              actor.system.ferocity.value || actor.system.ferocity;
            content =
              game.i18n.format(
                "tokenActionHud.dragonbane.chat.stats.ferocity",
                {
                  name: actorName,
                  ferocity,
                }
              ) ||
              `<strong>${actorName}</strong> has a Ferocity of ${ferocity}.`;
            break;
          }

          default:
            console.warn(`Unknown stat type: ${statType}`);
            return null;
        }

        // Create and send chat message
        await ChatMessage.create({
          author: game.user.id,
          speaker: ChatMessage.getSpeaker({ actor: actor }),
          content: content,
          type: CONST.CHAT_MESSAGE_TYPES.OTHER,
        });

        return content;
      } catch (error) {
        console.error(
          "Token Action HUD Dragonbane: Error creating stats chat message:",
          error
        );
        ui.notifications.error(`Failed to display ${statType} information`);
        return null;
      }
    }

    /**
     * Create currency chat message
     * @param {object} actor The actor
     * @param {string} currencyType The currency type (gold, silver, copper)
     * @returns {Promise} The chat message promise
     */
    static async createCurrencyChatMessage(actor, currencyType) {
      if (!actor) return null;

      const actorName = actor.name;
      const currency = actor.system?.currency;
      if (!currency) return null;

      let content = "";

      try {
        switch (currencyType) {
          case "gold": {
            const gold = currency.gc || 0;
            content =
              game.i18n.format("tokenActionHud.dragonbane.chat.currency.gold", {
                name: actorName,
                amount: gold,
              }) || `<strong>${actorName}</strong> has ${gold} gold.`;
            break;
          }

          case "silver": {
            const silver = currency.sc || 0;
            content =
              game.i18n.format(
                "tokenActionHud.dragonbane.chat.currency.silver",
                { name: actorName, amount: silver }
              ) || `<strong>${actorName}</strong> has ${silver} silver.`;
            break;
          }

          case "copper": {
            const copper = currency.cc || 0;
            content =
              game.i18n.format(
                "tokenActionHud.dragonbane.chat.currency.copper",
                { name: actorName, amount: copper }
              ) || `<strong>${actorName}</strong> has ${copper} copper.`;
            break;
          }

          default:
            console.warn(`Unknown currency type: ${currencyType}`);
            return null;
        }

        return await ChatMessage.create({
          user: game.user.id,
          speaker: ChatMessage.getSpeaker({ actor: actor }),
          content: content,
        });
      } catch (error) {
        console.error(
          "Token Action HUD Dragonbane: Error creating currency chat message:",
          error
        );
        return null;
      }
    }

    /**
     * Check if an item is equipped
     * @param {object} item The item
     * @returns {boolean}   Whether the item is equipped
     */
    static isItemEquipped(item) {
      return item?.system?.worn === true || item?.system?.equipped === true;
    }

    /**
     * Get spell skill value
     * @param {object} actor The actor
     * @param {object} spell The spell
     * @returns {number} The skill value
     */
    static getSpellSkillValue(actor, spell) {
      if (!spell?.system?.school) return 0;

      const schoolName = spell.system.school;
      const actorSkills = actor?.system?.secondarySkills || [];

      // Special case for General spells - check for both "general" and "DoD.spell.general"
      if (
        schoolName.toLowerCase() === "general" ||
        schoolName.toLowerCase() === "dod.spell.general"
      ) {
        const magicSchools = ["Elementalism", "Mentalism", "Animism"];
        let highestValue = 0;

        for (const skill of actorSkills) {
          if (magicSchools.includes(skill.name)) {
            const skillValue = skill.system?.value || skill.value || 0;
            highestValue = Math.max(highestValue, skillValue);
          }
        }

        return highestValue;
      }

      // Find matching secondary skill by name for specific schools
      for (const skill of actorSkills) {
        if (skill.name === schoolName) {
          return skill.system?.value || skill.value || 0;
        }
      }

      return 0;
    }

    /**
     * Get weapon skill value
     * @param {object} actor The actor
     * @param {object} weapon The weapon
     * @returns {number} The skill value
     */
    static getWeaponSkillValue(actor, weapon) {
      // First try to get skill value directly from weapon
      if (weapon?.system?.skill?.value !== undefined) {
        return weapon.system.skill.value;
      }

      // Fallback: lookup by skill name in actor's weapon skills
      if (!weapon?.system?.skill?.name) return 0;

      const skillName = weapon.system.skill.name;

      // Check actor's weapon skills array
      if (actor?.system?.weaponSkills) {
        for (const skill of actor.system.weaponSkills) {
          if (skill.name === skillName) {
            return skill.system?.value || skill.value || 0;
          }
        }
      }

      return 0;
    }

    /**
     * Check if actor can use weapon
     * @param {object} actor The actor
     * @param {object} weapon The weapon
     * @returns {boolean} Whether the actor can use the weapon
     */
    static canUseWeapon(actor, weapon) {
      // Monsters can always use their weapons
      if (actor.type === "monster") return true;

      // Check if weapon is equipped for characters/NPCs
      return this.isItemEquipped(weapon);
    }

    /**
     * Get death roll status for characters
     * @param {object} actor The actor (must be character type)
     * @returns {object} Death roll successes and failures
     */
    static getDeathRollStatus(actor) {
      if (actor.type !== "character") return null;

      return {
        successes: actor?.system?.deathRolls?.successes || 0,
        failures: actor?.system?.deathRolls?.failures || 0,
      };
    }

    /**
     * Check if actor needs death rolls
     * @param {object} actor The actor
     * @returns {boolean} Whether death rolls are needed
     */
    static needsDeathRoll(actor) {
      // Add null check first
      if (!actor || actor.type !== "character") return false;

      // Check if actor is dying (at 0 HP or below)
      const hp = actor?.system?.hitPoints;
      const currentHP = hp?.value || 0;
      const isDying = currentHP <= 0;

      const deathRolls = this.getDeathRollStatus(actor);

      return isDying && deathRolls.failures < 3 && deathRolls.successes < 3;
    }

    /**
     * Parse monster attack name from table result description
     * @param {object} tableResult The attack table result
     * @returns {object} Object with attackName and cleanDescription
     */
    static parseMonsterAttackName(tableResult) {
      if (!tableResult)
        return { attackName: "Unknown Attack", cleanDescription: "" };

      // Get description based on Foundry version
      let attackDescription = "";
      if (game.release.generation >= 13) {
        attackDescription = tableResult.description || tableResult.text || "";
      } else {
        attackDescription = tableResult.text || "";
      }

      // Default attack name
      let attackName = `Attack ${tableResult.range[0]}`;

      // Parse the attack name from bold tags in description
      const match = attackDescription.match(/<(b|strong)>(.*?)<\/\1>/);
      if (match) {
        attackName = match[2];
        // Remove the bold tag from description for clean display
        attackDescription = attackDescription
          .replace(/<(b|strong)>.*?<\/\1>/, "")
          .trim();
      }

      return {
        attackName,
        cleanDescription: attackDescription,
      };
    }

    /**
     * Create monster attack chat message content
     * @param {object} tableResult The attack table result
     * @param {object} attackTable The attack table
     * @param {object} roll Optional roll data
     * @returns {string} HTML content for chat message
     */
    static createMonsterAttackChatContent(
      tableResult,
      attackTable,
      roll = null
    ) {
      const { attackName, cleanDescription } =
        this.parseMonsterAttackName(tableResult);

      let content = `<div class="dice-roll" data-action="expandRoll">
    <div class="dice-result">
        <div class="dice-formula">${
          attackTable.name || "Monster Attack Table"
        }</div>
        <h4 class="dice-total">${attackName}</h4>
    </div>
</div>`;

      if (cleanDescription) {
        content += `<div class="dice-description" style="margin-top: 0.5em;">${cleanDescription}</div>`;
      }

      return content;
    }
  };
});
