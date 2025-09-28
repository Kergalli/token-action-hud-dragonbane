# Token Action HUD Dragonbane

![Foundry Version](https://img.shields.io/badge/foundry-v12.331%20to%20v13.347-green) ![GitHub release](https://img.shields.io/github/v/release/kergalli/token-action-hud-dragonbane) ![Token Action HUD Core](https://img.shields.io/badge/TAH%20Core-v2.0.4%2B-blue)

Token Action HUD Dragonbane is a repositionable HUD of stats and actions specifically designed for the Dragonbane RPG system by Free League Publishing. **Version 2.0 represents a complete rebuild** optimized for Foundry VTT v13 and Token Action HUD Core 2.0+.

---

## ✨ Key Features

### 🎯 **Core Functionality**

- **Instant Action Access**: Roll dice and use abilities directly from the HUD without opening character sheets
- **Repositionable Interface**: Drag and position the HUD anywhere on screen with collapsible sections
- **Smart Filtering**: Configurable display options for equipped items, memorized spells, and more
- **Real-time Status**: Live health indicators with color-coded status (green/yellow/red)
- **Contextual Actions**: Different actions available based on actor type (Character/NPC/Monster)
- **Localized Content**: All buttons, tooltips, messages, and settings in both English and Swedish

### ⚔️ **Enhanced Combat Actions (Redesigned in v2.0)**

- **Combat Actions Group**: Dedicated section for tactical combat options
  - **First Aid**: Healing skill roll
  - **Rally Other**: Persuasion skill roll
  - **Rally Self**: WIL attribute check
  - **Dodge**: Evade skill for defensive maneuvers
  - **Death Rolls**: Show when at zero HP
- **Weapon Management**: Visual indicators for equipped (⚔) and broken weapons (red styling)

### 🧙‍♂️ **Magic & Spell System (Enhanced in v2.0)**

- **Organized by Rank**: Magic Tricks (Rank 0), Rank 1, Rank 2, Rank 3 spells
- **Preparation Indicators**: Memorized spells marked with ⚡ when showing all spells
- **Flexible Display**: Toggle between showing only memorized spells or all known spells
- **Skill Integration**: Displays spell skill values with school-based calculations, including General spells (highest magic skill)

### 🛡️ **Equipment & Inventory (Improved in v2.0)**

- **Visual Status Indicators**:
  - Equipped weapons and armor clearly marked
- **Smart Filtering**: Separate options for equipped weapons only vs. showing all equipment

### ⭐ **Abilities Management (Enhanced in v2.0.1)**

- **Grouped Display**: Abilities taken multiple times show as "Robust x4" instead of separate entries
- **Clean Interface**: Reduces clutter while maintaining full functionality

### 👹 **Monster & NPC Features (Enhanced in v2.0)**

- **Monster Attack System**:
  - Random attacks from monster attack tables
  - Specific attack selection with index numbers
  - Supports monsters with weapons for damage rolls
  - Integrated attack table support (tables entries must follow Dragonbane core standard)
- **Monster Actions**: Dedicated Defend and Weapon Damage actions
- **Traits Display**: GM-only whispered trait information for NPCs and Monsters
- **Simplified Interface**: Streamlined actions appropriate for each actor type

### 💤 **Advanced Rest System (Redesigned in v2.0)**

- **Rest Availability Tracking**: Visual indicators showing which rest types are available
- **Comprehensive Rest Options**: Round Rest, Stretch Rest, Shift Rest, Pass One Shift of Time
- **Usage Prevention**: Disabled styling and informative messages for already-used rest types

### 🏥 **Health & Condition Management (Improved in v2.0.1)**

- **Death Rolls**: Automatic death roll button shown under Combat when a character is a zero HP
- **Condition Toggles**: Visual management of attribute conditions and status effects
- **Active State Indicators**: Conditions highlighted when active with red styling
- **Custom Status Effects**: Full compatibility with status effect modules and custom icons
- **Injury Tracking**: Shows current injuries under Stats

### 🔧 **Utility Actions (New in v2.0)**

- **Light Test**: Interactive light source selection with duration rules and light roll test
- **Severe Injury**: CON-based survival tests with automatic table rolling
- **Stats Display**: Click any stat to show detailed information in chat

---

## 📐 HUD Layout (Redesigned in v2.0)

The HUD is organized into logical sections that can be collapsed or repositioned:

1. **📊 Stats**: HP, WP, Movement, Encumbrance, Ferocity, Monster Traits, Injuries with visual status indicators
2. **⚔️ Combat**: Weapons and Combat Actions (First Aid, Rally, Dodge)
3. **🧙‍♂️ Spells**: Magic Tricks, Rank 1-3 spells with preparation status
4. **👹 Monster**: Random/Specific Attacks, Weapon Damage, Defend (Monster actors only)
5. **🎯 Skills**: Core, Weapon, and Secondary skills (configurable display)
6. **⭐ Abilities**: Character abilities and special powers with grouped display for multiples
7. **🛡️ Conditions**: Attribute conditions and status effects with active indicators
8. **🎒 Inventory**: Armor, Helmets, Items organized by type
9. **🔧 Utility**: Rest actions, Light Test, Severe Injury, and other tools

---

## ⚙️ Module Settings

### 🎨 **Display Options**

- **Show Unequipped Items**: Display all equipment vs. only equipped items
- **Show All Spells**: Show all known spells with preparation indicators vs. only memorized
- **Show Equipped Weapons Only**: Filter to display only equipped/held weapons
- **Show Attributes**: Toggle attribute roll actions on the HUD
- **Show Conditions**: Toggle injury and condition management sections

### 🎯 **Skill Display Options**

- **Show Weapon Skills**: Toggle weapon skills section (Brawling always shown)
- **Show Secondary Skills**: Toggle secondary skills section
- **Show Death Roll**: Automatically display death roll when character is dying

---

## 🚀 Installation

### **From Foundry Module Browser (Recommended)**

1. Open Foundry VTT
2. Go to **Add-on Modules**
3. Click **Install Module**
4. Search for "**Token Action HUD Dragonbane**"
5. Click **Install**

### **Manual Installation**

Use this manifest URL in Foundry's Install Module dialog:

```
https://github.com/kergalli/token-action-hud-dragonbane/releases/latest/download/module.json
```

---

## 📋 Requirements

### **Required Modules**

- **[Token Action HUD Core](https://foundryvtt.com/packages/token-action-hud-core) v2.0.0+** - Essential for functionality

### **System Compatibility**

- **[Dragonbane System](https://foundryvtt.com/packages/dragonbane) v2.0+** - Official Free League system

### **Foundry Compatibility**

- **Foundry VTT**: v12.331 minimum, verified through v13.345
- **Optimized for**: Foundry VTT v13+ with modern features

---

## 🔄 Migration from v1.x

**⚠️ Version 2.0 includes breaking changes requiring attention:**

1. **Update Dependencies**: Ensure Token Action HUD Core is v2.0.0+
2. **Backup Settings**: Export current TAH layout before updating
3. **Reconfigure Module**: Review and adjust all module settings after installation
4. **Test Functionality**: Verify all features work correctly in your specific game setup

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history and feature updates.

### Recent Major Changes:

- **v2.0.3**: Enhanced Swedish localization with proper skill names and attribute abbreviations
- **v2.0.2**: Fixed multiple token selection compatibility and magic tricks display
- **v2.0.1**: Improved ability grouping and status effect compatibility
- **v2.0.0**: Complete rebuild for Foundry v13 and TAH Core 2.0+ with Swedish translation
- **v1.2.0**: Enhanced combat actions and targeting system
- **v1.1.1**: Initial stable release with core Dragonbane integration

---

## Credits & Attribution

### Icons

Some icons used in this module are from [game-icons.net](https://game-icons.net), created by delapouite, lorc, and skoll. Available under [Creative Commons 3.0 BY license](https://creativecommons.org/licenses/by/3.0/).

### Acknowledgments

- Free League Publishing for the excellent Dragonbane RPG system
- Token Action HUD Core team for the foundational framework
- The Foundry VTT community for feedback and support

---
