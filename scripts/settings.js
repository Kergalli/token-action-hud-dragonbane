import { MODULE } from "./constants.js";
import { handleZIndexSettingChange } from "./z-index-handler.js";

/**
 * Register module settings
 * Called by Token Action HUD Core to register Token Action HUD system module settings
 * @param {function} coreUpdate Token Action HUD Core update function
 */
export function register(coreUpdate) {
  // 1. Show Attributes
  game.settings.register(MODULE.ID, "showAttributes", {
    name: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.showAttributes.name"
    ),
    hint: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.showAttributes.hint"
    ),
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: (value) => {
      coreUpdate(value);
    },
  });

  // 2. Show Injuries
  game.settings.register(MODULE.ID, "showInjuries", {
    name: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.showInjuries.name"
    ),
    hint: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.showInjuries.hint"
    ),
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: (value) => {
      coreUpdate(value);
    },
  });

  // 3. Show Equipped Weapons Only
  game.settings.register(MODULE.ID, "showEquippedWeaponsOnly", {
    name: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.showEquippedWeaponsOnly.name"
    ),
    hint: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.showEquippedWeaponsOnly.hint"
    ),
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
    onChange: (value) => {
      coreUpdate(value);
    },
  });

  // 4. Show Death Roll
  game.settings.register(MODULE.ID, "showDeathRoll", {
    name: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.showDeathRoll.name"
    ),
    hint: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.showDeathRoll.hint"
    ),
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: (value) => {
      coreUpdate(value);
    },
  });

  // 5. Show All Spells
  game.settings.register(MODULE.ID, "showAllSpells", {
    name: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.showAllSpells.name"
    ),
    hint: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.showAllSpells.hint"
    ),
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
    onChange: (value) => {
      coreUpdate(value);
    },
  });

  // 6. Show Weapon Skills
  game.settings.register(MODULE.ID, "showWeaponSkills", {
    name: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.showWeaponSkills.name"
    ),
    hint: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.showWeaponSkills.hint"
    ),
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: (value) => {
      coreUpdate(value);
    },
  });

  // 7. Show Secondary Skills
  game.settings.register(MODULE.ID, "showSecondarySkills", {
    name: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.showSecondarySkills.name"
    ),
    hint: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.showSecondarySkills.hint"
    ),
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: (value) => {
      coreUpdate(value);
    },
  });

  // 8. Show Unequipped Items
  game.settings.register(MODULE.ID, "showUnequippedItems", {
    name: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.showUnequippedItems.name"
    ),
    hint: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.showUnequippedItems.hint"
    ),
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: (value) => {
      coreUpdate(value);
    },
  });

  // 9. Show Currency
  game.settings.register(MODULE.ID, "showCurrency", {
    name: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.showCurrency.name"
    ),
    hint: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.showCurrency.hint"
    ),
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: (value) => {
      coreUpdate(value);
    },
  });

  // 10. Severe Injury Table UUID
  game.settings.register(MODULE.ID, "severeInjuryTableUuid", {
    name:
      game.i18n.localize(
        "tokenActionHud.dragonbane.settings.severeInjuryTableUuid.name"
      ) || "Severe Injury Table",
    hint:
      game.i18n.localize(
        "tokenActionHud.dragonbane.settings.severeInjuryTableUuid.hint"
      ) ||
      "UUID of the Severe Injury roll table. Leave blank to auto-detect by name.",
    scope: "world",
    config: true,
    type: String,
    default: "",
  });

  game.settings.register(MODULE.ID, "fearEffectTableUuid", {
    name:
      game.i18n.localize(
        "tokenActionHud.dragonbane.settings.fearEffectTableUuid.name"
      ) || "Fear Effect Table",
    hint:
      game.i18n.localize(
        "tokenActionHud.dragonbane.settings.fearEffectTableUuid.hint"
      ) ||
      "UUID of the Fear effect roll table. Leave blank to auto-detect by name.",
    scope: "world",
    config: true,
    type: String,
    default: "",
  });

  // 11. Show HUD Above Other Windows (Z-Index Override)
  game.settings.register(MODULE.ID, "hudAboveWindows", {
    name: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.hudAboveWindows.name"
    ),
    hint: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.hudAboveWindows.hint"
    ),
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
    onChange: (value) => {
      handleZIndexSettingChange(value);
      coreUpdate(value);
    },
  });

  // 12. Button Background Color
  game.settings.register(MODULE.ID, "buttonBackgroundColor", {
    name: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.buttonBackgroundColor.name"
    ),
    hint: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.buttonBackgroundColor.hint"
    ),
    scope: "client",
    config: true,
    type: String,
    default: "#00604d",
    onChange: (value) => {
      applyButtonStyling();
      coreUpdate(value);
    },
  });

  // 13. Button Background Opacity
  game.settings.register(MODULE.ID, "buttonBackgroundOpacity", {
    name: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.buttonBackgroundOpacity.name"
    ),
    hint: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.buttonBackgroundOpacity.hint"
    ),
    scope: "client",
    config: true,
    type: Number,
    range: {
      min: 0,
      max: 1,
      step: 0.05,
    },
    default: 0.75,
    onChange: (value) => {
      applyButtonStyling();
      coreUpdate(value);
    },
  });

  // Function to apply button styling
  const applyButtonStyling = () => {
    const color = game.settings.get(MODULE.ID, "buttonBackgroundColor");
    const opacity = game.settings.get(MODULE.ID, "buttonBackgroundOpacity");

    // Convert hex to RGB
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Set CSS variable
    document.documentElement.style.setProperty(
      "--tah-dragonbane-button-bg",
      `rgba(${r}, ${g}, ${b}, ${opacity})`
    );
  };

  // Apply styling on startup
  Hooks.once("ready", () => {
    setTimeout(applyButtonStyling, 1000);
  });

  Hooks.on("tokenActionHudReady", () => {
    applyButtonStyling();
  });
}
