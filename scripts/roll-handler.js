export let RollHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    /**
     * Extends Token Action HUD Core's RollHandler class and handles action events triggered when an action is clicked
     * This serves as a minimal fallback for actions not handled by onClick properties in ActionHandler
     */
    RollHandler = class RollHandler extends coreModule.api.RollHandler {
        /**
         * Handle action click
         * Called by Token Action HUD Core when an action is left or right-clicked
         * @override
         * @param {object} event        The event
         * @param {string} encodedValue The encoded value
         */
        async handleActionClick (event, encodedValue) {
            const [actionTypeId, actionId] = encodedValue.split('|')

            // Handle right-click sheet rendering for items
            const renderable = ['weapon', 'spell', 'ability', 'item', 'armor', 'helmet', 'injury', 'skill']
            if (renderable.includes(actionTypeId) && this.isRenderItem()) {
                console.log('Token Action HUD Dragonbane: Right-click detected, opening sheet for:', actionTypeId, actionId)
                return this.renderItem(this.actor, actionId)
            }

            // Handle left-click actions for items
            if (renderable.includes(actionTypeId)) {
                console.log('Token Action HUD Dragonbane: Left-click detected, performing action for:', actionTypeId, actionId)
                
                // Get the item from the actor
                const item = this.actor.items.get(actionId)
                if (!item) {
                    console.warn('Token Action HUD Dragonbane: Item not found:', actionId)
                    return
                }

                try {
                    switch (actionTypeId) {
                        case 'weapon':
                            // Check if weapon is broken
                            if (item.system?.broken === true) {
                                const message = game.i18n.format('tokenActionHud.dragonbane.messages.weapons.weaponBroken', { weapon: item.name }) 
                                               || `${item.name} is broken and cannot be used!`
                                ui.notifications.warn(message)
                                return
                            }
                            return game.dragonbane.rollItem(item.name, item.type)
                            
                        case 'spell':
                            return game.dragonbane.useItem(item.name, item.type)
                            
                        case 'ability':
                            return game.dragonbane.useItem(item.name, item.type)
                            
                        case 'skill':
                            return game.dragonbane.rollItem(item.name, item.type)
                            
                        default:
                            // For other item types, try to use them or open sheet
                            if (item.type === 'item' && item.system?.consumable) {
                                return game.dragonbane.useItem(item.name, item.type)
                            }
                            return item.sheet?.render(true)
                    }
                } catch (error) {
                    console.warn('Token Action HUD Dragonbane: Action failed, opening sheet:', error)
                    return item.sheet?.render(true)
                }
            }

            // All other actions are handled by onClick in ActionHandler
            // This is just a fallback in case encodedValue is used instead of onClick
            console.warn(`Token Action HUD Dragonbane: Fallback handler called for ${actionTypeId}:${actionId} - consider using onClick instead`)
        }

        /**
         * Handle action hover
         * Called by Token Action HUD Core when an action is hovered on or off
         * @override
         * @param {object} event        The event
         * @param {string} encodedValue The encoded value
         */
        async handleActionHover (event, encodedValue) {
            // No hover behavior needed - actions use onClick
        }

        /**
         * Handle group click
         * Called by Token Action HUD Core when a group is right-clicked while the HUD is locked
         * @override
         * @param {object} event The event
         * @param {object} group The group
         */
        async handleGroupClick (event, group) {
            // No group click behavior needed
        }
    }
})
