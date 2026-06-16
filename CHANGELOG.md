# Changelog

## [2.6.0] - 2026-06-16

### ⚙️ Foundry v14 / Dragonbane v4 Compatibility

This release is a clean cut to **Foundry VTT v14** and the **Dragonbane v4.x** system. It is **not compatible with Foundry v13 or Dragonbane v3.x** — stay on v2.5.0 for those.

- **Foundry VTT v14**: Compatibility band moved to v14-only (`minimum`/`verified`/`maximum` = 14 / 14.364 / 14).
- **Dragonbane v4.0.1**: System relationship now requires `>= 4.0.0`, verified against `4.0.1`.
- **Token Action HUD Core 2.1.1**: Required Core module version bumped to `2.1` (tracked as major `2`).

### 🐛 Fixes

- **Attribute rolls**: Updated the HUD's call into the character sheet's attribute-roll handler to match Dragonbane v4.0.1's new ApplicationV2 `(event, target)` signature, so boons/banes dialogs work again from the HUD.
- **Death rolls**: Updated the HUD's call into the character sheet's death-roll handler for the same v4.0.1 signature change.
- **Chat buttons**: Hardened the chat-message render hook to accept Foundry v14's native-element form, keeping the Fear Effect and Severe Injury roll buttons working.

### 🧹 Maintenance

- **Removed unreachable death-roll path**: Deleted the unused `handleDeathRollAction` handler, which performed an untracked CON roll and was never reached at runtime (the Death Roll button routes through the tracked sheet path that updates success/failure counters and respects the action-counting ignore flag). Removing it prevents a future refactor from accidentally wiring up the untracked path. No user-facing change.

---

## [2.5.0] - 2025-04-04

### ✨ New Features

#### 💤 Rest Dialog Integration

- **Stretch Rest dialog**: Clicking Stretch Rest from the HUD now opens the system's rest dialog, matching the behaviour of the character sheet button. The dialog allows adjusting the amount of HP, WP, and conditions to recover, and offers an **Interrupt** option to spend the rest without recovering
- **Shift Rest dialog**: Clicking Shift Rest from the HUD now opens the system's rest dialog with **Finish** and **Interrupt** options, again matching the character sheet
- **Respects system setting**: Both dialogs honour the core Dragonbane **Rest Dialogs** setting (`restDialogIsDefault`). When the setting is enabled, the dialog opens on left-click and is skipped when holding Shift or Ctrl. When disabled, the behaviour is reversed — matching exactly what the character sheet does
- **All dialog strings localized**: Dialog titles, buttons, and interrupted messages use the system's own localization keys and are automatically correct in all languages the system supports

### 🐛 Bug Fixes

#### 👹 Monster Attack Name Resolution

- **Fixed monster attack names** not reflecting the system's updated naming logic introduced in Dragonbane v3.1.0. Attack names are now resolved using the table result's `name` field first (stripping the auto-generated `"TableName - "` prefix where present), falling back to bold-tag parsing for legacy tables, and finally to `"Attack N"` as a last resort — matching the system's own priority order

### 🔧 Compatibility

- **Verified compatibility** with Dragonbane system v3.1.5

---

## [2.4.2] - 2025-01-02

### 🌍 Localization Improvements

#### 🇮🇹 Italian Language Support

- **Italian Localization**: Complete Italian translation now available (contribution by **LuckyFrico**)
- **Full Coverage**: All settings, actions, combat rules, journey actions, and UI elements fully translated

---

## [2.4.1] - 2025-12-26

### 🐛 **Critical Bug Fixes**

#### 🎯 **YZE Combat Integration - Action Counting Fix**

- **Fixed Fear Test Action Counting Bug**: Fear Test WIL rolls and Fear Effect table rolls no longer incorrectly count as combat actions
- **Ignore Flag System**: Implemented comprehensive ignore flag system for Dragonbane Combat Assistant integration
  - **Light Test**: No longer counts as action (utility roll)
  - **Severe Injury Test**: No longer counts as action (survival test)
  - **Death Roll**: No longer counts as action (survival test)
  - **Fear Effect Table**: No longer counts as action (reaction roll)
- **Smart Integration**: Combat Assistant now respects `ignoreNextRollForActionCounting` flag from Token Action HUD

### 📋 **Compatibility Requirements**

- **Dragonbane Combat Assistant**: v2.2.3+ required for updated YZE integration to respect ignore flags
- **YZE Combat Module**: Compatible with existing single action tracking
- **Foundry VTT**: v13.345+ recommended for full functionality

### 📚 **Documentation Improvements**

- **README Restructure**: Completely reorganized README.md for improved readability and logical flow
- **Streamlined Installation Guide**: Clearer requirements and dependency information
- **Improved Usage Guidance**: Better organization of special cases and integration tips

---

## [2.4.0] - 2025-12-25

### ✨ **Enhanced User Experience**

#### 🩹 **Rally Self Action Improvements**

- **Smart Visibility**: Rally Self button now only appears when character is at zero HP (matches Death Roll behavior)
- **Automatic Action Tracking**: Rally Self now automatically applies action status effect after WIL roll completion

#### 💀 **Death Roll Enhancements**

- **Target Number Display**: Death Roll button now shows character's CON value for easy reference
- **Progress Tracking**: Displays current death roll successes and failures

#### 🔦 **Light Test Dialog Enhancement**

- **Equipped Icon Display**: Light sources in inventory now show ⚔ icon before name

#### 🎯 **Custom Table Settings Clarification**

- **Clear Scope**: Updated Severe Injury Table UUID and Fear Effect Table UUID setting hints
- **Token Action HUD Only**: Made explicit that custom tables only work for Token Action HUD rolls

#### 🎨 **Modern Dialog System (ApplicationV2)**

- **Visual Consistency**: Severe Injury and Light Test dialogs now use modern AppV2 architecture to align with Dragonbane v3.0

---

## [2.3.4] - 2025-11-02

### 🌍 Localization Improvements

#### 🇸🇪 Swedish Language Enhancements

- **Swedish Language Fixes**: Various improvements and corrections to Swedish translations (courtesy of **xdy**)
- **Enhanced Localization**: Better language support and more accurate translations throughout the module

---

## [2.3.3] - 2025-01-27

### ✨ New Features

#### 📖 Interactive Rules Display System

- **Right-Click Rules Summaries**: Combat Actions and Journey Actions now support right-click to whisper concise rules summaries
  - **Combat Actions**: Dodge, First Aid, Rally Self, Rally Other, and Death Roll
  - **Journey Actions**: Pathfinder, Make Camp, Hunt, Fish, Forage, and Cook
  - **Whispered Display**: Rules appear as private chat messages to the triggering player
  - **Structured Format**: Bullet-point summaries matching Dragonbane Combat Assistant styling for consistency

#### 🔦 Dual-Purpose Item Handling

- **Torch Visibility Fix**: Torches now intelligently appear in appropriate sections based on equipped status
  - **Equipped torches**: Display in Weapons section for combat use
  - **Unequipped torches**: Display in Inventory → Items section when "Show Equipped Weapons Only" is enabled
  - **Prevents item disappearance**: Ensures torches remain accessible regardless of equipment settings
  - **⚠️ Important**: Requires "Show Equipped Weapons Only" setting to be enabled for dual-purpose behavior. When disabled, torches will appear in Weapons regardless of equipped status.

---

## [2.3.2] - 2025-10-26

### 🎨 Added

#### Enhanced Button Customization

- **Custom Border Controls**: Added comprehensive border styling options for HUD buttons
  - **Button Border Color**: Hex color picker for border colors (default: 50% grey #808080)
  - **Button Border Size**: Range slider from 0-5px with 0.5px increments (default: 1px)
  - **Button Border Opacity**: Range slider from 0-100% with 5% increments (default: 80%)
  - **Live Preview**: All border changes apply immediately without requiring reload
  - **Per-Client Settings**: Each user can configure their own border preferences independently

### 🌍 Localization Improvements

#### 🇸🇪 Swedish Language Enhancements

- **Swedish Language Fixes**: Various improvements and corrections to Swedish translations (courtesy of **xdy**)
- **Enhanced Localization**: Better language support and more accurate translations throughout the module

---

## [2.3.1] - 2025-10-24

### 🎨 Added

#### Enhanced Customization Options

- **HUD Z-Index Override**: New optional setting "Show HUD Above Other Windows" allows GMs to force the Token Action HUD above Foundry journals and character sheets
- **Custom Button Styling**: Added user-configurable button background color and opacity settings
  - **Button Background Color**: Hex color picker for button backgrounds (default Dragonbane green: #00604d)
  - **Button Background Opacity**: Slider control from 0-100% opacity (default: 75%)
  - **Live Preview**: Changes apply immediately without requiring reload

---

## [2.3.0] - 2025-10-19

### ✨ New Features

#### 💰 Currency Display System

- **Currency Buttons**: Added Gold, Silver, and Copper currency display buttons under Inventory section for Characters and NPCs
- **Chat Integration**: Clicking currency buttons sends formatted chat messages (e.g., "**Eldara** has 8 gold.")
- **Module Setting**: New "Show Currency" option (enabled by default) to toggle currency display

#### 🎯 Enhanced Action Display

- **Severe Injury Improvements**: Severe Injury button now displays CON attribute value in parentheses (e.g., "Severe Injury (15)")

### 🐛 Bug Fixes & Improvements

#### 🎭 Actor Type Restrictions

- **Fear Test Limitation**: Removed Fear Test action from NPCs - now only available for Characters

#### 🎨 UI Refinements

- **Traits Display**: Reduced header size in traits display for better visual hierarchy

---

## [2.2.0] - 2025-10-15

### 🎯 New Features

#### 😰 Fear Test System

- **Fear Tests**: New Fear test actions available from the HUD for WIL-based fear resistance
- **Automatic Follow-up**: Failed Fear tests now automatically display instructions and roll buttons for Fear Effect tables

#### 🎲 Enhanced Table Integration

- **Custom Table UUIDs**: New settings for Fear Effect Table and Severe Injury Table UUIDs - great for homebrew tables!
  - **Fear Effect Table UUID**: Configure custom Fear effect roll tables
  - **Severe Injury Table UUID**: Configure custom Severe Injury roll tables
- **Automatic Fallback**: Falls back to name-based detection for standard tables (English/Swedish)

### 🔧 Improvements

#### 🛡️ Severe Injury Enhancements

- **Permission Validation**: Enhanced permission checking for Severe Injury table roll buttons (only initiating player and GM can roll)
- **Improved Styling**: Better visual feedback with disabled button states after rolling

#### 🎨 UI/UX Improvements

- **Button States**: Roll buttons now disable and show "Rolled" state after use
- **Permission Awareness**: Clear permission error messages for unauthorized roll attempts

---

## [2.1.0] - 2025-09-28

### ✨ New Features

#### 🛡️ New Utility Actions

- **Journey Actions**: Simple buttons for various Journey Actions have been added under Utilities

### ✨ Enhanced Condition System

#### 🛡️ Categorized Status Effects (v13+ Required)

- **Effect Categorization**: Status effects now automatically organize into groups that match Dragonbane Status Effects:
  - Attribute Conditions, General Effects, Spell Effects, Heroic Abilities
  - Undefined effects will be shown under a generic Status Effects category

#### 🔗 Dragonbane Status Effects Integration

- **Module Compatibility**: Full integration with the Dragonbane Status Effects module
- **Auto-Detection**: Automatically reads effect categories from `dragonbane-status-effects` flags
- **Seamless Organization**: Effects from the module are automatically sorted into appropriate categories
- **Respects Hidden Categories**: Hidden DSE catregories will no longer show in the Token Action HUD

#### ⚙️ Version-Specific Features

- **Foundry v13+ Optimized**: Enhanced categorization system requires Foundry VTT v13 or higher
- **v12 Compatibility Maintained**: Fallback support for Foundry v12 users with simplified categorization

---

## [2.0.4] - 2025-09-27

#### 🐛 Bug Fixes

- **Ability Actions Fixed**: Resolved "Spell [AbilityName] not found" errors when clicking abilities
  - Solution: Use `rollItem()` method for abilities instead, which works correctly

---

## [2.0.3] - 2025-09-27

### 🌍 Localization Improvements

#### 🇸🇪 Swedish Language Support Enhanced

- **Combat Actions Fixed**: Dodge, First Aid, and Rally Other actions now work correctly in Swedish Dragonbane
- **Attribute Abbreviations Localized**: Attributes under Stats now show Swedish abbreviations
- **Abilities Display Improved**: Abilities section now displays correctly in Swedish

#### 🔧 Technical Implementation

- **Skill Name Mapping**: Added `skillNames` localization keys for combat action skills
- **Attribute Localization**: Added `attributeAbbreviations` for proper language-specific display
- **Utility Methods**: New localization helpers `getLocalizedSkillName()` and `getLocalizedAttributeAbbreviation()`
- **Language File Structure**: Enhanced English and Swedish language files with new localization keys

---

## [2.0.2] - 2025-09-05

### 🐛 Bug Fixes

#### ⚔️ Combat Tracker Compatibility

- **Multiple Token Selection**: Fixed error when selecting multiple tokens and adding them to the combat tracker
- **Null Check Enhancement**: Added proper validation in `needsDeathRoll` method to prevent TypeError on null actors

#### ✨ Magic Tricks Display

- **Spell Grouping**: Fixed magic tricks not properly grouping under "Magic Tricks" category
- **Rank 0 Spells**: Corrected display logic for rank 0 spells to ensure consistent categorization

#### 🔧 Technical Improvements

- **Error Handling**: Enhanced error handling for edge cases with missing actor data
- **Stability**: Improved robustness when dealing with multiple token selections

---

## [2.0.1] - 2025-08-28

### 🔧 Quality of Life Improvements

#### ⭐ Enhanced Abilities Display

- **Grouped Abilities**: Multiple instances of the same ability now display as "Robust x4" instead of showing separate entries

#### 🛡️ Status Effects Compatibility

- **Custom Icon Support**: Fixed display issues with custom status effect modules
- **Modern Property Support**: Updated to use Foundry v12+ standard properties

#### 🔄 Technical Updates

- **Future-Proofing**: Enhanced compatibility with upcoming Foundry versions
- **Performance**: Minor optimizations for better responsiveness

---

## [2.0.0] - 2025-08-16

### 🚀 MAJOR RELEASE - Complete Rebuild

**Token Action HUD Dragonbane has been completely rebuilt from the ground up for Foundry VTT v13 and Token Action HUD Core 2.0+. This represents a fundamental rewrite with enhanced architecture, improved performance, and a redesigned user experience.**

---

### ✨ New Features

#### 🛡️ Improved Equipment Management

- **Visual Status Indicators**:
  - Red styling for broken weapons with usage prevention
  - Sparkle icons (⚡) for memorized spells
  - Crossed swords (⚔) for equipped weapons
  - Color-coded health status (yellow/red for injured/critical)
- **Smart Equipment Filtering**: Contextual display based on equipment status
- **Equipment Validation**: Prevents actions with broken or unusable equipment

#### ✨ Additional Information/Features

- **Injuries**: Now shown under Stats
- **Inventory**: Non-weapon gear, armor, and helmets can now be viewed from the HUD
- **Light Test**: Allows a player to roll a test for a light source, reported in chat output
- **Severe Injuries**: Allows player to roll for a Severe Injury from the HUD, reported in chat output with Severe Injury table roll button
- **Monster Weapon Damage**: Monsters with weapons now show those weapons under Monster and allow for easy damage rolls

---

### 🔧 Technical Improvements

#### 🏗️ Architecture Overhaul

- **Modern Token Action HUD Core 2.0+ Integration**: Built for the latest TAH architecture
- **Foundry v13 Compatibility**: Optimized for Foundry VTT v13 features and APIs
- **Modular Design**: Clean separation of concerns with dedicated handler classes

#### 🎨 User Interface Redesign

- **Reorganized Layout**: Logical grouping of actions with improved navigation
- **Enhanced Visual Feedback**: Clear status indicators and contextual styling

---

### 📊 HUD Layout Changes

#### Reorganized Sections:

1. **Stats**: HP, WP, Movement, Encumbrance, Ferocity, Traits (with visual status indicators)
2. **Combat**: Weapons and Combat Actions (First Aid, Rally, Dodge, Death Rolls)
3. **Spells**: Organized by rank (Magic Tricks, Rank 1-3) with preparation indicators
4. **Monster**: Random/Specific Attacks, Weapon Damage, Defend actions
5. **Skills**: Core, Weapon, and Secondary skills with optional display
6. **Abilities**: Character abilities and powers
7. **Conditions**: Attribute conditions and status effects with active state indicators
8. **Inventory**: Armor, Helmets, Items with equipment status
9. **Utility**: Rest actions, Light Test, Severe Injury, and other tools

---

### ⚙️ Settings & Configuration

#### New Module Settings:

- **Display Unequipped Items**: Toggle for showing unequipped equipment
- **Show All Spells**: Display all spells vs. only memorized with visual indicators
- **Show Equipped Weapons Only**: Filter to show only equipped/held weapons
- **Show Attributes**: Toggle attribute roll actions
- **Show Conditions**: Toggle injury and condition display
- **Show Death Roll**: Automatically display death roll when dying under Combat
- **Show Weapon Skills**: Optional weapon skills display
- **Show Secondary Skills**: Optional secondary skills display

---

### 🐛 Bug Fixes & Stability

- **Memory Leak Prevention**: Proper cleanup of event listeners and references
- **Error Recovery**: Graceful handling of missing or corrupted data
- **API Compatibility**: Robust integration with Dragonbane system APIs
- **Cross-Platform Stability**: Consistent behavior across different operating systems
- **Performance Bottlenecks**: Optimized rendering and data processing

---

### 🔄 Breaking Changes

**⚠️ This is a major version release with breaking changes:**

- **Minimum Requirements**:
  - Foundry VTT v12.331+ (verified through v13.345)
  - Token Action HUD Core 2.0.0+
  - Dragonbane System 2.0+
- **Configuration Reset**: Previous module settings will need to be reconfigured
- **Layout Changes**: HUD layout has been completely redesigned
- **API Changes**: Internal APIs have changed (affects custom integrations)

---

## [1.2.0] - 2025-07-28 (Legacy)

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

- **Memorized Spell Indicators**: When "Show Only Memorized Spells" is disabled, memorized spells display with sparkles icon (⚡)
- **Visual Consistency**: Spell indicators follow the same pattern as equipped weapon indicators
- **Smart Display Logic**: Only shows indicators for characters (NPCs/Monsters don't use memorization system)

#### Advanced Targeting System

- **Range Validation**: Combat actions automatically check if targets are within required range
- **Distance Calculation**: Uses Foundry's grid system to calculate precise distances in meters
- **Target Requirements**: Validates correct number of targets (0, 1, or specific requirements)
- **Smart Error Messages**: Provides clear feedback when targeting requirements aren't met

---

## [1.1.1] - Previous Legacy Release

### Features

- Full Dragonbane system integration
- Attribute, skill, weapon, spell, and ability actions
- Condition management with visual indicators
- Rest actions with availability tracking
- Monster-specific features (attacks, defend, traits)
- Stats display with health status indicators
- Comprehensive localization (English/Swedish)
- Performance optimizations and error handling
