/**
 * ActionHandler for Token Action HUD Dragonbane
 */

import {
    MODULE,
    ACTION_TYPE,
    COMBAT_ACTIONS,
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

        /**
         * Helper method to determine if a skill is the Brawling skill
         * Uses localization for better language support
         */
        _isBrawlingSkill(skill) {
            const skillName = skill.name.toLowerCase()

            // Try to get the localized name for brawling
            const localizedBrawling = game.i18n.localize('DoD.skills.brawling')?.toLowerCase()

            // If we found a localized version and it's not the key itself, use it
            if (localizedBrawling && localizedBrawling !== 'dod.skills.brawling') {
                if (skillName === localizedBrawling) {
                    return true
                }
            }

            // Fallback to known language variants for common translations
            const knownBrawlingNames = [
                'brawling',      // English
                'slagsmål',      // Swedish
                'rauferei',      // German
                'bagarre',       // French
                'rissa',         // Italian
                'pelea',         // Spanish
                'briga'          // Portuguese
            ]

            return knownBrawlingNames.includes(skillName)
        }

        /**
         * Helper method to find a skill by name with localization support
         */
        _findSkillByName(skillName) {
            const allSkills = this.actor.items.filter(item => item.type === 'skill')

            // Direct name match (case insensitive)
            let skill = allSkills.find(s => s.name.toLowerCase() === skillName.toLowerCase())
            if (skill) return skill

            // Try localized skill names
            const localizedSkillName = game.i18n.localize(`DoD.skills.${skillName}`)?.toLowerCase()
            if (localizedSkillName && localizedSkillName !== `dod.skills.${skillName}`) {
                skill = allSkills.find(s => s.name.toLowerCase() === localizedSkillName)
                if (skill) return skill
            }

            // Try common translations
            const skillTranslations = {
                'healing': ['healing', 'läkekonst', 'heilkunde'],
                'persuasion': ['persuasion', 'övertalning', 'überredung'],
                'evade': ['evade', 'undvika', 'ausweichen']
            }

            if (skillTranslations[skillName]) {
                for (const translation of skillTranslations[skillName]) {
                    skill = allSkills.find(s => s.name.toLowerCase() === translation.toLowerCase())
                    if (skill) return skill
                }
            }

            return null
        }

        _getActors() {
            return super._getActors() || []
        }

        /**
         * Build system actions
         */
        async buildSystemActions(groupIds) {
            // Check the core "Always show HUD" setting
            const alwaysShowHud = game.settings.get('token-action-hud-core', 'alwaysShowHud')

            // If "Always show HUD" is disabled and no tokens are controlled, don't build any actions
            if (!alwaysShowHud) {
                const controlledTokens = canvas.tokens?.controlled || []
                if (controlledTokens.length === 0) {
                    return // Just return early, let core handle everything else
                }
            }

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
                await this._buildCombatActions()
                await this._buildSpells()
                await this._buildAbilities()
                await this._buildConditions()
                await this._buildUtility()
                await this._buildMonsterAttacks()
                await this._buildTraits()
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

            // Weapon Skills - show for all actor types (unless hidden, but always show Brawling)
            if (skillsByType.weapon.length > 0) {
                const actions = []

                let weaponSkillsToShow = skillsByType.weapon

                // If weapon skills are hidden, only show Brawling
                if (hideWeaponSkills) {
                    weaponSkillsToShow = skillsByType.weapon.filter(skill => {
                        return this._isBrawlingSkill(skill)
                    })
                }

                for (const skill of weaponSkillsToShow) {
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

                if (actions.length > 0 && this.addActions) {
                    this.addActions(actions, { id: 'secondarySkills', type: 'system' })
                }
            }
        }

        /**
         * Build weapons using cached settings with broken weapon styling
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

            // Sort weapons alphabetically
            weapons.sort((a, b) => a.name.localeCompare(b.name))

            const actions = []

            for (const weapon of weapons) {
                let name = weapon.name

                // Check if weapon is broken
                const isBroken = weapon.system?.broken === true

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
                    img: weapon.img,
                    cssClass: isBroken ? 'dragonbane-weapon-broken' : ''
                })
            }

            if (actions.length > 0 && this.addActions) {
                this.addActions(actions, { id: 'weapons', type: 'system' })
            }
        }

        /**
         * Build combat actions
         */
        async _buildCombatActions() {
            // Skip for monsters
            if (this.actor.type === 'monster') return

            const actions = []

            for (const [actionKey, actionData] of Object.entries(COMBAT_ACTIONS)) {
                let name = game.i18n.localize(`tokenActionHud.dragonbane.combatActions.${actionKey}`) || actionKey
                let isAvailable = true
                let skillValue = null

                // Check if required skill/attribute exists and add value to name
                if (actionData.skillName) {
                    const skill = this._findSkillByName(actionData.skillName)
                    if (skill) {
                        skillValue = this._getSkillValue(skill)
                        name = `${name} (${skillValue})`
                    } else {
                        isAvailable = false
                        name = `${name} (${game.i18n.localize('tokenActionHud.dragonbane.combatActions.skillNotFound')})`
                    }
                } else if (actionData.attributeName) {
                    const attribute = this.actor.system.attributes?.[actionData.attributeName]
                    if (attribute) {
                        const attributeValue = attribute.value || attribute.max || 0
                        name = `${name} (${attributeValue})`
                    } else {
                        isAvailable = false
                    }
                }

                actions.push({
                    id: `${ACTION_TYPE.combatAction}>${actionKey}`,
                    name,
                    encodedValue: [ACTION_TYPE.combatAction, actionKey].join(this.delimiter),
                    img: actionData.icon || 'icons/svg/sword.svg',
                    cssClass: !isAvailable ? 'dragonbane-action-unavailable' : '',
                    disabled: !isAvailable
                })
            }

            if (actions.length > 0 && this.addActions) {
                this.addActions(actions, { id: 'combatActions', type: 'system' })
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

            // Sort spells alphabetically within each rank
            for (let rank = 0; rank <= 3; rank++) {
                if (spellsByRank[rank]) {
                    spellsByRank[rank].sort((a, b) => a.name.localeCompare(b.name))
                }
            }

            // Magic Tricks (Rank 0)
            if (spellsByRank[0].length > 0) {
                const actions = spellsByRank[0].map(spell => {
                    let name = spell.name

                    // Add visual indicator if showing all spells and this one is memorized
                    if (!showOnlyMemorized && this.actor.type === 'character') {
                        const isMemorized = spell.system.memorized === true
                        if (isMemorized) {
                            name = game.i18n.format('tokenActionHud.dragonbane.actions.spell.memorized', { name: spell.name }) || `✨ ${spell.name}`
                        }
                    }

                    return {
                        id: `${ACTION_TYPE.spell}>${spell.id}`,
                        name,
                        encodedValue: [ACTION_TYPE.spell, spell.id].join(this.delimiter),
                        img: spell.img
                    }
                })

                if (actions.length > 0 && this.addActions) {
                    this.addActions(actions, { id: 'magicTricks', type: 'system' })
                }
            }

            // Rank 1-3 Spells
            for (let rank = 1; rank <= 3; rank++) {
                if (spellsByRank[rank].length > 0) {
                    const actions = spellsByRank[rank].map(spell => {
                        let name = spell.name

                        // Add visual indicator if showing all spells and this one is memorized
                        if (!showOnlyMemorized && this.actor.type === 'character') {
                            const isMemorized = spell.system.memorized === true
                            if (isMemorized) {
                                name = game.i18n.format('tokenActionHud.dragonbane.actions.spell.memorized', { name: spell.name }) || `✨ ${spell.name}`
                            }
                        }

                        return {
                            id: `${ACTION_TYPE.spell}>${spell.id}`,
                            name,
                            encodedValue: [ACTION_TYPE.spell, spell.id].join(this.delimiter),
                            img: spell.img
                        }
                    })

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

            // Sort abilities alphabetically
            abilities.sort((a, b) => a.name.localeCompare(b.name))

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
         * Build stats actions - movement, HP, WP, encumbrance, ferocity, traits
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

                // Determine HP status and CSS class
                let hpCssClass = ''
                if (currentHP < maxHP) {
                    if (currentHP < (maxHP * 0.5)) {
                        hpCssClass = 'dragonbane-stat-critical' // Red for < 50%
                    } else {
                        hpCssClass = 'dragonbane-stat-injured' // Yellow for < 100% but >= 50%
                    }
                }
                // No class needed for full HP (stays white)

                actions.push({
                    id: `${ACTION_TYPE.stats}>hitpoints`,
                    name: `${hpLabel}: ${currentHP}/${maxHP}`,
                    encodedValue: [ACTION_TYPE.stats, 'hitpoints'].join(this.delimiter),
                    img: 'modules/game-icons-net/whitetransparent/hearts.svg',
                    cssClass: hpCssClass
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

                // Determine WP status and CSS class
                let wpCssClass = ''
                if (currentWP < maxWP) {
                    if (currentWP < (maxWP * 0.5)) {
                        wpCssClass = 'dragonbane-stat-critical' // Red for < 50%
                    } else {
                        wpCssClass = 'dragonbane-stat-injured' // Yellow for < 100% but >= 50%
                    }
                }
                // No class needed for full WP (stays white)

                actions.push({
                    id: `${ACTION_TYPE.stats}>willpoints`,
                    name: `${wpLabel}: ${currentWP}/${maxWP}`,
                    encodedValue: [ACTION_TYPE.stats, 'willpoints'].join(this.delimiter),
                    img: 'modules/game-icons-net/whitetransparent/brain.svg',
                    cssClass: wpCssClass
                })
            }

            // Encumbrance
            if (this.actor.type === 'character' && this.actor.system?.encumbrance) {
                const currentEnc = Math.round(100 * this.actor.system.encumbrance.value) / 100
                const maxEnc = this.actor.system.maxEncumbrance?.value || 0
                const encLabel = game.i18n.localize('tokenActionHud.dragonbane.actions.stats.encumbrance') || 'Enc'
                const isOverEncumbered = currentEnc > maxEnc

                actions.push({
                    id: `${ACTION_TYPE.stats}>encumbrance`,
                    name: `${encLabel}: ${currentEnc}/${maxEnc}`,
                    encodedValue: [ACTION_TYPE.stats, 'encumbrance'].join(this.delimiter),
                    img: 'icons/svg/anchor.svg',
                    cssClass: isOverEncumbered ? 'dragonbane-over-encumbered' : ''
                })
            }

            if (actions.length > 0 && this.addActions) {
                this.addActions(actions, { id: 'stats', type: 'system' })
            }
        }

        /**
         * Build traits actions for NPCs and Monsters
         */
        async _buildTraits() {
            // Only show for NPCs and Monsters that have traits
            if ((this.actor.type !== 'npc' && this.actor.type !== 'monster') ||
                !this.actor.system.traits || !this.actor.system.traits.trim()) {
                return
            }

            const actions = [{
                id: `${ACTION_TYPE.traits}>show`,
                name: game.i18n.localize('DoD.ui.character-sheet.traits') || 'Show Traits',
                encodedValue: [ACTION_TYPE.traits, 'show'].join(this.delimiter),
                img: 'modules/token-action-hud-dragonbane/assets/icons/traits.webp'
            }]

            if (this.addActions) {
                const groupId = this.actor.type === 'monster' ? 'monsterTraits' : 'npcTraits'
                this.addActions(actions, { id: groupId, type: 'system' })
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

                // Monster Defend - separate group
                const defendActions = [{
                    id: `${ACTION_TYPE.monsterDefend}>defend`,
                    name: game.i18n.localize('DoD.ui.character-sheet.monsterDefendTooltip'),
                    encodedValue: [ACTION_TYPE.monsterDefend, 'defend'].join(this.delimiter),
                    img: 'systems/dragonbane/art/icons/monster-defend.webp'
                }]

                // Add actions to their respective groups
                if (randomActions.length > 0 && this.addActions) {
                    this.addActions(randomActions, { id: 'monsterAttacksRandom', type: 'system' })
                }

                if (specificActions.length > 0 && this.addActions) {
                    this.addActions(specificActions, { id: 'monsterAttacksSpecific', type: 'system' })
                }

                if (defendActions.length > 0 && this.addActions) {
                    this.addActions(defendActions, { id: 'monsterDefend', type: 'system' })
                }

            } catch (error) {
                console.warn('Token Action HUD Dragonbane: Error building monster attacks:', error)
            }
        }
    }

    return ActionHandler
}
