import { MODULE } from './constants.js'

/**
 * Register module settings
 * Called by Token Action HUD Core to register Token Action HUD system module settings
 * @param {function} coreUpdate Token Action HUD Core update function
 */
export function register(coreUpdate) {
    // 1. Show Attributes
    game.settings.register(MODULE.ID, 'showAttributes', {
        name: game.i18n.localize('tokenActionHud.dragonbane.settings.showAttributes.name'),
        hint: game.i18n.localize('tokenActionHud.dragonbane.settings.showAttributes.hint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: (value) => {
            coreUpdate(value)
        }
    })

    // 2. Show Injuries
    game.settings.register(MODULE.ID, 'showInjuries', {
        name: game.i18n.localize('tokenActionHud.dragonbane.settings.showInjuries.name'),
        hint: game.i18n.localize('tokenActionHud.dragonbane.settings.showInjuries.hint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: (value) => {
            coreUpdate(value)
        }
    })

    // 3. Show Equipped Weapons Only
    game.settings.register(MODULE.ID, 'showEquippedWeaponsOnly', {
        name: game.i18n.localize('tokenActionHud.dragonbane.settings.showEquippedWeaponsOnly.name'),
        hint: game.i18n.localize('tokenActionHud.dragonbane.settings.showEquippedWeaponsOnly.hint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: false,
        onChange: (value) => {
            coreUpdate(value)
        }
    })

    // 4. Show Death Roll
    game.settings.register(MODULE.ID, 'showDeathRoll', {
        name: game.i18n.localize('tokenActionHud.dragonbane.settings.showDeathRoll.name'),
        hint: game.i18n.localize('tokenActionHud.dragonbane.settings.showDeathRoll.hint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: (value) => {
            coreUpdate(value)
        }
    })

    // 5. Show All Spells
    game.settings.register(MODULE.ID, 'showAllSpells', {
        name: game.i18n.localize('tokenActionHud.dragonbane.settings.showAllSpells.name'),
        hint: game.i18n.localize('tokenActionHud.dragonbane.settings.showAllSpells.hint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: false,
        onChange: (value) => {
            coreUpdate(value)
        }
    })

    // 6. Show Weapon Skills
    game.settings.register(MODULE.ID, 'showWeaponSkills', {
        name: game.i18n.localize('tokenActionHud.dragonbane.settings.showWeaponSkills.name'),
        hint: game.i18n.localize('tokenActionHud.dragonbane.settings.showWeaponSkills.hint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: (value) => {
            coreUpdate(value)
        }
    })

    // 7. Show Secondary Skills
    game.settings.register(MODULE.ID, 'showSecondarySkills', {
        name: game.i18n.localize('tokenActionHud.dragonbane.settings.showSecondarySkills.name'),
        hint: game.i18n.localize('tokenActionHud.dragonbane.settings.showSecondarySkills.hint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: (value) => {
            coreUpdate(value)
        }
    })

    // 8. Show Unequipped Items
    game.settings.register(MODULE.ID, 'showUnequippedItems', {
        name: game.i18n.localize('tokenActionHud.dragonbane.settings.showUnequippedItems.name'),
        hint: game.i18n.localize('tokenActionHud.dragonbane.settings.showUnequippedItems.hint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: (value) => {
            coreUpdate(value)
        }
    })
}