/**
 * Module-based constants
 */
export const MODULE = {
  ID: "token-action-hud-dragonbane",
};

/**
 * Core module version required by the system module
 */
export const REQUIRED_CORE_MODULE_VERSION = "2.0";

/**
 * Groups - All localization keys properly defined in en.json
 */
export const GROUP = {
  // Stats group (always first)
  stats: {
    id: "stats",
    name: "tokenActionHud.dragonbane.stats",
    type: "system",
  },

  // Equipment groups
  weapons: {
    id: "weapons",
    name: "DoD.ui.character-sheet.weapons",
    type: "system",
  },
  armor: { id: "armor", name: "DoD.ui.character-sheet.armor", type: "system" },
  helmets: {
    id: "helmets",
    name: "tokenActionHud.dragonbane.helmets",
    type: "system",
  },
  items: {
    id: "items",
    name: "tokenActionHud.dragonbane.items",
    type: "system",
  },

  // Magic groups
  spells: {
    id: "spells",
    name: "DoD.ui.character-sheet.spells",
    type: "system",
  },
  spellRank0: {
    id: "spellRank0",
    name: "tokenActionHud.dragonbane.spellRank0",
    type: "system",
  },
  spellRank1: {
    id: "spellRank1",
    name: "tokenActionHud.dragonbane.spellRank1",
    type: "system",
  },
  spellRank2: {
    id: "spellRank2",
    name: "tokenActionHud.dragonbane.spellRank2",
    type: "system",
  },
  spellRank3: {
    id: "spellRank3",
    name: "tokenActionHud.dragonbane.spellRank3",
    type: "system",
  },

  // Character groups
  abilities: {
    id: "abilities",
    name: "DoD.ui.character-sheet.abilities",
    type: "system",
  },
  attributes: {
    id: "attributes",
    name: "tokenActionHud.dragonbane.attributes",
    type: "system",
  },

  // Conditions groups - Enhanced with category support
  conditions: {
    id: "conditions",
    name: "tokenActionHud.dragonbane.conditions",
    type: "system",
  },
  attributeConditions: {
    id: "attributeConditions",
    name: "tokenActionHud.dragonbane.attributeConditions",
    type: "system",
  },
  statusEffects: {
    id: "statusEffects",
    name: "tokenActionHud.dragonbane.statusEffects",
    type: "system",
  },

  // New categorized condition groups
  generalEffects: {
    id: "generalEffects",
    name: "tokenActionHud.dragonbane.generalEffects",
    type: "system",
  },
  spellEffects: {
    id: "spellEffects",
    name: "tokenActionHud.dragonbane.spellEffects",
    type: "system",
  },
  heroicAbilities: {
    id: "heroicAbilities",
    name: "tokenActionHud.dragonbane.heroicAbilities",
    type: "system",
  },

  // Skills groups
  coreSkills: {
    id: "coreSkills",
    name: "DoD.ui.character-sheet.coreSkills",
    type: "system",
  },
  weaponSkills: {
    id: "weaponSkills",
    name: "DoD.ui.character-sheet.weaponSkills",
    type: "system",
  },
  secondarySkills: {
    id: "secondarySkills",
    name: "DoD.ui.character-sheet.secondarySkills",
    type: "system",
  },

  // Monster groups
  monsterAttacksRandom: {
    id: "monsterAttacksRandom",
    name: "tokenActionHud.dragonbane.monsterAttacksRandom",
    type: "system",
  },
  monsterAttacksSpecific: {
    id: "monsterAttacksSpecific",
    name: "tokenActionHud.dragonbane.monsterAttacksSpecific",
    type: "system",
  },
  monsterWeaponDamage: {
    id: "monsterWeaponDamage",
    name: "tokenActionHud.dragonbane.monsterWeaponDamage",
    type: "system",
  },
  monsterDefend: {
    id: "monsterDefend",
    name: "tokenActionHud.dragonbane.monsterDefend",
    type: "system",
  },

  // Combat groups
  combat: {
    id: "combat",
    name: "DoD.ui.character-sheet.combat",
    type: "system",
  },
  combatActions: {
    id: "combatActions",
    name: "tokenActionHud.dragonbane.combatActions",
    type: "system",
  },
  injuries: {
    id: "injuries",
    name: "DoD.ui.character-sheet.injuries",
    type: "system",
  },
  traits: {
    id: "traits",
    name: "DoD.ui.character-sheet.traits",
    type: "system",
  },

  // Utility groups
  resting: {
    id: "resting",
    name: "tokenActionHud.dragonbane.resting",
    type: "system",
  },
  tokenActions: {
    id: "tokenActions",
    name: "tokenActionHud.dragonbane.tokenActions",
    type: "system",
  },
  other: {
    id: "other",
    name: "tokenActionHud.dragonbane.other",
    type: "system",
  },
  journeyActions: {
    id: "journeyActions",
    name: "tokenActionHud.dragonbane.journeyActions",
    type: "system",
  },
  token: { id: "token", name: "tokenActionHud.token", type: "system" },
  utility: { id: "utility", name: "tokenActionHud.utility", type: "system" },
};

/**
 * Item types
 */
export const ITEM_TYPE = {
  ability: { groupId: "abilities" },
  armor: { groupId: "armor" },
  helmet: { groupId: "helmets" },
  injury: { groupId: "injuries" },
  item: { groupId: "items" },
  skill: { groupId: "skills" },
  spell: { groupId: "spells" },
  weapon: { groupId: "weapons" },
};

/**
 * Attributes for Dragonbane
 */
export const ATTRIBUTES = {
  str: { id: "str", name: "DoD.attributes.str" },
  con: { id: "con", name: "DoD.attributes.con" },
  agl: { id: "agl", name: "DoD.attributes.agl" },
  int: { id: "int", name: "DoD.attributes.int" },
  wil: { id: "wil", name: "DoD.attributes.wil" },
  cha: { id: "cha", name: "DoD.attributes.cha" },
};
