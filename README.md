# Token Action HUD Dragonbane

![Foundry Version](https://img.shields.io/badge/foundry-v14-green) ![GitHub release](https://img.shields.io/github/v/release/kergalli/token-action-hud-dragonbane) ![Token Action HUD Core](https://img.shields.io/badge/TAH%20Core-v2.1.1%2B-blue)

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

- **Dragonbane Status Effects Integration**: Full compatibility with DSE module
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

- **Rest Dialog Support**: Stretch Rest and Shift Rest open the system's rest dialog, matching character sheet behaviour
  - Stretch Rest dialog allows adjusting HP dice, WP dice, and conditions to recover
  - Both dialogs support the **Interrupt** option to spend the rest without recovering
  - Fully respects the system's **Rest Dialogs** setting and Shift/Ctrl modifier to skip
- **Rest Availability Tracking**: Visual indicators for available rest types
- **Complete Rest Options**: Round Rest, Stretch Rest, Shift Rest, Pass One Shift
- **Usage Prevention**: Disabled styling and messages for already-used rests

### 🎨 **Enhanced Customization**

- **Custom Button Styling**: Configurable colors, opacity, borders
- **Z-Index Control**: Force HUD above other Foundry windows
- **Live Updates**: Immediate application of styling changes
- **Per-Client Settings**: Individual user customization

### 🤖 **YZE Combat Integration**

- **Smart Action Detection**: Seamless integration with Dragonbane Combat Assistant
- **Automatic Exclusions**: Utility rolls correctly excluded from action counting
  - **Fear Tests**: WIL rolls and Fear Effect table rolls
  - **Light Tests**: Light source duration tests
  - **Death Rolls**: Survival tests with proper tracking
  - **Severe Injury Tests**: CON survival tests
- **Extensible API**: Other modules can utilize ignore flag system

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
| **[Token Action HUD Core](https://foundryvtt.com/packages/token-action-hud-core)** | v2.1.1+ | Essential framework |
| **[Dragonbane System](https://foundryvtt.com/packages/dragonbane)**                | v4.x+   | Official system     |

### **Recommended Integrations**

| Module                                                                                     | Integration | Benefits                                     |
| ------------------------------------------------------------------------------------------ | ----------- | -------------------------------------------- |
| **[Dragonbane Combat Assistant](https://foundryvtt.com/packages/dragonbane-action-rules)** | Automatic   | Enhanced action rules, smart action counting |
| **[YZE Combat](https://foundryvtt.com/packages/yze-combat)**                               | Automatic   | Single action tracking system                |
| **[Dragonbane Status Effects](https://foundryvtt.com/packages/dragonbane-status-effects)** | Automatic   | Enhanced condition categorization            |

### **🆕 Automatic Action Exclusions**

When using **Dragonbane Combat Assistant v2.2.3+**, these utility rolls are **automatically excluded** from action counting:

- ✅ **Fear Tests** - WIL resistance and Fear Effect table rolls
- ✅ **Light Tests** - Light source duration tests
- ✅ **Death Rolls** - CON survival tests (with proper tracking)
- ✅ **Severe Injury Tests** - CON survival tests

### **Foundry Compatibility**

- **Foundry VTT**: v14 only (v14.364+ verified)
- **Dragonbane System**: v4.x only (v4.0.1 verified)
- **Note**: For Foundry v13 / Dragonbane v3.x, use module version **2.5.0** — the last release supporting that line.

---

## 📝 **Recent Updates**

### **v2.6.0 - Foundry v14 / Dragonbane v4 Compatibility** ⭐

- **Clean cut to Foundry v14**: Now v14-only (`14.364` verified). For v13 / Dragonbane v3.x, stay on v2.5.0.
- **Dragonbane v4.0.1**: Requires the v4.x system; verified against `4.0.1`.
- **Token Action HUD Core 2.1.1**: Required Core module version bumped accordingly.
- **Attribute & Death rolls**: Updated the HUD's calls into the character sheet to match Dragonbane v4.0.1's new ApplicationV2 `(event, target)` handler signature, restoring boons/banes dialogs and death-roll tracking from the HUD.
- **Chat buttons**: Hardened the chat-message render hook for Foundry v14's native-element form, keeping Fear Effect and Severe Injury roll buttons working.

### **Previous Major Updates**

- **v2.5.0**: Rest dialog support from the HUD (Stretch/Shift with Interrupt), monster attack name resolution matching the system's v3.1.0 priority order; verified against Dragonbane v3.1.5
- **v2.4.1**: Auto exclusion of certain test for YZE Engine action tracking, preserved dialogs, ignore flag system, more integration with Dragonbane Combat Assistant
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
  true,
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
- **LuckyFrico** - Italian language localization
- **Free League Publishing** - Excellent Dragonbane RPG system
- **Token Action HUD Core team** - Foundational framework
- **Foundry VTT community** - Feedback and support

### **Attribution**

- **Icons**: Some icons from [game-icons.net](https://game-icons.net) by delapouite, lorc, and skoll
- **License**: [Creative Commons 3.0 BY](https://creativecommons.org/licenses/by/3.0/)

### **Support & Documentation**

- **Issues**: [GitHub Issues](https://github.com/kergalli/token-action-hud-dragonbane/issues)
- **Documentation**: [Complete Changelog](CHANGELOG.md)
- **Community**: Dragonbane Community Discord channel

---

## ⚖️ **License & Disclaimer**

MIT License.

This VTT module is not affiliated with, sponsored, or endorsed by Fria Ligan AB. This Supplement was created under Fria Ligan AB’s [Dragonbane Third Party Supplement License](https://freeleaguepublishing.com/wp-content/uploads/2023/11/Dragonbane-License-Agreement.pdf).

![A Supplement For Dragonbane](https://raw.githubusercontent.com/Kergalli/dragonbane_macros/refs/heads/main/dragonbane-license-logo-red.png)
