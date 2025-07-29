# Changelog
## [1.2.0] - 2025-07-28

### Added

#### Combat Actions System
- **New Combat Actions Group**: Restructured "Weapons" into "Combat" with two subcategories:
  - "Weapons" (existing weapon functionality)  
  - "Combat Actions" (new combat-specific actions)

#### New Combat Action Buttons
- **First Aid**: Uses Healing skill, requires target within 2m (1 grid square), uses regeneration icon
- **Rally Other**: Uses Persuasion skill, requires target within 10m, uses upgrade icon
- **Rally Self**: Uses WIL attribute check, no target required, uses upgrade icon
- **Dodge**: Uses Evade skill, no target required, uses combat icon

#### Enhanced Weapon System
- **Broken Weapon Detection**: Weapons marked as broken now display with red text styling
- **Broken Weapon Prevention**: Attempting to use a broken weapon shows warning message and prevents action
- **Visual Indicators**: Broken weapons use the same red styling as unavailable rest actions

#### Enhanced Spell System
- **Memorized Spell Indicators**: When "Show Only Memorized Spells" is disabled, memorized spells display with sparkles icon (✨)
- **Visual Consistency**: Spell indicators follow the same pattern as equipped weapon indicators
- **Smart Display Logic**: Only shows indicators for characters (NPCs/Monsters don't use memorization system)

#### Advanced Targeting System
- **Range Validation**: Combat actions automatically check if targets are within required range
- **Distance Calculation**: Uses Foundry's grid system to calculate precise distances in meters
- **Target Requirements**: Validates correct number of targets (0, 1, or specific requirements)
- **Smart Error Messages**: Provides clear feedback when targeting requirements aren't met

---

## [1.1.1] - Previous Release

### Features
- Full Dragonbane system integration
- Attribute, skill, weapon, spell, and ability actions
- Condition management with visual indicators
- Rest actions with availability tracking
- Monster-specific features (attacks, defend, traits)
- Stats display with health status indicators
- Comprehensive localization (English/Swedish)
- Performance optimizations and error handling

---

## Future Roadmap

### Planned Features
- **Additional Combat Actions**: Grapple, Shove, Aim, etc.
- **Custom Action Builder**: User interface for creating custom combat actions
- **Macro Integration**: Support for triggering macros from combat actions
- **Enhanced Targeting**: Support for AoE targeting and multiple target types
- **Action Queuing**: Ability to queue multiple actions for complex maneuvers

### Under Consideration
- **Animation Integration**: Visual effects for combat actions
- **Sound Effects**: Audio feedback for different action types
- **Advanced Conditions**: Custom condition tracking and automation
- **Combat Tracker Integration**: Direct integration with initiative and turn management