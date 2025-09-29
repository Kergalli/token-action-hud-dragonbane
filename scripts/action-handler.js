// System Module Imports
import { createActionBuilders } from "./action-builders.js";
import { createActionDialogs } from "./action-dialogs.js";
import { createActionHandlers } from "./action-handlers.js";
import { createActionUtilities } from "./action-utilities.js";
import { Utils } from "./utils.js";

export let ActionHandler = null;

Hooks.once("tokenActionHudCoreApiReady", async (coreModule) => {
  /**
   * Extends Token Action HUD Core's ActionHandler class and builds system-defined actions for the HUD
   */
  ActionHandler = class ActionHandler extends coreModule.api.ActionHandler {
    /**
     * Build utility actions (resting, other)
     */
    async buildUtility() {
      this.buildResting();
      this.buildOther();
    }

    /**
     * Build resting actions
     */
    async buildResting() {
      // Skip for NPCs and monsters - rest tracking is primarily for player characters
      if (this.actorType === "npc" || this.actorType === "monster") return;

      const actions = [];

      // Read availability flags from actor system (default to true if missing)
      const canRestRound = this.actor.system?.canRestRound ?? true;
      const canRestStretch = this.actor.system?.canRestStretch ?? true;
      const canRestShift = this.actor.system?.canRestShift ?? true;

      // Round Rest
      actions.push({
        id: "roundRest",
        name:
          coreModule.api.Utils.i18n("tokenActionHud.dragonbane.roundRest") ||
          "Round Rest",
        listName:
          coreModule.api.Utils.i18n("tokenActionHud.dragonbane.roundRest") ||
          "Round Rest",
        tooltip:
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.tooltips.roundRest"
          ) || "Restores 1D6 WP",
        img: "systems/dragonbane/art/icons/rest-round.webp",
        disabled: !canRestRound,
        cssClass: !canRestRound ? "dragonbane-rest-unavailable" : "",
        encodedValue: ["rest", "roundRest"].join(this.delimiter),
        onClick: async (event) => {
          if (!canRestRound) {
            await this.handleRestUnavailableAction("roundRest");
          } else {
            await this.handleRestAction(event, "roundRest");
          }
        },
      });

      // Stretch Rest
      actions.push({
        id: "stretchRest",
        name:
          coreModule.api.Utils.i18n("tokenActionHud.dragonbane.stretchRest") ||
          "Stretch Rest",
        listName:
          coreModule.api.Utils.i18n("tokenActionHud.dragonbane.stretchRest") ||
          "Stretch Rest",
        tooltip:
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.tooltips.stretchRest"
          ) ||
          "Restores 1D6 HP (2D6 with Healing), 1D6 WP, and removes 1 condition",
        img: "systems/dragonbane/art/icons/rest-stretch.webp",
        disabled: !canRestStretch,
        cssClass: !canRestStretch ? "dragonbane-rest-unavailable" : "",
        encodedValue: ["rest", "stretchRest"].join(this.delimiter),
        onClick: async (event) => {
          if (!canRestStretch) {
            await this.handleRestUnavailableAction("stretchRest");
          } else {
            await this.handleRestAction(event, "stretchRest");
          }
        },
      });

      // Shift Rest
      actions.push({
        id: "shiftRest",
        name:
          coreModule.api.Utils.i18n("tokenActionHud.dragonbane.shiftRest") ||
          "Shift Rest",
        listName:
          coreModule.api.Utils.i18n("tokenActionHud.dragonbane.shiftRest") ||
          "Shift Rest",
        tooltip:
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.tooltips.shiftRest"
          ) || "Restores all HP, all WP, and removes all conditions",
        img: "systems/dragonbane/art/icons/rest-shift.webp",
        disabled: !canRestShift,
        cssClass: !canRestShift ? "dragonbane-rest-unavailable" : "",
        encodedValue: ["rest", "shiftRest"].join(this.delimiter),
        onClick: async (event) => {
          if (!canRestShift) {
            await this.handleRestUnavailableAction("shiftRest");
          } else {
            await this.handleRestAction(event, "shiftRest");
          }
        },
      });

      // Pass One Shift of Time
      actions.push({
        id: "passOneShift",
        name:
          coreModule.api.Utils.i18n("tokenActionHud.dragonbane.passOneShift") ||
          "Pass One Shift of Time",
        listName:
          coreModule.api.Utils.i18n("tokenActionHud.dragonbane.passOneShift") ||
          "Pass One Shift of Time",
        tooltip:
          coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.tooltips.passOneShift"
          ) ||
          "Advances time without resting, making rest actions available again",
        img: "systems/dragonbane/art/icons/hourglass.webp",
        encodedValue: ["rest", "restReset"].join(this.delimiter),
        onClick: async (event) => {
          await this.handleRestAction(event, "restReset");
        },
      });

      if (actions.length > 0) {
        this.addActions(actions, { id: "resting", type: "system" });
      }
    }

    /**
     * Build other utility actions
     */
    async buildOther() {
      const actions = [];

      // Light Test (for characters and NPCs only)
      if (this.actorType === "character" || this.actorType === "npc") {
        actions.push({
          id: "lightTest",
          name: coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.lightTest"
          ),
          listName: coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.lightTest"
          ),
          img: "icons/svg/light.svg",
          encodedValue: ["lightTest", "lightTest"].join(this.delimiter),
          onClick: async (event) => {
            await this.handleLightTestAction(event);
          },
        });
      }

      // Severe Injury (for characters only)
      if (this.actorType === "character") {
        actions.push({
          id: "severeInjury",
          name: coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.severeInjury"
          ),
          listName: coreModule.api.Utils.i18n(
            "tokenActionHud.dragonbane.severeInjury"
          ),
          img: "icons/svg/blood.svg",
          encodedValue: ["severeInjury", "severeInjury"].join(this.delimiter),
          onClick: async (event) => {
            await this.handleSevereInjuryAction(event);
          },
        });
      }

      if (actions.length > 0) {
        this.addActions(actions, { id: "other", type: "system" });
      }
    }

    /**
     * Build conditions actions with v12 fallback
     * Enhanced categorization for v13+, simple categorization for v12
     */
    async buildConditions() {
      const statusEffects = CONFIG.statusEffects || [];
      if (statusEffects.length === 0) return;

      const attributeConditionsMap = Utils.getAttributeConditionsMap();
      const activeEffects = this._getActiveEffects();

      // Check Foundry version for compatibility
      const isV12 = game.version.startsWith("12");
      const isV13Plus = !isV12;

      if (isV12) {
        // V12 FALLBACK: Use simple categorization (original approach)
        const attributeActions = [];
        const regularActions = [];

        for (const effect of statusEffects) {
          if (!effect.id && !effect.img && !effect.icon) continue;

          const effectId = effect.id || effect.img || effect.icon;
          const effectName = effect.name || effect.label || effectId;

          if (/^action[1-9]$/.test(effectId) || effectName === "Action")
            continue;

          const localizedName = game.i18n.localize(effectName) || effectName;
          const attributeKey = attributeConditionsMap[localizedName];

          let isActive = activeEffects.has(effectId);
          if (
            attributeKey &&
            this.actor.system?.conditions?.[attributeKey]?.value
          ) {
            isActive = true;
          }

          const action = this._createConditionAction(
            effect,
            isActive,
            attributeKey
          );

          // Simple categorization: only attribute vs regular
          if (attributeKey && this.actorType === "character") {
            attributeActions.push(action);
          } else if (!attributeKey) {
            regularActions.push(action);
          }
        }

        // Sort and add to HUD (v12 compatible)
        const sortActions = (a, b) => {
          if (a.selected !== b.selected) return a.selected ? -1 : 1;
          return a.name.localeCompare(b.name);
        };

        attributeActions.sort(sortActions);
        regularActions.sort(sortActions);

        if (attributeActions.length > 0) {
          this.addActions(attributeActions, {
            id: "attributeConditions",
            type: "system",
          });
        }
        if (regularActions.length > 0) {
          this.addActions(regularActions, {
            id: "statusEffects",
            type: "system",
          });
        }
      } else {
        // V13+ ENHANCED: Use full categorization
        const attributeActions = [];
        const generalActions = [];
        const spellActions = [];
        const heroicActions = [];
        const regularActions = [];

        for (const effect of statusEffects) {
          if (!effect.id && !effect.img && !effect.icon) continue;

          const effectId = effect.id || effect.img || effect.icon;
          const effectName = effect.name || effect.label || effectId;

          if (/^action[1-9]$/.test(effectId) || effectName === "Action")
            continue;

          const localizedName = game.i18n.localize(effectName) || effectName;
          const attributeKey = attributeConditionsMap[localizedName];

          let isActive = activeEffects.has(effectId);
          if (
            attributeKey &&
            this.actor.system?.conditions?.[attributeKey]?.value
          ) {
            isActive = true;
          }

          const action = this._createConditionAction(
            effect,
            isActive,
            attributeKey
          );

          // Enhanced categorization
          let category = null;
          if (effect.flags?.["dragonbane-status-effects"]?.category) {
            category = effect.flags["dragonbane-status-effects"].category;
          }

          if (attributeKey && this.actorType === "character") {
            attributeActions.push(action);
          } else if (category === "general") {
            generalActions.push(action);
          } else if (category === "spell") {
            spellActions.push(action);
          } else if (category === "ability") {
            heroicActions.push(action);
          } else if (!attributeKey) {
            regularActions.push(action);
          }
        }

        // Sort and add to HUD (v13+ enhanced)
        const sortActions = (a, b) => {
          if (a.selected !== b.selected) return a.selected ? -1 : 1;
          return a.name.localeCompare(b.name);
        };

        attributeActions.sort(sortActions);
        generalActions.sort(sortActions);
        spellActions.sort(sortActions);
        heroicActions.sort(sortActions);
        regularActions.sort(sortActions);

        if (attributeActions.length > 0) {
          this.addActions(attributeActions, {
            id: "attributeConditions",
            type: "system",
          });
        }
        if (generalActions.length > 0) {
          this.addActions(generalActions, {
            id: "generalEffects",
            type: "system",
          });
        }
        if (spellActions.length > 0) {
          this.addActions(spellActions, { id: "spellEffects", type: "system" });
        }
        if (heroicActions.length > 0) {
          this.addActions(heroicActions, {
            id: "heroicAbilities",
            type: "system",
          });
        }
        if (regularActions.length > 0) {
          this.addActions(regularActions, {
            id: "statusEffects",
            type: "system",
          });
        }
      }
    }

    /**
     * Build system actions
     * Called by Token Action HUD Core
     * @override
     * @param {array} groupIds
     */
    async buildSystemActions(groupIds) {
      // Early return if no actor - we need an actor for Dragonbane actions
      if (!this.actor) {
        this.buildMultipleTokenActions();
        return;
      }

      // Set actor and token variables
      this.actors = [this.actor];
      this.actorType = this.actor?.type;

      // Settings
      this.showUnequippedItems = Utils.getSetting("showUnequippedItems");
      this.showAllSpells = Utils.getSetting("showAllSpells");
      this.showEquippedWeaponsOnly = Utils.getSetting(
        "showEquippedWeaponsOnly"
      );
      this.showAttributes = Utils.getSetting("showAttributes");
      this.showInjuries = Utils.getSetting("showInjuries");
      this.showDeathRoll = Utils.getSetting("showDeathRoll");
      this.showWeaponSkills = Utils.getSetting("showWeaponSkills");
      this.showSecondarySkills = Utils.getSetting("showSecondarySkills");

      // Set items variable
      if (this.actor) {
        let items = this.actor.items;
        items = coreModule.api.Utils.sortItemsByName(items);
        this.items = items;
      }

      // PHASE 1: Bind utility methods
      const actionUtilities = createActionUtilities(coreModule);
      Object.assign(this, {
        _createItemAction: actionUtilities._createItemAction.bind(this),
        _createSimpleAction: actionUtilities._createSimpleAction.bind(this),
        _createConditionalAction:
          actionUtilities._createConditionalAction.bind(this),
        _tryDragonbaneActionOrSheet:
          actionUtilities._tryDragonbaneActionOrSheet.bind(this),
        _createConditionAction:
          actionUtilities._createConditionAction.bind(this),
      });

      // PHASE 2: Bind dialog methods
      const actionDialogs = createActionDialogs(coreModule);
      Object.assign(this, {
        showLightSourceDialog: actionDialogs.showLightSourceDialog.bind(this),
        showSevereInjuryDialog: actionDialogs.showSevereInjuryDialog.bind(this),
        performSevereInjuryRoll:
          actionDialogs.performSevereInjuryRoll.bind(this),
        buildSevereInjuryChatContent:
          actionDialogs.buildSevereInjuryChatContent.bind(this),
        getLightSourceData: actionDialogs.getLightSourceData.bind(this),
        rollSevereInjuryTable: actionDialogs.rollSevereInjuryTable.bind(this),
        _getSkillValue: actionDialogs._getSkillValue.bind(this),
      });

      // PHASE 3: Bind handler methods
      const actionHandlers = createActionHandlers(coreModule);
      Object.assign(this, {
        handleStatsAction: actionHandlers.handleStatsAction.bind(this),
        handleTraitsAction: actionHandlers.handleTraitsAction.bind(this),
        handleWeaponAction: actionHandlers.handleWeaponAction.bind(this),
        handleSpellAction: actionHandlers.handleSpellAction.bind(this),
        handleAbilityAction: actionHandlers.handleAbilityAction.bind(this),
        handleSkillAction: actionHandlers.handleSkillAction.bind(this),
        handleAttributeAction: actionHandlers.handleAttributeAction.bind(this),
        handleItemAction: actionHandlers.handleItemAction.bind(this),
        handleConditionAction: actionHandlers.handleConditionAction.bind(this),
        handleConditionToggle: actionHandlers.handleConditionToggle.bind(this),
        handleRestAction: actionHandlers.handleRestAction.bind(this),
        handleRestUnavailableAction:
          actionHandlers.handleRestUnavailableAction.bind(this),
        handleLightTestAction: actionHandlers.handleLightTestAction.bind(this),
        handleSevereInjuryAction:
          actionHandlers.handleSevereInjuryAction.bind(this),
        handleCombatSkillAction:
          actionHandlers.handleCombatSkillAction.bind(this),
        handleDeathRollAction: actionHandlers.handleDeathRollAction.bind(this),
        handleMonsterAttack: actionHandlers.handleMonsterAttack.bind(this),
        handleMonsterDefend: actionHandlers.handleMonsterDefend.bind(this),
        handleMonsterWeaponDamage:
          actionHandlers.handleMonsterWeaponDamage.bind(this),
      });

      // PHASE 4: Bind builder methods
      const actionBuilders = createActionBuilders(coreModule);
      Object.assign(this, {
        buildStats: actionBuilders.buildStats.bind(this),
        buildTraits: actionBuilders.buildTraits.bind(this),
        buildWeapons: actionBuilders.buildWeapons.bind(this),
        buildSpells: actionBuilders.buildSpells.bind(this),
        buildAbilities: actionBuilders.buildAbilities.bind(this),
        buildSkills: actionBuilders.buildSkills.bind(this),
        buildSkillCategory: actionBuilders.buildSkillCategory.bind(this),
        buildAttributes: actionBuilders.buildAttributes.bind(this),
        buildInventory: actionBuilders.buildInventory.bind(this),
        buildInjuries: actionBuilders.buildInjuries.bind(this),
        buildCombatActions: actionBuilders.buildCombatActions.bind(this),
        buildJourneyActions: actionBuilders.buildJourneyActions.bind(this),
        buildMonsterAttacks: actionBuilders.buildMonsterAttacks.bind(this),
        buildMonsterWeaponDamage:
          actionBuilders.buildMonsterWeaponDamage.bind(this),
        buildMonsterDefend: actionBuilders.buildMonsterDefend.bind(this),
      });

      if (this.actorType === "character") {
        this.buildCharacterActions();
      } else if (this.actorType === "npc") {
        this.buildNPCActions();
      } else if (this.actorType === "monster") {
        this.buildMonsterActions();
      }

      // Build top-level sections for all actor types
      this.buildAbilities();
      this.buildSpells();
      this.buildConditions();
      this.buildUtility();
    }

    /**
     * Build character actions
     */
    buildCharacterActions() {
      this.buildStats();
      this.buildWeapons();
      this.buildSkills();
      if (this.showAttributes) this.buildAttributes();
      this.buildInventory();
      if (this.showInjuries) this.buildInjuries();
      this.buildCombatActions();
      this.buildJourneyActions();
    }

    /**
     * Build NPC actions
     */
    buildNPCActions() {
      this.buildStats();
      this.buildTraits();
      this.buildWeapons();
      this.buildSkills();
      if (this.showAttributes) this.buildAttributes();
      this.buildInventory();
      if (this.showInjuries) this.buildInjuries();
      this.buildCombatActions();
      this.buildJourneyActions();
    }

    /**
     * Build monster actions
     */
    buildMonsterActions() {
      this.buildStats();
      this.buildTraits();
      this.buildMonsterAttacks();
      this.buildMonsterWeaponDamage();
      this.buildMonsterDefend();
    }

    /**
     * Build multiple token actions
     */
    buildMultipleTokenActions() {
      // For multiple tokens, show basic actions
      this.buildCombatActions();
    }

    /**
     * Generic builder for item-based actions
     * @param {string} itemType - Type of items to build
     * @param {string} actionTypeId - Action type identifier
     * @param {function} nameFormatter - Function to format item names
     * @param {function} filterCallback - Function to filter items
     * @param {string} handlerName - Handler method name
     * @param {string} groupId - Group ID for actions
     * @returns {void}
     */
    _buildItemActions(
      itemType,
      actionTypeId,
      nameFormatter,
      filterCallback,
      handlerName,
      groupId
    ) {
      if (this.items.size === 0) return;

      const items = new Map();

      for (const [itemId, itemData] of this.items) {
        if (itemData.type !== itemType) continue;
        if (filterCallback && !filterCallback(itemData)) continue;
        items.set(itemId, itemData);
      }

      if (items.size === 0) return;

      const actions = [...items].map(([itemId, itemData]) => {
        const name = nameFormatter(itemData);
        return this._createItemAction(
          itemId,
          name,
          itemData,
          actionTypeId,
          handlerName
        );
      });

      this.addActions(actions, { id: groupId, type: "system" });
    }

    /**
     * Collect items by type with optional filter
     * @param {string} itemType - Type of items to collect
     * @param {function} filterCallback - Optional filter function
     * @returns {Map} Map of filtered items
     */
    _collectItemsByType(itemType, filterCallback = null) {
      const items = new Map();

      if (!this.items || this.items.size === 0) return items;

      for (const [itemId, itemData] of this.items) {
        if (itemData.type !== itemType) continue;
        if (filterCallback && !filterCallback(itemData)) continue;
        items.set(itemId, itemData);
      }

      return items;
    }

    /**
     * Collect items with equipment-based filtering
     * @param {string} itemType - Type of items to collect
     * @param {boolean} showUnequipped - Whether to show unequipped items
     * @param {boolean} equippedOnly - Whether to show only equipped items
     * @returns {Map} Map of filtered items
     */
    _collectItemsWithEquipmentFilter(itemType, showUnequipped, equippedOnly) {
      if (!this.items || this.items.size === 0) return new Map();

      return this._collectItemsByType(itemType, (itemData) => {
        const equipped = Utils.isItemEquipped(itemData);
        if (equippedOnly && !equipped) return false;
        if (!showUnequipped && !equipped) return false;
        return true;
      });
    }

    /**
     * Get currently active effects for the actor
     * @returns {Set} Set of active effect IDs
     */
    _getActiveEffects() {
      const activeEffects = new Set();

      if (this.actor.effects) {
        for (const effect of this.actor.effects) {
          // Add from statuses
          if (effect.statuses) {
            for (const status of effect.statuses) {
              activeEffects.add(status);
            }
          }
          // Add from img (modern) or icon (deprecated)
          const effectIcon = effect.img || effect.icon;
          if (effectIcon) {
            activeEffects.add(effectIcon);
          }
        }
      }

      return activeEffects;
    }
  };
});
