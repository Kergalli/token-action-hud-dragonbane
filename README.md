# Token Action HUD Dragonbane
![Foundry Version](https://img.shields.io/badge/foundry-v12-green) ![GitHub release](https://img.shields.io/github/v/release/kergalli/token-action-hud-dragonbane)

Token Action HUD Dragonbane is a repositionable HUD of stats and actions. Specifically designed for the Dragonbane system by Free League.

## Features

### Core Functionality
- Easy access to rolls and information directly from the HUD. No need to open character sheet.
- The HUD is repositionable and sections can be collapsed.
- Module settings allow you to hide unequipped weapons and unmemorized spells.
- Shows relevant combat stats with health status indicators.
- Allows for attribute, weapon, skill, and spell rolls.
- Manage conditions. Attribute conditions are synced with character sheet.
- You can also perform rest and death rolls from the utility section.

### Combat Actions System (v1.2.0)
- **Enhanced Combat Group**: Restructured "Weapons" into "Combat" with two subcategories
  - **Weapons**: All weapon attacks with broken weapon detection
  - **Combat Actions**: New tactical combat options

#### New Combat Actions
- **First Aid**: Uses Healing skill, requires target within 2m (1 grid square)
- **Rally Other**: Uses Persuasion skill, requires target within 10m  
- **Rally Self**: Uses WIL attribute check, no target required
- **Dodge**: Uses Evade skill, no target required

### Enhanced Visual Indicators
- **Broken Weapons**: Display in red and prevent usage with warning messages
- **Memorized Spells**: Show sparkle icons (✨) when displaying all spells
- **Equipped Weapons**: Show crossed swords (⚔) when displaying all weapons
- **Health Status**: Color-coded HP/WP indicators (yellow for injured, red for critical)
- **Active Conditions**: Highlighted when active

### Advanced Targeting System
- **Automatic Range Validation**: Checks if targets are within required range
- **Grid-Based Distance**: Uses tactical grid squares instead of true distance
- **Smart Error Messages**: Clear feedback when targeting requirements aren't met
- **Multi-Target Support**: Validates correct number of targets for each action

### Monster & NPC Features
- **Monster Attacks**: Random and specific attacks from monster attack tables
- **Monster Defend**: Automated defense rolls for monsters
- **Traits Display**: Show NPC/Monster traits in chat (whispered to GM)

## Installation

**From Foundry Module Browser**
1. Open Foundry VTT
2. Go to **Add-on Modules**
3. Click **Install Module**
4. Search for "**Token Action HUD Dragonbane**"
5. Click **Install**

**Manual Installation**
Use this manifest URL in Foundry's Install Module dialog: `https://github.com/kergalli/token-action-hud-dragonbane/releases/latest/download/module.json`


## Required Modules
- [Token Action HUD Core](https://foundryvtt.com/packages/token-action-hud-core) is required for Token Action HUD Dragonbane to function.

## Module Settings

### Display Options
- **Hide Weapon Skills**: Hide weapon skills from the HUD (Brawling is always shown)
- **Hide Secondary Skills**: Hide secondary skills from the HUD
- **Show Only Memorized Spells**: Only show memorized spells (uncheck to show all with indicators)
- **Show Unequipped Weapons**: Show unequipped weapons in addition to equipped ones

## Compatibility

Currently supports:
- **Foundry VTT**: V12 (up through build 343)
- **Token Action HUD Core**: v1.5.7
- **Dragonbane System**: Latest version

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history and updates.

---
