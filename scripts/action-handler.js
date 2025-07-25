/**
 * ActionHandler for Token Action HUD Dragonbane
 */

import {
    MODULE,
    ACTION_TYPE,
    getAttributeConditionsMap
} from './constants.js'

/**
 * Create ActionHandler class that extends the core ActionHandler
 */
export function createActionHandler(coreModule) {

    class ActionHandler extends coreModule.api.ActionHandler {

        constructor() {
            super()
            // Create debounced update function for this handler
            this._debouncedUpdate = foundry.utils.debounce(() => {
                if (ui.tokenActionHud) ui.tokenActionHud.update()
            }, 100)
        }

        /**
         * Clean up debounced functions to prevent memory leaks
         */
        destroy() {
            if (this._debouncedUpdate) {
                this._debouncedUpdate.cancel()
                this._debouncedUpdate = null
            }
        }

        /**
         * Helper method to get skill value
         */
        _getSkillValue(skill) {
            return skill.system?.value || skill.system?.level || skill.system?.rank || 0
        }

        _getActors() {
            return super._getActors() || []
        }

        /**
         * Build system actions
         */
        async buildSystemActions(groupIds) {
            // Use the default Token Action HUD Core logic
            this.actors = (!this.actor) ? this._getActors() : [this.actor]
            this.actorType = this.actor?.type
            this.tokenId = this.token?.id

            if (this.actors.length === 0) {
                return
            }

            // Cache all settings once per build cycle for better performance
            this.cachedSettings = {
                hideWeaponSkills: game.settings.get(MODULE.ID, 'hideWeaponSkills'),
                hideSecondarySkills: game.settings.get(MODULE.ID, 'hideSecondarySkills'),
                showOnlyMemorizedSpells: game.settings.get(MODULE.ID, 'showOnlyMemorizedSpells'),
                showUnequippedWeapons: game.settings.get(MODULE.ID, 'showUnequippedWeapons')
            }

            for (const actor of this.actors) {
                this.actor = actor

                await this._buildAttributes()
                await this._buildSkills()
                await this._buildWeapons()
                await this._buildSpells()
                await this._buildAbilities()
                await this._buildConditions()
                await this._buildUtility()
                await this._buildMonsterAttacks()
                await this._buildStats()
            }
        }

        /**
         * Build attributes with values
         */
        async _buildAttributes() {
            const attributes = this.actor.system.attributes
            if (!attributes) return

            const actions = []

            for (const [key, attribute] of Object.entries(attributes)) {
                if (!attribute) continue

                // Use localized attribute names (STR, CON, AGL, etc.)
                const localizedName = game.i18n.localize(`DoD.attributes.${key}`)
                const attributeValue = attribute.value || attribute.max || 0
                const name = `${localizedName} (${attributeValue})`

                const actionId = `${ACTION_TYPE.attribute}>${key}`
                const encodedValue = [ACTION_TYPE.attribute, key].join(this.delimiter)

                actions.push({
                    id: actionId,
                    name,
                    encodedValue,
                    img: 'icons/svg/dice-target.svg'
                })
            }

            if (actions.length > 0 && this.addActions) {
                this.addActions(actions, { id: 'attributes', type: 'system' })
            }
        }

        /**
         * Build skills with values and proper grouping
         */
        async _buildSkills() {
            // Use cached settings for better performance
            const hideWeaponSkills = this.cachedSettings.hideWeaponSkills
            const hideSecondarySkills = this.cachedSettings.hideSecondarySkills

            // Try to use system's pre-sorted arrays, fallback to manual filtering
            let skillsByType = {
                core: this.actor.system?.coreSkills || [],
                weapon: this.actor.system?.weaponSkills || [],
                secondary: this.actor.system?.secondarySkills || []
            }

            // If system arrays are empty/unavailable, fallback to manual grouping
            if (skillsByType.core.length === 0 && skillsByType.weapon.length === 0 && skillsByType.secondary.length === 0) {
                const items = this.actor.items.filter(item => item.type === 'skill')
                if (items.length === 0) return

                skillsByType = { core: [], weapon: [], secondary: [] }

                for (const skill of items) {
                    const systemType = skill.system.skillType || 'core'
                    const skillType = systemType === 'core' ? 'core' :
                        systemType === 'weapon' ? 'weapon' : 'secondary'

                    if (skillsByType[skillType]) {
                        skillsByType[skillType].push(skill)
                    }
                }
            }

            // Core Skills - show for all actor types
            if (skillsByType.core.length > 0) {
                const actions = []
                for (const skill of skillsByType.core) {
                    const skillValue = this._getSkillValue(skill)
                    const name = `${skill.name} (${skillValue})`

                    actions.push({
                        id: `${ACTION_TYPE.skill}>${skill.id}`,
                        name,
                        encodedValue: [ACTION_TYPE.skill, skill.id].join(this.delimiter),
                        img: skill.img
                    })
                }

                if (actions.length > 0 && this.addActions) {
                    this.addActions(actions, { id: 'coreSkills', type: 'system' })
                }
            }

            // Weapon Skills - show for all actor types (unless hidden)
            if (skillsByType.weapon.length > 0 && !hideWeaponSkills) {
                const actions = []
                for (const skill of skillsByType.weapon) {
                    const skillValue = this._getSkillValue(skill)
                    const name = `${skill.name} (${skillValue})`

                    actions.push({
                        id: `${ACTION_TYPE.skill}>${skill.id}`,
                        name,
                        encodedValue: [ACTION_TYPE.skill, skill.id].join(this.delimiter),
                        img: skill.img
                    })
                }

                if (actions.length > 0 && this.addActions) {
                    this.addActions(actions, { id: 'weaponSkills', type: 'system' })
                }
            }

            // Secondary Skills - show for all actor types (unless hidden)
            if (skillsByType.secondary.length > 0 && !hideSecondarySkills) {
                const actions = []
                for (const skill of skillsByType.secondary) {
                    const skillValue = this._getSkillValue(skill)
                    const name = `${skill.name} (${skillValue})`

                    actions.push({
                        id: `${ACTION_TYPE.skill}>${skill.id}`,
                        name,
                        encodedValue: [ACTION_TYPE.skill, skill.id].join(this.delimiter),
                        img: skill.img
                    })
                }

                // Add NPC Traits button if NPC has traits
                if (this.actor.type === 'npc' && this.actor.system.traits && this.actor.system.traits.trim()) {
                    actions.push({
                        id: `${ACTION_TYPE.traits}>show`,
                        name: game.i18n.localize('DoD.ui.character-sheet.traits') || 'Show Traits',
                        encodedValue: [ACTION_TYPE.traits, 'show'].join(this.delimiter),
                        img: 'modules/token-action-hud-dragonbane/assets/icons/traits.webp'
                    })
                }

                if (actions.length > 0 && this.addActions) {
                    this.addActions(actions, { id: 'secondarySkills', type: 'system' })
                }
            } else if (this.actor.type === 'npc' && this.actor.system.traits && this.actor.system.traits.trim()) {
                // If no secondary skills but NPC has traits, create traits-only group
                const actions = [{
                    id: `${ACTION_TYPE.traits}>show`,
                    name: game.i18n.localize('DoD.ui.character-sheet.traits') || 'Show Traits',
                    encodedValue: [ACTION_TYPE.traits, 'show'].join(this.delimiter),
                    img: 'modules/token-action-hud-dragonbane/assets/icons/traits.webp'
                }]

                if (this.addActions) {
                    this.addActions(actions, { id: 'npcTraits', type: 'system' })
                }
            }
        }

        /**
         * Build weapons using cached settings
         */
        async _buildWeapons() {
            const allWeapons = this.actor.items.filter(item => item.type === 'weapon')
            if (allWeapons.length === 0) return

            // Use cached settings for better performance
            const showUnequippedWeapons = this.cachedSettings.showUnequippedWeapons

            let weapons = allWeapons
            if (!showUnequippedWeapons) {
                weapons = allWeapons.filter(weapon => weapon.system.worn === true)
            }

            if (weapons.length === 0) return

            const actions = []

            for (const weapon of weapons) {
                let name = weapon.name

                // Add visual indicator if showing both equipped and unequipped weapons
                if (showUnequippedWeapons) {
                    const isEquipped = weapon.system.worn === true
                    if (isEquipped) {
                        name = game.i18n.format('tokenActionHud.dragonbane.actions.weapon.equipped', { name: weapon.name }) || `⚔ ${weapon.name}`
                    }
                }

                try {
                    let weaponSkillName = null

                    if (weapon.system?.skill && typeof weapon.system.skill === 'object') {
                        weaponSkillName = weapon.system.skill.name
                    } else if (typeof weapon.system?.skill === 'string') {
                        weaponSkillName = weapon.system.skill
                    }

                    if (weaponSkillName) {
                        const associatedSkill = this.actor.items.find(item =>
                            item.type === 'skill' &&
                            item.name.toLowerCase() === weaponSkillName.toLowerCase()
                        )

                        if (associatedSkill) {
                            const skillValue = this._getSkillValue(associatedSkill)
                            name = `${name} (${skillValue})`
                        }
                    }
                } catch (error) {
                    // Silently continue if skill lookup fails
                }

                actions.push({
                    id: `${ACTION_TYPE.weapon}>${weapon.id}`,
                    name,
                    encodedValue: [ACTION_TYPE.weapon, weapon.id].join(this.delimiter),
                    img: weapon.img
                })
            }

            if (actions.length > 0 && this.addActions) {
                this.addActions(actions, { id: 'weapons', type: 'system' })
            }
        }

        /**
         * Build spells with rank grouping and cached settings
         */
        async _buildSpells() {
            const allSpells = this.actor.items.filter(item => item.type === 'spell')

            // Use cached settings for better performance
            const showOnlyMemorized = this.cachedSettings.showOnlyMemorizedSpells

            let spells = allSpells

            // FIX 2: NPCs and Monsters always show all spells (no memorization system)
            // Only Characters use the memorized spell filtering
            if (showOnlyMemorized && this.actor.type === 'character') {
                spells = allSpells.filter(spell => spell.system.memorized === true)
            }
            // NPCs and Monsters always show all their spells regardless of memorized setting

            if (spells.length === 0) return

            const spellsByRank = { 0: [], 1: [], 2: [], 3: [] }

            for (const spell of spells) {
                const rank = spell.system.rank || 0
                if (spellsByRank[rank]) {
                    spellsByRank[rank].push(spell)
                }
            }

            // Magic Tricks (Rank 0)
            if (spellsByRank[0].length > 0) {
                const actions = spellsByRank[0].map(spell => ({
                    id: `${ACTION_TYPE.spell}>${spell.id}`,
                    name: spell.name,
                    encodedValue: [ACTION_TYPE.spell, spell.id].join(this.delimiter),
                    img: spell.img
                }))

                if (actions.length > 0 && this.addActions) {
                    this.addActions(actions, { id: 'magicTricks', type: 'system' })
                }
            }

            // Rank 1-3 Spells
            for (let rank = 1; rank <= 3; rank++) {
                if (spellsByRank[rank].length > 0) {
                    const actions = spellsByRank[rank].map(spell => ({
                        id: `${ACTION_TYPE.spell}>${spell.id}`,
                        name: spell.name,
                        encodedValue: [ACTION_TYPE.spell, spell.id].join(this.delimiter),
                        img: spell.img
                    }))

                    if (actions.length > 0 && this.addActions) {
                        this.addActions(actions, { id: `spellsRank${rank}`, type: 'system' })
                    }
                }
            }
        }

        /**
         * Build abilities
         */
        async _buildAbilities() {
            const abilities = this.actor.items.filter(item => item.type === 'ability')
            if (abilities.length === 0) return

            const actions = abilities.map(ability => ({
                id: `${ACTION_TYPE.ability}>${ability.id}`,
                name: ability.name,
                encodedValue: [ACTION_TYPE.ability, ability.id].join(this.delimiter),
                img: ability.img
            }))

            if (actions.length > 0 && this.addActions) {
                this.addActions(actions, { id: 'abilities', type: 'system' })
            }
        }

        /**
         * Build conditions - status effects with active state highlighting
         */
        async _buildConditions() {
            const statusEffects = CONFIG.statusEffects || []
            if (statusEffects.length === 0) return

            // Use static helper functions
            const attributeConditions = getAttributeConditionsMap()

            // Get currently active effects
            const activeEffects = new Set()

            if (this.actor?.effects) {
                this.actor.effects.forEach(effect => {
                    if (effect.statuses) {
                        effect.statuses.forEach(statusId => activeEffects.add(statusId))
                    }
                    if (effect.icon) {
                        activeEffects.add(effect.icon)
                    }
                })
            }

            const attributeActions = []
            const regularActions = []

            for (const effect of statusEffects) {
                if (!effect.id && !effect.icon) continue

                const effectId = effect.id || effect.icon
                const effectName = effect.name || effect.label || effectId

                const localizedName = game.i18n.localize(effectName) || effectName
                const attributeKey = attributeConditions[localizedName]
                let isActive = activeEffects.has(effectId)

                // For attribute conditions, also check character sheet checkbox
                if (attributeKey && this.actor?.system?.conditions?.[attributeKey]?.value) {
                    isActive = true
                }

                let name = localizedName
                if (isActive) {
                    name = `● ${name}`
                }

                const action = {
                    id: `${ACTION_TYPE.condition}>${effectId}`,
                    name,
                    encodedValue: [ACTION_TYPE.condition, effectId].join(this.delimiter),
                    img: effect.icon,
                    cssClass: isActive ? 'active' : '',
                    info1: isActive ? 'Active' : '',
                    selected: isActive
                }

                if (attributeKey) {
                    attributeActions.push(action)
                } else {
                    regularActions.push(action)
                }
            }

            // Sort to put active ones first
            const sortActions = (a, b) => {
                if (a.selected && !b.selected) return -1
                if (!a.selected && b.selected) return 1
                return a.name.localeCompare(b.name)
            }

            attributeActions.sort(sortActions)
            regularActions.sort(sortActions)

            if (attributeActions.length > 0 && this.addActions) {
                this.addActions(attributeActions, { id: 'attributeConditions', type: 'system' })
            }

            if (regularActions.length > 0 && this.addActions) {
                this.addActions(regularActions, { id: 'conditions', type: 'system' })
            }
        }

        /**
         * Build utility actions with rest availability checks
         */
        async _buildUtility() {
            // Skip utility actions for monsters
            if (this.actor.type === 'monster') return

            const canRestRound = this.actor.system.canRestRound ?? true
            const canRestStretch = this.actor.system.canRestStretch ?? true
            const canRestShift = this.actor.system.canRestShift ?? true

            const actions = [
                {
                    id: 'roundRest',
                    name: game.i18n.localize('tokenActionHud.dragonbane.actions.rest.round') || 'Round Rest (1D6 WP)',
                    encodedValue: [ACTION_TYPE.utility, 'roundRest'].join(this.delimiter),
                    disabled: !canRestRound,
                    cssClass: !canRestRound ? 'dragonbane-rest-unavailable' : '',
                    img: 'systems/dragonbane/art/icons/rest-round.webp'
                },
                {
                    id: 'stretchRest',
                    name: game.i18n.localize('tokenActionHud.dragonbane.actions.rest.stretch') || 'Stretch Rest (1D6 HP/WP)',
                    encodedValue: [ACTION_TYPE.utility, 'stretchRest'].join(this.delimiter),
                    disabled: !canRestStretch,
                    cssClass: !canRestStretch ? 'dragonbane-rest-unavailable' : '',
                    img: 'systems/dragonbane/art/icons/rest-stretch.webp'
                },
                {
                    id: 'shiftRest',
                    name: game.i18n.localize('tokenActionHud.dragonbane.actions.rest.shift') || 'Shift Rest (All HP/WP/Conditions)',
                    encodedValue: [ACTION_TYPE.utility, 'shiftRest'].join(this.delimiter),
                    disabled: !canRestShift,
                    cssClass: !canRestShift ? 'dragonbane-rest-unavailable' : '',
                    img: 'systems/dragonbane/art/icons/rest-shift.webp'
                },
                {
                    id: 'restReset',
                    name: game.i18n.localize('tokenActionHud.dragonbane.actions.rest.reset') || 'Pass One Shift of Time',
                    encodedValue: [ACTION_TYPE.utility, 'restReset'].join(this.delimiter),
                    img: 'systems/dragonbane/art/icons/hourglass.webp'
                }
            ]

            // Add Death Roll for characters only
            if (this.actor.type === 'character') {
                actions.push({
                    id: 'deathRoll',
                    name: game.i18n.localize('DoD.ui.character-sheet.deathRolls'),
                    encodedValue: [ACTION_TYPE.deathRoll, 'deathRoll'].join(this.delimiter),
                    img: 'icons/svg/skull.svg'
                })
            }

            if (actions.length > 0 && this.addActions) {
                this.addActions(actions, { id: 'utility', type: 'system' })
            }
        }

        /**
         * Build stats actions - movement, HP, WP, encumbrance, ferocity
         */
        async _buildStats() {
            const actions = []

            // Movement
            if (this.actor.system?.movement?.value !== undefined) {
                const movement = this.actor.system.movement.value
                const moveLabel = game.i18n.localize('DoD.ui.character-sheet.movement')
                actions.push({
                    id: `${ACTION_TYPE.stats}>movement`,
                    name: `${moveLabel}: ${movement}`,
                    encodedValue: [ACTION_TYPE.stats, 'movement'].join(this.delimiter),
                    img: 'modules/game-icons-net/whitetransparent/move.svg'
                })
            }

            // Hit Points
            if (this.actor.system?.hitPoints) {
                const currentHP = this.actor.system.hitPoints.value || 0
                const maxHP = this.actor.system.hitPoints.max || 0
                const hpLabel = game.i18n.localize('DoD.ui.character-sheet.hp')
                actions.push({
                    id: `${ACTION_TYPE.stats}>hitpoints`,
                    name: `${hpLabel}: ${currentHP}/${maxHP}`,
                    encodedValue: [ACTION_TYPE.stats, 'hitpoints'].join(this.delimiter),
                    img: 'modules/game-icons-net/whitetransparent/hearts.svg'
                })
            }

            // Ferocity
            if (this.actor.type === 'monster' && this.actor.system?.ferocity !== undefined) {
                const ferocity = this.actor.system.ferocity.value || this.actor.system.ferocity || 0
                const ferocityLabel = game.i18n.localize('DoD.ui.character-sheet.ferocity')
                actions.push({
                    id: `${ACTION_TYPE.stats}>ferocity`,
                    name: `${ferocityLabel}: ${ferocity}`,
                    encodedValue: [ACTION_TYPE.stats, 'ferocity'].join(this.delimiter),
                    img: 'modules/game-icons-net/whitetransparent/front-teeth.svg'
                })
            }

            // Willpower Points
            if (this.actor.type !== 'monster' && this.actor.system?.willPoints?.max > 0) {
                const currentWP = this.actor.system.willPoints.value || 0
                const maxWP = this.actor.system.willPoints.max || 0
                const wpLabel = game.i18n.localize('DoD.ui.character-sheet.wp')
                actions.push({
                    id: `${ACTION_TYPE.stats}>willpoints`,
                    name: `${wpLabel}: ${currentWP}/${maxWP}`,
                    encodedValue: [ACTION_TYPE.stats, 'willpoints'].join(this.delimiter),
                    img: 'modules/game-icons-net/whitetransparent/brain.svg'
                })
            }

            // Encumbrance
            if (this.actor.type === 'character' && this.actor.system?.encumbrance) {
                const currentEnc = Math.round(100 * this.actor.system.encumbrance.value) / 100
                const maxEnc = this.actor.system.maxEncumbrance?.value || 0
                const encLabel = game.i18n.localize('tokenActionHud.dragonbane.actions.stats.encumbrance') || 'Enc'
                actions.push({
                    id: `${ACTION_TYPE.stats}>encumbrance`,
                    name: `${encLabel}: ${currentEnc}/${maxEnc}`,
                    encodedValue: [ACTION_TYPE.stats, 'encumbrance'].join(this.delimiter),
                    img: 'icons/svg/anchor.svg'
                })
            }

            if (actions.length > 0 && this.addActions) {
                this.addActions(actions, { id: 'stats', type: 'system' })
            }
        }

        /**
         * Build monster attack actions
         */
        async _buildMonsterAttacks() {
            // Only build for monsters
            if (this.actor.type !== 'monster') return

            // Check if monster has an attack table
            const attackTableUuid = this.actor.system.attackTable
            if (!attackTableUuid) return

            try {
                const attackTable = fromUuidSync(attackTableUuid)
                if (!attackTable || !attackTable.results || attackTable.results.size === 0) return

                // Random Monster Attack group
                const randomActions = [{
                    id: `${ACTION_TYPE.monsterAttack}>random`,
                    name: game.i18n.localize('DoD.ui.dialog.monsterAttackRandom'),
                    encodedValue: [ACTION_TYPE.monsterAttack, 'random'].join(this.delimiter),
                    img: 'systems/dragonbane/art/icons/monster-attack.webp'
                }]

                // Specific Monster Attacks group
                const specificActions = []
                for (let result of attackTable.results) {
                    const attackIndex = result.range[0]
                    let attackName = `Attack ${attackIndex}`
                    let attackDescription = ''

                    // Extract attack name and description from table result
                    if (game.release.generation >= 13) {
                        attackDescription = result.description || result.text || ''
                    } else {
                        attackDescription = result.text || ''
                    }

                    // Parse the attack name from the description (usually in bold tags)
                    const match = attackDescription.match(/<(b|strong)>(.*?)<\/\1>/)
                    if (match) {
                        attackName = match[2]
                    }

                    specificActions.push({
                        id: `${ACTION_TYPE.monsterAttack}>${attackIndex}`,
                        name: `${attackIndex}. ${attackName}`,
                        encodedValue: [ACTION_TYPE.monsterAttack, attackIndex.toString()].join(this.delimiter),
                        img: 'systems/dragonbane/art/icons/monster-attack.webp',
                        info1: `Attack ${attackIndex}`
                    })
                }

                // Monster Defend (goes in specific attacks group)
                specificActions.push({
                    id: `${ACTION_TYPE.monsterDefend}>defend`,
                    name: game.i18n.localize('DoD.ui.character-sheet.monsterDefendTooltip'),
                    encodedValue: [ACTION_TYPE.monsterDefend, 'defend'].join(this.delimiter),
                    img: 'systems/dragonbane/art/icons/monster-defend.webp'
                })

                // Traits group (if monster has traits)
                const traitActions = []
                if (this.actor.system.traits && this.actor.system.traits.trim()) {
                    traitActions.push({
                        id: `${ACTION_TYPE.traits}>show`,
                        name: game.i18n.localize('DoD.ui.character-sheet.traits'),
                        encodedValue: [ACTION_TYPE.traits, 'show'].join(this.delimiter),
                        img: 'modules/token-action-hud-dragonbane/assets/icons/traits.webp'
                    })
                }

                // Add actions to their respective groups
                if (randomActions.length > 0 && this.addActions) {
                    this.addActions(randomActions, { id: 'monsterAttacksRandom', type: 'system' })
                }

                if (specificActions.length > 0 && this.addActions) {
                    this.addActions(specificActions, { id: 'monsterAttacksSpecific', type: 'system' })
                }

                if (traitActions.length > 0 && this.addActions) {
                    this.addActions(traitActions, { id: 'monsterTraits', type: 'system' })
                }

            } catch (error) {
                console.warn('Token Action HUD Dragonbane: Error building monster attacks:', error)
            }
        }
    }

    return ActionHandler
}
