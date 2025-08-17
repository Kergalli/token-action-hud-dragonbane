/**
 * Dialog and helper methods for Token Action HUD Dragonbane
 * Self-contained dialog boxes and utility helper functions
 */

export function createActionDialogs(coreModule) {
    return {
        /**
         * Show light source selection dialog with HTML table and Dragonbane styling
         * @returns {Promise<string|null>} Selected light source ID or null if cancelled
         */
        showLightSourceDialog: async function() {
            const lightSources = [
                { value: 'lantern', label: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.lightSources.lantern') || 'Lantern' },
                { value: 'oilLamp', label: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.lightSources.oilLamp') || 'Oil Lamp' },
                { value: 'tallowCandle', label: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.lightSources.tallowCandle') || 'Tallow Candle' },
                { value: 'torch', label: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.lightSources.torch') || 'Torch' }
            ]

            const options = lightSources.map(source => `<option value="${source.value}">${source.label}</option>`).join('')
            const chooseLabel = coreModule.api.Utils.i18n('tokenActionHud.dragonbane.dialog.lightTest.selectSource') || 'Choose a light source:'
            const noteText = coreModule.api.Utils.i18n('tokenActionHud.dragonbane.dialog.lightTest.note') || 'Note: All light sources burn for up to one shift of time. Roll of 1 always extinguishes the light.'
            
            // Get localized table headers
            const tableHeaders = {
                source: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.dialog.lightTest.table.source') || 'Source',
                radius: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.dialog.lightTest.table.radius') || 'Radius',
                test: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.dialog.lightTest.table.test') || 'Test',
                whenToRoll: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.dialog.lightTest.table.whenToRoll') || 'When to Roll',
                onOne: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.dialog.lightTest.table.onOne') || 'On 1'
            }
            
            // Get localized table content
            const tableContent = {
                afterEachStretch: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.dialog.lightTest.table.afterEachStretch') || 'After each stretch',
                afterStretchOrCombat: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.dialog.lightTest.table.afterStretchOrCombat') || 'After stretch or combat',
                afterStretchOrWeapon: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.dialog.lightTest.table.afterStretchOrWeapon') || 'After stretch or used as weapon',
                refillRelight: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.dialog.lightTest.table.refillRelight') || 'Refill & relight (action)',
                goesOut: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.dialog.lightTest.table.goesOut') || 'Goes out'
            }

            // Create styled light source names with inventory checking
            const createStyledLightSourceName = (lightSourceId) => {
                const lightSourceData = this.getLightSourceData(lightSourceId)
                const lightSourceName = lightSourceData.name

                // If no actor, return plain styling
                if (!this.actor) {
                    return lightSourceName
                }

                try {
                    // Search for item by name (case insensitive)
                    const lightSourceItem = this.actor.items.find(item =>
                        item.name.toLowerCase() === lightSourceName.toLowerCase()
                    )

                    if (lightSourceItem) {
                        // In inventory: Bold and green color using Dragonbane green
                        return `<strong style="color: #00604d;">${lightSourceName}</strong>`
                    }
                } catch (error) {
                    console.warn('Token Action HUD Dragonbane: Error checking light source inventory:', error)
                }

                // Not in inventory: Plain black text
                return lightSourceName
            }

            return new Promise((resolve) => {
                const dialog = new Dialog({
                    title: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.dialog.lightTest.title') || 'Light Test',
                    content: `
                        <div style="padding: 10px;">
                            <div style="margin-bottom: 15px;">
                                <label for="light-source" style="font-weight: bold; display: block; margin-bottom: 5px;">${chooseLabel}</label>
                                <select id="light-source" style="width: 100%; margin-top: 5px; padding: 5px; font-size: 14px;">${options}</select>
                            </div>
                            
                            <div class="display-generic-table" style="margin-bottom: 15px;">
                                <table style="width: 100%; border-collapse: collapse; background: transparent;">
                                    <thead>
                                        <tr style="background-color: transparent;"> 
                                            <th style="padding: 6px; text-align: left; border-bottom: 2px solid #4a2407; font-weight: bold;">${tableHeaders.source}</th>
                                            <th style="padding: 6px; text-align: center; border-bottom: 2px solid #4a2407; font-weight: bold;">${tableHeaders.radius}</th>
                                            <th style="padding: 6px; text-align: center; border-bottom: 2px solid #4a2407; font-weight: bold;">${tableHeaders.test}</th>
                                            <th style="padding: 6px; text-align: left; border-bottom: 2px solid #4a2407; font-weight: bold;">${tableHeaders.whenToRoll}</th>
                                            <th style="padding: 6px; text-align: left; border-bottom: 2px solid #4a2407; font-weight: bold;">${tableHeaders.onOne}</th>
                                        </tr>
                                    </thead>
                                    <tbody style="color: #4a2407;">
                                        <tr style="background-color: rgba(74, 36, 7, 0.1);">
                                            <td style="padding: 6px 8px; text-align: left; border-bottom: 1px solid #4a2407;">${createStyledLightSourceName('lantern')}</td>
                                            <td style="padding: 6px 8px; text-align: center; border-bottom: 1px solid #4a2407;">10m</td>
                                            <td style="padding: 6px 8px; text-align: center; border-bottom: 1px solid #4a2407;">1d8</td>
                                            <td style="padding: 6px 8px; text-align: left; border-bottom: 1px solid #4a2407;">${tableContent.afterEachStretch}</td>
                                            <td style="padding: 6px 8px; text-align: left; border-bottom: 1px solid #4a2407;">${tableContent.refillRelight}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 6px 8px; text-align: left; border-bottom: 1px solid #4a2407;">${createStyledLightSourceName('oilLamp')}</td>
                                            <td style="padding: 6px 8px; text-align: center; border-bottom: 1px solid #4a2407;">10m</td>
                                            <td style="padding: 6px 8px; text-align: center; border-bottom: 1px solid #4a2407;">1d6</td>
                                            <td style="padding: 6px 8px; text-align: left; border-bottom: 1px solid #4a2407;">${tableContent.afterEachStretch}</td>
                                            <td style="padding: 6px 8px; text-align: left; border-bottom: 1px solid #4a2407;">${tableContent.refillRelight}</td>
                                        </tr>
                                        <tr style="background-color: rgba(74, 36, 7, 0.1);">
                                            <td style="padding: 6px 8px; text-align: left; border-bottom: 1px solid #4a2407;">${createStyledLightSourceName('tallowCandle')}</td>
                                            <td style="padding: 6px 8px; text-align: center; border-bottom: 1px solid #4a2407;">4m</td>
                                            <td style="padding: 6px 8px; text-align: center; border-bottom: 1px solid #4a2407;">1d4</td>
                                            <td style="padding: 6px 8px; text-align: left; border-bottom: 1px solid #4a2407;">${tableContent.afterStretchOrCombat}</td>
                                            <td style="padding: 6px 8px; text-align: left; border-bottom: 1px solid #4a2407;">${tableContent.goesOut}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 6px 8px; text-align: left; border-bottom: none;">${createStyledLightSourceName('torch')}</td>
                                            <td style="padding: 6px 8px; text-align: center; border-bottom: none;">10m</td>
                                            <td style="padding: 6px 8px; text-align: center; border-bottom: none;">1d6</td>
                                            <td style="padding: 6px 8px; text-align: left; border-bottom: none;">${tableContent.afterStretchOrWeapon}</td>
                                            <td style="padding: 6px 8px; text-align: left; border-bottom: none;">${tableContent.goesOut}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <div style="font-size: 13px; color: #666; text-align: center; margin: 0; font-style: italic;">
                                <p style="margin: 0;">${noteText}</p>
                            </div>
                        </div>
                    `,
                    buttons: {
                        roll: {
                            label: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.dialog.lightTest.roll') || 'Roll Light Test',
                            callback: (html) => resolve(html.find('#light-source').val())
                        },
                        cancel: {
                            label: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.dialog.lightTest.cancel') || 'Cancel',
                            callback: () => resolve(null)
                        }
                    },
                    default: 'roll'
                })
                
                // Render the dialog with appropriate dimensions for the table
                dialog.render(true, { width: 700, height: 360, resizable: false })
            })
        },

        /**
         * Show severe injury dialog with boons/banes selection matching Dragonbane styling
         * @param {object} actor The actor performing the severe injury test
         * @returns {Promise<object|null>} Object with boons/banes values or null if cancelled
         */
        showSevereInjuryDialog: async function(actor) {
            // Use official Dragonbane language keys
            const testLabel = coreModule.api.Utils.i18n('tokenActionHud.dragonbane.messages.severeInjury.testLabel') || 'Severe Injury Test'
            const boonsLabel = game.i18n.localize('DoD.ui.dialog.boons') || 'Boons'
            const banesLabel = game.i18n.localize('DoD.ui.dialog.banes') || 'Banes'
            const extraLabel = game.i18n.localize('DoD.ui.dialog.extra') || 'Extra'
            const rollLabel = coreModule.api.Utils.i18n('tokenActionHud.dragonbane.rollSevereInjuryTest') || 'Roll Severe Injury Test'
            
            // Build content matching Dragonbane's roll-dialog.hbs structure
            const content = `
                <form class="DoD.dialog">
                    <div class="flexrow">
                        <table class="sheet-table boons">
                            <tr class="sheet-table-header">
                                <th></th>
                                <th class="text-header">${boonsLabel}</th>
                            </tr>
                            <tr class="sheet-table-data">
                                <td class="number-data">
                                    <select class="extraBoons" name="extraBoons"> 
                                        <option value="0">0</option> 
                                        <option value="1">1</option> 
                                        <option value="2">2</option> 
                                        <option value="3">3</option> 
                                        <option value="4">4</option> 
                                        <option value="5">5</option> 
                                        <option value="6">6</option> 
                                        <option value="7">7</option> 
                                        <option value="8">8</option> 
                                        <option value="9">9</option> 
                                    </select>                    
                                </td>
                                <td class="text-data wide">${extraLabel}</td>
                            </tr>
                        </table>
                        
                        <table class="sheet-table banes">
                            <tr class="sheet-table-header">
                                <th></th>
                                <th class="text-header">${banesLabel}</th>
                            </tr>
                            <tr class="sheet-table-data">
                                <td class="number-data">
                                    <select class="extraBanes" name="extraBanes"> 
                                        <option value="0">0</option> 
                                        <option value="1">1</option> 
                                        <option value="2">2</option> 
                                        <option value="3">3</option> 
                                        <option value="4">4</option> 
                                        <option value="5">5</option> 
                                        <option value="6">6</option> 
                                        <option value="7">7</option> 
                                        <option value="8">8</option> 
                                        <option value="9">9</option> 
                                    </select>                    
                                </td>
                                <td class="text-data wide">${extraLabel}</td>
                            </tr>
                        </table>
                    </div>
                </form>
            `
            
            return new Promise((resolve) => {
                const dialog = new Dialog({
                    title: testLabel,
                    content: content,
                    buttons: {
                        roll: {
                            label: rollLabel,
                            callback: (html) => {
                                const form = html[0].querySelector("form")
                                const extraBoons = parseInt(form.querySelector('.extraBoons').value) || 0
                                const extraBanes = parseInt(form.querySelector('.extraBanes').value) || 0
                                resolve({ boons: extraBoons, banes: extraBanes })
                            }
                        }
                    },
                    default: 'roll',
                    close: () => resolve(null)
                })
                
                dialog.render(true, { width: 400, resizable: false })
            })
        },

        /**
         * Perform severe injury roll with boons/banes
         * @param {object} actor The actor
         * @param {number} boons Number of boons
         * @param {number} banes Number of banes
         * @returns {Promise<object>} Roll result object
         */
        performSevereInjuryRoll: async function(actor, boons, banes) {
            const conValue = actor.system.attributes?.con?.value || 0
            
            // Calculate net modifier
            const netModifier = boons - banes
            let rollFormula = '1d20'
            let rollsToMake = 1
            
            if (netModifier > 0) {
                // Boons: roll extra dice, take lowest
                rollsToMake = 1 + Math.abs(netModifier)
                rollFormula = `${rollsToMake}d20kl` // Keep lowest
            } else if (netModifier < 0) {
                // Banes: roll extra dice, take highest  
                rollsToMake = 1 + Math.abs(netModifier)
                rollFormula = `${rollsToMake}d20kh` // Keep highest
            }
            
            const roll = new Roll(rollFormula)
            await roll.evaluate()
            
            const isSuccess = roll.total <= conValue
            
            return {
                roll,
                isSuccess,
                conValue,
                boons,
                banes,
                netModifier,
                rollsToMake
            }
        },

        /**
         * Build severe injury chat message content matching Dragonbane structure
         * @param {object} actor The actor
         * @param {object} rollResult The roll result object
         * @returns {string} HTML content for chat message
         */
        buildSevereInjuryChatContent: async function(actor, rollResult) {
            const { roll, isSuccess, conValue, boons, banes, netModifier, rollsToMake } = rollResult
            
            // Get the roll formula for display (1d20, 3d20kl, 3d20kh)
            let rollFormula = '1d20'
            if (netModifier > 0) {
                rollFormula = `${rollsToMake}d20kl`
            } else if (netModifier < 0) {
                rollFormula = `${rollsToMake}d20kh`
            }
            
            const testLabel = coreModule.api.Utils.i18n('tokenActionHud.dragonbane.messages.severeInjury.testLabel') || 'Severe Injury Test'
            const successLabel = coreModule.api.Utils.i18n('tokenActionHud.dragonbane.messages.severeInjury.success') || 'Success!'
            const failureLabel = coreModule.api.Utils.i18n('tokenActionHud.dragonbane.messages.severeInjury.failure') || 'Failure!'

            // Get the expandable tooltip content
            const tooltip = await roll.getTooltip()

            // Build header text like standard Dragonbane rolls: "Severe Injury Test for CON succeeded/failed."
            const resultText = isSuccess ? 'succeeded' : 'failed'
            const headerText = `${testLabel} for <strong>CON</strong> <strong>${resultText}</strong>.`

            // Build the chat content starting with the header (like standard rolls)
            let content = `
                <div style="font-size: 12px; margin-bottom: 0.5em;">${headerText}</div>
                <div class="dice-roll" data-action="expandRoll">
                    <div class="dice-result">
                        <div class="dice-formula">${rollFormula}</div>
                        ${tooltip}
                        <h4 class="dice-total">${roll.total}</h4>
                    </div>
                </div>
            `

            // Add the result sections (back to original styling - NOT clickable)
            if (isSuccess) {
                const survivesMessage = coreModule.api.Utils.i18n('tokenActionHud.dragonbane.messages.severeInjury.survivesWithoutInjuries')
                    ?.replace('{actor}', actor.name) || `${actor.name} survives without lasting injuries.`
                
                content += `
                    <div style="border: 2px solid #28a745; padding: 10px; background: rgba(40,167,69,.1); margin: 5px 0;">
                        <h3 style="margin-top: 0; color: #28a745;"><strong>${successLabel}</strong></h3>
                        <p style="margin: 0;">${survivesMessage}</p>
                    </div>
                `
            } else {
                const survivesWithInjuries = coreModule.api.Utils.i18n('tokenActionHud.dragonbane.messages.severeInjury.survivesWithInjuries')
                    ?.replace('{actor}', actor.name) || `${actor.name} survives death, but injuries remain...`
                const rollSevereInjuryButton = coreModule.api.Utils.i18n('tokenActionHud.dragonbane.messages.severeInjury.rollSevereInjury') || 'Roll Severe Injury'
                
                content += `
                    <div style="border: 2px solid #dc3545; padding: 10px; background: rgba(220,53,69,.1); margin: 5px 0;">
                        <h3 style="margin-top: 0; color: #dc3545;"><strong>${failureLabel}</strong></h3>
                        <p>${survivesWithInjuries}</p>
                        <button class="severe-injury-roll-btn" style="background: #dc3545; color: #fff; border: 1px solid #b5b3a4; padding: 1px 6px; border-radius: 3px; cursor: pointer; margin-top: 8px; height: 32px;">
                            ${rollSevereInjuryButton}
                        </button>
                    </div>
                `
            }

            return content
        },

        /**
         * Get light source data for testing
         * @param {string} sourceId - Light source identifier
         * @returns {object|null} Light source data object or null
         */
        getLightSourceData: function(sourceId) {
            const sources = {
                lantern: { 
                    name: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.lightSources.lantern') || 'Lantern', 
                    dice: '1d8' 
                },
                oilLamp: { 
                    name: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.lightSources.oilLamp') || 'Oil Lamp', 
                    dice: '1d6' 
                },
                tallowCandle: { 
                    name: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.lightSources.tallowCandle') || 'Tallow Candle', 
                    dice: '1d4' 
                },
                torch: { 
                    name: coreModule.api.Utils.i18n('tokenActionHud.dragonbane.lightSources.torch') || 'Torch', 
                    dice: '1d6' 
                }
            }
            return sources[sourceId] || null
        },

        /**
         * Roll on the severe injury table
         * @returns {Promise<void>}
         */
        rollSevereInjuryTable: async function() {
            try {
                // Find severe injury table - support multiple language variants
                const table = game.tables.contents.find(tbl =>
                    tbl.name.toLowerCase().includes('severe injury') ||
                    tbl.name.toLowerCase().includes('svår skada') ||
                    tbl.name.toLowerCase().includes('allvarlig skada')
                )

                if (!table) {
                    const message = coreModule.api.Utils.i18n('tokenActionHud.dragonbane.messages.severeInjury.tableNotFound') || 'Severe Injury roll table not found'
                    ui.notifications.warn(message)
                    return
                }

                // Draw from table (this creates its own chat message)
                await table.draw({ displayChat: true })

            } catch (error) {
                console.error('Token Action HUD Dragonbane: Error rolling severe injury table:', error)
                const message = coreModule.api.Utils.i18n('tokenActionHud.dragonbane.messages.severeInjury.tableFailed') || 'Failed to roll severe injury table'
                ui.notifications.error(message)
            }
        },

        /**
         * Get skill value from skill object
         * @param {object} skill - The skill object
         * @returns {number} The skill value
         */
        _getSkillValue: function(skill) {
            return skill.system?.value || 0
        }
    }
}