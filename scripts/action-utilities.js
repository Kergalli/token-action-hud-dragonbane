/**
 * Action utility methods for Token Action HUD Dragonbane
 * Pure utility functions for creating action objects
 */

export function createActionUtilities(coreModule) {
  return {
    /**
     * Create a standard item action object
     * @param {string} id - Action ID
     * @param {string} name - Display name
     * @param {object} itemData - Item data object
     * @param {string} actionTypeId - Action type identifier
     * @param {string} handlerName - Handler method name
     * @param {object} extraProps - Additional properties to merge
     * @returns {object} Action object
     */
    _createItemAction: function (
      id,
      name,
      itemData,
      actionTypeId,
      handlerName,
      extraProps = {}
    ) {
      const baseAction = {
        id,
        name,
        listName: name,
        img: itemData.img,
        encodedValue: [actionTypeId, id].join(this.delimiter),
      };

      // Only add onClick for items that don't need right-click sheet opening
      // Let weapons, spells, abilities, and skills route to RollHandler instead
      const useRollHandler = ["weapon", "spell", "ability", "skill"].includes(
        actionTypeId
      );

      if (!useRollHandler) {
        baseAction.onClick = async (event) => {
          await this[handlerName](event, itemData);
        };
      }

      return { ...baseAction, ...extraProps };
    },

    /**
     * Create a simple action object
     * @param {string} id - Action ID
     * @param {string} name - Display name
     * @param {string} img - Image path
     * @param {string} actionTypeId - Action type identifier
     * @param {string} handlerName - Handler method name
     * @param {object} extraProps - Additional properties to merge
     * @returns {object} Action object
     */
    _createSimpleAction: function (
      id,
      name,
      img,
      actionTypeId,
      handlerName,
      extraProps = {}
    ) {
      const baseAction = {
        id,
        name,
        listName: name,
        img,
        encodedValue: [actionTypeId, id].join(this.delimiter),
      };

      // Don't add onClick for action types that should route through RollHandler
      const useRollHandler = [
        "weapon",
        "spell",
        "ability",
        "skill",
        "combatAction",
        "journeyAction",
      ].includes(actionTypeId);

      if (!useRollHandler) {
        baseAction.onClick = async (event) => {
          await this[handlerName](event, id);
        };
      }

      return { ...baseAction, ...extraProps };
    },

    /**
     * Create a conditional action with CSS class based on condition
     * @param {string} id - Action ID
     * @param {string} name - Display name
     * @param {string} img - Image path
     * @param {boolean} condition - Condition to check
     * @param {string} cssClass - CSS class when condition is true
     * @param {string} actionTypeId - Action type identifier
     * @param {string} handlerName - Handler method name
     * @returns {object} Action object
     */
    _createConditionalAction: function (
      id,
      name,
      img,
      condition,
      cssClass,
      actionTypeId,
      handlerName
    ) {
      return this._createSimpleAction(
        id,
        name,
        img,
        actionTypeId,
        handlerName,
        {
          cssClass: condition ? cssClass : "",
        }
      );
    },

    /**
     * Try Dragonbane action or fallback to sheet
     * @param {object} itemData - Item data
     * @param {string} methodName - Dragonbane API method name
     * @returns {Promise}
     */
    _tryDragonbaneActionOrSheet: async function (itemData, methodName) {
      try {
        // Try official Dragonbane API method
        if (
          game.dragonbane &&
          typeof game.dragonbane[methodName] === "function"
        ) {
          return game.dragonbane[methodName](itemData.name, itemData.type);
        }

        // Fallback to opening sheet
        return itemData.sheet?.render(true);
      } catch (error) {
        // Silent fallback to sheet
        return itemData.sheet?.render(true);
      }
    },

    /**
     * Create a condition action
     * @param {string} id - Action ID
     * @param {string} name - Display name
     * @param {string} img - Image path
     * @param {boolean} isActive - Whether condition is active
     * @param {string} effectId - Effect ID for toggling
     * @param {string} attributeKey - Attribute key for attribute conditions
     * @returns {object} Action object
     */
    _createConditionAction: function (effect, isActive, attributeKey = null) {
      const effectId = effect.id || effect.img || effect.icon; // Try img first (modern), then icon (deprecated)
      const effectName = effect.name || effect.label || effectId;
      const localizedName = game.i18n.localize(effectName) || effectName;

      return {
        id: `condition_${effectId}`,
        name: localizedName,
        listName: localizedName,
        img: effect.img || effect.icon || "icons/svg/cancel.svg", // Try img first (modern), then icon (deprecated)
        cssClass: isActive ? "dragonbane-condition-active" : "",
        selected: isActive,
        encodedValue: ["condition", effectId].join(this.delimiter),
        onClick: async (event) => {
          await this.handleConditionToggle(event, effectId, attributeKey);
        },
      };
    },
  };
}
