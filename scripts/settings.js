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
    // Background settings
    const bgColor = game.settings.get(MODULE.ID, "buttonBackgroundColor");
    const bgOpacity = game.settings.get(MODULE.ID, "buttonBackgroundOpacity");

    // Border settings
    const borderColor = game.settings.get(MODULE.ID, "buttonBorderColor");
    const borderSize = game.settings.get(MODULE.ID, "buttonBorderSize");
    const borderOpacity = game.settings.get(MODULE.ID, "buttonBorderOpacity");

    // Convert background hex to RGB
    const bgHex = bgColor.replace("#", "");
    const bgR = parseInt(bgHex.substr(0, 2), 16);
    const bgG = parseInt(bgHex.substr(2, 2), 16);
    const bgB = parseInt(bgHex.substr(4, 2), 16);

    // Convert border hex to RGB
    const borderHex = borderColor.replace("#", "");
    const borderR = parseInt(borderHex.substr(0, 2), 16);
    const borderG = parseInt(borderHex.substr(2, 2), 16);
    const borderB = parseInt(borderHex.substr(4, 2), 16);

    // Set CSS variables
    document.documentElement.style.setProperty(
      "--tah-dragonbane-button-bg",
      `rgba(${bgR}, ${bgG}, ${bgB}, ${bgOpacity})`
    );

    document.documentElement.style.setProperty(
      "--tah-dragonbane-button-border",
      `${borderSize}px solid rgba(${borderR}, ${borderG}, ${borderB}, ${borderOpacity})`
    );
  };

  // Apply styling on startup
  Hooks.once("ready", () => {
    setTimeout(applyButtonStyling, 1000);
  });

  Hooks.on("tokenActionHudReady", () => {
    applyButtonStyling();
  });
  // 14. Button Border Color
  game.settings.register(MODULE.ID, "buttonBorderColor", {
    name: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.buttonBorderColor.name"
    ),
    hint: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.buttonBorderColor.hint"
    ),
    scope: "client",
    config: true,
    type: String,
    default: "#ffffff",
    onChange: (value) => {
      applyButtonStyling();
      coreUpdate(value);
    },
  });

  // 15. Button Border Size
  game.settings.register(MODULE.ID, "buttonBorderSize", {
    name: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.buttonBorderSize.name"
    ),
    hint: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.buttonBorderSize.hint"
    ),
    scope: "client",
    config: true,
    type: Number,
    range: {
      min: 0,
      max: 5,
      step: 0.5,
    },
    default: 1,
    onChange: (value) => {
      applyButtonStyling();
      coreUpdate(value);
    },
  });

  // 16. Button Border Opacity
  game.settings.register(MODULE.ID, "buttonBorderOpacity", {
    name: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.buttonBorderOpacity.name"
    ),
    hint: game.i18n.localize(
      "tokenActionHud.dragonbane.settings.buttonBorderOpacity.hint"
    ),
    scope: "client",
    config: true,
    type: Number,
    range: {
      min: 0,
      max: 1,
      step: 0.05,
    },
    default: 0.8,
    onChange: (value) => {
      applyButtonStyling();
      coreUpdate(value);
    },
  });
}
