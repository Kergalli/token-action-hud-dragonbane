# Token Action HUD Dragonbane

![Foundry Version](https://img.shields.io/badge/foundry-v12%20to%20v13-green) ![GitHub release](https://img.shields.io/github/v/release/kergalli/token-action-hud-dragonbane) ![Token Action HUD Core](https://img.shields.io/badge/TAH%20Core-v2.0.0%2B-blue)

**Token Action HUD Dragonbane** provides a repositionable HUD of stats and actions specifically designed for the Dragonbane RPG system by Free League Publishing.

---

## 🚀 **Installation**

### **From Foundry Module Browser (Recommended)**

1. Open Foundry VTT → **Add-on Modules** → **Install Module**
2. Search for "**Token Action HUD Dragonbane**" → **Install**

### **Manual Installation**

Use this manifest URL in Foundry's Install Module dialog:

```
https://github.com/kergalli/token-action-hud-dragonbane/releases/latest/download/module.json
```

---

## ✨ **Key Features**

### 🎯 **Core Functionality**

- **Instant Action Access**: Roll dice and use abilities directly without opening character sheets
- **Repositionable Interface**: Drag and position HUD anywhere with collapsible sections
- **Real-time Status**: Live health indicators with color-coded status (green/yellow/red)
- **Smart Filtering**: Configurable display for equipped items, memorized spells, and more
- **Contextual Actions**: Different actions based on actor type (Character/NPC/Monster)
- **Full Localization**: Complete English and Swedish support

### ⚔️ **Enhanced Combat System**

- **Combat Actions Group**: Dedicated tactical combat section
  - **First Aid**: Healing skill rolls
  - **Rally Other**: Persuasion skill rolls
  - **Rally Self**: WIL attribute checks (when at zero HP)
  - **Dodge**: Evade skill for defensive maneuvers
  - **Death Rolls**: CON attribute rolls with automatic tracking (when dying)
  - **Right-Click Rules**: Whispered rules summaries for all combat actions
- **Weapon Management**: Visual indicators for equipped (⚔) and broken weapons (red styling)
- **Smart YZE Integration**: Automatic action counting with proper utility roll exclusions

### 🧙‍♂️ **Magic & Spell System**

- **Organized by Rank**: Magic Tricks (Rank 0), Rank 1-3 spells clearly categorized
- **Preparation Indicators**: Memorized spells marked with ⚡ when showing all spells
- **Flexible Display**: Toggle between memorized-only vs. all known spells
- **Skill Integration**: Displays spell skill values with school-based calculations

### 🛡️ **Equipment & Inventory Management**

- **Visual Status Indicators**: Equipped weapons and armor clearly marked
- **Smart Filtering**: Separate options for equipped weapons vs. all equipment
- **Intelligent Torch Placement**: Torches appear in logical HUD sections based on equipped status
- **Quick Currency Access**: Gold, Silver, Copper buttons with current amounts

### 🔧 **Utility & Journey Actions**

- **Journey Actions**: Pathfinder, Make Camp, Hunt, Fish, Forage, Cook
  - **Right-Click Rules**: Whispered rules summaries for journey actions
- **Utility Tests**:
  - **Fear Test**: WIL-based resistance rolls
  - **Light Test**: Interactive light source selection with duration rules
  - **Severe Injury**: CON-based survival tests with automatic table rolling
- **Stats Display**: Click any stat for detailed chat information

### 🏥 **Health & Condition Management**

- **Dragonbane Status Effects Integration**: Full compatibility with DSE module (v13+)
  - **Categorized Conditions**: Organized into DSE-defined categories
  - **Respects DSE Settings**: Hidden categories automatically excluded
- **Active State Indicators**: Active conditions highlighted with red styling
- **Death Roll Integration**: Automatic death roll buttons when dying
- **Injury Tracking**: Current injuries displayed under Stats

### 👹 **Monster & NPC Features**

- **Monster Attack System**: Random and specific attacks from monster tables
- **Dedicated Actions**: Monster Defend and Weapon Damage actions
- **Traits Display**: GM-only whispered trait information
- **Streamlined Interface**: Appropriate actions for each actor type

### 💤 **Advanced Rest System**

- **Rest Availability Tracking**: Visual indicators for available rest types
- **Complete Rest Options**: Round Rest, Stretch Rest, Shift Rest, Pass One Shift
- **Usage Prevention**: Disabled styling and messages for already-used rests

### 🎨 **Enhanced Customization**

- **Custom Button Styling**: Configurable colors, opacity, borders
- **Z-Index Control**: Force HUD above other Foundry windows
- **Live Updates**: Immediate application of styling changes
- **Per-Client Settings**: Individual user customization

### 🤖 **YZE Combat Integration** ⭐ **NEW v2.4.1**

- **Smart Action Detection**: Seamless integration with Dragonbane Combat Assistant
- **Automatic Exclusions**: Utility rolls correctly excluded from action counting
  - **Fear Tests**: WIL rolls and Fear Effect table rolls
  - **Light Tests**: Light source duration tests
  - **Death Rolls**: Survival tests with proper tracking
  - **Severe Injury Tests**: CON survival tests
- **Extensible API**: Other modules can utilize ignore flag system
- **Preserved Dialogs**: All boons/banes dialogs maintained

---

## 📐 **HUD Layout**

The HUD organizes into collapsible, repositionable sections:

| Section           | Contents                                          | Special Features                        |
| ----------------- | ------------------------------------------------- | --------------------------------------- |
| **📊 Stats**      | HP, WP, Movement, Encumbrance, Ferocity, Injuries | Color-coded health indicators           |
| **⚔️ Combat**     | Weapons, Combat Actions, Death Rolls              | Right-click rules summaries             |
| **🧙‍♂️ Spells**     | Magic Tricks, Rank 1-3 spells                     | Preparation status indicators           |
| **👹 Monster**    | Random/Specific Attacks, Defend                   | Monster actors only                     |
| **🎯 Skills**     | Core, Weapon, Secondary skills                    | Configurable display options            |
| **⭐ Abilities**  | Character abilities, powers                       | Grouped display for multiples           |
| **🛡️ Conditions** | Status effects, attribute conditions              | Active state highlighting               |
| **🎒 Inventory**  | Armor, Helmets, Items, Currency                   | Smart equipment filtering               |
| **🔧 Utility**    | Rest, Journey, Various Tests                      | Right-click rules summaries for journys |

---

## ⚙️ **Configuration**

**Access**: Game Settings → Configure Settings → Token Action HUD Dragonbane

### **Display Options**

- **Show Unequipped Items**: Display all equipment vs. only equipped
- **Show All Spells**: All known spells (with indicators) vs. memorized only
- **Show Equipped Weapons Only**: Filter to equipped/held weapons only
- **Show Attributes**: Toggle attribute roll actions
- **Show Conditions**: Toggle injury and condition sections
- **Show Currency**: Display gold, silver, copper buttons

### **Skill Display**

- **Show Weapon Skills**: Toggle weapon skills section (Brawling always shown)
- **Show Secondary Skills**: Toggle secondary skills section
- **Show Death Roll**: Auto-display when character is dying

### **Table Configuration**

- **Fear Effect Table UUID**: Custom Fear effect table (e.g., `RollTable.wHTr9HuHkpVv7ccX`)
- **Severe Injury Table UUID**: Custom Severe Injury table (e.g., `RollTable.4wZ2sIWqV3tw8eKL`)
- **Automatic Detection**: Leave blank for name-based detection (English/Swedish)
- **Token Action HUD Only**: Custom tables work exclusively with TAH rolls

### **Visual Customization**

#### **Button Styling**

- **Background Color**: Hex color for button backgrounds (default: #00604d)
- **Background Opacity**: Transparency 0-100% (default: 75%)
- **Border Color**: Hex color for borders (default: #808080)
- **Border Size**: Thickness 0-5px (default: 1px)
- **Border Opacity**: Border transparency 0-100% (default: 80%)
- **Live Preview**: Changes apply instantly

#### **Advanced Options**

- **Show HUD Above Other Windows**: Force TAH above journals and character sheets

---

## 🔗 **Integration & Compatibility**

### **Required Dependencies**

| Module                                                                             | Version | Purpose             |
| ---------------------------------------------------------------------------------- | ------- | ------------------- |
| **[Token Action HUD Core](https://foundryvtt.com/packages/token-action-hud-core)** | v2.0.0+ | Essential framework |
| **[Dragonbane System](https://foundryvtt.com/packages/dragonbane)**                | v2.0+   | Official system     |

### **Recommended Integrations**

| Module                                                                                     | Integration | Benefits                                     |
| ------------------------------------------------------------------------------------------ | ----------- | -------------------------------------------- |
| **[Dragonbane Combat Assistant](https://foundryvtt.com/packages/dragonbane-action-rules)** | Automatic   | Enhanced action rules, smart action counting |
| **[YZE Combat](https://foundryvtt.com/packages/yze-combat)**                               | Automatic   | Single action tracking system                |
| **[Dragonbane Status Effects](https://foundryvtt.com/packages/dragonbane-status-effects)** | Automatic   | Enhanced condition categorization (v13+)     |

### **🆕 Automatic Action Exclusions (v2.4.1)**

When using **Dragonbane Combat Assistant v2.2.3+**, these utility rolls are **automatically excluded** from action counting:

- ✅ **Fear Tests** - WIL resistance and Fear Effect table rolls
- ✅ **Light Tests** - Light source duration tests
- ✅ **Death Rolls** - CON survival tests (with proper tracking)
- ✅ **Severe Injury Tests** - CON survival tests

### **Foundry Compatibility**

- **Foundry VTT**: v12.331+ (v13.345+ recommended for full features)
- **Optimized for**: v13+ with enhanced condition categorization

---

## 📝 **Recent Updates**

### **v2.4.1 - YZE Combat Integration Fixes** ⭐

- **Fixed Action Counting**: Fear Tests, Light Tests, Death Rolls, Severe Injury Tests properly excluded
- **Preserved Dialogs**: All attribute rolls maintain boons/banes selection dialogs
- **Ignore Flag System**: Extensible API for other modules to exclude custom rolls
- **Enhanced Integration**: Seamless compatibility with Dragonbane Combat Assistant

### **Previous Major Updates**

- **v2.4.0**: Rally Self visibility improvements, Death Roll enhancements, Light Test dialog upgrades
- **v2.3.3**: Right-click rules summaries, intelligent torch placement
- **v2.3.0**: Currency display system, Severe Injury enhancements, Fear Test additions
- **v2.1.0**: Dragonbane Status Effects integration, categorized conditions (v13+)
- **v2.0.0**: Complete rebuild for Foundry v13 and TAH Core 2.0+

**See [CHANGELOG.md](CHANGELOG.md) for complete version history**

---

## 🛠️ **Advanced Usage**

### **For Module Developers**

Token Action HUD Dragonbane provides an extensible ignore flag system:

```javascript
// Exclude custom rolls from action counting
await game.user.setFlag(
  "token-action-hud-dragonbane",
  "ignoreNextRollForActionCounting",
  true
);
await yourCustomRollFunction();
// Dragonbane Combat Assistant automatically respects this flag
```

### **Custom Tables**

- Use **UUID settings** for homebrew Fear Effect or Severe Injury tables
- Leave **blank for automatic detection** by table name (English/Swedish)
- Custom tables work **only with Token Action HUD rolls**, not sheet-based rolls

---

## 🌍 **Credits & Support**

### **Community Contributors**

- **xdy** - Swedish language improvements and localization fixes
- **Free League Publishing** - Excellent Dragonbane RPG system
- **Token Action HUD Core team** - Foundational framework
- **Foundry VTT community** - Feedback and support

### **Attribution**

- **Icons**: Some icons from [game-icons.net](https://game-icons.net) by delapouite, lorc, and skoll
- **License**: [Creative Commons 3.0 BY](https://creativecommons.org/licenses/by/3.0/)

### **Support & Documentation**

- **Issues**: [GitHub Issues](https://github.com/kergalli/token-action-hud-dragonbane/issues)
- **Documentation**: [Complete Changelog](CHANGELOG.md)
- **Community**: Foundry VTT Discord #dragonbane channel

---

## ⚖️ **License**

This module is provided under the MIT License. This is an unofficial, fan-created module not affiliated with Free League Publishing. Dragonbane™ is a trademark of Free League Publishing.
