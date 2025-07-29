/**
 * RollHandler for Token Action HUD Dragonbane
 */

import { ACTION_TYPE, COMBAT_ACTIONS, TIMEOUTS, getAttributeConditionsMap } from './constants.js'

/**
 * Create RollHandler class that extends the core RollHandler
 */
export function createRollHandler(coreModule) {
    
    class RollHandler extends coreModule.api.RollHandler {
        async handleActionClick(event, encodedValue) {
            const [actionType, actionId] = encodedValue.split(this.delimiter)

            switch (actionType) {
                case ACTION_TYPE.attribute:
                    await this._handleAttributeAction(actionId)
                    break
                case ACTION_TYPE.skill:
                    await this._handleSkillAction(actionId)
                    break
                case ACTION_TYPE.weapon:
                    await this._handleWeaponAction(actionId)
                    break
                case ACTION_TYPE.spell:
                    await this._handleSpellAction(actionId)
                    break
                case ACTION_TYPE.ability:
                    await this._handleAbilityAction(actionId)
                    break
                case ACTION_TYPE.condition:
                    await this._handleConditionAction(actionId)
                    break
                case ACTION_TYPE.utility:
                    await this._handleUtilityAction(actionId)
                    break
                case ACTION_TYPE.monsterAttack:
                    await this._handleMonsterAttackAction(actionId)
                    break
                case ACTION_TYPE.monsterDefend:
                    await this._handleMonsterDefendAction()
                    break
                case ACTION_TYPE.traits:
                    await this._handleTraitsAction()
                    break
                case ACTION_TYPE.stats:
                    await this._handleStatsAction(actionId)
                    break
                case ACTION_TYPE.deathRoll:
                    await this._handleDeathRollAction()
                    break
                case ACTION_TYPE.combatAction:
                    await this._handleCombatAction(actionId)
                    break
            }
        }

        async _handleAttributeAction(attributeId) {
            try {
                // Try to use the character sheet's built-in attribute roll method (shows dialog)
                const sheet = this.actor.sheet
                if (sheet && typeof sheet._onAttributeRoll === 'function') {
                    const fakeEvent = {
                        preventDefault: () => { },
                        currentTarget: { dataset: { attribute: attributeId } },
                        target: { dataset: { attribute: attributeId } }
                    }
                    await sheet._onAttributeRoll(fakeEvent)
                    return
                }

                // Fallback to direct system method (no dialog)
                await game.dragonbane.rollAttribute(this.actor, attributeId)

            } catch (error) {
                console.error('Attribute roll failed:', error)
            }
        }

        async _handleSkillAction(skillId) {
            const skill = this.actor.items.get(skillId)
            if (!skill) return

            try {
                await game.dragonbane.rollItem(skill.name, skill.type)
            } catch (error) {
                console.error('Skill roll failed:', error)
               }
        }

        async _handleWeaponAction(weaponId) {
            const weapon = this.actor.items.get(weaponId)
            if (!weapon) return

            // Check if weapon is broken
            if (weapon.system?.broken === true) {
                ui.notifications.warn(
                    game.i18n.format('tokenActionHud.dragonbane.messages.weapons.weaponBroken', { 
                        weapon: weapon.name 
                    }) || `${weapon.name} is broken and cannot be used!`
                )
                return
            }

            try {
                await game.dragonbane.rollItem(weapon.name, weapon.type)
            } catch (error) {
                console.error('Weapon attack failed:', error)
            }
        }

        async _handleSpellAction(spellId) {
            const spell = this.actor.items.get(spellId)
            if (!spell) return

            try {
                await game.dragonbane.useItem(spell.name, spell.type)
            } catch (error) {
                console.error('Spell casting failed:', error)
            }
        }

        async _handleAbilityAction(abilityId) {
            const ability = this.actor.items.get(abilityId)
            if (!ability) return

            try {
                await game.dragonbane.useItem(ability.name, ability.type)
            } catch (error) {
                console.error('Ability use failed:', error)
            }
        }

        /**
         * Handle combat actions (First Aid, Rally Other, Rally Self, Dodge)
         */
        async _handleCombatAction(actionId) {
            const combatActionData = COMBAT_ACTIONS[actionId]
            if (!combatActionData) {
                ui.notifications.error(game.i18n.localize('tokenActionHud.dragonbane.errors.combatActionNotFound') || 'Combat action not found')
                return
            }

            try {
                // Validate targeting if required
                if (combatActionData.requiresTarget) {
                    const validationResult = this._validateTargeting(combatActionData)
                    if (!validationResult.valid) {
                        ui.notifications.warn(validationResult.message)
                        return
                    }
                }

                // Execute the combat action
                if (combatActionData.skillName) {
                    await this._executeCombatSkillAction(actionId, combatActionData)
                } else if (combatActionData.attributeName) {
                    await this._executeCombatAttributeAction(actionId, combatActionData)
                }

            } catch (error) {
                console.error(`Combat action ${actionId} failed:`, error)
                ui.notifications.error(game.i18n.localize('tokenActionHud.dragonbane.errors.combatActionFailed') || 'Combat action failed')
            }
        }

        /**
         * Validate targeting requirements for combat actions
         */
        _validateTargeting(combatActionData) {
            const targets = Array.from(game.user.targets)
            
            if (targets.length === 0) {
                return {
                    valid: false,
                    message: game.i18n.localize('tokenActionHud.dragonbane.errors.noTargetSelected') || 'No target selected'
                }
            }

            if (targets.length > 1) {
                return {
                    valid: false,
                    message: game.i18n.localize('tokenActionHud.dragonbane.errors.tooManyTargets') || 'Too many targets selected'
                }
            }

            const target = targets[0]
            const actorToken = this.actor.getActiveTokens()[0]
            
            if (!actorToken) {
                return {
                    valid: false,
                    message: game.i18n.localize('tokenActionHud.dragonbane.errors.noActorToken') || 'Actor has no token on the scene'
                }
            }

            // Check range
            const distance = this._calculateDistance(actorToken, target)
            if (distance > combatActionData.maxRange) {
                return {
                    valid: false,
                    message: game.i18n.format('tokenActionHud.dragonbane.errors.targetTooFar', {
                        distance: Math.round(distance * 10) / 10,
                        maxRange: combatActionData.maxRange
                    }) || `Target is too far away (${Math.round(distance * 10) / 10}m, max: ${combatActionData.maxRange}m)`
                }
            }

            return { valid: true }
        }

        /**
         * Calculate distance between tokens in grid squares (like validation.js)
         */
        _calculateDistance(sourceToken, targetToken) {
            if (!canvas.grid || !canvas.scene) return 0
            
            try {
                const gridSize = canvas.grid.size;
                const gridDistance = canvas.scene.grid.distance || 2; // Default 2m per square for Dragonbane
                
                // Helper function to get token bounds in grid coordinates
                const getTokenBounds = (token) => {
                    const doc = token.document || token;
                    const x = Math.round(doc.x / gridSize);
                    const y = Math.round(doc.y / gridSize);
                    const w = doc.width || 1;
                    const h = doc.height || 1;
                    return { left: x, right: x + w - 1, top: y, bottom: y + h - 1 };
                };
                
                const bounds1 = getTokenBounds(sourceToken);
                const bounds2 = getTokenBounds(targetToken);
                
                // Calculate minimum distance between token boundaries
                const dx = Math.max(0, bounds2.left - bounds1.right, bounds1.left - bounds2.right);
                const dy = Math.max(0, bounds2.top - bounds1.bottom, bounds1.top - bounds2.bottom);
                
                // Use Chebyshev distance (8-directional movement, treats diagonal as same as orthogonal)
                const gridSquaresAway = Math.max(dx, dy);
                
                // Convert to game distance - adjacent (≤1 square) = 0m, otherwise multiply by grid distance
                const gameDistance = gridSquaresAway <= 1 ? 0 : gridSquaresAway * gridDistance;
                
                return gameDistance;
                
            } catch (error) {
                // Fallback to simple grid measurement
                const distance = canvas.grid.measureDistance(sourceToken, targetToken)
                const gridDistance = canvas.scene.grid.distance || 2
                return distance <= gridDistance ? 0 : distance
            }
        }

        /**
         * Execute combat action that uses a skill
         */
        async _executeCombatSkillAction(actionId, combatActionData) {
            const skill = this._findSkillByName(combatActionData.skillName)
            if (!skill) {
                ui.notifications.error(
                    game.i18n.format('tokenActionHud.dragonbane.errors.skillNotFound', { 
                        skill: combatActionData.skillName 
                    }) || `${combatActionData.skillName} skill not found`
                )
                return
            }

            // Use the Dragonbane system's skill roll method
            await game.dragonbane.rollItem(skill.name, skill.type)
        }

        /**
         * Execute combat action that uses an attribute
         */
        async _executeCombatAttributeAction(actionId, combatActionData) {
            const attributeId = combatActionData.attributeName
            
            // Use the existing attribute roll handler
            await this._handleAttributeAction(attributeId)
        }

        /**
         * Find skill by name with localization support
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

        /**
         * Handle condition (status effect) toggle
         */
        async _handleConditionAction(effectId) {
            try {
                const attributeConditions = getAttributeConditionsMap()

                const statusEffect = CONFIG.statusEffects.find(e =>
                    e.id === effectId || e.icon === effectId
                )
                const effectName = statusEffect?.name || statusEffect?.label || effectId

                const attributeKey = attributeConditions[effectName]

                if (attributeKey) {
                    // Handle special attribute condition
                    const currentCheckboxValue = this.actor?.system?.conditions?.[attributeKey]?.value || false
                    const newCheckboxValue = !currentCheckboxValue

                    const updateData = {}
                    updateData[`system.conditions.${attributeKey}.value`] = newCheckboxValue
                    await this.actor.update(updateData)

                } else {
                    // Handle regular status effect
                    await this.actor.toggleStatusEffect(effectId)
                }

                if (ui.tokenActionHud) {
                    setTimeout(() => ui.tokenActionHud.update(), TIMEOUTS.HUD_UPDATE_DELAY)
                }

            } catch (error) {
                console.error('Condition toggle failed:', error)
            }
        }

        async _handleUtilityAction(actionId) {
            switch (actionId) {
                case 'roundRest':
                    await this.actor.restRound()
                    break
                case 'stretchRest':
                    await this.actor.restStretch()
                    break
                case 'shiftRest':
                    await this.actor.restShift()
                    break
                case 'restReset':
                    await this.actor.restReset()
                    break
            }
        }

        async _handleMonsterAttackAction(actionId) {
            if (this.actor.type !== 'monster') {
                ui.notifications.warn(game.i18n.localize('tokenActionHud.dragonbane.errors.monsterAttacksOnly') || 'Monster attacks can only be used by monsters')
                return
            }

            const attackTable = this.actor.system.attackTable ? fromUuidSync(this.actor.system.attackTable) : null
            if (!attackTable) {
                ui.notifications.warn(game.i18n.localize('DoD.WARNING.missingMonsterAttackTable'))
                return
            }

            try {
                let tableResult = null
                let roll = null

                if (actionId === 'random') {
                    // Use system method to get the table result
                    const draw = await this.actor.drawMonsterAttack(attackTable)
                    tableResult = draw.results[0]
                    roll = draw.roll
                } else {
                    // Specific attack
                    const attackIndex = parseInt(actionId)
                    tableResult = attackTable.results.find(result => result.range[0] === attackIndex)
                    if (!tableResult) {
                        ui.notifications.warn(`Attack ${attackIndex} not found in table`)
                        return
                    }
                }

                // Extract attack name and description using your preferred logic
                let attackDescription = game.release.generation >= 13 ? tableResult.description : tableResult.text
                let attackName = `Attack ${tableResult.range[0]}`

                const match = attackDescription.match(/<(b|strong)>(.*?)<\/\1>/)
                if (match) {
                    attackName = match[2]
                    attackDescription = attackDescription.replace(/<(b|strong)>.*?<\/\1>/, '').trim()
                }

                // Create your preferred chat message format
                let content = `<div class="dice-roll" data-action="expandRoll">
            <div class="dice-result">
                <div class="dice-formula">${attackTable.name || 'Monster Attack Table'}</div>
                <h4 class="dice-total">${attackName}</h4>
            </div>
        </div>`

                if (attackDescription) {
                    content += `<div class="dice-description" style="margin-top: 0.5em;">${attackDescription}</div>`
                }

                await ChatMessage.create({
                    author: game.user.id,
                    speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                    content: content,
                    rolls: roll ? [roll] : []
                })

            } catch (error) {
                console.error('Monster attack error:', error)
                ui.notifications.error(game.i18n.localize('tokenActionHud.dragonbane.errors.monsterAttackFailed') || 'Failed to execute monster attack')
            }
        }

        async _handleMonsterDefendAction() {
            if (this.actor.type !== 'monster') {
                ui.notifications.warn(game.i18n.localize('tokenActionHud.dragonbane.errors.monsterDefendOnly') || 'Monster defend can only be used by monsters')
                return
            }

            try {
                await game.dragonbane.monsterDefend(this.actor)
            } catch (error) {
                console.error('Monster defend error:', error)
                ui.notifications.error(game.i18n.localize('tokenActionHud.dragonbane.errors.monsterDefendFailed') || 'Failed to execute monster defend')
            }
        }

        async _handleTraitsAction() {
            if (this.actor.type !== 'monster' && this.actor.type !== 'npc') {
                ui.notifications.warn(game.i18n.localize('tokenActionHud.dragonbane.errors.traitsOnly') || 'Show Traits can only be used by monsters and NPCs')
                return
            }

            const traits = this.actor.system.traits
            if (!traits || !traits.trim()) {
                ui.notifications.info(game.i18n.format('tokenActionHud.dragonbane.errors.noTraits', { actor: this.actor.name }) || `${this.actor.name} has no traits to display`)
                return
            }

            try {
                // Create whispered message to GM with actor traits
                let content = `<div style="border: 2px solid #00604d; padding: 10px; background: #f0e9de; margin: 5px 0;">
                    <h3 style="margin-top: 0; color: #00604d; border-bottom: 1px solid #00604d; padding-bottom: 5px;">
                        ${this.actor.name} - ${game.i18n.localize('DoD.ui.character-sheet.traits')}
                    </h3>
                    <div style="font-size: 14px;">
                        ${traits}
                    </div>
                </div>`

                // Create whispered message to GM
                await ChatMessage.create({
                    author: game.user.id,
                    whisper: ChatMessage.getWhisperRecipients("GM"),
                    content: content
                })

            } catch (error) {
                console.error('Show traits error:', error)
                ui.notifications.error(game.i18n.localize('tokenActionHud.dragonbane.errors.traitsFailed') || 'Failed to show traits')
            }
        }

        async _handleDeathRollAction() {
            if (this.actor.type !== 'character') {
                ui.notifications.warn(game.i18n.localize('tokenActionHud.dragonbane.errors.deathRollsOnly') || 'Death rolls can only be used by characters')
                return
            }

            try {
                // Try to use the character sheet's built-in death roll method
                const sheet = this.actor.sheet
                if (sheet && typeof sheet._onDeathRoll === 'function') {
                    const fakeEvent = {
                        preventDefault: () => { },
                        currentTarget: { blur: () => { } }
                    }
                    await sheet._onDeathRoll(fakeEvent)
                    return
                }

            } catch (error) {
                console.error('Death roll error:', error)
                ui.notifications.error(game.i18n.localize('tokenActionHud.dragonbane.errors.deathRollFailed') || 'Failed to execute death roll')
            }
        }

        async _handleStatsAction(actionId) {
            let content = ''
            let actorName = this.actor.name

            switch (actionId) {
                case 'movement':
                    const movement = this.actor.system?.movement?.value || 0
                    content = game.i18n.format('tokenActionHud.dragonbane.messages.stats.movement', {
                        actor: `<strong>${actorName}</strong>`,
                        value: `<strong>${movement}</strong>`
                    }) || `<p><strong>${actorName}</strong> has a Movement of <strong>${movement}</strong>.</p>`
                    content = `<p>${content}</p>`
                    break

                case 'hitpoints':
                    const currentHP = this.actor.system?.hitPoints?.value || 0
                    const maxHP = this.actor.system?.hitPoints?.max || 0
                    const lostHP = maxHP - currentHP
                    let hpMessage = game.i18n.format('tokenActionHud.dragonbane.messages.stats.hitPoints', {
                        actor: `<strong>${actorName}</strong>`,
                        current: `<strong>${currentHP}</strong>`,
                        max: `<strong>${maxHP}</strong>`
                    }) || `<strong>${actorName}</strong> has <strong>${currentHP}/${maxHP}</strong> Hit Points`

                    if (lostHP > 0) {
                        const damageMessage = game.i18n.format('tokenActionHud.dragonbane.messages.stats.hitPointsDamage', {
                            damage: `<strong>${lostHP}</strong>`
                        }) || ` (<strong>${lostHP}</strong> damage taken)`
                        hpMessage += damageMessage
                    }
                    content = `<p>${hpMessage}.</p>`
                    break

                case 'ferocity':
                    const ferocity = this.actor.system?.ferocity?.value || this.actor.system?.ferocity || 0
                    content = game.i18n.format('tokenActionHud.dragonbane.messages.stats.ferocity', {
                        actor: `<strong>${actorName}</strong>`,
                        value: `<strong>${ferocity}</strong>`
                    }) || `<p><strong>${actorName}</strong> has a Ferocity of <strong>${ferocity}</strong>.</p>`
                    content = `<p>${content}</p>`
                    break

                case 'willpoints':
                    const currentWP = this.actor.system?.willPoints?.value || 0
                    const maxWP = this.actor.system?.willPoints?.max || 0
                    const lostWP = maxWP - currentWP
                    let wpMessage = game.i18n.format('tokenActionHud.dragonbane.messages.stats.willPoints', {
                        actor: `<strong>${actorName}</strong>`,
                        current: `<strong>${currentWP}</strong>`,
                        max: `<strong>${maxWP}</strong>`
                    }) || `<strong>${actorName}</strong> has <strong>${currentWP}/${maxWP}</strong> Will Points`

                    if (lostWP > 0) {
                        const spentMessage = game.i18n.format('tokenActionHud.dragonbane.messages.stats.willPointsSpent', {
                            spent: `<strong>${lostWP}</strong>`
                        }) || ` (<strong>${lostWP}</strong> spent)`
                        wpMessage += spentMessage
                    }
                    content = `<p>${wpMessage}.</p>`
                    break

                case 'encumbrance':
                    const currentEnc = Math.round(100 * (this.actor.system?.encumbrance?.value || 0)) / 100
                    const maxEnc = this.actor.system?.maxEncumbrance?.value || 0
                    const overEncumbered = currentEnc > maxEnc
                    let encMessage = game.i18n.format('tokenActionHud.dragonbane.messages.stats.encumbrance', {
                        actor: `<strong>${actorName}</strong>`,
                        current: `<strong>${currentEnc}</strong>`,
                        max: `<strong>${maxEnc}</strong>`
                    }) || `<strong>${actorName}</strong> is carrying <strong>${currentEnc}/${maxEnc}</strong> items`

                    if (overEncumbered) {
                        const overMessage = game.i18n.localize('tokenActionHud.dragonbane.messages.stats.encumbranceOver') || ` and is <strong style="color: red;">over-encumbered</strong>`
                        encMessage += overMessage
                    }
                    content = `<p>${encMessage}.</p>`
                    break

                default:
                    content = game.i18n.format('tokenActionHud.dragonbane.messages.stats.default', {
                        actor: `<strong>${actorName}</strong>`
                    }) || `<p><strong>${actorName}</strong> - Stat information.</p>`
                    break
            }

            try {
                await ChatMessage.create({
                    author: game.user.id,
                    speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                    content: content
                })
            } catch (error) {
                console.error('Stats action error:', error)
                ui.notifications.error(game.i18n.localize('tokenActionHud.dragonbane.errors.statsFailed') || 'Failed to display stat information')
            }
        }
    }
    
    return RollHandler
}
