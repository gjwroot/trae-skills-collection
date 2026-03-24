# Novel Skill Upgrade Plan

> Generated: 2026-03-20
> Version: v1.0
> Meme Update Frequency: Monthly

---

## 1. Requirements Overview

| Item | Content |
|:---|:---|
| Name | Novel Review and Creation Skill Full Upgrade |
| Core Goal | Make novels more entertaining, twisty, meme-rich |
| User Value | Entertainment > Plot Delivery |
| Skill Core | Three-review process, Generate→Evaluate→Retry→Next Chapter |
| Meme Update | Monthly |

---

## 2. System Architecture

### 2.1 Target Directory Structure

novel-auto-writer/
├── SKILL.md
├── skill.yaml
├── novel_writer.py
├── quality_evaluator.py
├── resources/
│   ├── meme/
│   │   ├── _schema.md
│   │   ├── anime_memes.md
│   │   ├── game_memes.md
│   │   ├── internet_memes.md
│   │   ├── tv_memes.md
│   │   ├── yearly_memes.md
│   │   ├── pun_memes.md
│   │   ├── story_memes.md
│   │   ├── reader_memes.md
│   │   └── meme_usage.md
│   ├── title/
│   │   ├── _templates.md
│   │   ├── qidian_titles.md
│   │   ├── jinjiang_titles.md
│   │   ├── fanqie_titles.md
│   │   └── feilu_titles.md
│   └── trending/
│       └── 2025_2026_trends.md

---

## 3. Meme Database Design

### 3.1 Meme Schema

| Field | Type | Required | Description | Example |
|:---|:---|:---:|:---|:---|
| id | string | Yes | Unique ID | meme_001 |
| name | string | Yes | Meme name | OlaOla |
| category | enum | Yes | Main category | anime_jojo |
| subcategory | string | No | Sub category | combat |
| created | date | Yes | Creation date | 2024-01-01 |
| trending_level | enum | Yes | Heat level A/B/C/D | A |
| expire_date | date | No | Suggested expiry | 2026-12-31 |
| last_used | date | No | Last used date | 2025-03-15 |
| use_count | int | No | Usage count | 15 |
| tags | array | No | Tags | [combat, combo] |
| alternatives | array | No | Alternative memes | [MudaMuda] |
| reverse_example | string | No | Reverse usage example | When villain thinks he is losing... |
| notes | string | No | Notes | For battle scenes |

### 3.2 Category System

| Category | Description | Sub-categories |
|:---|:---|:---|
| anime_jojo | JOJO series | Combat, Stand, Famous lines |
| anime_db | Dragon Ball series | Kamehameha, Power level 5 |
| anime_attack | Attack on Titan | Commander, Rainer |
| anime_diga | Ultraman Tiga | Warrior of light |
| anime_other | Other anime | One Piece, Naruto |
| game_lol | League of Legends | Champion quotes, Esports |
| game_genshin | Genshin Impact | Character memes, Plot |
| game_other | Other games | Zelda, Honor of Kings |
| internet_trending | Internet memes | Abstract, News reversal |
| internet_pun | Pun/Wordplay | Gaoda/Dada, Rat-duck |
| tv_drama | TV Series | Famous scenes, Lines |
| tv_novel | Novel adaptations | Plot twists |

---

## 4. Heat Level System

| Level | Name | Description | Lifespan |
|:---|:---|:---|:---|
| A | Top Meme | Viral everywhere | 3-6 months |
| B | Hot Meme | Popular in circles | 6-12 months |
| C | Common Meme | Classic, still used | 1-2 years |
| D | Classic Meme | Timeless | Unlimited |

---

## 5. Progressive Loading (L1/L2/L3)

| Level | Content | Load Timing |
|:---|:---|:---|
| L1 | Classic(D) + Common(C) + Top 10 A-level | On startup |
| L2 | By category (on-demand) | During writing |
| L3 | Archived expired memes | On explicit reference |

---

## 6. Meme Lifecycle Management

### 6.1 Update Frequency
- **Monthly** (every month)

### 6.2 Update Process

```
[Monthly Scan]
     ↓
[Heat Detection] → Search trend API
     ↓
[Level Adjustment] → Auto/Manual confirmation
     ↓
[Expiry Marking] → Set expire_date or demote
     ↓
[Alternative Suggestion] → Recommend similar memes
     ↓
[Archive] → Move to archive / mark as expired
```

### 6.3 Expiry Criteria

| Condition | Description | Action |
|:---|:---|:---|
| expire_date < today | Past suggested date | Demote or archive |
| Level D + 0 uses > 1 year | Never used and expired | Archive |
| User feedback "outdated" | Feedback driven | Demote + add alternatives |
| New alternative appears | Competition driven | Add alternatives |

---

## 7. Title Library Design

### 7.1 Platforms to Research

| Platform | List Types |
|:---|:---|
| Qidian | Monthly votes, Recommend, Reward, New book |
| Jinjiang | Points, Monthly, Completed |
| Fanqie | Popular, Paid, Free |
| Feilu | Hot sales, VIP |

### 7.2 Title Templates

1. Shock style: 震惊!XXX竟然XXX
2. Twist style: 以为XXX，结果XXX
3. Suspense style: XXX的真相令人XXX
4. Hot word style: XXX才是真正的XXX
5. Meme style: XXX (meme combination)

---

## 8. Three-Review Process

### Review 1: Requirement Understanding
- Understand core user request
- Check for contradictions or ambiguity
- Confirm style and meme preferences

### Review 2: Creation Process
- Evaluate if content meets 3 elements (twist/meme/foreshadow)
- Check meme usage (not outdated, not repetitive)
- Evaluate logic and plot development
- Fail → Regenerate

### Review 3: Pre-delivery
- Final reading experience check
- Check for foreshadowing
- Confirm happy ending direction
- Fail → Modify

---

## 9. Chapter Workflow

1. [Generate] Generate draft based on chapter requirements
2. [Evaluate] Call quality_evaluator.py for review
3. [Decide] Pass/Fail
4. [Decision]
   - If pass → Save and move to next chapter
   - If fail → Regenerate (max 3 retries)
5. [Retry Limit] >3 times → Mark issue, human intervention

---

## 10. File Cleanup

| Issue | Action |
|:---|:---|
| .current_prompt.txt | Delete or incorporate into flow |
| Temp files | Unified naming standard |
| Interaction files | Only necessary state files |

---

## 11. Task Breakdown (WBS)

### Milestone 1: Research and Design
- [ ] Task 1.1: Research existing novel-auto-writer skill (2h)
- [ ] Task 1.2: Research novel platforms (3h)
- [ ] Task 1.3: Design meme database schema (2h)
- [ ] Task 1.4: Design title database schema (1h)
- [ ] Task 1.5: Create directory structure (1h)
- [ ] Task 1.6: Design meme lifecycle management (2h)

### Milestone 2: Meme Database
- [ ] Task 2.1: Collect anime memes (4h)
- [ ] Task 2.2: Collect game memes (4h)
- [ ] Task 2.3: Collect internet memes (4h)
- [ ] Task 2.4: Collect TV memes (3h)
- [ ] Task 2.5: Collect yearly memes 2024-2026 (4h)
- [ ] Task 2.6: Collect pun/wordplay memes (3h)
- [ ] Task 2.7: Collect "I have a friend" memes (2h)
- [ ] Task 2.8: Collect reader complaint memes (2h)
- [ ] Task 2.9: Organize meme usage examples (3h)
- [ ] Task 2.10: Add trending_level and expire_date (3h)

### Milestone 3: Title Database
- [ ] Task 3.1: Research Qidian titles (2h)
- [ ] Task 3.2: Research Jinjiang titles (2h)
- [ ] Task 3.3: Research Fanqie titles (2h)
- [ ] Task 3.4: Research Feilu titles (2h)
- [ ] Task 3.5: Collect classic title formats (2h)
- [ ] Task 3.6: Design title templates (2h)
- [ ] Task 3.7: Design chapter title templates (2h)

### Milestone 4: Skill Upgrade
- [ ] Task 4.1: Upgrade SKILL.md (3h)
- [ ] Task 4.2: Upgrade quality_evaluator.py (3h)
- [ ] Task 4.3: Create meme reference mechanism (3h)
- [ ] Task 4.4: Create title reference mechanism (2h)
- [ ] Task 4.5: Implement Generate→Evaluate→Retry flow (4h)
- [ ] Task 4.6: Optimize novel writing instructions (3h)
- [ ] Task 4.7: Implement outdated meme detection (3h)
- [ ] Task 4.8: Implement monthly update flow (4h)

### Milestone 5: File Cleanup
- [ ] Task 5.1: Review existing files (1h)
- [ ] Task 5.2: Handle .current_prompt.txt (1h)
- [ ] Task 5.3:制定文件命名规范 (1h)
- [ ] Task 5.4: Update skill.yaml (1h)

### Milestone 6: Testing
- [ ] Task 6.1: Write test cases (2h)
- [ ] Task 6.2: E2E testing (3h)
- [ ] Task 6.3: Fix issues (3h)
- [ ] Task 6.4: Verify three-review process (2h)

---

## 12. Meme Content Categories

| Category | Sub-category | Examples |
|:---|:---|:---|
| Anime JOJO | Combat | OlaOla, MudaMuda, DIO's resolve |
| Anime DB | Power level | Kamehameha, Power level 5, Spirit Ball |
| Anime Attack | Commander | Commander! Commander!, Rainer sit |
| Anime Diga | Light warrior | Has light,厉害 No light, also厉害 |
| Game LOL | Champion | Item builds, Esports moments |
| Game Genshin | Character | Primo-geovishap, Spiral Abyss |
| Pun | Homophone | Gaoda(achieve), Liwei fanfou |
| Abstract | Internet | What are you doing, Gege 2.5 years |
| News | Reversal | Rat identified as duck |
| TV | Drama | Famous scenes, Quote collections |
| Reader | Complaint | You said, we say what |
| Number | Code | 9527, 007, 10086, Refund |

---

## 13. Best Practices

1. Meme freshness > quantity
2. Timely updates (monthly)
3. Diversity in usage
4. Context-appropriate memes
5. Alternative suggestions for expired memes