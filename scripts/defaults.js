import { GROUP } from './constants.js'

/**
 * Default layout and groups - Updated to use core Dragonbane localization where appropriate
 */
export let DEFAULTS = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    const groups = GROUP
    Object.values(groups).forEach(group => {
        group.name = coreModule.api.Utils.i18n(group.name)
        group.listName = `Group: ${coreModule.api.Utils.i18n(group.listName ?? group.name)}`
    })
    const groupsArray = Object.values(groups)
    
    DEFAULTS = {
        layout: [
            {
                nestId: 'stats',
                id: 'stats',
                name: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.stats'),
                groups: [
                    { ...groups.stats, nestId: 'stats_stats' },
                    { ...groups.attributes, nestId: 'stats_attributes' },
                    { ...groups.injuries, nestId: 'stats_injuries' },
                    { ...groups.traits, nestId: 'stats_traits' }
                ]
            },
            {
                nestId: 'combat',
                id: 'combat',
                name: coreModule.api.Utils.i18n('DoD.ui.character-sheet.combat'),
                groups: [
                    { ...groups.weapons, nestId: 'combat_weapons' },
                    { ...groups.combatActions, nestId: 'combat_combatActions' }
                ]
            },
            {
                nestId: 'spells',
                id: 'spells',
                name: coreModule.api.Utils.i18n('DoD.ui.character-sheet.spells'),
                groups: [
                    { ...groups.spellRank0, nestId: 'spells_rank0' },
                    { ...groups.spellRank1, nestId: 'spells_rank1' },
                    { ...groups.spellRank2, nestId: 'spells_rank2' },
                    { ...groups.spellRank3, nestId: 'spells_rank3' }
                ]
            },
            {
                nestId: 'monster',
                id: 'monster',
                name: coreModule.api.Utils.i18n('TYPES.Actor.monster'),
                groups: [
                    { ...groups.monsterAttacksRandom, nestId: 'monster_attacksRandom' },
                    { ...groups.monsterAttacksSpecific, nestId: 'monster_attacksSpecific' },
                    { ...groups.monsterWeaponDamage, nestId: 'monster_weaponDamage' },
                    { ...groups.monsterDefend, nestId: 'monster_defend' }
                ]
            },
            {
                nestId: 'skills',
                id: 'skills',
                name: coreModule.api.Utils.i18n('DoD.ui.character-sheet.skills'),
                groups: [
                    { ...groups.coreSkills, nestId: 'skills_coreSkills' },
                    { ...groups.weaponSkills, nestId: 'skills_weaponSkills' },
                    { ...groups.secondarySkills, nestId: 'skills_secondarySkills' }
                ]
            },
            {
                nestId: 'abilities',
                id: 'abilities',
                name: coreModule.api.Utils.i18n('DoD.ui.character-sheet.abilities'),
                groups: [
                    { ...groups.abilities, nestId: 'abilities_abilities' }
                ]
            },
            {
                nestId: 'conditions',
                id: 'conditions', 
                name: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.conditions'),
                groups: [
                    { ...groups.attributeConditions, nestId: 'conditions_attributeConditions' },
                    { ...groups.statusEffects, nestId: 'conditions_statusEffects' }
                ]
            },
            {
                nestId: 'inventory',
                id: 'inventory',
                name: coreModule.api.Utils.i18n('DoD.ui.character-sheet.inventory'),
                groups: [
                    { ...groups.armor, nestId: 'inventory_armor' },
                    { ...groups.helmets, nestId: 'inventory_helmets' },
                    { ...groups.items, nestId: 'inventory_items' }
                ]
            },
            {
                nestId: 'utility',
                id: 'utility',
                name: coreModule.api.Utils.i18n('tokenActionHud.utility'),
                groups: [
                    { ...groups.resting, nestId: 'utility_resting' },
                    { ...groups.tokenActions, nestId: 'utility_tokenActions' },
                    { ...groups.other, nestId: 'utility_other' }
                ]
            }
        ],
        groups: groupsArray
    }
})