/**
 * Token Action HUD Dragonbane - Constants and Shared Utilities
 * Compatible with Token Action HUD Core v1.5.7
 */

// Module constants
export const MODULE = {
    ID: 'token-action-hud-dragonbane'
}

export const REQUIRED_CORE_MODULE_VERSION = '1.5'

// Action types
export const ACTION_TYPE = {
    attribute: 'attribute',
    skill: 'skill',
    weapon: 'weapon',
    spell: 'spell',
    ability: 'ability',
    condition: 'condition',
    utility: 'utility',
    monsterAttack: 'monsterAttack',
    monsterDefend: 'monsterDefend',
    traits: 'traits',
    stats: 'stats',
    deathRoll: 'deathRoll',
    combatAction: 'combatAction'
}

export const TIMEOUTS = {
    HUD_UPDATE_DELAY: 100
}

// Combat action definitions
export const COMBAT_ACTIONS = {
    firstAid: {
        id: 'firstAid',
        skillName: 'healing',
        requiresTarget: true,
        maxRange: 2, // meters
        icon: 'icons/svg/regen.svg'
    },
    rallyOther: {
        id: 'rallyOther', 
        skillName: 'persuasion',
        requiresTarget: true,
        maxRange: 10, // meters
        icon: 'icons/svg/upgrade.svg'
    },
    rallySelf: {
        id: 'rallySelf',
        attributeName: 'wil',
        requiresTarget: false,
        maxRange: 0,
        icon: 'icons/svg/upgrade.svg'
    },
    dodge: {
        id: 'dodge',
        skillName: 'evade', 
        requiresTarget: false,
        maxRange: 0,
        icon: 'icons/svg/combat.svg'
    }
}

// Group definitions
export const GROUP = {
    attributes: {
        id: 'attributes',
        name: () => game.i18n.localize('tokenActionHud.dragonbane.groups.attributes') || 'Attributes',
        type: 'system'
    },
    skills: {
        id: 'skills',
        name: () => game.i18n.localize('DoD.ui.character-sheet.skills'),
        type: 'system'
    },
    coreSkills: {
        id: 'coreSkills',
        name: () => game.i18n.localize('DoD.skillTypes.core'),
        type: 'system'
    },
    weaponSkills: {
        id: 'weaponSkills',
        name: () => game.i18n.localize('DoD.skillTypes.weapon'),
        type: 'system'
    },
    secondarySkills: {
        id: 'secondarySkills',
        name: () => game.i18n.localize('DoD.skillTypes.secondary'),
        type: 'system'
    },
    combat: {
        id: 'combat',
        name: () => game.i18n.localize('tokenActionHud.dragonbane.groups.combat') || 'Combat',
        type: 'system'
    },
    weapons: {
        id: 'weapons',
        name: () => game.i18n.localize('DoD.ui.character-sheet.weapons'),
        type: 'system'
    },
    combatActions: {
        id: 'combatActions',
        name: () => game.i18n.localize('tokenActionHud.dragonbane.groups.combatActions') || 'Combat Actions',
        type: 'system'
    },
    spells: {
        id: 'spells',
        name: () => game.i18n.localize('DoD.ui.character-sheet.spells'),
        type: 'system'
    },
    magicTricks: {
        id: 'magicTricks',
        name: () => game.i18n.localize('DoD.ui.character-sheet.tricks'),
        type: 'system'
    },
    spellsRank1: {
        id: 'spellsRank1',
        name: () => game.i18n.localize('tokenActionHud.dragonbane.groups.spellsRank1') || 'Rank 1',
        type: 'system'
    },
    spellsRank2: {
        id: 'spellsRank2',
        name: () => game.i18n.localize('tokenActionHud.dragonbane.groups.spellsRank2') || 'Rank 2',
        type: 'system'
    },
    spellsRank3: {
        id: 'spellsRank3',
        name: () => game.i18n.localize('tokenActionHud.dragonbane.groups.spellsRank3') || 'Rank 3',
        type: 'system'
    },
    abilities: {
        id: 'abilities',
        name: () => game.i18n.localize('DoD.ui.character-sheet.abilities'),
        type: 'system'
    },
    attributeConditions: {
        id: 'attributeConditions',
        name: () => game.i18n.localize('tokenActionHud.dragonbane.groups.attributeConditions') || 'Attribute Conditions',
        type: 'system'
    },
    conditions: {
        id: 'conditions',
        name: () => game.i18n.localize('tokenActionHud.dragonbane.groups.conditions') || 'Status Effects',
        type: 'system'
    },
    conditionsParent: {
        id: 'conditionsParent',
        name: () => game.i18n.localize('tokenActionHud.dragonbane.groups.conditionsParent') || 'Conditions',
        type: 'system'
    },
    utility: {
        id: 'utility',
        name: () => game.i18n.localize('tokenActionHud.dragonbane.groups.utility') || 'Utility',
        type: 'system'
    },
    monsterAttacks: {
        id: 'monsterAttacks',
        name: () => game.i18n.localize('DoD.ui.character-sheet.monsterAttackTooltip'),
        type: 'system'
    },
    monsterAttacksRandom: {
        id: 'monsterAttacksRandom',
        name: () => game.i18n.localize('tokenActionHud.dragonbane.groups.monsterAttacksRandom') || 'Random Monster Attack',
        type: 'system'
    },
    monsterAttacksSpecific: {
        id: 'monsterAttacksSpecific',
        name: () => game.i18n.localize('DoD.ui.character-sheet.monsterAttackTooltip'),
        type: 'system'
    },
    monsterDefend: {
        id: 'monsterDefend',
        name: () => game.i18n.localize('tokenActionHud.dragonbane.groups.monsterDefend') || 'Monster Defend',
        type: 'system'
    },
    traits: {
        id: 'traits',
        name: () => game.i18n.localize('DoD.ui.character-sheet.traits') || 'Traits',
        type: 'system'
    },
    monsterTraits: {
        id: 'monsterTraits',
        name: () => game.i18n.localize('DoD.ui.character-sheet.traits'),
        type: 'system'
    },
    npcTraits: {
        id: 'npcTraits',
        name: () => game.i18n.localize('DoD.ui.character-sheet.traits'),
        type: 'system'
    },
    stats: {
        id: 'stats',
        name: () => game.i18n.localize('tokenActionHud.dragonbane.groups.stats') || 'Stats',
        type: 'system'
    }
}

/**
 * Helper function to map condition effects to attribute keys
 * @returns {Object} Mapping of localized condition names to attribute keys
 */
export const getAttributeConditionsMap = () => {
    const mapping = {}
    Object.entries(CONFIG.DoD.conditionEffects).forEach(([key, value]) => {
        // Extract attribute from key like "system.conditions.str.value" -> "str"
        const match = key.match(/system\.conditions\.(\w+)\.value/)
        if (match) {
            const attributeKey = match[1]  // "str", "con", etc.
            const localizedName = game.i18n.localize(value.name)  // "Exhausted", "Sickly", etc.
            mapping[localizedName] = attributeKey
        }
    })
    return mapping
}
