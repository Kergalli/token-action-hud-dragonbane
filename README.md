# Token Action HUD Dragonbane

![Foundry Version](https://img.shields.io/badge/foundry-v12%20to%20v13-green) ![GitHub release](https://img.shields.io/github/v/release/kergalli/token-action-hud-dragonbane) ![Token Action HUD Core](https://img.shields.io/badge/TAH%20Core-v2.0.0%2B-blue)

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

### ⚔️ **Enhanced Combat Actions**

- **Combat Actions Group**: Dedicated section for tactical combat options
  - **First Aid**: Healing skill roll
  - **Rally Other**: Persuasion skill roll
  - **Rally Self**: WIL attribute check
  - **Dodge**: Evade skill for defensive maneuvers
  - **Death Rolls**: Show when at zero HP
- **Weapon Management**: Visual indicators for equipped (⚔) and broken weapons (red styling)

### 🧙‍♂️ **Magic & Spell System**

- **Organized by Rank**: Magic Tricks (Rank 0), Rank 1, Rank 2, Rank 3 spells
- **Preparation Indicators**: Memorized spells marked with ⚡ when showing all spells
- **Flexible Display**: Toggle between showing only memorized spells or all known spells
- **Skill Integration**: Displays spell skill values with school-based calculations, including General spells (highest magic skill)

### 🛡️ **Equipment & Inventory**

- **Visual Status Indicators**:
  - Equipped weapons and armor clearly marked
- **Smart Filtering**: Separate options for equipped weapons only vs. showing all equipment
- **Quick Currency Access**: Gold, Silver, and Copper buttons show current amounts directly on the HUD

### ⭐ **Abilities Management**

- **Grouped Display**: Abilities taken multiple times show as "Robust x4" instead of separate entries
- **Clean Interface**: Reduces clutter while maintaining full functionality

### 👹 **Monster & NPC Features**

- **Monster Attack System**:
  - Random attacks from monster attack tables
  - Specific attack selection with index numbers
  - Supports monsters with weapons for damage rolls
  - Integrated attack table support (tables entries must follow Dragonbane core standard)
- **Monster Actions**: Dedicated Defend and Weapon Damage actions
- **Traits Display**: GM-only whispered trait information for NPCs and Monsters
- **Simplified Interface**: Streamlined actions appropriate for each actor type

### 💤 **Advanced Rest System**

- **Rest Availability Tracking**: Visual indicators showing which rest types are available
- **Comprehensive Rest Options**: Round Rest, Stretch Rest, Shift Rest, Pass One Shift of Time
- **Usage Prevention**: Disabled styling and informative messages for already-used rest types

### 🏥 **Health & Condition Management**

- **Dragonbane Status Effects Integration**: **NEW v2.1.0, v13 only** - Seamless compatibility with the Dragonbane Status Effects module
  - **Categorized Conditions** - Organization of status effects into the defined DSE categories
  - **Respects DSE Settings** - Hidden DSE catregories will no longer show in the Token Action HUD
- **Active State Indicators**: Conditions highlighted when active with red styling
- **Custom Status Effects**: Full compatibility with status effect modules and custom icons
- **Death Rolls**: Automatic death roll button shown under Combat when a character is a zero HP
- **Injury Tracking**: Shows current injuries under Stats

### 🔧 **Utility Actions**

- **Journey Actions**: Simple buttons for various Journey Actions
- **Light Test**: Interactive light source selection with duration rules and light roll test
- **Fear Test**: WIL-based resistance rolls against fear effects
- **Severe Injury**: CON-based survival tests with automatic table rolling
- **Stats Display**: Click any stat to show detailed information in chat

### 🎨 **Enhanced Customization**

- **Custom Button Styling**: Personalize button appearance with configurable background colors and opacity
- **Z-Index Control**: Optional setting to force HUD above other Foundry windows (journals, character sheets)
- **Live Updates**: All customization changes apply immediately without requiring reload
- **Per-Client Settings**: Each user can configure their own visual preferences

---

## 📐 HUD Layout

The HUD is organized into logical sections that can be collapsed or repositioned:

1. **📊 Stats**: HP, WP, Movement, Encumbrance, Ferocity, Monster Traits, Injuries with visual status indicators
2. **⚔️ Combat**: Weapons and Combat Actions (First Aid, Rally, Dodge)
3. **🧙‍♂️ Spells**: Magic Tricks, Rank 1-3 spells with preparation status
4. **👹 Monster**: Random/Specific Attacks, Weapon Damage, Defend (Monster actors only)
5. **🎯 Skills**: Core, Weapon, and Secondary skills (configurable display)
6. **⭐ Abilities**: Character abilities and special powers with grouped display for multiples
7. **🛡️ Conditions**: Attribute conditions and status effects with active indicators
8. **🎒 Inventory**: Armor, Helmets, Items organized by type, currency
9. **🔧 Utility**: Rest actions, Journey actions, Light Test, Fear Test, Severe Injury, and other tools

---

## ⚙️ Module Settings

### 🎨 **Display Options**

- **Show Unequipped Items**: Display all equipment vs. only equipped items
- **Show All Spells**: Show all known spells with preparation indicators vs. only memorized
- **Show Equipped Weapons Only**: Filter to display only equipped/held weapons
- **Show Attributes**: Toggle attribute roll actions on the HUD
- **Show Conditions**: Toggle injury and condition management sections
- **Show Currency**: Display currency (gold, silver, copper)

### 🎯 **Skill Display Options**

- **Show Weapon Skills**: Toggle weapon skills section (Brawling always shown)
- **Show Secondary Skills**: Toggle secondary skills section
- **Show Death Roll**: Automatically display death roll when character is dying

### 🎲 **Table Configuration**

- **Fear Effect Table UUID**: Specify UUID for custom Fear effect roll tables (e.g., RollTable.wHTr9HuHkpVv7ccX)
- **Severe Injury Table UUID**: Specify UUID for custom Severe Injury roll tables (e.g., RollTable.4wZ2sIWqV3tw8eKL)
- **Homebrew Tables**: Allows for custom/homebrew tables via UUID
- **Note**: _Leave UUID settings blank to use automatic detection by table name (supports English and Swedish)_

### 🎨 Visual Customization

#### Advanced Options
- **Show HUD Above Other Windows**: Optional setting to force Token Action HUD above journals and character sheets

#### Button Styling
- **Button Background Color**: Choose any hex color for button backgrounds (default: Dragonbane green #00604d)
- **Button Background Opacity**: Adjust transparency from 0-100% (default: 75%)
- **Live Preview**: Changes appear instantly as you adjust settings

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

### **Foundry Compatibility**

- **Foundry VTT**: v13.345+ **required** for full v2.1.0 features (v12.331+ for basic functionality)
- **Optimized for**: Foundry VTT v13+ with enhanced condition categorization and module integration

### **System Compatibility**

- **[Dragonbane System](https://foundryvtt.com/packages/dragonbane) v2.0+** - Official Free League system

### **Required Modules**

- **[Token Action HUD Core](https://foundryvtt.com/packages/token-action-hud-core) v2.0.0+** - Essential for functionality

### **Optional Modules for Enhanced Experience**

- **[Dragonbane Status Effects](https://foundryvtt.com/packages/dragonbane-status-effects)**: **NEW v2.1.0** - Unlocks categorized condition display and enhanced status effect management (Foundry v13+ required)

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history and feature updates.

### Recent Major Changes:

- **v2.3.1**: Added customizable button styling and z-index override settings
- **v2.3.0**: Currency display system, enhanced Severe Injury with CON value, Fear Test refinements
- **v2.2.0**: Severe Injury enhancements and addition of Fear test
- **v2.1.0**: Categorized condition system with Dragonbane Status Effects integration (v13+ required)
- **v2.0.4**: Fixed ability action errors with improved rollItem() method
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
