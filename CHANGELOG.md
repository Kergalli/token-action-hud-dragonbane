# Changelog

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
