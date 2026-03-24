# Meme Database Schema

## Meme Entry Format

```yaml
- id: meme_001
  name: "OlaOla"
  category: anime_jojo
  subcategory: combat
  created: "2024-01-01"
  trending_level: A
  expire_date: "2026-12-31"
  last_used: null
  use_count: 0
  tags: [combat, combo, energy]
  alternatives: [MudaMuda]
  reverse_example: "反派以为自己在疯狂输出，结果主角毫发无损"
  notes: "战斗场景专用"
```

## Field Definitions

| Field | Type | Required | Description |
|:---|:---|:---:|:---|
| id | string | Yes | Unique ID in format: meme_XXX |
| name | string | Yes | Meme display name |
| category | enum | Yes | Main category from category system |
| subcategory | string | No | Sub category for finer grouping |
| created | date | Yes | Creation date YYYY-MM-DD |
| trending_level | enum | Yes | A/B/C/D heat level |
| expire_date | date | No | Suggested expiry date |
| last_used | date | No | Last used date |
| use_count | int | No | Usage counter |
| tags | array | No | Searchable tags |
| alternatives | array | No | Alternative memes when expired |
| reverse_example | string | No | Reverse usage example |
| notes | string | No | Usage notes |

## Trending Level Definitions

| Level | Name | Lifespan | Description |
|:---:|:---|:---:|:---|
| A | Top Meme | 3-6 months | Viral everywhere, must use |
| B | Hot Meme | 6-12 months | Popular in circles |
| C | Common Meme | 1-2 years | Classic, still usable |
| D | Classic Meme | Unlimited | Timeless, evergreen |

## Category System

| Category | Sub-categories |
|:---|:---|
| anime_jojo | Combat, Stand, Famous lines |
| anime_db | Kamehameha, Power level, Spirit Ball |
| anime_attack | Commander, Rainer, Titan |
| anime_diga | Light warrior, Transformation |
| anime_other | One Piece, Naruto, Other |
| game_lol | Champion quotes, Esports, Items |
| game_genshin | Characters, Plot, Spiral Abyss |
| game_other | Zelda, Honor of Kings, Other |
| internet_trending | Abstract, News reversal, Viral |
| internet_pun | Homophone, Rat-duck, Wordplay |
| tv_drama | Famous scenes, Quote collections |
| tv_novel | Plot twists, Adaptations |

## Progressive Loading Strategy

| Level | Content | Load Timing |
|:---|:---|:---|
| L1 | Classic(D) + Common(C) + Top 10 A-level | On startup |
| L2 | By category (on-demand) | During writing |
| L3 | Archived expired memes | On explicit reference |

## Meme Lifecycle

1. **Creation**: Add with trending_level and expire_date
2. **Usage Tracking**: Update last_used and use_count
3. **Monthly Review**: Adjust trending_level based on usage
4. **Expiry**: Demote or archive when expired