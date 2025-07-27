/**
 * Token Action HUD Dragonbane
 * Compatible with Token Action HUD Core v1.5.7
 */

// Import constants and class factories
import {
    MODULE,
    REQUIRED_CORE_MODULE_VERSION
} from './constants.js'

import { createActionHandler } from './action-handler.js'
import { createRollHandler } from './roll-handler.js'
import { createSystemManager, setClassReferences } from './system-manager.js'

// Module-level variables for class storage
let ActionHandler = null
let RollHandler = null
let SystemManager = null

/**
 * Ready hook
 */
Hooks.once('ready', async () => {
    // Create debounced update function for settings changes
    const debouncedSettingsUpdate = foundry.utils.debounce(() => {
        if (ui.tokenActionHud) ui.tokenActionHud.update()
    }, 100)

    // Listen for core Token Action HUD setting changes
    Hooks.on('updateSetting', (setting) => {
        // Check if it's a core Token Action HUD setting we care about
        if (setting.namespace === 'token-action-hud-core') {
            // Update the HUD when core settings change
            debouncedSettingsUpdate()
        }
    })

    // Register module settings
    game.settings.register(MODULE.ID, 'hideWeaponSkills', {
        name: game.i18n.localize('tokenActionHud.dragonbane.settings.hideWeaponSkills.name') || 'Hide Weapon Skills',
        hint: game.i18n.localize('tokenActionHud.dragonbane.settings.hideWeaponSkills.hint') || 'Hide weapon skills from the Token Action HUD',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        onChange: debouncedSettingsUpdate
    })

    game.settings.register(MODULE.ID, 'hideSecondarySkills', {
        name: game.i18n.localize('tokenActionHud.dragonbane.settings.hideSecondarySkills.name') || 'Hide Secondary Skills',
        hint: game.i18n.localize('tokenActionHud.dragonbane.settings.hideSecondarySkills.hint') || 'Hide secondary skills from the Token Action HUD',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        onChange: debouncedSettingsUpdate
    })

    game.settings.register(MODULE.ID, 'showOnlyMemorizedSpells', {
        name: game.i18n.localize('tokenActionHud.dragonbane.settings.showOnlyMemorizedSpells.name') || 'Show Only Memorized Spells',
        hint: game.i18n.localize('tokenActionHud.dragonbane.settings.showOnlyMemorizedSpells.hint') || 'Only show memorized spells in the Token Action HUD. Uncheck to show all spells.',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
        onChange: debouncedSettingsUpdate
    })

    game.settings.register(MODULE.ID, 'showUnequippedWeapons', {
        name: game.i18n.localize('tokenActionHud.dragonbane.settings.showUnequippedWeapons.name') || 'Show Unequipped Weapons',
        hint: game.i18n.localize('tokenActionHud.dragonbane.settings.showUnequippedWeapons.hint') || 'Show weapons that are not currently equipped in addition to equipped weapons',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        onChange: debouncedSettingsUpdate
    })

    const module = game.modules.get(MODULE.ID)
    module.api = {
        requiredCoreModuleVersion: REQUIRED_CORE_MODULE_VERSION,
        SystemManager
    }
    Hooks.call('tokenActionHudSystemReady', module)
})

/**
 * Token Action HUD Core module hook
 */
Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    if (!coreModule.api) {
        return
    }

    if (game.system.id !== 'dragonbane') {
        return
    }

    /**
     * Create ActionHandler Class
     */
    ActionHandler = createActionHandler(coreModule)

    /**
     * Create RollHandler Class
     */
    RollHandler = createRollHandler(coreModule)

    /**
     * Set class references for SystemManager
     */
    setClassReferences(ActionHandler, RollHandler)

    /**
     * Create SystemManager Class
     */
    SystemManager = createSystemManager(coreModule)
})
