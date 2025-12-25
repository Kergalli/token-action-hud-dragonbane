/**
 * Action builder methods for Token Action HUD Dragonbane
 * All build* methods that construct actions for the HUD
 */

import { ATTRIBUTES, ITEM_TYPE } from "./constants.js";
import { Utils } from "./utils.js";

export function createActionBuilders(coreModule) {
  return {
    /**
     * Build stats actions - HP, WP, movement, encumbrance, ferocity
     */
    buildStats: async function () {
      if (!this.actor?.system) return;

      const actions = [];

      // Define stat configurations
      const statConfigs = [
        {
          id: "hitpoints",
          condition: () => this.actor.system?.hitPoints,
          getName: () => {
            const currentHP = this.actor.system.hitPoints.value || 0;
            const maxHP = this.actor.system.hitPoints.max || 0;
            const hpLabel = game.i18n.localize("DoD.ui.character-sheet.hp");
            return `${hpLabel}: ${currentHP}/${maxHP}`;
          },
          getCssClass: () => {
            const currentHP = this.actor.system.hitPoints.value || 0;
            const maxHP = this.actor.system.hitPoints.max || 0;
            return Utils.getStatStatus(currentHP, maxHP);
          },
          img: "modules/token-action-hud-dragonbane/assets/hearts.svg",
        },
        {
          id: "willpoints",
          condition: () =>
            this.actor.type !== "monster" &&
            this.actor.system?.willPoints?.max > 0,
          getName: () => {
            const currentWP = this.actor.system.willPoints.value || 0;
            const maxWP = this.actor.system.willPoints.max || 0;
            const wpLabel = game.i18n.localize("DoD.ui.character-sheet.wp");
            return `${wpLabel}: ${currentWP}/${maxWP}`;
          },
          getCssClass: () => {
            const currentWP = this.actor.system.willPoints.value || 0;
            const maxWP = this.actor.system.willPoints.max || 0;
            return Utils.getStatStatus(currentWP, maxWP);
          },
          img: "modules/token-action-hud-dragonbane/assets/brain.svg",
        },
        {
          id: "movement",
          condition: () => this.actor.system?.movement?.value !== undefined,
          getName: () => {
            const movement = this.actor.system.movement.value;
            const moveLabel = game.i18n.localize(
              "DoD.ui.character-sheet.movement"
            );
            return `${moveLabel}: ${movement}`;
          },
          getCssClass: () => "",
          img: "modules/token-action-hud-dragonbane/assets/move.svg",
        },
        {
          id: "encumbrance",
          condition: () =>
            this.actor.type === "character" && this.actor.system?.encumbrance,
          getName: () => {
            const currentEnc =
              Math.round(100 * this.actor.system.encumbrance.value) / 100;
            const maxEnc = this.actor.system.maxEncumbrance?.value || 0;
            const encLabel =
              game.i18n.localize(
                "tokenActionHud.dragonbane.actions.stats.encumbrance"
              ) || "Enc";
            return `${encLabel}: ${currentEnc}/${maxEnc}`;
          },
          getCssClass: () => {
            const currentEnc =
              Math.round(100 * this.actor.system.encumbrance.value) / 100;
            const maxEnc = this.actor.system.maxEncumbrance?.value || 0;
            return currentEnc > maxEnc ? "dragonbane-over-encumbered" : "";
          },
          img: "icons/svg/anchor.svg",
        },
        {
          id: "ferocity",
          condition: () =>
            this.actor.type === "monster" &&
            this.actor.system?.ferocity !== undefined,
          getName: () => {
            const ferocity =
              this.actor.system.ferocity.value ||
              this.actor.system.ferocity ||
              0;
            const ferocityLabel = game.i18n.localize(
              "DoD.ui.character-sheet.ferocity"
            );
            return `${ferocityLabel}: ${ferocity}`;
          },
          getCssClass: () => "",
          img: "modules/token-action-hud-dragonbane/assets/front-teeth.svg",
        },
      ];

      // Build actions using configuration
      for (const config of statConfigs) {
        if (config.condition()) {
          const name = config.getName();
          const cssClass = config.getCssClass();
          const extraProps = cssClass ? { cssClass } : {};

          actions.push(
            this._createSimpleAction(
              config.id,
              name,
              config.img,
              "stats",
              "handleStatsAction",
              extraProps
            )
          );
        }
      }

      if (actions.length > 0) {
        this.addActions(actions, { id: "stats", type: "system" });
      }
    },

    /**
     * Build traits actions (for NPCs and Monsters only)
     */
    buildTraits: async function () {
      // Only show for NPCs and Monsters that have traits
      if (
        (this.actorType !== "npc" && this.actorType !== "monster") ||
        !this.actor?.system?.traits?.trim()
      ) {
        return;
      }

      const actionTypeId = "traits";
      const groupData = { id: "traits", type: "system" };

      // Use core Dragonbane localization for "Traits"
      const traitsLabel = game.i18n.localize("DoD.ui.character-sheet.traits");

      const actions = [
        {
          id: "showTraits",
          name: `${this.actor.name} ${traitsLabel}`,
          listName: `${this.actor.name} ${traitsLabel}`,
          img: "modules/token-action-hud-dragonbane/assets/traits.webp",
          encodedValue: [actionTypeId, "show"].join(this.delimiter),
          onClick: async (event) => {
            await this.handleTraitsAction(event);
          },
        },
      ];

      this.addActions(actions, groupData);
    },

    /**
     * Build weapon actions
     */
    buildWeapons: async function () {
      if (!this.items || this.items.size === 0) return;

      // Weapon filter function - ONLY uses showEquippedWeaponsOnly setting
      const weaponFilter = (itemData) => {
        const equipped = Utils.isItemEquipped(itemData);
        const canUse = Utils.canUseWeapon(this.actor, itemData);

        // If showEquippedWeaponsOnly is true, only show equipped/usable weapons
        if (this.showEquippedWeaponsOnly && !canUse) {
          return false;
        }

        // Special case: exclude unequipped torches when showing equipped only
        // (they'll appear in inventory instead)
        if (
          this.showEquippedWeaponsOnly &&
          !equipped &&
          Utils.isTorch(itemData)
        ) {
          return false;
        }

        return true;
      };

      // Weapon name formatter with skill values and equipped markers
      const weaponNameFormatter = (itemData) => {
        const baseWeaponName = itemData.name;
        const skillValue = Utils.getWeaponSkillValue(this.actor, itemData);
        let name = `${baseWeaponName} (${skillValue})`;

        // Add equipped marker if NOT showing equipped weapons only and this weapon is equipped
        if (!this.showEquippedWeaponsOnly && this.actor.type === "character") {
          const isEquipped = Utils.isItemEquipped(itemData);
          if (isEquipped) {
            name =
              game.i18n.format(
                "tokenActionHud.dragonbane.actions.weapon.equipped",
                { name }
              ) || `⚔ ${name}`;
          }
        }

        return name;
      };

      const weapons = this._collectItemsByType("weapon", weaponFilter);
      if (weapons.size === 0) return;

      const actions = [...weapons].map(([itemId, itemData]) => {
        const name = weaponNameFormatter(itemData);
        const extraProps = {};

        // Check if weapon is broken and add CSS class
        if (itemData.system?.broken === true) {
          extraProps.cssClass = "dragonbane-weapon-broken";
        }

        return this._createItemAction(
          itemId,
          name,
          itemData,
          "weapon",
          "handleWeaponAction",
          extraProps
        );
      });

      this.addActions(actions, { id: "weapons", type: "system" });
    },

    /**
     * Build spell actions - grouped by rank
     */
    buildSpells: async function () {
      if (!this.items || this.items.size === 0) return;

      const spellsByRank = new Map();
      spellsByRank.set(0, new Map()); // Magic Tricks
      spellsByRank.set(1, new Map()); // Rank 1
      spellsByRank.set(2, new Map()); // Rank 2
      spellsByRank.set(3, new Map()); // Rank 3

      // Categorize spells by rank
      for (const [itemId, itemData] of this.items) {
        if (itemData.type !== "spell") continue;

        let rank = itemData.system?.rank || 0;
        if (itemData.system?.school?.toLowerCase() === "general") rank = 0;

        const isPrepared = itemData.system?.memorized === true;

        // Filter for characters
        if (
          this.actor.type === "character" &&
          !this.showAllSpells &&
          !isPrepared
        )
          continue;

        const clampedRank = Math.max(0, Math.min(3, rank));
        spellsByRank.get(clampedRank).set(itemId, itemData);
      }

      // Spell name formatter
      const spellNameFormatter = (itemData) => {
        const baseSpellName = itemData.name;
        const skillValue = Utils.getSpellSkillValue(this.actor, itemData);
        let name = `${baseSpellName} (${skillValue})`;

        if (this.showAllSpells && this.actor.type === "character") {
          const isPrepared = itemData.system?.memorized === true;
          if (isPrepared) {
            name =
              game.i18n.format(
                "tokenActionHud.dragonbane.actions.spell.prepared",
                { name }
              ) || `⚡ ${name}`;
          }
        }
        return name;
      };

      // Build actions for each rank
      const rankGroups = [
        "spellRank0",
        "spellRank1",
        "spellRank2",
        "spellRank3",
      ];

      for (const [rank, spells] of spellsByRank) {
        if (spells.size === 0) continue;

        const actions = [...spells].map(([itemId, itemData]) => {
          const name = spellNameFormatter(itemData);
          return this._createItemAction(
            itemId,
            name,
            itemData,
            "spell",
            "handleSpellAction"
          );
        });

        this.addActions(actions, { id: rankGroups[rank], type: "system" });
      }
    },

    /**
     * Build ability actions - grouped by name with count
     */
    buildAbilities: async function () {
      const abilities = this._collectItemsByType("ability");
      if (!abilities || abilities.size === 0) return;

      // Group abilities by name
      const abilityGroups = new Map();

      for (const [itemId, itemData] of abilities) {
        const abilityName = itemData.name;

        if (!abilityGroups.has(abilityName)) {
          abilityGroups.set(abilityName, []);
        }
        abilityGroups.get(abilityName).push({ itemId, itemData });
      }

      const actions = [];

      // Create actions for each grouped ability
      for (const [abilityName, abilityInstances] of abilityGroups) {
        const count = abilityInstances.length;
        const firstInstance = abilityInstances[0]; // Use first instance for the action

        // Create display name with count if multiple instances
        const displayName =
          count > 1 ? `${abilityName} x${count}` : abilityName;

        const action = this._createItemAction(
          firstInstance.itemId,
          displayName,
          firstInstance.itemData,
          "ability",
          "handleAbilityAction"
        );

        actions.push(action);
      }

      // Sort actions alphabetically by name
      actions.sort((a, b) => a.name.localeCompare(b.name));

      this.addActions(actions, { id: "abilities", type: "system" });
    },

    /**
     * Build skill actions - using system's categorized skill arrays
     */
    buildSkills: async function () {
      if (!this.actor?.system) return;

      const actionTypeId = "skill";

      // Build Core Skills (always shown)
      if (this.actor.system.coreSkills?.length > 0) {
        this.buildSkillCategory(
          this.actor.system.coreSkills,
          "coreSkills",
          actionTypeId
        );
      }

      // Build Weapon Skills (if setting enabled)
      if (this.actor.system.weaponSkills?.length > 0 && this.showWeaponSkills) {
        this.buildSkillCategory(
          this.actor.system.weaponSkills,
          "weaponSkills",
          actionTypeId
        );
      }

      // Build Secondary Skills (if setting enabled)
      if (
        this.actor.system.secondarySkills?.length > 0 &&
        this.showSecondarySkills
      ) {
        this.buildSkillCategory(
          this.actor.system.secondarySkills,
          "secondarySkills",
          actionTypeId
        );
      }
    },

    /**
     * Build a category of skills
     * @param {Array} skillsArray Array of skills in this category
     * @param {string} groupId Group ID for this category
     * @param {string} actionTypeId Action type ID
     */
    buildSkillCategory: function (skillsArray, groupId, actionTypeId) {
      const groupData = { id: groupId, type: "system" };

      const actions = skillsArray.map((skill) => {
        // Use the skill's actual item ID - skills are items in Dragonbane
        const id = skill._id || skill.id || skill.name;
        const skillName = skill.name;
        const skillValue = this._getSkillValue(skill);
        const name = `${skillName} (${skillValue})`;

        return {
          id,
          name, // Token Action HUD Core uses 'name' for display
          listName: name, // Keep listName for consistency
          img: skill.img, // Use skill's image directly
          encodedValue: [actionTypeId, id].join(this.delimiter),
          // No onClick - let RollHandler handle skills for proper right-click support
        };
      });

      this.addActions(actions, groupData);
    },

    /**
     * Build attribute actions
     */
    buildAttributes: async function () {
      if (!this.actor?.system?.attributes) return;

      const attributeConfigs = Object.entries(ATTRIBUTES).map(
        ([attrKey, attrConfig]) => ({
          id: attrKey,
          name: () => {
            const attrAbbreviation =
              Utils.getLocalizedAttributeAbbreviation(attrKey);
            const value = this.actor.system.attributes[attrKey]?.value || 0;
            return `${attrAbbreviation} (${value})`;
          },
          img: "icons/svg/dice-target.svg",
          handler: "handleAttributeAction",
          handlerArgs: [attrKey],
        })
      );

      const actions = attributeConfigs.map((config) => {
        const action = this._createSimpleAction(
          config.id,
          config.name(),
          config.img,
          "attribute",
          config.handler
        );

        // Override onClick to pass attribute key
        action.onClick = async (event) => {
          await this[config.handler](event, ...config.handlerArgs);
        };

        return action;
      });

      this.addActions(actions, { id: "attributes", type: "system" });
    },

    /**
     * Build inventory (non-weapon items)
     */
    buildInventory: async function () {
      if (!this.items || this.items.size === 0) return;

      const inventoryTypes = ["armor", "helmet", "item"];
      const inventoryMap = new Map();

      // Collect items by type with equipment filtering - ONLY uses showUnequippedItems setting
      for (const type of inventoryTypes) {
        const items = this._collectItemsWithEquipmentFilter(
          type,
          this.showUnequippedItems,
          false
        );
        if (items.size > 0) {
          inventoryMap.set(type, items);
        }
      }

      // Add unequipped torches to inventory when showEquippedWeaponsOnly is true
      if (this.showEquippedWeaponsOnly && this.items) {
        const unequippedTorches = [];

        for (const [itemId, itemData] of this.items) {
          if (Utils.isTorch(itemData) && !Utils.isItemEquipped(itemData)) {
            const name = Utils.toTitleCase(itemData.name);
            const action = this._createItemAction(
              itemId,
              name,
              itemData,
              "weapon", // Keep as weapon for proper right-click/left-click handling
              "handleWeaponAction"
            );
            unequippedTorches.push(action);
          }
        }

        if (unequippedTorches.length > 0) {
          this.addActions(unequippedTorches, { id: "items", type: "system" });
        }
      }

      // Build actions for each item type
      for (const [type, typeMap] of inventoryMap) {
        const groupId = ITEM_TYPE[type]?.groupId;
        if (!groupId) continue;

        const actions = [...typeMap].map(([itemId, itemData]) => {
          const name = Utils.toTitleCase(itemData.name);
          const equipped = Utils.isItemEquipped(itemData) ? "⚔ " : "";
          const displayName = `${equipped}${name}`;

          return this._createItemAction(
            itemId,
            displayName,
            itemData,
            "item",
            "handleItemAction"
          );
        });

        this.addActions(actions, { id: groupId, type: "system" });
      }
    },

    /**
     * Build currency actions (gold, silver, copper)
     */
    buildCurrency: async function () {
      // Check if currency display is enabled
      if (!this.showCurrency) return;

      if (!this.actor?.system?.currency) return;

      const currency = this.actor.system.currency;
      const actions = [];

      // Currency configurations
      const currencyConfigs = [
        {
          id: "gold",
          key: "gc",
          name: () => currency.gc?.toString() || "0",
          img: "icons/commodities/currency/coin-engraved-tail-gold.webp",
          statKey: "gold",
        },
        {
          id: "silver",
          key: "sc",
          name: () => currency.sc?.toString() || "0",
          img: "icons/commodities/currency/coin-embossed-unicorn-silver.webp",
          statKey: "silver",
        },
        {
          id: "copper",
          key: "cc",
          name: () => currency.cc?.toString() || "0",
          img: "icons/commodities/currency/coin-inset-copper-axe.webp",
          statKey: "copper",
        },
      ];

      // Build currency actions
      for (const config of currencyConfigs) {
        const value = currency[config.key] || 0;

        const action = this._createSimpleAction(
          config.id,
          config.name(),
          config.img,
          "currency",
          "handleCurrencyAction"
        );

        // Override onClick to pass currency type
        action.onClick = async (event) => {
          await this.handleCurrencyAction(event, config.statKey);
        };

        actions.push(action);
      }

      if (actions.length > 0) {
        this.addActions(actions, { id: "currency", type: "system" });
      }
    },

    /**
     * Build injuries
     */
    buildInjuries: async function () {
      const injuries = this._collectItemsByType("injury");
      if (!injuries || injuries.size === 0) return;

      const actions = [...injuries].map(([itemId, itemData]) => {
        return this._createItemAction(
          itemId,
          itemData.name,
          itemData,
          "item",
          "handleConditionAction"
        );
      });

      this.addActions(actions, { id: "injuries", type: "system" });
    },

    /**
     * Build combat actions (dodge, first aid, rally actions, death rolls)
     */
    buildCombatActions: async function () {
      const actions = [];

      // Helper function to get skill value by key using localization
      const getSkillValueByName = (skillKey) => {
        if (!this.actor?.system?.coreSkills) return 0;

        // Get the localized skill name from the key
        const localizedSkillName = game.i18n.localize(
          `tokenActionHud.dragonbane.skillNames.${skillKey}`
        );

        // Find the skill using the localized name
        const skill = this.actor.system.coreSkills.find(
          (s) => s.name === localizedSkillName
        );
        return skill?.system?.value || skill?.value || 0;
      };

      // Helper function to get attribute value by key
      const getAttributeValue = (attributeKey) => {
        return this.actor?.system?.attributes?.[attributeKey]?.value || 0;
      };

      const combatConfigs = [
        {
          id: "dodge",
          condition: () =>
            this.actorType === "character" || this.actorType === "npc",
          name: () => {
            const baseName = coreModule.api.Utils.i18n(
              "tokenActionHud.dragonbane.dodge"
            );
            const skillValue = getSkillValueByName("evade");
            return `${baseName} (${skillValue})`;
          },
          img: "icons/svg/combat.svg",
          actionType: "combatAction",
          handler: "handleCombatSkillAction",
          handlerArgs: ["evade"],
        },
        {
          id: "firstAid",
          condition: () =>
            this.actorType === "character" || this.actorType === "npc",
          name: () => {
            const baseName = coreModule.api.Utils.i18n(
              "tokenActionHud.dragonbane.firstAid"
            );
            const skillValue = getSkillValueByName("healing");
            return `${baseName} (${skillValue})`;
          },
          img: "icons/svg/regen.svg",
          actionType: "combatAction",
          handler: "handleCombatSkillAction",
          handlerArgs: ["healing"],
        },
        {
          id: "rallyOther",
          condition: () =>
            this.actorType === "character" || this.actorType === "npc",
          name: () => {
            const baseName = coreModule.api.Utils.i18n(
              "tokenActionHud.dragonbane.rallyOther"
            );
            const skillValue = getSkillValueByName("persuasion");
            return `${baseName} (${skillValue})`;
          },
          img: "icons/svg/upgrade.svg",
          actionType: "combatAction",
          handler: "handleCombatSkillAction",
          handlerArgs: ["persuasion"],
        },
        {
          id: "rallySelf",
          condition: () => {
            // Only show for characters at zero HP
            if (this.actorType !== "character") return false;
            const currentHP = this.actor?.system?.hitPoints?.value || 0;
            return currentHP <= 0;
          },
          name: () => {
            const baseName = coreModule.api.Utils.i18n(
              "tokenActionHud.dragonbane.rallySelf"
            );
            const attributeValue = getAttributeValue("wil"); // This should use getAttributeValue, not getSkillValueByName
            return `${baseName} (${attributeValue})`;
          },
          img: "icons/svg/upgrade.svg",
          actionType: "combatAction",
          handler: "handleAttributeAction", // Should be handleAttributeAction, not handleCombatSkillAction
          handlerArgs: ["wil"],
        },
      ];

      // Build standard combat actions
      for (const config of combatConfigs) {
        if (config.condition()) {
          const action = this._createSimpleAction(
            config.id,
            config.name(),
            config.img,
            config.actionType,
            config.handler
          );

          // Use encodedValue instead of onClick for combat actions
          action.encodedValue = [config.actionType, config.id].join(
            this.delimiter
          );

          // Remove the onClick handler completely - let it route to RollHandler

          actions.push(action);
        }
      }

      // Death roll action (special case with custom listName)
      if (
        this.actorType === "character" &&
        this.showDeathRoll &&
        Utils.needsDeathRoll(this.actor)
      ) {
        const deathRolls = Utils.getDeathRollStatus(this.actor);
        const conValue = this.actor?.system?.attributes?.con?.value || 0;

        // Build the full name with CON value and death roll progress
        const fullDeathRollName = `${coreModule.api.Utils.i18n(
          "tokenActionHud.dragonbane.deathRoll"
        )} (${conValue}) [${deathRolls.successes}/${deathRolls.failures}]`;

        const deathRollAction = this._createSimpleAction(
          "deathRoll",
          fullDeathRollName, // Use the full name here instead of just CON
          "icons/svg/skull.svg",
          "combatAction",
          "handleDeathRollAction"
        );

        // The name is already set correctly, no need to override listName
        actions.push(deathRollAction);
      }

      if (actions.length > 0) {
        this.addActions(actions, { id: "combatActions", type: "system" });
      }
    },

    /**
     * Build journey actions (pathfinder, make camp, hunt, fish, forage, cook)
     */
    buildJourneyActions: async function () {
      const actions = [];

      // Helper function to get skill value by name from core skills
      const getSkillValueByName = (skillKey) => {
        if (!this.actor?.system?.coreSkills) return 0;
        const localizedSkillName = Utils.getLocalizedSkillName(skillKey);
        const skill = this.actor.system.coreSkills.find(
          (s) => s.name === localizedSkillName
        );
        return skill?.system?.value || skill?.value || 0;
      };

      // Define journey action configurations
      const journeyConfigs = [
        {
          id: "pathfinder",
          condition: () =>
            this.actorType === "character" || this.actorType === "npc",
          name: () => {
            const baseName = coreModule.api.Utils.i18n(
              "tokenActionHud.dragonbane.pathfinder"
            );
            const skillValue = getSkillValueByName("bushcraft");
            return `${baseName} (${skillValue})`;
          },
          img: "modules/token-action-hud-dragonbane/assets/path-distance.svg",
          actionType: "journeyAction",
          handler: "handleCombatSkillAction",
          handlerArgs: ["bushcraft"],
        },
        {
          id: "makeCamp",
          condition: () =>
            this.actorType === "character" || this.actorType === "npc",
          name: () => {
            const baseName = coreModule.api.Utils.i18n(
              "tokenActionHud.dragonbane.makeCamp"
            );
            const skillValue = getSkillValueByName("bushcraft");
            return `${baseName} (${skillValue})`;
          },
          img: "icons/svg/fire.svg",
          actionType: "journeyAction",
          handler: "handleCombatSkillAction",
          handlerArgs: ["bushcraft"],
        },
        {
          id: "hunt",
          condition: () =>
            this.actorType === "character" || this.actorType === "npc",
          name: () => {
            const baseName = coreModule.api.Utils.i18n(
              "tokenActionHud.dragonbane.hunt"
            );
            const skillValue = getSkillValueByName("huntingfishing");
            return `${baseName} (${skillValue})`;
          },
          img: "icons/svg/pawprint.svg",
          actionType: "journeyAction",
          handler: "handleCombatSkillAction",
          handlerArgs: ["huntingfishing"],
        },
        {
          id: "fish",
          condition: () =>
            this.actorType === "character" || this.actorType === "npc",
          name: () => {
            const baseName = coreModule.api.Utils.i18n(
              "tokenActionHud.dragonbane.fish"
            );
            const skillValue = getSkillValueByName("huntingfishing");
            return `${baseName} (${skillValue})`;
          },
          img: "modules/token-action-hud-dragonbane/assets/fishing-pole.svg",
          actionType: "journeyAction",
          handler: "handleCombatSkillAction",
          handlerArgs: ["huntingfishing"],
        },
        {
          id: "forage",
          condition: () =>
            this.actorType === "character" || this.actorType === "npc",
          name: () => {
            const baseName = coreModule.api.Utils.i18n(
              "tokenActionHud.dragonbane.forage"
            );
            const skillValue = getSkillValueByName("bushcraft");
            return `${baseName} (${skillValue})`;
          },
          img: "modules/token-action-hud-dragonbane/assets/plant-seed.svg",
          actionType: "journeyAction",
          handler: "handleCombatSkillAction",
          handlerArgs: ["bushcraft"],
        },
        {
          id: "cook",
          condition: () =>
            this.actorType === "character" || this.actorType === "npc",
          name: () => {
            const baseName = coreModule.api.Utils.i18n(
              "tokenActionHud.dragonbane.cook"
            );
            const skillValue = getSkillValueByName("bushcraft");
            return `${baseName} (${skillValue})`;
          },
          img: "modules/token-action-hud-dragonbane/assets/camp-cooking-pot.svg",
          actionType: "journeyAction",
          handler: "handleCombatSkillAction",
          handlerArgs: ["bushcraft"],
        },
      ];

      // Build standard journey actions
      for (const config of journeyConfigs) {
        if (config.condition()) {
          const action = this._createSimpleAction(
            config.id,
            config.name(),
            config.img,
            config.actionType,
            config.handler
          );

          // Use encodedValue instead of onClick for journey actions
          action.encodedValue = [config.actionType, config.id].join(
            this.delimiter
          );

          actions.push(action);
        }
      }

      if (actions.length > 0) {
        this.addActions(actions, { id: "journeyActions", type: "system" });
      }
    },

    /**
     * Build monster attacks
     */
    buildMonsterAttacks: async function () {
      // Only build for monsters
      if (this.actorType !== "monster") return;

      // Check if monster has an attack table
      const attackTableUuid = this.actor.system.attackTable;
      if (!attackTableUuid) return;

      try {
        const attackTable = fromUuidSync(attackTableUuid);
        if (
          !attackTable ||
          !attackTable.results ||
          attackTable.results.size === 0
        )
          return;

        // Random Monster Attack group
        const randomActions = [
          {
            id: "monsterAttackRandom",
            name: game.i18n.localize("DoD.ui.dialog.monsterAttackRandom"),
            listName: game.i18n.localize("DoD.ui.dialog.monsterAttackRandom"),
            img: "systems/dragonbane/art/icons/monster-attack.webp",
            onClick: async (event) => {
              await this.handleMonsterAttack(event, "random");
            },
          },
        ];

        // Specific Monster Attacks group
        const specificActions = [];
        for (let result of attackTable.results) {
          const attackIndex = result.range[0];
          const { attackName } = Utils.parseMonsterAttackName(result);

          const attackText =
            coreModule.api.Utils.i18n("tokenActionHud.dragonbane.attackNumber")
              ?.replace("{index}", attackIndex)
              ?.replace("{name}", attackName) ||
            `Attack ${attackIndex}: ${attackName}`;

          specificActions.push({
            id: `monsterAttackSpecific_${attackIndex}`,
            name: `${attackIndex}. ${attackName}`,
            listName: attackText,
            img: "systems/dragonbane/art/icons/monster-attack.webp",
            onClick: async (event) => {
              await this.handleMonsterAttack(event, attackIndex.toString());
            },
          });
        }

        // Add actions to their respective groups
        if (randomActions.length > 0) {
          this.addActions(randomActions, {
            id: "monsterAttacksRandom",
            type: "system",
          });
        }

        if (specificActions.length > 0) {
          this.addActions(specificActions, {
            id: "monsterAttacksSpecific",
            type: "system",
          });
        }
      } catch (error) {
        console.warn(
          "Token Action HUD Dragonbane: Error building monster attacks:",
          error
        );
      }
    },

    /**
     * Build monster weapon damage actions
     */
    buildMonsterWeaponDamage: async function () {
      // Only build for monsters
      if (this.actorType !== "monster") return;

      if (!this.items || this.items.size === 0) return;

      const weaponActions = [];

      // Get all weapons from monster items
      for (const [itemId, itemData] of this.items) {
        if (itemData.type !== "weapon") continue;

        weaponActions.push({
          id: `monsterWeaponDamage_${itemId}`,
          name: itemData.name,
          listName: itemData.name,
          img: itemData.img,
          onClick: async (event) => {
            await this.handleMonsterWeaponDamage(event, itemData);
          },
        });
      }

      if (weaponActions.length > 0) {
        this.addActions(weaponActions, {
          id: "monsterWeaponDamage",
          type: "system",
        });
      }
    },

    /**
     * Build monster defend actions
     */
    buildMonsterDefend: async function () {
      // Only build for monsters
      if (this.actorType !== "monster") return;

      const defendActions = [
        {
          id: "monsterDefend",
          name: game.i18n.localize(
            "DoD.ui.character-sheet.monsterDefendTooltip"
          ),
          listName: game.i18n.localize(
            "DoD.ui.character-sheet.monsterDefendTooltip"
          ),
          img: "systems/dragonbane/art/icons/monster-defend.webp",
          onClick: async (event) => {
            await this.handleMonsterDefend(event);
          },
        },
      ];

      if (defendActions.length > 0) {
        this.addActions(defendActions, { id: "monsterDefend", type: "system" });
      }
    },
  };
}
