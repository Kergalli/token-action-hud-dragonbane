/**
 * SystemManager for Token Action HUD Dragonbane
 */

import { MODULE, GROUP } from './constants.js'

// Module-level variables to store class references
let ActionHandler = null
let RollHandler = null

/**
 * Set the class references (called from init.js)
 */
export function setClassReferences(actionHandler, rollHandler) {
    ActionHandler = actionHandler
    RollHandler = rollHandler
}

/**
 * Factory function to create SystemManager class that extends the core SystemManager
 */
export function createSystemManager(coreModule) {
    return class SystemManager extends coreModule.api.SystemManager {
        getActionHandler(rollHandlerId) {
            return new ActionHandler()
        }

        getAvailableRollHandlers() {
            return { core: 'Core Dragonbane' }
        }

        getRollHandler(rollHandlerId) {
            return new RollHandler()
        }

        registerDefaults() {
            const groups = GROUP

            // Convert group definitions to proper format with localized names
            const groupsArray = Object.values(groups).map(group => ({
                ...group,
                name: typeof group.name === 'function' ? group.name() : group.name
            }))

            // Always include all skill groups in layout - visibility will be controlled in buildSystemActions
            const skillGroups = [
                { ...groups.coreSkills, name: groups.coreSkills.name(), nestId: 'skills_coreSkills' },
                { ...groups.weaponSkills, name: groups.weaponSkills.name(), nestId: 'skills_weaponSkills' },
                { ...groups.secondarySkills, name: groups.secondarySkills.name(), nestId: 'skills_secondarySkills' },
                { ...groups.npcTraits, name: groups.npcTraits.name(), nestId: 'skills_npcTraits' }
            ]

            const layout = [
                {
                    nestId: 'stats',
                    id: 'stats',
                    name: groups.stats.name(),
                    groups: [{ ...groups.stats, name: groups.stats.name(), nestId: 'stats_stats' }]
                },
                {
                    nestId: 'attributes',
                    id: 'attributes',
                    name: groups.attributes.name(),
                    groups: [{ ...groups.attributes, name: groups.attributes.name(), nestId: 'attributes_attributes' }]
                },
                {
                    nestId: 'traits',
                    id: 'traits',
                    name: groups.traits.name(),
                    groups: [
                        { ...groups.monsterTraits, name: groups.monsterTraits.name(), nestId: 'traits_monsterTraits' },
                        { ...groups.npcTraits, name: groups.npcTraits.name(), nestId: 'traits_npcTraits' }
                    ]
                },
                {
                    nestId: 'combat',
                    id: 'combat',
                    name: groups.combat.name(),
                    groups: [
                        { ...groups.weapons, name: groups.weapons.name(), nestId: 'combat_weapons' },
                        { ...groups.combatActions, name: groups.combatActions.name(), nestId: 'combat_combatActions' }
                    ]
                },
                {
                    nestId: 'monsterAttacks',
                    id: 'monsterAttacks',
                    name: groups.monsterAttacks.name(),
                    groups: [
                        { ...groups.monsterAttacksRandom, name: groups.monsterAttacksRandom.name(), nestId: 'monsterAttacks_random' },
                        { ...groups.monsterAttacksSpecific, name: groups.monsterAttacksSpecific.name(), nestId: 'monsterAttacks_specific' },
                        { ...groups.monsterDefend, name: groups.monsterDefend.name(), nestId: 'monsterAttacks_defend' }
                    ]
                },
                {
                    nestId: 'skills',
                    id: 'skills',
                    name: groups.skills.name(),
                    groups: skillGroups
                },
                {
                    nestId: 'spells',
                    id: 'spells',
                    name: groups.spells.name(),
                    groups: [
                        { ...groups.magicTricks, name: groups.magicTricks.name(), nestId: 'spells_magicTricks' },
                        { ...groups.spellsRank1, name: groups.spellsRank1.name(), nestId: 'spells_rank1' },
                        { ...groups.spellsRank2, name: groups.spellsRank2.name(), nestId: 'spells_rank2' },
                        { ...groups.spellsRank3, name: groups.spellsRank3.name(), nestId: 'spells_rank3' }
                    ]
                },
                {
                    nestId: 'abilities',
                    id: 'abilities',
                    name: groups.abilities.name(),
                    groups: [{ ...groups.abilities, name: groups.abilities.name(), nestId: 'abilities_abilities' }]
                },
                {
                    nestId: 'conditionsParent',
                    id: 'conditionsParent',
                    name: groups.conditionsParent.name(),
                    groups: [
                        { ...groups.attributeConditions, name: groups.attributeConditions.name(), nestId: 'conditionsParent_attributeConditions' },
                        { ...groups.conditions, name: groups.conditions.name(), nestId: 'conditionsParent_conditions' }
                    ]
                },
                {
                    nestId: 'utility',
                    id: 'utility',
                    name: groups.utility.name(),
                    groups: [{ ...groups.utility, name: groups.utility.name(), nestId: 'utility_utility' }]
                }
            ]

            return { groups: groupsArray, layout }
        }
    }
}
