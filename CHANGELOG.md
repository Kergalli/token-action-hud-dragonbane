# Changelog

## [2.3.3] - 2025-01-27

### ✨ New Features

#### 📖 Interactive Rules Display System

- **Right-Click Rules Summaries**: Combat Actions and Journey Actions now support right-click to whisper concise rules summaries
  - **Combat Actions**: Dodge, First Aid, Rally Self, Rally Other, and Death Roll
  - **Journey Actions**: Pathfinder, Make Camp, Hunt, Fish, Forage, and Cook
  - **Whispered Display**: Rules appear as private chat messages to the triggering player
  - **Structured Format**: Bullet-point summaries matching Dragonbane Combat Assistant styling for consistency

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
