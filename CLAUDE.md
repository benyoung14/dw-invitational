# DW Invitational

Annual golf trip dashboard for ~16 players at Reunion Resort & Golf Club
(three courses: Arnold Palmer, Tom Watson, Jack Nicklaus). Single-file React
component with a Masters/Augusta-inspired aesthetic.

## Scoring

Modified Stableford → quota points. Each player carries a rolling quota; the
leaderboard sorts by **total points minus quota**.

## Tech

- Vite + React
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- `lucide-react` for icons
- State persists to `localStorage` under key `dw-invitational-v2`

## Design

Design tokens live in the `C` object at the top of `src/golf_trip_dashboard.jsx`
(greens, gold, cream). Fonts:

- **Cormorant Garamond** — display
- **Lora** — body
- **JetBrains Mono** — numbers

Keep these consistent when adding new components.

## Working in this codebase

The dashboard is composed of named sub-components: `Leaderboard`, `Schedule`,
`CourseDetail`, `Field`, `Scorecard`, `Travel`. **Prefer surgical edits to
specific named components over broad rewrites.**
