# DW Invitational 2026 — Project Handoff

Context document for Claude. Read this first before touching anything.

## What this is

A live scoring dashboard for the DW Invitational golf tournament
played at Reunion Resort (Orlando area) **Nov 4-8, 2026**. 15 players
split into 5 teams of 3. Three rounds of competition. Private group
of friends; the organizer (not Ben) sets the format and sends scoring
sheets.

- **Live site:** https://dw-invitational-2026.netlify.app
- **GitHub:** https://github.com/benyoung14/dw-invitational
- **Supabase project ref:** `bmhoynvqpvgxlxvowtil`

## Stack

- **Frontend:** React + Vite, single-file app in `src/golf_trip_dashboard.jsx`
  (~2,900 lines). Tailwind for styling, lucide-react icons.
- **Backend / persistence:** Supabase (`app_state` table, singleton JSONB
  row with `{players, teams, groups, scores}`). Realtime subscription
  pushes updates to all open browsers.
- **Deploy:** Netlify. GitHub integration enabled, so `git push` on
  main triggers an auto-build + deploy (~1 min).
- **Dev auth:** `.env.local` holds Supabase URL + anon key (not in git).

## Key files

- `src/golf_trip_dashboard.jsx` — the entire app
- `src/supabase.js` — Supabase client init
- `supabase-setup.sql` — one-time schema setup (table + RLS policies)
- `netlify.toml` — build config, SPA redirect
- `.env.local` — Supabase creds (local only, not pushed)

## User (Ben) context

- Not a professional engineer. Walks through things step-by-step.
- Says "live site" when he means Netlify production; "spreadsheet"
  when he means the organizer's Excel file.
- Prefers batched deploys to save Netlify build credits (300/month).
- Works from a Mac Mini at home + a laptop on the road. Both clone
  the repo from GitHub; data syncs via Supabase.

## Tournament format (CRITICAL — this is custom, not standard)

### Teams
- **5 teams of 3 players.** Rosters fixed by the organizer and
  locked in the UI.
- `t1`: Barta/Wydom/DW · `t2`: Tommy/Kimbo/Spencer ·
  `t3`: Ben/Conrad/Shawn · `t4`: Ian/Nick/Henry ·
  `t5`: Chad/Tom/Warenda
- Team names are user-editable on the Teams tab (Team 4 was renamed
  to "Wydom's Woodies", Team 2 to "Skull it and Pray", etc.)

### Rounds
- **R1 Thursday Nov 5 — Tom Watson Course — Team Best Ball (2 Net)**
- **R2 Friday Nov 6 — Arnold Palmer Course — Team Best Ball (2 Net)**
- **R3 Saturday Nov 7 — Jack Nicklaus Course — Singles Net Stroke**

### Team scoring (what wins the tournament)
- R1 & R2: team's score = sum of the **2 lowest net scores per hole**
  across the 3 team members. Rank teams 1-5 → **20 / 15 / 10 / 5 / 0 pts**.
- R3: rank all 15 players by net stroke; award **15, 14, 13 … 1 pts** to
  each player's team based on where they finish.
- Highest 3-round total wins.

### Individual award — "Mankles"
- **Trophy:** a silver apple-shaped kitchen timer (physical object).
  Reflected in the dashboard as a custom SVG `<AppleTimer />` component,
  shown on the leaderboard leader and in the scrolling ticker at the
  top of the page.
- Each round: `handicap + Stableford points earned that round`.
- Stableford values (custom, NOT traditional):
  - Eagle+ (−2 or better): **8**
  - Birdie (−1): **4**
  - Par (0): **2**
  - Bogey (+1): **1**
  - Double (+2): **0**
  - Triple+ (+3 or worse): **−1**
- **Points use gross vs par**, NOT net. Handicap is added as a round-level
  bonus, not applied to each hole for the point calc.
- Sum across all 3 rounds wins the Mankles. Spencer with 9 hcp + 30 pts
  on Watson = 39 for that round.
- **Note:** the organizer's Excel spreadsheet uses TRADITIONAL Stableford
  (Eagle 5, Birdie 3, Par 2, Bogey 1, Double 0). The dashboard uses the
  Mankles values above per Ben's explicit instruction. Confirm with
  organizer before changing.

### Handicap stroke allocation
- Everyone strokes off the **field low man = Frank Barta at 8**.
  Not off their playing group's low — off the whole field's low.
- Each player's strokes = `max(0, roundedHcp − 8)`, allocated to the
  hardest-ranked holes first (hcp 1 → H). Shown on the Scorecard as
  small gold dots above each hole number, and as a "Strokes N" badge
  on each player's card header.

### Skins (side game)
- **$180 pot per round**, split evenly across however many skins are
  won. 5 skins on Watson = $36 per skin.
- Net scoring (same strokes-off-Barta allocation).
- **Full-field pool** — all 15 players compete, not per foursome.
- Lowest net on a hole wins the skin.
- **Ties = no skin on that hole. No carryovers.** (Simpler rule than
  the earlier "ties push" that got replaced.)
- A hole is only decided once all 15 players have posted a score.

### Course par (verified against GolfPass official scorecards)
- Watson: `5,4,3,4,4,4,3,5,4 / 4,4,3,4,5,3,4,5,4` (72)
- Palmer: `4,3,5,4,3,4,4,4,5 / 5,4,4,4,3,5,3,4,4` (72)
- Nicklaus: `4,4,5,4,3,5,4,3,4 / 4,3,4,4,4,5,3,4,5` (72)

The organizer's spreadsheet originally had WRONG par rows (same total,
wrong hole-by-hole arrangement). Dashboard is authoritative.

## Players + handicaps (as of DW Handicaps 2026 sheet)

| ID | Name | Hcp | Team |
|----|------|-----|------|
| p1  | Frank Barta       | 8  | t1 |
| p2  | Marc Wydom        | 16 | t1 |
| p3  | Donnie Muller     | 19 | t1 |
| p4  | Tommy Duncan      | 24 | t2 |
| p5  | Jason Kimbo       | 17 | t2 |
| p6  | Spencer Friend    | 9  | t2 |
| p7  | Ben Young         | 18 | t3 |
| p8  | Justin Conrad     | 30 | t3 |
| p9  | Shawn McMaster    | 19 | t3 |
| p10 | Ian Dempsey       | 21 | t4 |
| p11 | Nick Roy          | 21 | t4 |
| p12 | Henry Holst       | 19 | t4 |
| p13 | Chad Stone        | 23 | t5 |
| p14 | Tom Devine        | 17 | t5 |
| p15 | Mike Warenda      | 21 | t5 |

Everywhere a player name is shown, it reads `Name (hcp)` —
e.g., "Spencer Friend (9)". There's a `playerLabel(player)` helper
in the main file; use it, don't inline the format.

## Pairings (locked for R1/R2, auto for R3)

### R1 Watson — Thursday 11:00 AM start
- **11:00 AM** (threesome): Spencer / Ian / Henry
- 11:10 AM: Nick / Ben / Conrad / Shawn
- 11:20 AM: Tommy / Barta / DW / Wydom
- 11:30 AM: Chad / Tom / Warenda / Kimbo

### R2 Palmer — Friday 10:50 AM start
- **10:50 AM** (threesome): Tommy / Chad / Shawn
- 11:00 AM: Wydom / Tom / Henry / Conrad
- 11:10 AM: Barta / Warenda / Ben / Ian
- 11:20 AM: Spencer / Nick / DW / Kimbo

### R3 Nicklaus — Saturday 10:50 AM start
- **AUTO-POPULATED** from Mankles standings once all 15 players
  have fully scored R1 and R2. Lowest total tees off first.
- 10:50 AM (threesome): seeds 15, 14, 13 (bottom 3)
- 11:00 AM: seeds 12-9
- 11:10 AM: seeds 8-5
- 11:20 AM: seeds 4-1 (leaders tee off last)
- Logic lives in a `useEffect` in the `GolfTripDashboard` component.
  Skips the auto-fill if any R3 slot has been set manually, so
  overrides stick. R3 slots stay editable via dropdowns.

## Tabs (nav order)

**Primary (always visible on mobile):**
1. **Leaderboard** — team standings + Mankles. Share button + Rules modal.
2. **Schedule** — group pairings + tee times.
3. **Skins** — per-round skins game with payouts.
4. **Scorecard** — score entry (password-gated with `dw2026!`).

**Secondary (in a "More" dropdown on mobile, inline on desktop):**
5. **Players** — roster, display-only (handicaps & teams locked).
6. **Teams** — team cards with per-round breakdowns; expandable rows.
7. **Courses** — hole-by-hole scorecards per course.

Above the nav sits a **Mankles ticker** — a thin dark-green strip
scrolling the full ranking left-to-right in a loop. The leader shows
in gold with the silver apple-timer SVG. Clicking the ticker jumps
to the Leaderboard tab.

## Key UI protections

- Scorecard tab is password-gated with `dw2026!` (client-side only —
  easily bypassed with devtools; casual deterrent against bystanders
  changing scores on their phones mid-round). Unlock persists in
  `sessionStorage` for the browser tab.
- Players tab team dropdown and handicap input are read-only.
- Schedule R1/R2 player slots are read-only (locked pairings).
  R3 slots are editable dropdowns (auto-populated — see above).

## Workflow

Edits → `npm run build` (sanity check) → `git add -A && git commit` →
`git push`. Netlify auto-deploys from GitHub `main` branch in ~1 min.
Keep commit messages following the pattern of recent commits (short
subject + explanatory body + Co-Authored-By trailer).

For Supabase data changes (scores, pairings, rosters): write a
one-off `.mjs` script, run it against `.env.local`, done. Data flows
live via realtime to all open browsers; no deploy needed.

### Supabase script pattern

```javascript
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

// GET current data
const getRes = await fetch(`${url}/rest/v1/app_state?id=eq.singleton&select=data`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` }
});
const prev = (await getRes.json())[0]?.data || {};

// Mutate, then POST back preserving other fields
const payload = { ...prev, scores: {...} };
const putRes = await fetch(`${url}/rest/v1/app_state`, {
  method: 'POST',
  headers: {
    apikey: key, Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates,return=representation',
  },
  body: JSON.stringify({ id: 'singleton', data: payload, updated_at: new Date().toISOString() }),
});
```

Run with:
```bash
cd /Users/benyoung/Desktop/dw-invitational && set -a && \
  source .env.local && set +a && node /path/to/script.mjs
```

Must use `dangerouslyDisableSandbox: true` in Bash tool — the
sandbox blocks DNS resolution to supabase.co.

## Current state (as of handoff)

- All 15 players have test scores pushed for R1/R2/R3 so the
  dashboard is fully populated for testing. Scores were randomized
  with per-player per-round "moods" so there's realistic variation
  (hot days, cold days, blow-up holes, etc.).
- The R3 pairings in the live data are stale (seeded from older test
  scores). The reset script below empties them.
- Ben is reviewing UI/UX before the actual tournament.
- Oct 22 test pass: team points, Mankles and skins were recomputed
  independently and match the live site exactly.

## Pre-tournament reset (prepared, NOT yet run)

Run 1-2 days before Nov 4, only when Ben says go. All three
read `.env.local` themselves; Bash needs `dangerouslyDisableSandbox`.

```bash
npm run reset:check                          # dry run: backup + preview, writes nothing
npm run reset:go                             # backup, then clear all scores + R3 slots
npm run restore -- backups/<file>.json       # dry run of an undo
npm run restore -- backups/<file>.json --confirm
```

- Every run saves `backups/<timestamp>-<label>.json` first (gitignored —
  contains flight info; the folder syncs via iCloud Desktop).
- Reset keeps players, handicaps, teams, flight info, R1/R2 pairings and
  R3 tee times. It aborts if the live data changed mid-run, then
  re-reads to verify.
- Afterwards everyone should refresh the site once: a phone that slept
  through the realtime update still holds the old state, and if it then
  edits a score it would upload the old test scores back over the reset.

## Scoring details added Oct 22

- Mankles ties → most gross birdies-or-better across all rounds (also
  orders R3 auto-seeding). Still tied after that = arbitrary order.
- Score entry accepts 1 to triple par per hole; anything else shows red,
  struck through, and is saved as empty until corrected.

## Pending items

1. **Round summary / recap page.** Ben wants an exportable per-round
   summary with funny writeups for each player. He'll send player
   personality descriptions separately. On receipt: build a
   "Round N Recap" page or modal with highlights (biggest round,
   skins payouts, best/worst holes) plus 1-2 sentence personality-based
   descriptions.

## Things NOT to do (per Ben)

- Don't add a "pick who you are" personalization — scores are only
  entered at end of round, not during play.
- Don't add live "thru X" indicators.
- Don't add swipe navigation or auto-advance Enter key on scorecard.
- Don't add playing-partner collapse on scorecard.
- Don't add course info popovers on scorecard.
- Don't do silent destructive git actions. Confirm before anything
  that could lose work.
- Don't share Supabase anon key in chat — it's in `.env.local`.

## Attribution

Git commits end with:
```
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
```
