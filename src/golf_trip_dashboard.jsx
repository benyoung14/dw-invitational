import { useState, useEffect, useMemo, useRef, Fragment as ReactFragment } from 'react';
const React = { Fragment: ReactFragment };
import { Trophy, Calendar, Users, ClipboardList, Flag, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import logoUrl from './assets/logo.svg';
import { supabase, TABLE, SHARED_ROW_ID } from './supabase';

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}
import heroImg from './assets/reunion-hero.jpg';
import palmerImg from './assets/reunion-palmer.jpg';
import watsonImg from './assets/reunion-watson.jpg';
import nicklausImg from './assets/reunion-nicklaus.jpg';
import courseMapImg from './assets/reunion-coursemap.jpg';

// ============================================================
// IMAGERY — Reunion Resort media kit
// ============================================================
const HERO_IMG = heroImg;
const COURSE_IMGS = {
  palmer:   palmerImg,
  watson:   watsonImg,
  nicklaus: nicklausImg,
};

// ============================================================
// PLACEHOLDER DATA — replace with your trip's real info
// ============================================================
const INITIAL_PLAYERS = [
  { id: 'p1',  name: 'Frank Barta',    handicap: 8,  team: 't1' },
  { id: 'p2',  name: 'Marc Wydom',     handicap: 16, team: 't1' },
  { id: 'p3',  name: 'Donnie Muller',  handicap: 19, team: 't1' },
  { id: 'p4',  name: 'Tommy Duncan',   handicap: 24, team: 't2' },
  { id: 'p5',  name: 'Jason Kimbo',    handicap: 17, team: 't2' },
  { id: 'p6',  name: 'Spencer Friend', handicap: 9,  team: 't2' },
  { id: 'p7',  name: 'Ben Young',      handicap: 18, team: 't3' },
  { id: 'p8',  name: 'Justin Conrad',  handicap: 30, team: 't3' },
  { id: 'p9',  name: 'Shawn McMaster', handicap: 19, team: 't3' },
  { id: 'p10', name: 'Ian Dempsey',    handicap: 21, team: 't4' },
  { id: 'p11', name: 'Nick Roy',       handicap: 21, team: 't4' },
  { id: 'p12', name: 'Henry Holst',    handicap: 19, team: 't4' },
  { id: 'p13', name: 'Chad Stone',     handicap: 23, team: 't5' },
  { id: 'p14', name: 'Tom Devine',     handicap: 17, team: 't5' },
  { id: 'p15', name: 'Mike Warenda',   handicap: 21, team: 't5' },
];

// ============================================================
// COURSE DATA — Reunion Resort & Golf Club
// (yardages from reunionresort.com/golf/courses)
// ============================================================
const COURSES = [
  {
    id: 'palmer',
    name: 'Arnold Palmer',
    subtitle: 'The Legacy',
    source: 'Reunion Resort · Gold Tees · 70.9/133',
    tees: ['Gold'],
    holes: [
      { hole: 1,  par: 4, hcp: 5,  yards: [384] },
      { hole: 2,  par: 3, hcp: 11, yards: [144] },
      { hole: 3,  par: 5, hcp: 9,  yards: [511] },
      { hole: 4,  par: 4, hcp: 15, yards: [339] },
      { hole: 5,  par: 3, hcp: 13, yards: [170] },
      { hole: 6,  par: 4, hcp: 7,  yards: [376] },
      { hole: 7,  par: 4, hcp: 17, yards: [274] },
      { hole: 8,  par: 4, hcp: 1,  yards: [438] },
      { hole: 9,  par: 5, hcp: 3,  yards: [526] },
      { hole: 10, par: 5, hcp: 6,  yards: [581] },
      { hole: 11, par: 4, hcp: 14, yards: [378] },
      { hole: 12, par: 4, hcp: 8,  yards: [377] },
      { hole: 13, par: 4, hcp: 2,  yards: [416] },
      { hole: 14, par: 3, hcp: 18, yards: [119] },
      { hole: 15, par: 5, hcp: 12, yards: [487] },
      { hole: 16, par: 3, hcp: 16, yards: [160] },
      { hole: 17, par: 4, hcp: 10, yards: [357] },
      { hole: 18, par: 4, hcp: 4,  yards: [382] },
    ],
  },
  {
    id: 'watson',
    name: 'Tom Watson',
    subtitle: 'The Independence',
    source: 'Reunion Resort · Gold/Blue Combo Tees · 71.7/131',
    tees: ['Gold/Blue'],
    holes: [
      { hole: 1,  par: 5, hcp: 5,  yards: [528], tee: 'Blue' },
      { hole: 2,  par: 4, hcp: 9,  yards: [353], tee: 'Gold' },
      { hole: 3,  par: 3, hcp: 17, yards: [152], tee: 'Gold' },
      { hole: 4,  par: 4, hcp: 1,  yards: [403], tee: 'Blue' },
      { hole: 5,  par: 4, hcp: 3,  yards: [427], tee: 'Blue' },
      { hole: 6,  par: 4, hcp: 15, yards: [340], tee: 'Gold' },
      { hole: 7,  par: 3, hcp: 11, yards: [193], tee: 'Blue' },
      { hole: 8,  par: 5, hcp: 7,  yards: [537], tee: 'Gold' },
      { hole: 9,  par: 4, hcp: 13, yards: [384], tee: 'Blue' },
      { hole: 10, par: 4, hcp: 2,  yards: [399], tee: 'Blue' },
      { hole: 11, par: 4, hcp: 10, yards: [356], tee: 'Gold' },
      { hole: 12, par: 3, hcp: 16, yards: [185], tee: 'Gold' },
      { hole: 13, par: 4, hcp: 14, yards: [358], tee: 'Gold' },
      { hole: 14, par: 5, hcp: 18, yards: [463], tee: 'Blue' },
      { hole: 15, par: 3, hcp: 12, yards: [151], tee: 'Gold' },
      { hole: 16, par: 4, hcp: 4,  yards: [376], tee: 'Blue' },
      { hole: 17, par: 5, hcp: 8,  yards: [518], tee: 'Gold' },
      { hole: 18, par: 4, hcp: 6,  yards: [383], tee: 'Blue' },
    ],
  },
  {
    id: 'nicklaus',
    name: 'Jack Nicklaus',
    subtitle: 'The Tradition',
    source: 'BlueGolf · Blue Tees',
    tees: ['Blue'],
    holes: [
      { hole: 1,  par: 4, hcp: 17, yards: [315, 303] },
      { hole: 2,  par: 4, hcp: 1,  yards: [403, 392] },
      { hole: 3,  par: 5, hcp: 5,  yards: [555, 540] },
      { hole: 4,  par: 4, hcp: 3,  yards: [371, 354] },
      { hole: 5,  par: 3, hcp: 7,  yards: [193, 178] },
      { hole: 6,  par: 5, hcp: 13, yards: [512, 501] },
      { hole: 7,  par: 4, hcp: 9,  yards: [351, 338] },
      { hole: 8,  par: 3, hcp: 15, yards: [150, 133] },
      { hole: 9,  par: 4, hcp: 11, yards: [346, 334] },
      { hole: 10, par: 4, hcp: 4,  yards: [404, 390] },
      { hole: 11, par: 3, hcp: 18, yards: [152, 137] },
      { hole: 12, par: 4, hcp: 6,  yards: [373, 358] },
      { hole: 13, par: 4, hcp: 10, yards: [396, 381] },
      { hole: 14, par: 4, hcp: 2,  yards: [391, 375] },
      { hole: 15, par: 5, hcp: 12, yards: [497, 483] },
      { hole: 16, par: 3, hcp: 8,  yards: [177, 161] },
      { hole: 17, par: 4, hcp: 14, yards: [360, 348] },
      { hole: 18, par: 5, hcp: 16, yards: [526, 420] },
    ],
  },
];

const ROUNDS = [
  { id: 'r1', day: 'Thursday', date: 'Nov 5', course: 'Tom Watson',     courseId: 'watson',   format: 'bestball2net', par: 72, tees: ['Gold', 'Blue'], label: 'Round I · Tom Watson',     pairingsLocked: true  },
  { id: 'r2', day: 'Friday',   date: 'Nov 6', course: 'Arnold Palmer',  courseId: 'palmer',   format: 'bestball2net', par: 72, tees: ['Gold'],         label: 'Round II · Arnold Palmer', pairingsLocked: true  },
  { id: 'r3', day: 'Saturday', date: 'Nov 7', course: 'Jack Nicklaus',  courseId: 'nicklaus', format: 'netstroke',    par: 72, tees: ['Blue'],         label: 'Round III · Jack Nicklaus', pairingsLocked: false },
];

// ============================================================
// COLOR + FONT TOKENS — Augusta-inspired
// ============================================================
const C = {
  green:    '#0E5E3F',
  greenDk:  '#063A26',
  greenDkr: '#031E14',
  cream:    '#F5EFE0',
  creamLt:  '#FAF6EC',
  gold:     '#C9A961',
  goldDk:   '#8E7637',
  ink:      '#1A1A14',
  rule:     '#D9CFB7',
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lora:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  .font-display { font-family: 'Cormorant Garamond', Georgia, serif; letter-spacing: 0.01em; }
  .font-body    { font-family: 'Lora', Georgia, serif; }
  .font-mono    { font-family: 'JetBrains Mono', ui-monospace, monospace; }
  .smallcaps    { font-variant: small-caps; letter-spacing: 0.18em; text-transform: lowercase; }
  .tabular      { font-variant-numeric: tabular-nums; }
`;

// ============================================================
// SCORING HELPERS
// ============================================================
const formatToPar = (n) => (n === 0 ? 'E' : n > 0 ? `+${n}` : `${n}`);

const roundTotal = (scores, playerId, roundId) => {
  const r = scores?.[roundId]?.[playerId];
  if (!r) return null;
  const total = r.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
  const filled = r.filter((b) => Number.isFinite(b)).length;
  return { total, filled };
};

// Display label with handicap: "Spencer Friend (10)".
// Falls back to just the name if no finite handicap is set.
const playerLabel = (p) => {
  if (!p) return '';
  const hcp = Math.round(p.handicap ?? NaN);
  return Number.isFinite(hcp) ? `${p.name} (${hcp})` : p.name;
};

// Return the group a player is in for a given round, or null.
const findPlayerGroup = (playerId, roundId, groups) =>
  (groups?.[roundId] || []).find((g) => (g.playerIds || []).includes(playerId)) || null;

// "Strokes off the field low man" — every player strokes off the lowest
// handicap in the whole field (not just their playing group). Returns an
// 18-length array of strokes-per-hole allocated to the hardest holes
// (hcp 1 first). The field low man gets 0.
// `groups` and `round` are accepted for signature stability but unused.
const strokesForRound = (player, round, groups, players, course) => {
  if (!course) return Array(18).fill(0);
  const fieldHcps = (players || [])
    .map((p) => Math.round(p?.handicap ?? NaN))
    .filter((h) => Number.isFinite(h));
  if (fieldHcps.length === 0) return Array(course.holes.length).fill(0);
  const low = Math.min(...fieldHcps);
  const diff = Math.max(0, Math.round(player.handicap ?? 0) - low);
  return allocateStrokes(diff, course.holes);
};

// Standard handicap-stroke allocation: a player with H strokes gets
// floor(H/18) on every hole plus one extra on each of the H mod 18
// hardest-ranked holes (holes with the lowest handicap number).
const allocateStrokes = (courseHcp, holes) => {
  const n = holes.length;
  const alloc = Array(n).fill(0);
  const h = Math.max(0, Math.floor(courseHcp));
  if (h === 0 || n === 0) return alloc;
  const base = Math.floor(h / n);
  const extra = h - base * n;
  for (let i = 0; i < n; i++) alloc[i] = base;
  const order = holes
    .map((hole, i) => ({ i, hcp: hole.hcp ?? 99 }))
    .sort((a, b) => a.hcp - b.hcp);
  for (let k = 0; k < extra; k++) alloc[order[k].i] += 1;
  return alloc;
};

// Per-hole net scores for a player (array of 18, nulls where no gross entered).
// Uses "strokes off the low man" in the player's group for the round.
const netHoleScores = (player, round, scores, course, groups, players) => {
  if (!course) return null;
  const roundScores = scores?.[round.id]?.[player.id];
  if (!roundScores) return null;
  const strokes = strokesForRound(player, round, groups, players, course);
  return course.holes.map((_, i) => (
    Number.isFinite(roundScores[i]) ? roundScores[i] - strokes[i] : null
  ));
};

// Net stroke total — group-relative strokes applied per hole.
const netForRound = (player, round, scores, course, groups, players) => {
  const rt = roundTotal(scores, player.id, round.id);
  if (!rt || rt.filled === 0) return null;
  const nets = netHoleScores(player, round, scores, course, groups, players);
  if (!nets) return null;
  const net = nets.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
  return { gross: rt.total, net, filled: rt.filled };
};

// Mankles point quota based on GROSS score vs par (no handicap strokes
// applied — handicap is added as a bonus to the round total in the
// leaderboard). Eagle+ = 8, Birdie = 4, Par = 2, Bogey = 1,
// Double = 0, Triple or worse = -1.
// `groups` and `players` are accepted for signature stability but unused.
const stablefordPoints = (player, round, scores, course, groups, players) => {
  if (!course) return null;
  const roundScores = scores?.[round.id]?.[player.id];
  if (!roundScores) return null;
  let pts = 0, filled = 0;
  roundScores.forEach((gross, i) => {
    if (!Number.isFinite(gross)) return;
    filled++;
    const diff = gross - course.holes[i].par;
    if (diff <= -2) pts += 8;
    else if (diff === -1) pts += 4;
    else if (diff === 0) pts += 2;
    else if (diff === 1) pts += 1;
    else if (diff === 2) pts += 0;
    else pts -= 1; // triple bogey or worse
  });
  return { points: pts, filled };
};

// Team best-ball net: for each hole, sum the 2 lowest net scores
// across all team members who posted that hole.
const teamBestBallNet = (team, round, players, scores, course, groups) => {
  if (!course) return null;
  const teamPlayers = players.filter((p) => p.team === team.id);
  if (teamPlayers.length === 0) return null;
  const allNets = teamPlayers.map((p) => netHoleScores(p, round, scores, course, groups, players));
  const perHole = course.holes.map((_, holeIdx) => {
    const nets = allNets.map((arr) => arr?.[holeIdx]).filter(Number.isFinite);
    if (nets.length < 2) return null;
    const sorted = [...nets].sort((a, b) => a - b);
    return sorted[0] + sorted[1];
  });
  const filled = perHole.filter(Number.isFinite).length;
  const total = perHole.reduce((a, b) => a + (b ?? 0), 0);
  return { team, perHole, total, filled, complete: filled === course.holes.length, members: teamPlayers };
};

// Points for team places 1→5 in team best-ball rounds.
const TEAM_PLACE_POINTS = [20, 15, 10, 5, 0];

// Rank teams for a best-ball round; returns { results, pointsByTeam }.
// Ties share the sum of positions evenly.
const rankTeamsBestBall = (round, teams, players, scores, course, groups) => {
  const results = teams.map((t) => teamBestBallNet(t, round, players, scores, course, groups)).filter(Boolean);
  const complete = results.filter((r) => r.complete);
  const sorted = [...complete].sort((a, b) => a.total - b.total);
  const pointsByTeam = new Map();
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1].total === sorted[i].total) j++;
    const slice = TEAM_PLACE_POINTS.slice(i, j + 1);
    const share = slice.reduce((a, b) => a + b, 0) / (j - i + 1);
    for (let k = i; k <= j; k++) pointsByTeam.set(sorted[k].team.id, share);
    i = j + 1;
  }
  return { results, sorted, pointsByTeam };
};

// Rank all players by net for a stroke round; award (N, N-1, ..., 1) points.
// Points go to the player's team.
const rankPlayersNetStroke = (round, players, scores, course, groups) => {
  const results = players.map((p) => {
    const nets = netHoleScores(p, round, scores, course, groups, players);
    if (!nets) return { p, net: null, complete: false };
    const complete = nets.every(Number.isFinite);
    const net = complete ? nets.reduce((a, b) => a + b, 0) : null;
    return { p, net, complete };
  });
  const scored = results.filter((r) => r.complete);
  const sorted = [...scored].sort((a, b) => a.net - b.net);
  const pointsByPlayer = new Map();
  const pointsByTeam = new Map();
  const n = players.length;
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1].net === sorted[i].net) j++;
    let sum = 0;
    for (let k = i; k <= j; k++) sum += Math.max(0, n - k);
    const share = sum / (j - i + 1);
    for (let k = i; k <= j; k++) {
      pointsByPlayer.set(sorted[k].p.id, share);
      const tid = sorted[k].p.team;
      if (tid) pointsByTeam.set(tid, (pointsByTeam.get(tid) || 0) + share);
    }
    i = j + 1;
  }
  return { results: scored, sorted, pointsByPlayer, pointsByTeam };
};

// Build a per-tournament summary: team totals (R1 + R2 + R3) and per-player mankles.
const computeStandings = (rounds, teams, players, scores, courseById, groups) => {
  const roundResults = rounds.map((r) => {
    const course = courseById(r.courseId);
    if (r.format === 'bestball2net') {
      return { round: r, format: r.format, ...rankTeamsBestBall(r, teams, players, scores, course, groups) };
    }
    if (r.format === 'netstroke') {
      return { round: r, format: r.format, ...rankPlayersNetStroke(r, players, scores, course, groups) };
    }
    return { round: r, format: r.format };
  });

  const teamTotals = teams.map((t) => {
    const perRound = roundResults.map((rr) => rr.pointsByTeam?.get(t.id) ?? 0);
    const total = perRound.reduce((a, b) => a + b, 0);
    return { team: t, perRound, total };
  }).sort((a, b) => b.total - a.total);

  // Mankles display: for each round the player posted scores in, the
  // round value is (handicap + Stableford points). Total sums across
  // rounds. Unplayed rounds contribute 0.
  const mankles = players.map((p) => {
    const hcp = Math.round(p.handicap ?? 0);
    let total = 0;
    let filled = 0;
    const perRound = rounds.map((r) => {
      const course = courseById(r.courseId);
      const sp = stablefordPoints(p, r, scores, course, groups, players);
      if (sp && sp.filled > 0) {
        const roundValue = hcp + sp.points;
        total += roundValue;
        filled += sp.filled;
        return { points: sp.points, roundValue, played: true };
      }
      return { points: 0, roundValue: 0, played: false };
    });
    return { player: p, perRound, total, filled };
  }).sort((a, b) => b.total - a.total);

  return { roundResults, teamTotals, mankles };
};

// ============================================================
// ROOT
// ============================================================
const INITIAL_TEAMS = [
  { id: 't1', name: 'Team 1' },
  { id: 't2', name: 'Team 2' },
  { id: 't3', name: 'Team 3' },
  { id: 't4', name: 'Team 4' },
  { id: 't5', name: 'Team 5' },
];

const INITIAL_GROUPS = {
  // Round I · Watson · Thursday 11/5 — locked pairings
  r1: [
    { id: 'g1', name: 'Group 1', teeTime: '11:00 AM', playerIds: ['p6',  'p10', 'p12', ''  ] },
    { id: 'g2', name: 'Group 2', teeTime: '11:10 AM', playerIds: ['p11', 'p7',  'p8',  'p9'] },
    { id: 'g3', name: 'Group 3', teeTime: '11:20 AM', playerIds: ['p4',  'p1',  'p3',  'p2'] },
    { id: 'g4', name: 'Group 4', teeTime: '11:30 AM', playerIds: ['p13', 'p14', 'p15', 'p5'] },
  ],
  // Round II · Palmer · Friday 11/6 — locked pairings
  r2: [
    { id: 'g1', name: 'Group 1', teeTime: '10:50 AM', playerIds: ['p4',  'p13', 'p9',  ''  ] },
    { id: 'g2', name: 'Group 2', teeTime: '11:00 AM', playerIds: ['p2',  'p14', 'p12', 'p8'] },
    { id: 'g3', name: 'Group 3', teeTime: '11:10 AM', playerIds: ['p1',  'p15', 'p7',  'p10'] },
    { id: 'g4', name: 'Group 4', teeTime: '11:20 AM', playerIds: ['p6',  'p11', 'p3',  'p5'] },
  ],
  // Round III · Nicklaus · Saturday 11/7 — pairings set after R2 based on standings
  r3: [
    { id: 'g1', name: 'Group 1', teeTime: '10:50 AM', playerIds: ['', '', ''] },
    { id: 'g2', name: 'Group 2', teeTime: '11:00 AM', playerIds: ['', '', '', ''] },
    { id: 'g3', name: 'Group 3', teeTime: '11:10 AM', playerIds: ['', '', '', ''] },
    { id: 'g4', name: 'Group 4', teeTime: '11:20 AM', playerIds: ['', '', '', ''] },
  ],
};

export default function GolfTripDashboard() {
  const [tab, setTab] = useState('leaderboard');
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [scores, setScores] = useState({}); // { roundId: { playerId: [18 hole scores] } }
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef(null);
  const lastSyncedRef = useRef(null);
  const stateRef = useRef({ players, scores, teams, groups });
  stateRef.current = { players, scores, teams, groups };

  const isPristine = () => (
    stateRef.current.players === INITIAL_PLAYERS &&
    stateRef.current.teams === INITIAL_TEAMS &&
    stateRef.current.groups === INITIAL_GROUPS &&
    Object.keys(stateRef.current.scores).length === 0
  );

  const applyState = (s) => {
    if (!s) return;
    const incoming = JSON.stringify({
      players: s.players ?? stateRef.current.players,
      scores: s.scores ?? stateRef.current.scores,
      teams: s.teams ?? stateRef.current.teams,
      groups: s.groups ?? stateRef.current.groups,
    });
    // Skip echoes that match what we already have (last-synced or in-flight save) —
    // applying them would clobber edits the user has typed since the save started.
    if (incoming === lastSyncedRef.current) return;
    if (s.players) setPlayers(s.players);
    if (s.scores) setScores(s.scores);
    if (s.teams) setTeams(s.teams);
    if (s.groups) setGroups(s.groups);
    lastSyncedRef.current = incoming;
  };

  // Load + subscribe (Supabase if configured, otherwise localStorage).
  useEffect(() => {
    let cancelled = false;
    let channel = null;

    if (supabase) {
      supabase
        .from(TABLE)
        .select('data')
        .eq('id', SHARED_ROW_ID)
        .maybeSingle()
        .then(({ data, error }) => {
          if (cancelled) return;
          if (error) console.warn('[supabase] load error', error);
          // If the user has already started editing before the fetch resolved,
          // don't clobber their work with the remote snapshot.
          if (isPristine()) applyState(data?.data);
          setLoaded(true);
        });

      channel = supabase
        .channel('app_state_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: TABLE, filter: `id=eq.${SHARED_ROW_ID}` },
          (payload) => applyState(payload.new?.data),
        )
        .subscribe();
    } else {
      try {
        const raw = localStorage.getItem('dw-invitational-v2');
        if (raw && isPristine()) applyState(JSON.parse(raw));
      } catch {}
      setLoaded(true);
    }

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  // Persist on change — debounced upsert to Supabase, or localStorage fallback.
  useEffect(() => {
    if (!loaded) return;
    const payload = { players, scores, teams, groups };
    const serialized = JSON.stringify(payload);
    // Skip if state matches the last-synced snapshot — prevents save↔echo loops.
    if (serialized === lastSyncedRef.current) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      // Mark in-flight snapshot as synced BEFORE the network call so the echo
      // for this save is recognized as our own and skipped by applyState.
      lastSyncedRef.current = serialized;
      if (supabase) {
        const { error } = await supabase
          .from(TABLE)
          .upsert({ id: SHARED_ROW_ID, data: payload, updated_at: new Date().toISOString() });
        if (error) console.warn('[supabase] save error', error);
      } else {
        try { localStorage.setItem('dw-invitational-v2', JSON.stringify(payload)); } catch {}
      }
    }, 350);

    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [players, scores, teams, groups, loaded]);

  // Auto-populate R3 pairings from the Mankles standings once R1 and R2
  // are fully scored for every player. Lowest total tees off first
  // (bottom 3 → Group 1 threesome, next 4 → Group 2, next 4 → Group 3,
  // top 4 → Group 4). Skipped if any R3 slot already has a player set
  // so manual overrides are respected.
  useEffect(() => {
    if (!loaded) return;
    const r3 = groups.r3 || [];
    if (r3.length === 0) return;
    const anyAssigned = r3.some((g) => (g.playerIds || []).some((id) => id));
    if (anyAssigned) return;
    if (players.length < 15) return;

    const fullyScored = (arr) =>
      Array.isArray(arr) && arr.length === 18 && arr.every((x) => Number.isFinite(x));
    const r1 = scores?.r1 || {};
    const r2 = scores?.r2 || {};
    const bothDone = players.every((p) => fullyScored(r1[p.id]) && fullyScored(r2[p.id]));
    if (!bothDone) return;

    const courseById = (id) => COURSES.find((c) => c.id === id);
    const { mankles } = computeStandings(ROUNDS, teams, players, scores, courseById, groups);
    const ranked = [...mankles].sort((a, b) => a.total - b.total);
    const ids = ranked.map((m) => m.player.id);

    let idx = 0;
    const newR3 = r3.map((g) => {
      const size = (g.playerIds || []).length;
      const picks = ids.slice(idx, idx + size);
      idx += size;
      const padded = [...picks];
      while (padded.length < size) padded.push('');
      return { ...g, playerIds: padded };
    });

    setGroups((prev) => ({ ...prev, r3: newR3 }));
  }, [loaded, players, scores, teams, groups]);

  return (
    <div className="min-h-screen w-full font-body relative" style={{ background: C.cream, color: C.ink }}>
      <style>{FONTS}</style>

      <Header onLogoClick={() => setTab('leaderboard')} />
      <Nav tab={tab} setTab={setTab} />

      <main className="relative max-w-[1500px] mx-auto px-6 pb-20">
        <TopoPattern opacity={0.04} />
        <div className="relative" style={{ zIndex: 1 }}>
        {tab === 'leaderboard' && <Leaderboard players={players} scores={scores} teams={teams} groups={groups} />}
        {tab === 'schedule'    && <Schedule players={players} groups={groups} setGroups={setGroups} />}
        {tab === 'roster'      && <Roster players={players} setPlayers={setPlayers} teams={teams} />}
        {tab === 'teams'       && <Teams players={players} scores={scores} teams={teams} setTeams={setTeams} groups={groups} />}
        {tab === 'skins'       && <Skins players={players} scores={scores} groups={groups} />}
        {tab === 'courses'     && <Courses />}
        {tab === 'scorecard'   && <Scorecard players={players} scores={scores} setScores={setScores} teams={teams} groups={groups} />}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ============================================================
// HEADER
// ============================================================
function Header({ onLogoClick }) {
  const isMobile = useIsMobile();
  return (
    <header className="relative w-full overflow-hidden" style={{ background: C.greenDk, color: C.cream }}>
      {/* Hero photo — full-cover on mobile, masked 70% on desktop */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${HERO_IMG})`,
          backgroundSize: isMobile ? 'cover' : '70% auto',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          opacity: isMobile ? 0.6 : 0.78,
        }}
        aria-hidden="true"
      />
      {/* horizontal fade — only on desktop where the image is constrained to 70% */}
      {!isMobile && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${C.greenDk} 0%, ${C.greenDk} 18%, rgba(6,58,38,0) 38%, rgba(6,58,38,0) 62%, ${C.greenDk} 82%, ${C.greenDk} 100%)`,
          }}
          aria-hidden="true"
        />
      )}
      {/* vertical tint — keeps text readable */}
      <div
        className="absolute inset-0"
        style={{
          background: isMobile
            ? `linear-gradient(180deg, rgba(3,30,20,0.55) 0%, rgba(6,58,38,0.75) 70%, ${C.greenDk} 100%)`
            : `linear-gradient(180deg, rgba(3,30,20,0.30) 0%, rgba(6,58,38,0.55) 60%, ${C.greenDk} 100%)`,
        }}
        aria-hidden="true"
      />
      <PalmFronds />

      <div className="relative max-w-[1500px] mx-auto px-6 pt-10 pb-10 text-center">
        <div className="flex justify-center mb-5">
          <button
            type="button"
            onClick={onLogoClick}
            aria-label="Go to leaderboard"
            className="bg-transparent border-0 p-0 cursor-pointer"
          >
            <img
              src={logoUrl}
              alt="DW Invitational"
              className="h-16 md:h-20"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </button>
        </div>
        <div className="smallcaps text-xs mb-3" style={{ color: C.gold }}>
          The Annual Invitational · November 4–8, 2026
        </div>
        <h1 className="font-display text-6xl md:text-7xl leading-none mb-4" style={{ color: C.cream }}>
          DW Invitational 2026
        </h1>
        <div className="flex items-center justify-center gap-3 text-sm smallcaps" style={{ color: C.gold }}>
          <span className="h-px w-10" style={{ background: C.gold }} />
          <span>Reunion Resort · Three Courses · Three Rounds</span>
          <span className="h-px w-10" style={{ background: C.gold }} />
        </div>
      </div>
      <div className="relative h-1" style={{ background: `linear-gradient(90deg, ${C.greenDk}, ${C.gold} 50%, ${C.greenDk})` }} />
    </header>
  );
}

// ============================================================
// DECORATIVE SVGs
// ============================================================
function PalmFronds() {
  return (
    <>
      <svg
        viewBox="0 0 200 200"
        className="absolute -top-6 -left-8 w-40 h-40 md:-top-10 md:-left-12 md:w-72 md:h-72 opacity-20 pointer-events-none"
        aria-hidden="true"
        style={{ color: C.gold }}
      >
        <PalmFrondPath />
      </svg>
      <svg
        viewBox="0 0 200 200"
        className="absolute -top-6 -right-10 w-44 h-44 md:-top-12 md:-right-16 md:w-80 md:h-80 opacity-20 pointer-events-none"
        aria-hidden="true"
        style={{ color: C.gold, transform: 'scaleX(-1)' }}
      >
        <PalmFrondPath />
      </svg>
    </>
  );
}

function PalmFrondPath() {
  // Stylized palm frond — single curving spine with feathered leaflets
  return (
    <g fill="currentColor">
      <path d="M20,180 Q60,120 110,80 Q150,50 180,30" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" />
      {[0.15, 0.28, 0.4, 0.52, 0.62, 0.72, 0.82, 0.9].map((t, i) => {
        const x = 20 + (180 - 20) * t;
        const y = 180 - (180 - 30) * Math.pow(t, 0.7);
        const len = 30 + i * 4;
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${-50 - t * 30})`}>
            <ellipse cx={len / 2} cy={0} rx={len / 2} ry={3.5} opacity="0.7" />
          </g>
        );
      })}
    </g>
  );
}

function TopoPattern({ opacity = 0.05 }) {
  // Topographic-style background pattern
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      style={{ opacity, zIndex: 0 }}
    >
      <defs>
        <pattern id="topo" x="0" y="0" width="180" height="180" patternUnits="userSpaceOnUse">
          <path d="M0,90 Q45,60 90,90 T180,90" fill="none" stroke={C.greenDk} strokeWidth="1" />
          <path d="M0,60 Q45,30 90,60 T180,60" fill="none" stroke={C.greenDk} strokeWidth="1" />
          <path d="M0,120 Q45,90 90,120 T180,120" fill="none" stroke={C.greenDk} strokeWidth="1" />
          <path d="M0,150 Q45,120 90,150 T180,150" fill="none" stroke={C.greenDk} strokeWidth="1" />
          <path d="M0,30 Q45,0 90,30 T180,30" fill="none" stroke={C.greenDk} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#topo)" />
    </svg>
  );
}

function GoldSeal({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="none" stroke={C.gold} strokeWidth="1" />
      <circle cx="32" cy="32" r="26" fill="none" stroke={C.gold} strokeWidth="0.5" strokeDasharray="2 2" />
      <g transform="translate(32 32)">
        {Array.from({ length: 16 }).map((_, i) => (
          <line
            key={i}
            x1="0" y1="-22"
            x2="0" y2="-26"
            stroke={C.gold}
            strokeWidth="1"
            transform={`rotate(${(360 / 16) * i})`}
          />
        ))}
      </g>
      <text
        x="32" y="36"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, serif"
        fontSize="18"
        fontWeight="600"
        fill={C.gold}
      >
        DW
      </text>
    </svg>
  );
}

// ============================================================
// NAV
// ============================================================
function Nav({ tab, setTab }) {
  const items = [
    { id: 'leaderboard', label: 'Leaderboard', short: 'Board',    Icon: Trophy },
    { id: 'schedule',    label: 'Schedule',    short: 'Schedule', Icon: Calendar },
    { id: 'roster',      label: 'Players',     short: 'Players',  Icon: Users },
    { id: 'teams',       label: 'Teams',       short: 'Teams',    Icon: Shield },
    { id: 'skins',       label: 'Skins',       short: 'Skins',    Icon: Flag },
    { id: 'courses',     label: 'Courses',     short: 'Courses',  Icon: Flag },
    { id: 'scorecard',   label: 'Scorecard',   short: 'Score',    Icon: ClipboardList },
  ];
  return (
    <nav className="border-b" style={{ background: C.creamLt, borderColor: C.rule }}>
      <div className="max-w-6xl mx-auto px-2 md:px-4 flex items-center justify-between md:justify-center gap-0 md:gap-6">
        {items.map(({ id, label, short, Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="relative flex-1 md:flex-initial px-1 md:px-4 py-3 md:py-4 smallcaps flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 transition-colors text-[10px] md:text-xs"
              style={{ color: active ? C.greenDk : '#6b6555' }}
            >
              <Icon size={16} strokeWidth={1.5} />
              <span className="leading-none md:hidden">{short}</span>
              <span className="leading-none hidden md:inline">{label}</span>
              {active && (
                <span className="absolute left-1 right-1 md:left-2 md:right-2 -bottom-px h-0.5" style={{ background: C.gold }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ============================================================
// LEADERBOARD
// ============================================================
function Leaderboard({ players, scores, teams, groups }) {
  const teamName = (id) => (teams || []).find((t) => t.id === id)?.name || '';
  const courseById = (id) => COURSES.find((c) => c.id === id);

  const { teamTotals, mankles, roundResults } = useMemo(
    () => computeStandings(ROUNDS, teams, players, scores, courseById, groups),
    [players, scores, teams, groups]
  );

  const anyScores = teamTotals.some((t) => t.total > 0) || mankles.some((m) => m.filled > 0);
  const fmtPts = (n) => (n === 0 ? '—' : (Math.round(n * 10) / 10).toString());

  return (
    <section className="mt-10">
      <div className="flex justify-center mb-2">
        <GoldSeal size={56} />
      </div>
      <SectionTitle eyebrow="Live Standings" title="The Leaderboard" />

      {!anyScores && (
        <div className="mb-6 p-4 text-sm rounded" style={{ background: C.creamLt, border: `1px solid ${C.rule}` }}>
          No scores entered yet. Head to <span className="smallcaps">Scorecard</span> to begin posting rounds.
        </div>
      )}

      {/* TEAM STANDINGS */}
      <div className="mb-3 smallcaps text-[11px]" style={{ color: C.goldDk }}>Team Standings</div>
      <div className="rounded mb-8" style={{ border: `1px solid ${C.rule}`, background: 'white' }}>
        <table className="w-full text-sm tabular table-fixed md:table-auto">
          <thead>
            <tr className="text-left" style={{ background: C.greenDk, color: C.cream }}>
              <th className="py-3 px-1 md:px-3 smallcaps text-[11px] w-9 md:w-12 text-center md:text-left">Pos</th>
              <th className="py-3 px-1 md:px-3 smallcaps text-[11px]">Team</th>
              {ROUNDS.map((r, i) => (
                <th key={r.id} className="py-3 px-1 md:px-2 smallcaps text-[11px] text-right w-10 md:w-auto">
                  R{i + 1}
                </th>
              ))}
              <th className="py-3 px-1 md:px-3 smallcaps text-[11px] text-right w-12 md:w-auto" style={{ color: C.gold }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {teamTotals.map((row, i) => {
              const members = players.filter((p) => p.team === row.team.id).map(playerLabel).join(', ');
              const leader = i === 0 && row.total > 0;
              return (
                <tr key={row.team.id} className="border-t" style={{ borderColor: C.rule, background: leader ? '#FBF5DF' : 'transparent' }}>
                  <td className="py-3 px-1 md:px-3 font-display text-base md:text-lg text-center md:text-left" style={{ color: leader ? C.goldDk : C.ink }}>
                    {row.total > 0 ? i + 1 : '—'}
                  </td>
                  <td className="py-3 px-1 md:px-3 font-display text-base md:text-lg">
                    <div className="leading-tight truncate">
                      {row.team.name}
                      {leader && <Trophy size={14} className="inline ml-2" style={{ color: C.gold }} />}
                    </div>
                    <div className="text-[10px] smallcaps font-body truncate" style={{ color: '#6b6555' }}>
                      {members || '—'}
                    </div>
                  </td>
                  {row.perRound.map((pts, idx) => (
                    <td key={idx} className="py-3 px-1 md:px-2 text-right align-middle text-xs md:text-sm font-mono" style={{ color: pts > 0 ? C.ink : '#bfb89e' }}>
                      {fmtPts(pts)}
                    </td>
                  ))}
                  <td className="py-3 px-1 md:px-3 text-right font-display text-base md:text-lg" style={{ color: row.total > 0 ? C.greenDk : '#bfb89e' }}>
                    {row.total > 0 ? fmtPts(row.total) : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* INDIVIDUAL MANKLES */}
      <div className="mb-3 smallcaps text-[11px]" style={{ color: C.goldDk }}>Individual Mankles · Handicap + Points per Round</div>
      <div className="rounded mb-6" style={{ border: `1px solid ${C.rule}`, background: 'white' }}>
        <table className="w-full text-sm tabular table-fixed md:table-auto">
          <thead>
            <tr className="text-left" style={{ background: C.greenDk, color: C.cream }}>
              <th className="py-3 px-1 md:px-3 smallcaps text-[11px] w-9 md:w-12 text-center md:text-left">Pos</th>
              <th className="py-3 px-1 md:px-3 smallcaps text-[11px]">Player</th>
              <th className="hidden md:table-cell py-3 px-2 smallcaps text-[11px] text-right">HCP</th>
              {ROUNDS.map((r, idx) => (
                <th key={r.id} className="py-3 px-1 md:px-2 smallcaps text-[11px] text-right w-10 md:w-auto">R{idx + 1}</th>
              ))}
              <th className="py-3 px-1 md:px-3 smallcaps text-[11px] text-right w-14 md:w-auto" style={{ color: C.gold }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {mankles.map((row, i) => {
              const leader = i === 0 && row.total > 0;
              return (
                <tr key={row.player.id} className="border-t" style={{ borderColor: C.rule, background: leader ? '#FBF5DF' : 'transparent' }}>
                  <td className="py-3 px-1 md:px-3 font-display text-base md:text-lg text-center md:text-left" style={{ color: leader ? C.goldDk : C.ink }}>
                    {row.total > 0 ? i + 1 : '—'}
                  </td>
                  <td className="py-3 px-1 md:px-3 font-display text-base md:text-lg">
                    <div className="leading-tight truncate">
                      {playerLabel(row.player)}
                      {leader && <Trophy size={14} className="inline ml-2" style={{ color: C.gold }} />}
                    </div>
                    <div className="md:hidden text-[10px] smallcaps font-body" style={{ color: '#6b6555' }}>
                      {teamName(row.player.team) || '—'}
                    </div>
                  </td>
                  <td className="hidden md:table-cell py-3 px-2 text-right text-xs" style={{ color: '#6b6555' }}>{row.player.handicap}</td>
                  {row.perRound.map((rd, idx) => (
                    <td key={idx} className="py-3 px-1 md:px-2 text-right align-middle text-xs md:text-sm font-mono" style={{ color: rd.played ? C.ink : '#bfb89e' }}>
                      {rd.played ? rd.roundValue : '—'}
                    </td>
                  ))}
                  <td className="py-3 px-1 md:px-3 text-right font-display text-base md:text-lg font-mono" style={{ color: row.total > 0 ? C.greenDk : '#bfb89e' }}>
                    {row.total > 0 ? row.total : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs italic" style={{ color: '#6b6555' }}>
        R1 & R2 are team best-ball (2 lowest net per hole) · Teams rank 1–5 → 20/15/10/5/0 pts.
        R3 is singles net stroke · Each player's net rank → 15, 14… 1 pt to their team.
        Mankles each round = handicap + Stableford points earned
        (Eagle 8 · Birdie 4 · Par 2 · Bogey 1 · Double 0 · Triple+ −1).
      </p>
    </section>
  );
}

// ============================================================
// SCHEDULE
// ============================================================
function Schedule({ players, groups, setGroups }) {
  const updateGroupTime = (roundId, groupId, value) => {
    setGroups((prev) => ({
      ...prev,
      [roundId]: (prev[roundId] || []).map((g) =>
        g.id === groupId ? { ...g, teeTime: value } : g
      ),
    }));
  };
  const updateGroupSlot = (roundId, groupId, slotIdx, playerId) => {
    setGroups((prev) => ({
      ...prev,
      [roundId]: (prev[roundId] || []).map((g) => {
        if (g.id !== groupId) return g;
        const next = [...g.playerIds];
        next[slotIdx] = playerId;
        return { ...g, playerIds: next };
      }),
    }));
  };

  const formatPill = (f) => {
    const map = {
      stroke:        { label: 'Stroke Play',             bg: C.greenDk, fg: C.cream },
      stableford:    { label: 'Stableford',              bg: C.gold,    fg: C.greenDkr },
      matchplay:     { label: 'Team Match Play',         bg: C.greenDkr, fg: C.gold },
      bestball2net:  { label: 'Team Best Ball · 2 Net',  bg: C.greenDk, fg: C.gold },
      netstroke:     { label: 'Singles · Net Stroke',    bg: C.gold,    fg: C.greenDkr },
    };
    return map[f] || { label: f, bg: '#999', fg: 'white' };
  };

  return (
    <section className="mt-10">
      <SectionTitle eyebrow="Order of Play" title="The Schedule" />
      <div className="grid md:grid-cols-3 gap-5">
        {ROUNDS.map((r, i) => {
          const pill = formatPill(r.format);
          const img = COURSE_IMGS[r.courseId];
          return (
            <article key={r.id} className="rounded relative overflow-hidden" style={{ background: 'white', border: `1px solid ${C.rule}` }}>
              <div className="relative h-40 overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, rgba(6,58,38,0.15) 0%, rgba(6,58,38,0.85) 100%)`,
                  }}
                />
                <div className="absolute top-3 left-3 smallcaps text-[10px] px-2 py-1 rounded" style={{ background: C.gold, color: C.greenDkr }}>
                  Round {i + 1}
                </div>
                <div className="absolute bottom-3 right-3 smallcaps text-[10px]" style={{ color: C.cream }}>
                  {r.day} · {r.date}
                </div>
              </div>
              <div className="absolute left-0 right-0 h-1" style={{ background: C.gold, top: '10rem' }} />
              <div className="p-6">
                <h3 className="font-display text-2xl mb-1" style={{ color: C.greenDkr }}>{r.course}</h3>
                <div className="text-sm italic mb-3" style={{ color: '#6b6555' }}>Par {r.par}</div>
                {r.tees && r.tees.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="smallcaps text-[10px]" style={{ color: C.goldDk }}>Tees</span>
                    <div className="flex items-center gap-1.5">
                      {r.tees.map((t) => {
                        const swatch = t === 'Gold' ? '#C9A24A' : t === 'Blue' ? '#1e4f9c' : '#999';
                        return (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] smallcaps"
                            style={{ background: 'white', border: `1px solid ${C.rule}`, color: C.ink }}
                          >
                            <span
                              className="inline-block rounded-full"
                              style={{ width: 8, height: 8, background: swatch, border: '1px solid rgba(0,0,0,0.1)' }}
                              aria-hidden="true"
                            />
                            {t}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="smallcaps text-[10px] mb-2" style={{ color: C.goldDk }}>Groups & Tee Times</div>
                {r.id === 'r3' && !r.pairingsLocked && (
                  <div className="text-[11px] italic mb-3 p-2 rounded" style={{ background: C.creamLt, border: `1px dashed ${C.rule}`, color: '#6b6555' }}>
                    Auto-pairs from Mankles standings once R1 &amp; R2 are fully scored —
                    bottom 3 tee off first, top 4 last. Edit any slot to override.
                  </div>
                )}
                <div className="space-y-4">
                  {(() => {
                    const roundGroups = groups[r.id] || [];
                    const taken = new Set();
                    roundGroups.forEach((gg) => gg.playerIds.forEach((pid) => { if (pid) taken.add(pid); }));
                    return roundGroups.map((g) => (
                      <div key={g.id} className="rounded p-3" style={{ background: C.creamLt, border: `1px solid ${C.rule}` }}>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-display text-base flex-1 min-w-0" style={{ color: C.greenDkr }}>
                            {g.name}
                          </span>
                          <div className="font-mono text-sm shrink-0" style={{ color: C.greenDk }}>
                            {g.teeTime || '—'}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-1.5">
                          {g.playerIds.map((pid, slotIdx) => {
                            const assignedPlayer = players.find((p) => p.id === pid);
                            const assignedName = assignedPlayer ? playerLabel(assignedPlayer) : '';
                            if (r.pairingsLocked) {
                              if (!pid) return null;
                              return (
                                <div
                                  key={slotIdx}
                                  className="text-sm w-full bg-white rounded px-2 py-1.5"
                                  style={{ border: `1px solid ${C.rule}`, color: C.ink }}
                                >
                                  {assignedName || '—'}
                                </div>
                              );
                            }
                            return (
                              <select
                                key={slotIdx}
                                value={pid}
                                onChange={(e) => updateGroupSlot(r.id, g.id, slotIdx, e.target.value)}
                                className="text-sm w-full bg-white outline-none rounded px-2 py-1.5"
                                style={{ border: `1px solid ${C.rule}`, color: pid ? C.ink : '#bfb89e' }}
                              >
                                <option value="">— Player {slotIdx + 1} —</option>
                                {players
                                  .filter((p) => p.id === pid || !taken.has(p.id))
                                  .map((p) => (
                                    <option key={p.id} value={p.id}>{playerLabel(p)}</option>
                                  ))}
                              </select>
                            );
                          })}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================
// ROSTER (editable, spreadsheet-style)
// ============================================================
function Roster({ players, setPlayers, teams }) {
  return (
    <section className="mt-10">
      <SectionTitle eyebrow="Sixteen Competitors" title="Players" />

      {/* MOBILE: card list */}
      <div className="md:hidden space-y-3">
        {players.map((p, i) => (
          <RosterCardMobile key={p.id} index={i} player={p} setPlayers={setPlayers} teams={teams} />
        ))}
      </div>

      {/* DESKTOP: spreadsheet table */}
      <div className="hidden md:block overflow-x-auto rounded" style={{ border: `1px solid ${C.rule}`, background: 'white' }}>
        <table className="text-sm" style={{ width: '100%', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: 36 }} />
            <col style={{ width: 145 }} />
            <col style={{ width: 70 }} />
            <col style={{ width: 95 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 130 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 130 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 130 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 60 }} />
            <col style={{ width: 90 }} />
          </colgroup>
          <thead>
            <tr style={{ background: C.greenDk, color: C.cream }}>
              <th className="py-3 px-2 smallcaps text-[11px] text-left">#</th>
              <th className="py-3 px-2 smallcaps text-[11px] text-left">Name</th>
              <th className="py-3 px-2 smallcaps text-[11px] text-right">HCP</th>
              <th className="py-3 px-2 smallcaps text-[11px] text-left">Team</th>
              <th className="py-3 px-2 smallcaps text-[11px] text-left">Dep. City</th>
              <th className="py-3 px-2 smallcaps text-[11px] text-left">Dep. Time</th>
              <th className="py-3 px-2 smallcaps text-[11px] text-left">Airline</th>
              <th className="py-3 px-2 smallcaps text-[11px] text-left">Arrival</th>
              <th className="py-3 px-2 smallcaps text-[11px] text-left">Arr. Date</th>
              <th className="py-3 px-2 smallcaps text-[11px] text-left">Departure</th>
              <th className="py-3 px-2 smallcaps text-[11px] text-left">Dep. Date</th>
              <th className="py-3 px-2 smallcaps text-[11px] text-center">Rental</th>
              <th className="py-3 px-2 smallcaps text-[11px] text-right" style={{ color: C.gold }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, i) => (
              <RosterRow key={p.id} index={i} player={p} setPlayers={setPlayers} teams={teams} />
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs italic" style={{ color: '#6b6555' }}>
        Edit any field and press <span className="smallcaps">Update</span> to save. Changes persist automatically.
      </p>

      <CarpoolSuggestions players={players} />
    </section>
  );
}

const FLIGHT_FIELDS = ['team', 'departureCity', 'departure', 'airline', 'arrivalTime', 'date', 'departureTime', 'departureDate'];

function RosterRow({ index, player, setPlayers, teams }) {
  const initial = () => ({
    name: player.name ?? '',
    handicap: player.handicap != null && player.handicap !== '' ? String(Math.round(player.handicap)) : '',
    team: player.team ?? '',
    departureCity: player.departureCity ?? '',
    departure: player.departure ?? '',
    airline: player.airline ?? '',
    arrivalTime: player.arrivalTime ?? '',
    date: player.date ?? '',
    departureTime: player.departureTime ?? '',
    departureDate: player.departureDate ?? '',
    rental: !!player.rental,
  });
  const [draft, setDraft] = useState(initial);
  const [justSaved, setJustSaved] = useState(false);

  const dirtyRef = useRef(false);
  useEffect(() => {
    if (dirtyRef.current) return;
    setDraft(initial());
    /* eslint-disable-next-line */
  }, [player]);

  const set = (field, value) => setDraft((d) => ({ ...d, [field]: value }));

  const dirty =
    draft.name !== (player.name ?? '') ||
    parseInt(draft.handicap || '0', 10) !== Math.round(player.handicap ?? 0) ||
    FLIGHT_FIELDS.some((f) => draft[f] !== (player[f] ?? '')) ||
    draft.rental !== !!player.rental;
  dirtyRef.current = dirty;

  const REQUIRED_FIELDS = ['name', 'handicap', 'team', 'departureCity', 'departure', 'airline', 'arrivalTime', 'date', 'departureTime', 'departureDate'];
  const allFilled = REQUIRED_FIELDS.every((f) => {
    const v = player[f];
    if (f === 'handicap') return Number.isFinite(v);
    return v != null && String(v).trim() !== '';
  });

  const submit = () => {
    if (!dirty) return;
    setPlayers((prev) => prev.map((p) => (
      p.id === player.id ? {
        ...p,
        name: draft.name.trim() || p.name,
        handicap: Math.max(0, Math.min(99, parseInt(draft.handicap, 10) || 0)),
        team: draft.team,
        departureCity: draft.departureCity.trim(),
        departure: draft.departure.trim(),
        airline: draft.airline.trim(),
        arrivalTime: draft.arrivalTime.trim(),
        date: draft.date,
        departureTime: draft.departureTime.trim(),
        departureDate: draft.departureDate,
        rental: !!draft.rental,
      } : p
    )));
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1200);
  };

  const onEnter = (e) => { if (e.key === 'Enter' && dirty) submit(); };

  const cellInput = (field, opts = {}) => (
    <input
      value={draft[field]}
      onChange={(e) => set(field, e.target.value)}
      onKeyDown={onEnter}
      placeholder={opts.placeholder}
      type={opts.type || 'text'}
      step={opts.step}
      className={`w-full bg-transparent outline-none rounded px-2 py-1.5 ${opts.mono ? 'font-mono text-sm' : 'text-sm'} ${opts.right ? 'text-right' : ''}`}
      style={{ border: `1px solid ${dirty ? C.gold : C.rule}`, color: opts.color || C.ink }}
    />
  );

  return (
    <tr className="border-t transition-colors" style={{ borderColor: C.rule, background: allFilled ? 'rgba(14,94,63,0.08)' : 'transparent' }}>
      <td className="py-2 px-2 font-mono text-xs" style={{ color: '#8e8870' }}>
        {String(index + 1).padStart(2, '0')}
      </td>
      <td className="py-2 px-2">
        <input
          value={draft.name}
          onChange={(e) => set('name', e.target.value)}
          onFocus={(e) => e.target.select()}
          onKeyDown={onEnter}
          placeholder="Player name"
          className="font-display text-base w-full bg-transparent outline-none rounded px-2 py-1.5"
          style={{ border: `1px solid ${dirty ? C.gold : C.rule}`, color: C.ink }}
        />
      </td>
      <td className="py-2 px-2">
        <div className="font-mono text-sm w-full text-right px-2 py-1.5" style={{ color: C.greenDk }}>
          {draft.handicap || '—'}
        </div>
      </td>
      <td className="py-2 px-2">
        <div className="text-sm px-2 py-1.5" style={{ color: draft.team ? C.greenDk : '#bfb89e' }}>
          {(teams || []).find((t) => t.id === draft.team)?.name || '—'}
        </div>
      </td>
      <td className="py-2 px-2">{cellInput('departureCity', { placeholder: 'New York' })}</td>
      <td className="py-2 px-2">
        <TimeInput value={draft.departure} dirty={dirty} onChange={(v) => set('departure', v)} onCommit={(v) => { set('departure', v); if (dirty) submit(); }} />
      </td>
      <td className="py-2 px-2">{cellInput('airline', { placeholder: 'Delta' })}</td>
      <td className="py-2 px-2">
        <TimeInput value={draft.arrivalTime} dirty={dirty} onChange={(v) => set('arrivalTime', v)} onCommit={(v) => { set('arrivalTime', v); if (dirty) submit(); }} />
      </td>
      <td className="py-2 px-2">
        <DateSelect value={draft.date} dirty={dirty} onChange={(v) => set('date', v)} />
      </td>
      <td className="py-2 px-2">
        <TimeInput value={draft.departureTime} dirty={dirty} onChange={(v) => set('departureTime', v)} onCommit={(v) => { set('departureTime', v); if (dirty) submit(); }} />
      </td>
      <td className="py-2 px-2">
        <DateSelect value={draft.departureDate} dirty={dirty} onChange={(v) => set('departureDate', v)} />
      </td>
      <td className="py-2 px-2 text-center">
        <input
          type="checkbox"
          checked={!!draft.rental}
          onChange={(e) => set('rental', e.target.checked)}
          className="w-4 h-4 cursor-pointer"
          style={{ accentColor: C.greenDk }}
        />
      </td>
      <td className="py-2 px-2 text-right">
        <button
          onClick={submit}
          disabled={!dirty}
          className="smallcaps text-[11px] px-3 py-1.5 rounded transition-opacity"
          style={{
            background: dirty ? C.greenDk : C.creamLt,
            color: dirty ? C.gold : '#bfb89e',
            border: `1px solid ${dirty ? C.greenDk : C.rule}`,
            cursor: dirty ? 'pointer' : 'default',
          }}
        >
          {justSaved ? 'Saved' : 'Update'}
        </button>
      </td>
    </tr>
  );
}

function RosterCardMobile({ index, player, setPlayers, teams }) {
  const initial = () => ({
    name: player.name ?? '',
    handicap: player.handicap != null && player.handicap !== '' ? String(Math.round(player.handicap)) : '',
    team: player.team ?? '',
    departureCity: player.departureCity ?? '',
    departure: player.departure ?? '',
    airline: player.airline ?? '',
    arrivalTime: player.arrivalTime ?? '',
    date: player.date ?? '',
    departureTime: player.departureTime ?? '',
    departureDate: player.departureDate ?? '',
    rental: !!player.rental,
  });
  const [draft, setDraft] = useState(initial);
  const [justSaved, setJustSaved] = useState(false);
  const dirtyRef = useRef(false);
  useEffect(() => {
    if (dirtyRef.current) return;
    setDraft(initial());
    /* eslint-disable-next-line */
  }, [player]);

  const set = (field, value) => setDraft((d) => ({ ...d, [field]: value }));
  const dirty =
    draft.name !== (player.name ?? '') ||
    parseInt(draft.handicap || '0', 10) !== Math.round(player.handicap ?? 0) ||
    FLIGHT_FIELDS.some((f) => draft[f] !== (player[f] ?? '')) ||
    draft.rental !== !!player.rental;
  dirtyRef.current = dirty;

  const REQUIRED_FIELDS = ['name', 'handicap', 'team', 'departureCity', 'departure', 'airline', 'arrivalTime', 'date', 'departureTime', 'departureDate'];
  const allFilled = REQUIRED_FIELDS.every((f) => {
    const v = player[f];
    if (f === 'handicap') return Number.isFinite(v);
    return v != null && String(v).trim() !== '';
  });

  const submit = () => {
    if (!dirty) return;
    setPlayers((prev) => prev.map((p) => (
      p.id === player.id ? {
        ...p,
        name: draft.name.trim() || p.name,
        handicap: Math.max(0, Math.min(99, parseInt(draft.handicap, 10) || 0)),
        team: draft.team,
        departureCity: draft.departureCity.trim(),
        departure: draft.departure.trim(),
        airline: draft.airline.trim(),
        arrivalTime: draft.arrivalTime.trim(),
        date: draft.date,
        departureTime: draft.departureTime.trim(),
        departureDate: draft.departureDate,
        rental: !!draft.rental,
      } : p
    )));
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1200);
  };

  const fieldStyle = { border: `1px solid ${dirty ? C.gold : C.rule}`, color: C.ink };
  const labelCls = "smallcaps text-[10px]";
  const labelStyle = { color: '#8e8870' };

  return (
    <div
      className="rounded p-4 transition-colors"
      style={{
        background: allFilled ? 'rgba(14,94,63,0.08)' : 'white',
        border: `1px solid ${C.rule}`,
      }}
    >
      <div className="flex items-baseline justify-between mb-3">
        <div className="font-mono text-xs" style={{ color: '#8e8870' }}>
          No. {String(index + 1).padStart(2, '0')}
        </div>
        <button
          onClick={submit}
          disabled={!dirty}
          className="smallcaps text-[11px] px-3 py-1.5 rounded"
          style={{
            background: dirty ? C.greenDk : C.creamLt,
            color: dirty ? C.gold : '#bfb89e',
            border: `1px solid ${dirty ? C.greenDk : C.rule}`,
          }}
        >
          {justSaved ? 'Saved' : 'Update'}
        </button>
      </div>

      <input
        value={draft.name}
        onChange={(e) => set('name', e.target.value)}
        onFocus={(e) => e.target.select()}
        placeholder="Player name"
        className="font-display text-xl w-full bg-transparent outline-none rounded px-2 py-1.5 mb-3"
        style={fieldStyle}
      />

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className={labelCls} style={labelStyle}>Handicap</div>
          <div className="font-mono text-sm px-2 py-1.5 mt-1" style={{ color: C.greenDk }}>
            {draft.handicap || '—'}
          </div>
        </div>
        <div>
          <div className={labelCls} style={labelStyle}>Team</div>
          <div className="text-sm px-2 py-1.5 mt-1" style={{ color: draft.team ? C.greenDk : '#bfb89e' }}>
            {(teams || []).find((t) => t.id === draft.team)?.name || '—'}
          </div>
        </div>
      </div>

      <div className="smallcaps text-[10px] mb-2" style={{ color: C.goldDk }}>Outbound</div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className={labelCls} style={labelStyle}>Dep. City</div>
          <input
            value={draft.departureCity}
            onChange={(e) => set('departureCity', e.target.value)}
            placeholder="New York"
            className="text-sm w-full bg-transparent outline-none rounded px-2 py-1.5 mt-1"
            style={fieldStyle}
          />
        </div>
        <div>
          <div className={labelCls} style={labelStyle}>Dep. Time</div>
          <div className="mt-1">
            <TimeInput value={draft.departure} dirty={dirty} onChange={(v) => set('departure', v)} />
          </div>
        </div>
        <div>
          <div className={labelCls} style={labelStyle}>Airline</div>
          <input
            value={draft.airline}
            onChange={(e) => set('airline', e.target.value)}
            placeholder="Delta"
            className="text-sm w-full bg-transparent outline-none rounded px-2 py-1.5 mt-1"
            style={fieldStyle}
          />
        </div>
        <div>
          <div className={labelCls} style={labelStyle}>Arrival Time</div>
          <div className="mt-1">
            <TimeInput value={draft.arrivalTime} dirty={dirty} onChange={(v) => set('arrivalTime', v)} />
          </div>
        </div>
        <div>
          <div className={labelCls} style={labelStyle}>Arrival Date</div>
          <div className="mt-1">
            <DateSelect value={draft.date} dirty={dirty} onChange={(v) => set('date', v)} />
          </div>
        </div>
      </div>

      <div className="smallcaps text-[10px] mb-2" style={{ color: C.goldDk }}>Return</div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className={labelCls} style={labelStyle}>Departure Time</div>
          <div className="mt-1">
            <TimeInput value={draft.departureTime} dirty={dirty} onChange={(v) => set('departureTime', v)} />
          </div>
        </div>
        <div>
          <div className={labelCls} style={labelStyle}>Departure Date</div>
          <div className="mt-1">
            <DateSelect value={draft.departureDate} dirty={dirty} onChange={(v) => set('departureDate', v)} />
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2 mt-2 cursor-pointer">
        <input
          type="checkbox"
          checked={!!draft.rental}
          onChange={(e) => set('rental', e.target.checked)}
          className="w-4 h-4"
          style={{ accentColor: C.greenDk }}
        />
        <span className="smallcaps text-[11px]" style={{ color: C.ink }}>Renting a car</span>
      </label>
    </div>
  );
}

// ============================================================
// TIME INPUT — auto-formats digits to h:mm with required AM/PM toggle
// ============================================================
const NOV_2026_DATES = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  return { value: `2026-11-${String(day).padStart(2, '0')}`, label: `Nov ${day}` };
});

function DateSelect({ value, onChange, dirty }) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="font-mono text-sm w-full bg-transparent outline-none rounded px-2 py-1.5"
      style={{ border: `1px solid ${dirty ? C.gold : C.rule}`, color: value ? C.greenDk : '#bfb89e' }}
    >
      <option value="">—</option>
      {NOV_2026_DATES.map((d) => (
        <option key={d.value} value={d.value}>{d.label}</option>
      ))}
    </select>
  );
}

function parseStoredTime(str) {
  const s = (str || '').trim();
  if (!s) return { time: '', meridiem: '' };
  const m = s.match(/^([0-9:]+)\s*([AaPp][Mm])?$/);
  if (!m) return { time: s, meridiem: '' };
  return { time: m[1], meridiem: (m[2] || '').toUpperCase() };
}

function formatTimeDigits(input) {
  const digits = (input || '').replace(/\D/g, '').slice(0, 4);
  if (!digits) return '';
  if (digits.length <= 2) return digits;
  if (digits.length === 3) return `${digits[0]}:${digits.slice(1)}`;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function TimeInput({ value, onChange, dirty }) {
  const initial = parseStoredTime(value);
  const [time, setTime] = useState(initial.time);
  const [meridiem, setMeridiem] = useState(initial.meridiem);

  useEffect(() => {
    const p = parseStoredTime(value);
    setTime(p.time);
    setMeridiem(p.meridiem);
  }, [value]);

  const commit = (t, m) => {
    if (!t) { onChange(''); return; }
    onChange(m ? `${t} ${m}` : t);
  };

  const onTimeChange = (e) => {
    const formatted = formatTimeDigits(e.target.value);
    setTime(formatted);
    commit(formatted, meridiem);
  };

  const pickMeridiem = (m) => {
    setMeridiem(m);
    commit(time, m);
  };

  return (
    <div
      className="flex items-center w-full rounded bg-transparent"
      style={{ border: `1px solid ${dirty ? C.gold : C.rule}` }}
    >
      <input
        type="text"
        inputMode="numeric"
        value={time}
        onChange={onTimeChange}
        placeholder="h:mm"
        className="font-mono text-sm flex-1 min-w-0 bg-transparent outline-none pl-1.5 pr-1 py-1.5 text-right"
        style={{ color: C.greenDk }}
      />
      <div className="flex items-center font-mono text-[10px] pr-1 select-none shrink-0">
        <button
          type="button"
          onClick={() => pickMeridiem('AM')}
          className="px-0.5 py-0.5 rounded transition-colors hover:bg-black/5"
          style={{ color: meridiem === 'AM' ? C.greenDk : '#bfb89e', fontWeight: meridiem === 'AM' ? 700 : 400 }}
        >
          AM
        </button>
        <span style={{ color: '#d6cfb8' }}>·</span>
        <button
          type="button"
          onClick={() => pickMeridiem('PM')}
          className="px-0.5 py-0.5 rounded transition-colors hover:bg-black/5"
          style={{ color: meridiem === 'PM' ? C.greenDk : '#bfb89e', fontWeight: meridiem === 'PM' ? 700 : 400 }}
        >
          PM
        </button>
      </div>
    </div>
  );
}

// ============================================================
// CARPOOL SUGGESTIONS
// ============================================================
function assignCars(people, max = 4) {
  // Sort by arrival minute so passengers fill rental cars in arrival order
  const sorted = [...people].sort((a, b) => (a._min ?? 0) - (b._min ?? 0));
  const renters = sorted.filter((p) => p.rental);
  const riders = sorted.filter((p) => !p.rental);

  // Each rental car: driver + up to (max - 1) passengers
  const rentalCars = renters.map((driver) => ({ type: 'rental', driver, passengers: [] }));

  // Fill rental cars round-robin with riders, capped at (max - 1) passengers each
  const remaining = [];
  for (const r of riders) {
    const target = rentalCars
      .filter((c) => c.passengers.length < max - 1)
      .sort((a, b) => a.passengers.length - b.passengers.length)[0];
    if (target) {
      target.passengers.push(r);
    } else {
      remaining.push(r);
    }
  }

  // Any leftover riders form rideshare cars (balanced)
  const rideshareCars = splitIntoCars(remaining, max).map((car) => ({ type: 'rideshare', riders: car }));

  return [...rentalCars, ...rideshareCars];
}

function splitIntoCars(group, max = 4) {
  const n = group.length;
  if (n === 0) return [];
  const numCars = Math.ceil(n / max);
  const base = Math.floor(n / numCars);
  const extras = n % numCars;
  const cars = [];
  let i = 0;
  for (let c = 0; c < numCars; c++) {
    const size = base + (c < extras ? 1 : 0);
    cars.push(group.slice(i, i + size));
    i += size;
  }
  return cars;
}

function timeToMinutes(str) {
  if (!str) return NaN;
  const m = String(str).trim().match(/^(\d{1,2}):?(\d{2})?\s*([AaPp][Mm])?$/);
  if (!m) return NaN;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2] || '0', 10);
  const mer = (m[3] || '').toUpperCase();
  if (mer === 'PM' && h < 12) h += 12;
  if (mer === 'AM' && h === 12) h = 0;
  return h * 60 + min;
}

function formatDateLabel(date) {
  if (!date) return '';
  const d = new Date(date + 'T00:00:00');
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatGroupHeader(group) {
  const date = formatDateLabel(group.date);
  const times = group.riders.map((p) => p.arrivalTime).filter(Boolean);
  const unique = Array.from(new Set(times));
  const timeLabel = unique.length === 1 ? unique[0] : `${unique[0]} – ${unique[unique.length - 1]}`;
  return [date, timeLabel].filter(Boolean).join(' · ');
}

const WINDOW_MIN = 60;

function CarpoolSuggestions({ players }) {
  const groups = useMemo(() => {
    const eligible = players
      .filter((p) => p.arrivalTime && p.date)
      .map((p) => ({ ...p, _min: timeToMinutes(p.arrivalTime) }))
      .filter((p) => Number.isFinite(p._min));

    // Bucket by date, then within each date sort by minute and cluster
    // such that the spread (max−min) within a cluster is ≤ WINDOW_MIN.
    const byDate = new Map();
    eligible.forEach((p) => {
      if (!byDate.has(p.date)) byDate.set(p.date, []);
      byDate.get(p.date).push(p);
    });

    const groups = [];
    for (const [date, riders] of byDate) {
      riders.sort((a, b) => a._min - b._min);
      let current = null;
      for (const p of riders) {
        if (!current || p._min - current.riders[0]._min > WINDOW_MIN) {
          current = { date, riders: [p] };
          groups.push(current);
        } else {
          current.riders.push(p);
        }
      }
    }

    return groups.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.riders[0]._min - b.riders[0]._min;
    });
  }, [players]);

  const lonelyRenters = players.filter(
    (p) => p.rental && (!p.arrivalTime || !p.date)
  );
  const incomplete = players.filter((p) => !p.rental && (!p.arrivalTime || !p.date));

  return (
    <section className="mt-12">
      <div className="mb-6 text-center">
        <div className="smallcaps text-xs mb-2" style={{ color: C.goldDk }}>Ground Transport</div>
        <h3 className="font-display text-3xl" style={{ color: C.greenDkr }}>Airport Carpool Suggestions</h3>
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="h-px w-8" style={{ background: C.gold }} />
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.gold }} />
          <span className="h-px w-8" style={{ background: C.gold }} />
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="p-4 text-sm rounded text-center" style={{ background: C.creamLt, border: `1px solid ${C.rule}`, color: '#6b6555' }}>
          No carpool groups yet — fill in arrival times and dates above to see suggestions.
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((g, gi) => {
            const cars = assignCars(g.riders);
            const totalPeople = g.riders.length;
            return (
              <div key={`${g.date}|${gi}`} className="rounded overflow-hidden" style={{ border: `1px solid ${C.rule}`, background: 'white' }}>
                <div className="px-4 py-2 flex items-center justify-between" style={{ background: C.greenDk, color: C.cream }}>
                  <div className="font-display text-lg">{formatGroupHeader(g)}</div>
                  <div className="smallcaps text-[11px]" style={{ color: C.gold }}>
                    {totalPeople} {totalPeople === 1 ? 'person' : 'people'} · {cars.length} {cars.length === 1 ? 'car' : 'cars'}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-px" style={{ background: C.rule }}>
                  {cars.map((car, idx) => {
                    const passengers = car.type === 'rental'
                      ? [car.driver, ...car.passengers]
                      : car.riders;
                    return (
                      <div key={idx} className="p-4" style={{ background: 'white' }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="smallcaps text-[10px]" style={{ color: C.goldDk }}>
                            {car.type === 'rental'
                              ? `${car.driver.name.split(' ')[0]}'s rental`
                              : `Rideshare ${idx + 1}`}
                          </div>
                          <div className="smallcaps text-[10px]" style={{ color: '#8e8870' }}>
                            {passengers.length} of 4
                          </div>
                        </div>
                        <ul className="space-y-1">
                          {passengers.map((p, pi) => {
                            const isDriver = car.type === 'rental' && pi === 0;
                            return (
                              <li key={p.id} className="font-display text-base flex items-center justify-between" style={{ color: C.ink }}>
                                <span className="flex items-center gap-2">
                                  {playerLabel(p)}
                                  {isDriver && (
                                    <span className="smallcaps text-[9px] px-1.5 py-0.5 rounded" style={{ background: C.gold, color: C.greenDkr }}>
                                      Driver
                                    </span>
                                  )}
                                </span>
                                <span className="font-mono text-xs" style={{ color: '#8e8870' }}>
                                  {p.arrivalTime}{p.airline ? ` · ${p.airline}` : ''}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(lonelyRenters.length > 0 || incomplete.length > 0) && (
        <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
          {lonelyRenters.length > 0 && (
            <div className="p-4 rounded" style={{ background: C.creamLt, border: `1px solid ${C.rule}` }}>
              <div className="smallcaps text-[10px] mb-2" style={{ color: C.goldDk }}>Renting a car (no arrival info yet)</div>
              <div style={{ color: C.ink }}>{lonelyRenters.map(playerLabel).join(', ')}</div>
            </div>
          )}
          {incomplete.length > 0 && (
            <div className="p-4 rounded" style={{ background: C.creamLt, border: `1px solid ${C.rule}` }}>
              <div className="smallcaps text-[10px] mb-2" style={{ color: C.goldDk }}>Missing arrival info</div>
              <div style={{ color: C.ink }}>{incomplete.map(playerLabel).join(', ')}</div>
            </div>
          )}
        </div>
      )}

      <p className="mt-4 text-xs italic text-center" style={{ color: '#6b6555' }}>
        Players arriving within one hour of each other on the same day are grouped together.
        Riders fill any rental cars in the group first (driver + 3 passengers); the rest split into rideshares of up to four.
      </p>
    </section>
  );
}

// ============================================================
// TEAMS — overall team scoring vs quota
// ============================================================
function Teams({ players, scores, teams, setTeams, groups }) {
  const courseById = (id) => COURSES.find((c) => c.id === id);
  const { roundResults, teamTotals } = useMemo(
    () => computeStandings(ROUNDS, teams, players, scores, courseById, groups),
    [players, scores, teams, groups]
  );

  const updateName = (id, name) => {
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)));
  };

  const fmtPts = (n) => (n === 0 ? '—' : (Math.round(n * 10) / 10).toString());

  return (
    <section className="mt-10">
      <SectionTitle eyebrow="Team Standings" title="The Teams" />

      <div className="grid md:grid-cols-2 gap-5">
        {teamTotals.map((row, i) => {
          const members = players.filter((p) => p.team === row.team.id);
          return (
            <TeamCard
              key={row.team.id}
              rank={row.total > 0 ? i + 1 : null}
              team={row.team}
              members={members}
              roundResults={roundResults}
              perRoundPoints={row.perRound}
              total={row.total}
              fmtPts={fmtPts}
              onRename={(name) => updateName(row.team.id, name)}
            />
          );
        })}
      </div>

      <p className="mt-6 text-xs italic text-center" style={{ color: '#6b6555' }}>
        R1 & R2 are team best-ball (2 lowest net per hole) · Teams rank 1–5 → 20/15/10/5/0 points.
        R3 is singles net stroke · Each player's net rank → 15, 14… 1 point to their team.
        Highest total points across the three rounds wins.
      </p>
    </section>
  );
}

function TeamCard({ rank, team, members, roundResults, perRoundPoints, total, fmtPts, onRename }) {
  const hasAny = total > 0;
  const [openRound, setOpenRound] = useState(null);
  return (
    <div className="rounded overflow-hidden" style={{ background: 'white', border: `1px solid ${C.rule}` }}>
      <div className="px-5 py-4 flex items-center justify-between" style={{ background: C.greenDk, color: C.cream }}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {rank && (
            <span className="font-display text-2xl" style={{ color: rank === 1 ? C.gold : C.cream }}>
              {rank}
            </span>
          )}
          <input
            value={team.name}
            onChange={(e) => onRename(e.target.value)}
            className="font-display text-2xl flex-1 min-w-0 bg-transparent outline-none"
            style={{ color: C.cream, borderBottom: `1px dashed rgba(201,169,97,0.4)` }}
          />
          {rank === 1 && hasAny && <Trophy size={16} style={{ color: C.gold }} />}
        </div>
        <div className="text-right ml-3">
          <div className="smallcaps text-[10px]" style={{ color: C.gold }}>Points</div>
          <div className="font-display text-3xl tabular">
            {hasAny ? fmtPts(total) : '—'}
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="px-5 py-3 border-b text-xs" style={{ borderColor: C.rule, background: C.creamLt }}>
        <div className="smallcaps text-[10px] mb-1.5" style={{ color: C.goldDk }}>
          Roster · {members.length} {members.length === 1 ? 'player' : 'players'}
        </div>
        {members.length === 0 ? (
          <div className="italic" style={{ color: '#8e8870' }}>No players assigned yet.</div>
        ) : (
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {members.map((m) => (
              <span key={m.id} style={{ color: C.ink }}>
                {playerLabel(m)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Per-round breakdown */}
      <table className="w-full text-sm tabular">
        <thead>
          <tr style={{ background: C.creamLt }}>
            <th className="py-2 px-3 smallcaps text-[10px] text-left" style={{ color: '#8e8870' }}>Round</th>
            <th className="py-2 px-3 smallcaps text-[10px] text-right" style={{ color: '#8e8870' }}>Format</th>
            <th className="py-2 px-3 smallcaps text-[10px] text-right" style={{ color: '#8e8870' }}>Score</th>
            <th className="py-2 px-3 smallcaps text-[10px] text-right" style={{ color: C.goldDk }}>Pts</th>
          </tr>
        </thead>
        <tbody>
          {ROUNDS.map((r, idx) => {
            const rr = roundResults[idx];
            const pts = perRoundPoints[idx] ?? 0;
            const course = COURSES.find((c) => c.id === r.courseId);
            let scoreLabel = '—';
            let formatLabel = '—';
            let bbResult = null;
            let singlesMembers = [];
            if (r.format === 'bestball2net') {
              formatLabel = 'Best Ball';
              bbResult = rr?.results?.find((x) => x.team.id === team.id);
              if (bbResult) {
                scoreLabel = bbResult.complete ? `${bbResult.total} net` : `${bbResult.filled}/18`;
              }
            } else if (r.format === 'netstroke') {
              formatLabel = 'Singles Net';
              singlesMembers = members.map((m) => {
                const scored = rr?.sorted?.find((s) => s.p.id === m.id);
                const place = scored ? rr.sorted.indexOf(scored) + 1 : null;
                const playerPts = rr?.pointsByPlayer?.get(m.id) ?? 0;
                return { player: m, scored, place, pts: playerPts };
              });
              const complete = singlesMembers.filter((x) => x.scored);
              if (complete.length > 0) {
                const sum = complete.reduce((a, b) => a + b.scored.net, 0);
                scoreLabel = `${sum} (${complete.length}/${members.length})`;
              }
            }
            const isOpen = openRound === r.id;
            const hasDetail = (bbResult && bbResult.filled > 0) ||
                              (singlesMembers.some((x) => x.scored));
            return (
              <React.Fragment key={r.id}>
                <tr
                  className="border-t"
                  style={{ borderColor: C.rule, cursor: hasDetail ? 'pointer' : 'default' }}
                  onClick={() => hasDetail && setOpenRound(isOpen ? null : r.id)}
                >
                  <td className="py-2 px-3" style={{ color: C.ink }}>
                    <div className="flex items-center gap-1.5">
                      {hasDetail && (
                        <ChevronRight
                          size={12}
                          style={{
                            color: C.goldDk,
                            transform: isOpen ? 'rotate(90deg)' : 'none',
                            transition: 'transform 150ms',
                          }}
                        />
                      )}
                      <div>
                        <div className="font-display">{r.course}</div>
                        <div className="smallcaps text-[10px]" style={{ color: '#8e8870' }}>
                          {r.day} · {r.date}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-right smallcaps text-[10px]" style={{ color: '#6b6555' }}>{formatLabel}</td>
                  <td className="py-2 px-3 text-right font-mono text-xs" style={{ color: C.ink }}>{scoreLabel}</td>
                  <td className="py-2 px-3 text-right font-mono" style={{ color: pts > 0 ? C.greenDk : '#bfb89e' }}>
                    {pts > 0 ? fmtPts(pts) : '—'}
                  </td>
                </tr>
                {isOpen && hasDetail && (
                  <tr style={{ background: '#fbfaf5' }}>
                    <td colSpan={4} className="py-3 px-3">
                      {r.format === 'bestball2net' && bbResult && (
                        <BestBallBreakdown course={course} teamMembers={members} bbResult={bbResult} />
                      )}
                      {r.format === 'netstroke' && (
                        <SinglesBreakdown members={singlesMembers} totalPlayers={rr?.results?.length ?? 15} fmtPts={fmtPts} />
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
          <tr className="border-t" style={{ borderColor: C.rule, background: C.creamLt }}>
            <td className="py-2 px-3 smallcaps text-[11px]" style={{ color: C.goldDk }}>Total</td>
            <td></td>
            <td></td>
            <td className="py-2 px-3 text-right font-display text-xl" style={{ color: C.greenDk }}>
              {hasAny ? fmtPts(total) : '—'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function BestBallBreakdown({ course, teamMembers, bbResult }) {
  // Build per-player net scores for this round using the team-best-ball
  // result object. The team's members are the players; we recompute nets
  // from the result's cached scores if available, otherwise derive from
  // the members list.
  if (!course || !bbResult) return null;
  const front = Array.from({ length: 9 }, (_, i) => i);
  const back = Array.from({ length: 9 }, (_, i) => i + 9);

  // bbResult.perHole has the sum of 2 lowest nets per hole; to show
  // which members contributed, recompute each member's net array.
  const allNets = teamMembers.map((p) => {
    // Try to find a scored record; otherwise null row.
    // We need their net on each hole; recompute from the course + their
    // gross/strokes using the global helpers.
    return { player: p, nets: null };
  });

  // The team result doesn't carry per-member net arrays; instead we
  // store the counted indices to highlight. For a lightweight display,
  // just show the team's hole-by-hole best-ball picks and totals.
  const perHoleCell = (holeIdx) => {
    const v = bbResult.perHole[holeIdx];
    return (
      <td
        key={holeIdx}
        className="py-1 px-1 font-mono text-[11px] text-center"
        style={{ color: Number.isFinite(v) ? C.ink : '#bfb89e' }}
      >
        {Number.isFinite(v) ? v : '—'}
      </td>
    );
  };

  const sumRange = (idxs) => idxs.reduce((a, i) => a + (bbResult.perHole[i] ?? 0), 0);

  return (
    <div>
      <div className="smallcaps text-[10px] mb-2" style={{ color: C.goldDk }}>
        Best-ball net per hole · sum of 2 lowest member nets
      </div>
      <div className="overflow-x-auto rounded" style={{ border: `1px solid ${C.rule}`, background: 'white' }}>
        <table className="w-full text-xs tabular">
          <thead>
            <tr style={{ background: C.creamLt }}>
              <th className="py-1 px-1 smallcaps text-[10px] text-left" style={{ color: '#8e8870' }}>Hole</th>
              {front.map((i) => (
                <th key={i} className="py-1 px-1 font-mono text-[10px]" style={{ color: C.greenDk }}>{i + 1}</th>
              ))}
              <th className="py-1 px-1 smallcaps text-[10px]" style={{ color: C.goldDk }}>Out</th>
              {back.map((i) => (
                <th key={i} className="py-1 px-1 font-mono text-[10px]" style={{ color: C.greenDk }}>{i + 1}</th>
              ))}
              <th className="py-1 px-1 smallcaps text-[10px]" style={{ color: C.goldDk }}>In</th>
              <th className="py-1 px-1 smallcaps text-[10px]" style={{ color: C.goldDk }}>Tot</th>
            </tr>
            <tr className="border-t" style={{ borderColor: C.rule, background: C.creamLt }}>
              <th className="py-1 px-1 smallcaps text-[10px] text-left" style={{ color: '#8e8870' }}>Par</th>
              {front.map((i) => (
                <th key={i} className="py-1 px-1 font-mono text-[10px]" style={{ color: '#6b6555' }}>{course.holes[i].par}</th>
              ))}
              <th className="py-1 px-1 font-mono text-[10px]" style={{ color: C.goldDk }}>
                {front.reduce((a, i) => a + course.holes[i].par, 0)}
              </th>
              {back.map((i) => (
                <th key={i} className="py-1 px-1 font-mono text-[10px]" style={{ color: '#6b6555' }}>{course.holes[i].par}</th>
              ))}
              <th className="py-1 px-1 font-mono text-[10px]" style={{ color: C.goldDk }}>
                {back.reduce((a, i) => a + course.holes[i].par, 0)}
              </th>
              <th className="py-1 px-1 font-mono text-[10px]" style={{ color: C.goldDk }}>
                {course.holes.reduce((a, h) => a + h.par, 0)}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t" style={{ borderColor: C.rule }}>
              <td className="py-1 px-1 smallcaps text-[10px]" style={{ color: C.goldDk }}>Team</td>
              {front.map(perHoleCell)}
              <td className="py-1 px-1 font-mono text-[11px] text-center font-bold" style={{ color: C.greenDk }}>
                {sumRange(front) || '—'}
              </td>
              {back.map(perHoleCell)}
              <td className="py-1 px-1 font-mono text-[11px] text-center font-bold" style={{ color: C.greenDk }}>
                {sumRange(back) || '—'}
              </td>
              <td className="py-1 px-1 font-mono text-[11px] text-center font-bold" style={{ color: C.greenDk }}>
                {bbResult.total || '—'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-[10px]" style={{ color: '#6b6555' }}>
        Members: {teamMembers.map((p) => playerLabel(p)).join(' · ')}
      </div>
    </div>
  );
}

function SinglesBreakdown({ members, totalPlayers, fmtPts }) {
  const anyScored = members.some((m) => m.scored);
  if (!anyScored) {
    return <div className="text-[11px] italic" style={{ color: '#8e8870' }}>No singles scores posted yet.</div>;
  }
  return (
    <div>
      <div className="smallcaps text-[10px] mb-2" style={{ color: C.goldDk }}>
        Singles net stroke · each member's net rank → points
      </div>
      <div className="rounded overflow-hidden" style={{ border: `1px solid ${C.rule}`, background: 'white' }}>
        <table className="w-full text-xs tabular">
          <thead>
            <tr style={{ background: C.creamLt }}>
              <th className="py-1.5 px-2 smallcaps text-[10px] text-left" style={{ color: '#8e8870' }}>Player</th>
              <th className="py-1.5 px-2 smallcaps text-[10px] text-right" style={{ color: '#8e8870' }}>Net</th>
              <th className="py-1.5 px-2 smallcaps text-[10px] text-right" style={{ color: '#8e8870' }}>Place</th>
              <th className="py-1.5 px-2 smallcaps text-[10px] text-right" style={{ color: C.goldDk }}>Pts</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.player.id} className="border-t" style={{ borderColor: C.rule }}>
                <td className="py-1.5 px-2" style={{ color: C.ink }}>{playerLabel(m.player)}</td>
                <td className="py-1.5 px-2 text-right font-mono" style={{ color: C.ink }}>
                  {m.scored ? m.scored.net : '—'}
                </td>
                <td className="py-1.5 px-2 text-right font-mono text-[10px]" style={{ color: '#6b6555' }}>
                  {m.place ? `${m.place} / ${totalPlayers}` : '—'}
                </td>
                <td className="py-1.5 px-2 text-right font-mono" style={{ color: m.pts > 0 ? C.greenDk : '#bfb89e' }}>
                  {m.pts > 0 ? fmtPts(m.pts) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// SKINS — net scoring, whole-field pool, NO carryovers.
// Each round has a $180 pot that is split evenly across all skins won.
// If no skins are won in a round (every hole ties), the pot is unawarded.
// ============================================================
const SKINS_POT_PER_ROUND = 180;

const computeSkinsForRound = (round, players, scores, course, groups) => {
  if (!course) return null;
  const n = course.holes.length;
  const playerNets = players.map((p) => ({
    player: p,
    nets: netHoleScores(p, round, scores, course, groups, players),
  }));

  const holes = [];
  const skinsByPlayer = new Map();
  let totalSkins = 0;

  for (let i = 0; i < n; i++) {
    const posted = playerNets
      .map((pn) => ({ player: pn.player, net: pn.nets?.[i] }))
      .filter((x) => Number.isFinite(x.net));
    const allIn = posted.length === players.length;

    if (!allIn) {
      holes.push({ hole: i + 1, status: 'pending', posted: posted.length, total: players.length });
      continue;
    }

    const minNet = Math.min(...posted.map((x) => x.net));
    const winners = posted.filter((x) => x.net === minNet);

    if (winners.length === 1) {
      const winner = winners[0].player;
      skinsByPlayer.set(winner.id, (skinsByPlayer.get(winner.id) || 0) + 1);
      totalSkins += 1;
      holes.push({ hole: i + 1, status: 'won', winner, net: minNet });
    } else {
      holes.push({
        hole: i + 1, status: 'tied', tiedPlayers: winners.map((w) => w.player), net: minNet,
      });
    }
  }

  const payoutPerSkin = totalSkins > 0 ? SKINS_POT_PER_ROUND / totalSkins : 0;
  return { holes, skinsByPlayer, totalSkins, payoutPerSkin, pot: SKINS_POT_PER_ROUND };
};

function Skins({ players, scores, groups }) {
  const [activeRound, setActiveRound] = useState(ROUNDS[0].id);
  const round = ROUNDS.find((r) => r.id === activeRound);
  const course = COURSES.find((c) => c.id === round.courseId);
  const result = useMemo(
    () => computeSkinsForRound(round, players, scores, course, groups),
    [round, players, scores, course, groups]
  );

  const payoutPer = result?.payoutPerSkin || 0;
  const totals = players.map((p) => {
    const skins = result?.skinsByPlayer.get(p.id) || 0;
    return { player: p, skins, payout: skins * payoutPer };
  }).sort((a, b) => b.skins - a.skins);
  const anySkins = totals.some((t) => t.skins > 0);
  const fmtUsd = (n) => `$${n.toFixed(2)}`;

  return (
    <section className="mt-10">
      <SectionTitle eyebrow="Side Game" title="The Skins" />

      {/* DAY SELECTOR */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {ROUNDS.map((r, i) => {
          const active = r.id === activeRound;
          return (
            <button
              key={r.id}
              onClick={() => setActiveRound(r.id)}
              className="text-left rounded relative overflow-hidden transition-all"
              style={{
                background: active ? C.greenDk : 'white',
                color: active ? C.cream : C.ink,
                border: `1px solid ${active ? C.greenDk : C.rule}`,
                boxShadow: active ? '0 6px 14px rgba(6,58,38,0.15)' : 'none',
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: C.gold }} />
              <div className="p-5">
                <div className="smallcaps text-[11px] mb-1" style={{ color: active ? C.gold : C.goldDk }}>
                  Day {i + 1} · {r.day} {r.date}
                </div>
                <div className="font-display text-2xl" style={{ color: active ? C.cream : C.greenDkr }}>
                  {r.course}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* POT SUMMARY */}
      <div className="mb-6 p-4 rounded flex items-center justify-between flex-wrap gap-3" style={{ background: C.greenDk, color: C.cream }}>
        <div>
          <div className="smallcaps text-[11px]" style={{ color: C.gold }}>Round Pot</div>
          <div className="font-display text-2xl">${result?.pot ?? 0}</div>
        </div>
        <div>
          <div className="smallcaps text-[11px]" style={{ color: C.gold }}>Skins Won</div>
          <div className="font-display text-2xl">{result?.totalSkins ?? 0}</div>
        </div>
        <div>
          <div className="smallcaps text-[11px]" style={{ color: C.gold }}>Payout per Skin</div>
          <div className="font-display text-2xl">{result?.totalSkins > 0 ? fmtUsd(payoutPer) : '—'}</div>
        </div>
      </div>

      {/* STANDINGS */}
      <div className="mb-3 smallcaps text-[11px]" style={{ color: C.goldDk }}>Skins Won</div>
      <div className="rounded mb-8" style={{ border: `1px solid ${C.rule}`, background: 'white' }}>
        <table className="w-full text-sm tabular">
          <thead>
            <tr className="text-left" style={{ background: C.greenDk, color: C.cream }}>
              <th className="py-3 px-3 smallcaps text-[11px] w-12">Pos</th>
              <th className="py-3 px-3 smallcaps text-[11px]">Player</th>
              <th className="py-3 px-3 smallcaps text-[11px] text-right">Skins</th>
              <th className="py-3 px-3 smallcaps text-[11px] text-right" style={{ color: C.gold }}>Payout</th>
            </tr>
          </thead>
          <tbody>
            {totals.map((row, i) => {
              const leader = i === 0 && row.skins > 0;
              return (
                <tr key={row.player.id} className="border-t" style={{ borderColor: C.rule, background: leader ? '#FBF5DF' : 'transparent' }}>
                  <td className="py-3 px-3 font-display text-lg" style={{ color: leader ? C.goldDk : C.ink }}>
                    {row.skins > 0 ? i + 1 : '—'}
                  </td>
                  <td className="py-3 px-3 font-display text-lg">
                    {playerLabel(row.player)}
                    {leader && <Trophy size={14} className="inline ml-2" style={{ color: C.gold }} />}
                  </td>
                  <td className="py-3 px-3 text-right font-display text-xl font-mono" style={{ color: row.skins > 0 ? C.greenDk : '#bfb89e' }}>
                    {row.skins > 0 ? row.skins : '—'}
                  </td>
                  <td className="py-3 px-3 text-right font-display text-xl font-mono" style={{ color: row.skins > 0 ? C.greenDk : '#bfb89e' }}>
                    {row.skins > 0 ? fmtUsd(row.payout) : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* HOLE-BY-HOLE */}
      <div className="mb-3 smallcaps text-[11px]" style={{ color: C.goldDk }}>Hole-by-Hole</div>
      <div className="rounded" style={{ border: `1px solid ${C.rule}`, background: 'white' }}>
        <table className="w-full text-sm tabular">
          <thead>
            <tr className="text-left" style={{ background: C.greenDk, color: C.cream }}>
              <th className="py-3 px-2 smallcaps text-[11px] w-14 text-center">Hole</th>
              <th className="py-3 px-2 smallcaps text-[11px] w-14 text-center">Par</th>
              <th className="py-3 px-3 smallcaps text-[11px]">Result</th>
              <th className="py-3 px-3 smallcaps text-[11px] text-right">Net</th>
              <th className="py-3 px-3 smallcaps text-[11px] text-right" style={{ color: C.gold }}>Skins</th>
            </tr>
          </thead>
          <tbody>
            {result?.holes.map((h) => {
              const par = course.holes[h.hole - 1].par;
              let resultCell, netCell, skinsCell;
              if (h.status === 'won') {
                resultCell = <span className="font-display" style={{ color: C.greenDk }}>{playerLabel(h.winner)}</span>;
                netCell = h.net;
                skinsCell = <span className="font-mono" style={{ color: C.greenDk }}>1</span>;
              } else if (h.status === 'tied') {
                resultCell = (
                  <span style={{ color: '#8e8870' }}>
                    <span className="italic">Tie — no skin</span>
                    <div className="text-[10px] mt-0.5">{h.tiedPlayers.map((p) => p.name).join(', ')}</div>
                  </span>
                );
                netCell = h.net;
                skinsCell = <span style={{ color: '#bfb89e' }}>—</span>;
              } else {
                resultCell = <span style={{ color: '#bfb89e' }} className="italic">{h.posted}/{h.total} posted</span>;
                netCell = <span style={{ color: '#bfb89e' }}>—</span>;
                skinsCell = <span style={{ color: '#bfb89e' }}>—</span>;
              }
              return (
                <tr key={h.hole} className="border-t" style={{ borderColor: C.rule }}>
                  <td className="py-2 px-2 font-mono text-center" style={{ color: C.greenDk }}>{h.hole}</td>
                  <td className="py-2 px-2 font-mono text-center" style={{ color: '#6b6555' }}>{par}</td>
                  <td className="py-2 px-3">{resultCell}</td>
                  <td className="py-2 px-3 text-right font-mono" style={{ color: C.ink }}>{netCell}</td>
                  <td className="py-2 px-3 text-right font-mono">{skinsCell}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs italic" style={{ color: '#6b6555' }}>
        Net scoring (strokes off field low man) · Full-field pool across all {players.length} players ·
        Ties get no skin (no carryovers) · ${result?.pot ?? SKINS_POT_PER_ROUND} pot per round is split evenly across skins won.
      </p>

      {!anySkins && (
        <div className="mt-6 p-4 text-sm rounded text-center" style={{ background: C.creamLt, border: `1px solid ${C.rule}` }}>
          No skins awarded yet — holes are only decided once all {players.length} players have posted a score.
        </div>
      )}
    </section>
  );
}

// ============================================================
// COURSES — scorecards & hole-by-hole
// ============================================================
function Courses() {
  const [selectedId, setSelectedId] = useState(null);
  const selected = COURSES.find((c) => c.id === selectedId);

  if (selected) return <CourseDetail course={selected} onBack={() => setSelectedId(null)} />;

  return (
    <section className="mt-10">
      <SectionTitle eyebrow="Reunion Resort & Golf Club" title="The Courses" />

      <div className="grid md:grid-cols-3 gap-5">
        {COURSES.map((c) => {
          const total = c.holes.reduce((a, h) => a + h.par, 0);
          const longest = Math.max(...c.holes.map((h) => h.yards[0]));
          const yardsTotal = c.holes.reduce((a, h) => a + h.yards[0], 0);
          const img = COURSE_IMGS[c.id];
          return (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className="text-left rounded relative overflow-hidden transition-transform hover:-translate-y-0.5 group"
              style={{ background: 'white', border: `1px solid ${C.rule}` }}
            >
              <div className="relative h-48 overflow-hidden">
                <div
                  className="absolute inset-0 transition-transform group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(6,58,38,0.7) 100%)`,
                  }}
                />
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="smallcaps text-[10px] mb-1" style={{ color: C.gold }}>{c.subtitle}</div>
                  <h3 className="font-display text-3xl" style={{ color: C.cream }}>{c.name}</h3>
                </div>
              </div>
              <div className="h-1" style={{ background: C.gold }} />
              <div className="p-5">
                <div className="flex items-baseline gap-4 text-sm" style={{ color: '#6b6555' }}>
                  <span><span className="font-mono" style={{ color: C.greenDk }}>{total}</span> par</span>
                  <span><span className="font-mono" style={{ color: C.greenDk }}>{yardsTotal.toLocaleString()}</span> yds</span>
                  <span><span className="font-mono" style={{ color: C.greenDk }}>{longest}</span> longest</span>
                </div>
                <div className="mt-3 smallcaps text-[11px] flex items-center gap-2" style={{ color: C.goldDk }}>
                  <span>Tee time</span>
                  <span className="font-mono" style={{ color: C.greenDk }}>00:00</span>
                </div>
                <div className="mt-3 smallcaps text-[11px] flex items-center gap-2" style={{ color: C.greenDk }}>
                  View scorecard <ChevronRight size={12} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-10 mx-auto rounded overflow-hidden relative w-full md:max-w-[50%]" style={{ background: C.creamLt, border: `1px solid ${C.rule}` }}>
        <img src={courseMapImg} alt="Reunion Resort routing map" className="w-full block" />
        <div className="absolute top-3 left-3 smallcaps text-[10px] px-2 py-1 rounded" style={{ background: C.greenDk, color: C.gold }}>
          Property Map · Three Signature Courses
        </div>
      </div>
    </section>
  );
}

function CourseDetail({ course, onBack }) {
  const front = course.holes.slice(0, 9);
  const back = course.holes.slice(9);
  const sumPar = (arr) => arr.reduce((a, h) => a + h.par, 0);
  const sumYards = (arr, teeIdx) => arr.reduce((a, h) => a + h.yards[teeIdx], 0);
  const totalPar = sumPar(course.holes);
  const img = COURSE_IMGS[course.id];

  return (
    <section className="mt-10">
      <button
        onClick={onBack}
        className="smallcaps text-[11px] flex items-center gap-1 mb-6 hover:opacity-70"
        style={{ color: C.greenDk }}
      >
        <ChevronLeft size={14} /> All courses
      </button>

      {/* Hero banner */}
      <div className="relative rounded overflow-hidden mb-8" style={{ height: 280 }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(6,58,38,0.85) 100%)`,
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-6 text-center">
          <div className="smallcaps text-xs mb-2" style={{ color: C.gold }}>{course.subtitle}</div>
          <h2 className="font-display text-6xl" style={{ color: C.cream }}>{course.name}</h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <svg width="46" height="10" viewBox="0 0 46 10" aria-hidden="true">
              <line x1="0" y1="5" x2="40" y2="5" stroke={C.gold} strokeWidth="1" />
              <circle cx="44" cy="5" r="2" fill={C.gold} />
            </svg>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M7 0 L8.6 5.4 L14 7 L8.6 8.6 L7 14 L5.4 8.6 L0 7 L5.4 5.4 Z" fill={C.gold} />
            </svg>
            <svg width="46" height="10" viewBox="0 0 46 10" aria-hidden="true">
              <circle cx="2" cy="5" r="2" fill={C.gold} />
              <line x1="6" y1="5" x2="46" y2="5" stroke={C.gold} strokeWidth="1" />
            </svg>
          </div>
          <div className="mt-3 text-sm" style={{ color: C.cream }}>
            Par {totalPar} · {course.holes.length} holes · {course.tees.length} {course.tees.length === 1 ? 'tee box' : 'tee boxes'}
          </div>
          {course.source && (
            <div className="mt-1 smallcaps text-[10px]" style={{ color: C.gold }}>{course.source}</div>
          )}
        </div>
      </div>

      {/* SCORECARD TABLE */}
      <div className="overflow-x-auto rounded mb-10" style={{ border: `1px solid ${C.rule}`, background: 'white' }}>
        <table className="w-full text-xs tabular">
          <thead>
            <tr style={{ background: C.greenDk, color: C.cream }}>
              <th className="py-2 px-2 smallcaps text-[10px] text-left">Tee</th>
              {front.map((h) => (
                <th key={h.hole} className="py-2 px-2 font-mono text-[11px] text-right">{h.hole}</th>
              ))}
              <th className="py-2 px-2 smallcaps text-[10px] text-right" style={{ color: C.gold }}>Out</th>
              {back.map((h) => (
                <th key={h.hole} className="py-2 px-2 font-mono text-[11px] text-right">{h.hole}</th>
              ))}
              <th className="py-2 px-2 smallcaps text-[10px] text-right" style={{ color: C.gold }}>In</th>
              <th className="py-2 px-2 smallcaps text-[10px] text-right" style={{ color: C.gold }}>Tot</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t" style={{ borderColor: C.rule, background: C.creamLt }}>
              <td className="py-2 px-2 smallcaps text-[10px]" style={{ color: C.goldDk }}>Par</td>
              {front.map((h) => (
                <td key={h.hole} className="py-2 px-2 font-mono text-right" style={{ color: C.greenDkr }}>{h.par}</td>
              ))}
              <td className="py-2 px-2 font-mono text-right font-bold" style={{ color: C.greenDk }}>{sumPar(front)}</td>
              {back.map((h) => (
                <td key={h.hole} className="py-2 px-2 font-mono text-right" style={{ color: C.greenDkr }}>{h.par}</td>
              ))}
              <td className="py-2 px-2 font-mono text-right font-bold" style={{ color: C.greenDk }}>{sumPar(back)}</td>
              <td className="py-2 px-2 font-mono text-right font-bold" style={{ color: C.greenDk }}>{totalPar}</td>
            </tr>
            {course.holes.some((h) => h.hcp != null) && (
              <tr className="border-t" style={{ borderColor: C.rule }}>
                <td className="py-2 px-2 smallcaps text-[10px]" style={{ color: C.goldDk }}>Hcp</td>
                {front.map((h) => (
                  <td key={h.hole} className="py-2 px-2 font-mono text-right" style={{ color: '#6b6555' }}>{h.hcp ?? '—'}</td>
                ))}
                <td className="py-2 px-2 font-mono text-right" style={{ color: '#6b6555' }}>—</td>
                {back.map((h) => (
                  <td key={h.hole} className="py-2 px-2 font-mono text-right" style={{ color: '#6b6555' }}>{h.hcp ?? '—'}</td>
                ))}
                <td className="py-2 px-2 font-mono text-right" style={{ color: '#6b6555' }}>—</td>
                <td className="py-2 px-2 font-mono text-right" style={{ color: '#6b6555' }}>—</td>
              </tr>
            )}
            {course.tees.map((tee, idx) => {
              const isCombo = tee.includes('/');
              const comboParts = isCombo ? tee.split('/') : [tee];
              const yardCell = (h) => {
                if (isCombo && h.tee) {
                  const c = teeColor(h.tee);
                  const isBlueLike = h.tee === 'Blue' || h.tee === 'Black';
                  return (
                    <td
                      key={h.hole}
                      className="py-2 px-2 font-mono text-right"
                      style={{ background: c, color: isBlueLike ? C.cream : C.greenDkr }}
                    >
                      {h.yards[idx]}
                    </td>
                  );
                }
                return (
                  <td key={h.hole} className="py-2 px-2 font-mono text-right" style={{ color: C.ink }}>{h.yards[idx]}</td>
                );
              };
              return (
                <tr key={tee} className="border-t" style={{ borderColor: C.rule }}>
                  <td className="py-2 px-2 smallcaps text-[10px]" style={{ color: isCombo ? C.ink : teeColor(tee) }}>
                    {isCombo ? (
                      <span className="inline-flex items-center mr-1.5 align-middle">
                        {comboParts.map((part, i) => (
                          <span
                            key={part}
                            className="inline-block w-2 h-2 rounded-full"
                            style={{ background: teeColor(part), marginLeft: i === 0 ? 0 : -3, border: '1px solid white' }}
                          />
                        ))}
                      </span>
                    ) : (
                      <span className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle" style={{ background: teeColor(tee) }} />
                    )}
                    {tee}
                  </td>
                  {front.map((h) => yardCell(h))}
                  <td className="py-2 px-2 font-mono text-right font-bold" style={{ color: C.greenDk }}>{sumYards(front, idx)}</td>
                  {back.map((h) => yardCell(h))}
                  <td className="py-2 px-2 font-mono text-right font-bold" style={{ color: C.greenDk }}>{sumYards(back, idx)}</td>
                  <td className="py-2 px-2 font-mono text-right font-bold" style={{ color: C.greenDk }}>{sumYards(course.holes, idx)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </section>
  );
}

function teeColor(tee) {
  const map = {
    Black: '#1A1A14',
    Blue:  '#2C5AA0',
    White: '#9a9484',
    Gold:  '#C9A961',
    Red:   '#B0413E',
  };
  return map[tee] || '#6b6555';
}

// ============================================================
// SCORECARD — pick a day, then enter scores for every player
// ============================================================
const SCORECARD_PASSWORD = 'dw2026!';
const SCORECARD_UNLOCK_KEY = 'dw-invitational-scorecard-unlocked';

function Scorecard({ players, scores, setScores, teams, groups }) {
  const [activeRound, setActiveRound] = useState(ROUNDS[0].id);
  const round = ROUNDS.find((r) => r.id === activeRound);
  const course = COURSES.find((c) => c.id === round.courseId);
  const [unlocked, setUnlocked] = useState(() => {
    try { return sessionStorage.getItem(SCORECARD_UNLOCK_KEY) === '1'; } catch { return false; }
  });
  const [pwAttempt, setPwAttempt] = useState('');
  const [pwError, setPwError] = useState(false);

  const tryUnlock = () => {
    if (pwAttempt === SCORECARD_PASSWORD) {
      setUnlocked(true);
      setPwError(false);
      try { sessionStorage.setItem(SCORECARD_UNLOCK_KEY, '1'); } catch {}
    } else {
      setPwError(true);
    }
  };

  const setHole = (playerId, holeIdx, value) => {
    if (!unlocked) return;
    const v = parseInt(value, 10);
    setScores((prev) => {
      const next = { ...prev };
      if (!next[activeRound]) next[activeRound] = {};
      const arr = [...(next[activeRound][playerId] || Array(18).fill(null))];
      arr[holeIdx] = Number.isFinite(v) ? Math.max(1, Math.min(15, v)) : null;
      next[activeRound] = { ...next[activeRound], [playerId]: arr };
      return next;
    });
  };

  return (
    <section className="mt-10">
      <SectionTitle eyebrow="Post a Score" title="The Scorecard" />

      {!unlocked && (
        <div className="mb-8 mx-auto max-w-md p-5 rounded" style={{ background: C.creamLt, border: `1px solid ${C.rule}` }}>
          <div className="smallcaps text-[11px] mb-2" style={{ color: C.goldDk }}>Score Entry Locked</div>
          <div className="text-sm mb-3" style={{ color: C.ink }}>
            Enter the scorekeeper password to post or edit scores.
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={pwAttempt}
              onChange={(e) => { setPwAttempt(e.target.value); setPwError(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter') tryUnlock(); }}
              placeholder="Password"
              className="flex-1 text-sm bg-white outline-none rounded px-3 py-2"
              style={{ border: `1px solid ${pwError ? '#B0413E' : C.rule}`, color: C.ink }}
            />
            <button
              onClick={tryUnlock}
              className="smallcaps text-[11px] px-4 py-2 rounded"
              style={{ background: C.greenDk, color: C.gold, border: `1px solid ${C.greenDk}` }}
            >
              Unlock
            </button>
          </div>
          {pwError && (
            <div className="text-[11px] mt-2" style={{ color: '#B0413E' }}>Incorrect password.</div>
          )}
        </div>
      )}

      {/* DAY SELECTOR */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {ROUNDS.map((r, i) => {
          const active = r.id === activeRound;
          return (
            <button
              key={r.id}
              onClick={() => setActiveRound(r.id)}
              className="text-left rounded relative overflow-hidden transition-all"
              style={{
                background: active ? C.greenDk : 'white',
                color: active ? C.cream : C.ink,
                border: `1px solid ${active ? C.greenDk : C.rule}`,
                boxShadow: active ? '0 6px 14px rgba(6,58,38,0.15)' : 'none',
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: C.gold }} />
              <div className="p-5">
                <div className="smallcaps text-[11px] mb-1" style={{ color: active ? C.gold : C.goldDk }}>
                  Day {i + 1} · {r.day} {r.date}
                </div>
                <div className="font-display text-2xl mb-1" style={{ color: active ? C.cream : C.greenDkr }}>
                  {r.course}
                </div>
                <div className="smallcaps text-[10px]" style={{ color: active ? C.gold : '#8e8870' }}>
                  Par {round && r.id === round.id ? course.holes.reduce((a, h) => a + h.par, 0) : 72} · Stableford
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* PER-PLAYER SCORECARDS */}
      <div className="space-y-4">
        {players.map((p) => (
          <PlayerScorecard
            key={p.id}
            player={p}
            course={course}
            teams={teams}
            round={round}
            allPlayers={players}
            groups={groups}
            disabled={!unlocked}
            playerScores={scores?.[activeRound]?.[p.id] || Array(18).fill(null)}
            onSetHole={(holeIdx, value) => setHole(p.id, holeIdx, value)}
          />
        ))}
      </div>

      <p className="mt-6 text-xs italic text-center" style={{ color: '#6b6555' }}>
        Type a number into any hole to record a score. Totals update live and save automatically.
      </p>
    </section>
  );
}

function StrokeDots({ n }) {
  if (!n || n <= 0) return null;
  const dots = Array.from({ length: Math.min(n, 4) });
  return (
    <div className="flex items-center justify-center gap-0.5 mt-0.5" aria-label={`${n} stroke${n > 1 ? 's' : ''}`}>
      {dots.map((_, i) => (
        <span
          key={i}
          className="inline-block rounded-full"
          style={{ width: 4, height: 4, background: C.gold }}
        />
      ))}
      {n > 4 && <span className="text-[8px] font-mono ml-0.5" style={{ color: C.goldDk }}>×{n}</span>}
    </div>
  );
}

function PlayerScorecard({ player, course, teams, round, allPlayers, groups, playerScores, onSetHole, disabled }) {
  const teamName = (teams || []).find((t) => t.id === player.team)?.name || player.team;
  const isMobile = useIsMobile();
  const front = course.holes.slice(0, 9);
  const back = course.holes.slice(9);
  const strokes = round
    ? strokesForRound(player, round, groups, allPlayers || [], course)
    : Array(course.holes.length).fill(0);
  const totalStrokes = strokes.reduce((a, b) => a + b, 0);
  const sumPar = (arr) => arr.reduce((a, h) => a + h.par, 0);
  const sumScore = (arr, offset = 0) =>
    arr.reduce((a, _h, i) => a + (Number.isFinite(playerScores[i + offset]) ? playerScores[i + offset] : 0), 0);
  const filled = playerScores.filter((s) => Number.isFinite(s)).length;

  const total = playerScores.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
  const totalPar = sumPar(course.holes);
  const toPar = total - sumPar(course.holes.slice(0, filled));

  return (
    <div className="rounded overflow-hidden" style={{ border: `1px solid ${C.rule}`, background: 'white' }}>
      {/* Player header */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ background: C.greenDk, color: C.cream }}>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="font-display text-xl">{playerLabel(player)}</span>
          {player.team && (
            <span
              className="smallcaps text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: C.gold, color: C.greenDkr }}
            >
              {teamName}
            </span>
          )}
          <span className="smallcaps text-[10px]" style={{ color: C.gold }}>
            Strokes {totalStrokes}
          </span>
        </div>
        <div className="flex items-baseline gap-4 text-sm">
          <span className="smallcaps text-[10px]" style={{ color: C.gold }}>Holes</span>
          <span className="font-mono">{filled}/18</span>
          <span className="smallcaps text-[10px]" style={{ color: C.gold }}>Total</span>
          <span className="font-display text-2xl">{total || '—'}</span>
          {filled > 0 && (
            <span className="font-mono text-xs" style={{ color: C.gold }}>
              {formatToPar(toPar)}
            </span>
          )}
        </div>
      </div>

      {/* MOBILE: front 9 + back 9 stacked vertically (no horizontal scroll) */}
      {isMobile ? (
        <div>
          <NineTable
            label="Front 9"
            totalLabel="Out"
            holes={front}
            holeOffset={0}
            playerScores={playerScores}
            onSetHole={onSetHole}
            strokes={strokes}
            disabled={disabled}
          />
          <NineTable
            label="Back 9"
            totalLabel="In"
            holes={back}
            holeOffset={9}
            playerScores={playerScores}
            onSetHole={onSetHole}
            strokes={strokes}
            disabled={disabled}
            grandTotal={total}
            grandTotalPar={totalPar}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs tabular">
            <thead>
              <tr style={{ background: C.creamLt }}>
                <th className="py-1.5 px-2 smallcaps text-[10px] text-left" style={{ color: '#8e8870' }}>Hole</th>
                {front.map((h, i) => (
                  <th key={h.hole} className="py-1.5 px-1 font-mono text-[11px] align-top" style={{ color: C.greenDk }}>
                    <div>{h.hole}</div>
                    <StrokeDots n={strokes[i]} />
                  </th>
                ))}
                <th className="py-1.5 px-1 smallcaps text-[10px]" style={{ color: C.goldDk }}>Out</th>
                {back.map((h, i) => (
                  <th key={h.hole} className="py-1.5 px-1 font-mono text-[11px] align-top" style={{ color: C.greenDk }}>
                    <div>{h.hole}</div>
                    <StrokeDots n={strokes[i + 9]} />
                  </th>
                ))}
                <th className="py-1.5 px-1 smallcaps text-[10px]" style={{ color: C.goldDk }}>In</th>
                <th className="py-1.5 px-2 smallcaps text-[10px]" style={{ color: C.goldDk }}>Tot</th>
              </tr>
              <tr className="border-t" style={{ borderColor: C.rule }}>
                <th className="py-1.5 px-2 smallcaps text-[10px] text-left" style={{ color: '#8e8870' }}>Par</th>
                {front.map((h) => (
                  <th key={h.hole} className="py-1.5 px-1 font-mono text-[11px]" style={{ color: '#6b6555' }}>{h.par}</th>
                ))}
                <th className="py-1.5 px-1 font-mono text-[11px]" style={{ color: C.goldDk }}>{sumPar(front)}</th>
                {back.map((h) => (
                  <th key={h.hole} className="py-1.5 px-1 font-mono text-[11px]" style={{ color: '#6b6555' }}>{h.par}</th>
                ))}
                <th className="py-1.5 px-1 font-mono text-[11px]" style={{ color: C.goldDk }}>{sumPar(back)}</th>
                <th className="py-1.5 px-2 font-mono text-[11px]" style={{ color: C.goldDk }}>{totalPar}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t" style={{ borderColor: C.rule }}>
                <td className="py-1.5 px-2 smallcaps text-[10px]" style={{ color: C.goldDk }}>Score</td>
                {front.map((h, i) => (
                  <td key={h.hole} className="py-0.5 px-0.5">
                    <ScoreInput value={playerScores[i]} par={h.par} onChange={(v) => onSetHole(i, v)} disabled={disabled} />
                  </td>
                ))}
                <td className="py-1.5 px-1 font-mono text-center font-bold" style={{ color: C.greenDk }}>
                  {sumScore(front, 0) || '—'}
                </td>
                {back.map((h, i) => (
                  <td key={h.hole} className="py-0.5 px-0.5">
                    <ScoreInput value={playerScores[i + 9]} par={h.par} onChange={(v) => onSetHole(i + 9, v)} disabled={disabled} />
                  </td>
                ))}
                <td className="py-1.5 px-1 font-mono text-center font-bold" style={{ color: C.greenDk }}>
                  {sumScore(back, 9) || '—'}
                </td>
                <td className="py-1.5 px-2 font-mono text-center font-bold" style={{ color: C.greenDk }}>
                  {total || '—'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function NineTable({ label, totalLabel, holes, holeOffset, playerScores, onSetHole, strokes, disabled, grandTotal, grandTotalPar }) {
  const sumPar = holes.reduce((a, h) => a + h.par, 0);
  const sumScore = holes.reduce(
    (a, _h, i) => a + (Number.isFinite(playerScores[i + holeOffset]) ? playerScores[i + holeOffset] : 0),
    0
  );
  return (
    <div className="border-t" style={{ borderColor: C.rule }}>
      <div className="px-3 py-1.5 smallcaps text-[10px]" style={{ background: C.creamLt, color: C.goldDk }}>
        {label}
      </div>
      <table className="w-full text-xs tabular table-fixed">
        <thead>
          <tr style={{ background: C.creamLt }}>
            <th className="py-1 px-1 smallcaps text-[10px] text-left" style={{ width: 38, color: '#8e8870' }}>Hole</th>
            {holes.map((h, i) => (
              <th key={h.hole} className="py-1 px-0.5 font-mono text-[11px] align-top" style={{ color: C.greenDk }}>
                <div>{h.hole}</div>
                <StrokeDots n={strokes?.[i + holeOffset]} />
              </th>
            ))}
            <th className="py-1 px-1 smallcaps text-[10px]" style={{ width: 36, color: C.goldDk }}>{totalLabel}</th>
          </tr>
          <tr className="border-t" style={{ borderColor: C.rule }}>
            <th className="py-1 px-1 smallcaps text-[10px] text-left" style={{ color: '#8e8870' }}>Par</th>
            {holes.map((h) => (
              <th key={h.hole} className="py-1 px-0.5 font-mono text-[11px]" style={{ color: '#6b6555' }}>{h.par}</th>
            ))}
            <th className="py-1 px-1 font-mono text-[11px]" style={{ color: C.goldDk }}>{sumPar}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t" style={{ borderColor: C.rule }}>
            <td className="py-1 px-1 smallcaps text-[10px]" style={{ color: C.goldDk }}>Score</td>
            {holes.map((h, i) => (
              <td key={h.hole} className="py-0.5 px-0.5">
                <ScoreInput value={playerScores[i + holeOffset]} par={h.par} onChange={(v) => onSetHole(i + holeOffset, v)} disabled={disabled} />
              </td>
            ))}
            <td className="py-1 px-1 font-mono text-center font-bold" style={{ color: C.greenDk }}>
              {sumScore || '—'}
            </td>
          </tr>
        </tbody>
      </table>
      {grandTotal !== undefined && (
        <div className="px-3 py-2 border-t flex items-center justify-between" style={{ borderColor: C.rule, background: C.creamLt }}>
          <span className="smallcaps text-[10px]" style={{ color: C.goldDk }}>18-Hole Total</span>
          <span className="font-display text-xl tabular" style={{ color: C.greenDk }}>
            {grandTotal || '—'}
            <span className="font-mono text-xs ml-2" style={{ color: '#8e8870' }}>par {grandTotalPar}</span>
          </span>
        </div>
      )}
    </div>
  );
}

function ScoreInput({ value, par, onChange, disabled }) {
  const filled = Number.isFinite(value);
  const diff = filled ? value - par : 0;
  // Augusta-style score color
  let color = C.ink;
  if (filled) {
    if (diff <= -2) color = '#7B1FA2';
    else if (diff === -1) color = '#1B5E20';
    else if (diff === 0) color = C.ink;
    else if (diff === 1) color = '#B0413E';
    else color = '#6E0E0A';
  }
  return (
    <input
      type="text"
      inputMode="numeric"
      value={value ?? ''}
      readOnly={disabled}
      onChange={(e) => {
        if (disabled) return;
        const digits = e.target.value.replace(/\D/g, '').slice(0, 2);
        onChange(digits);
      }}
      placeholder="—"
      className="w-full text-center font-mono text-sm bg-transparent outline-none rounded py-1 px-0 transition-colors"
      style={{
        border: `1px solid ${filled ? C.gold : C.rule}`,
        color,
        fontWeight: filled ? 600 : 400,
      }}
    />
  );
}

// ============================================================
// SHARED BITS
// ============================================================
function SectionTitle({ eyebrow, title }) {
  return (
    <div className="mb-10 text-center relative">
      <div className="smallcaps text-xs mb-2" style={{ color: C.goldDk }}>{eyebrow}</div>
      <h2 className="font-display text-5xl" style={{ color: C.greenDkr }}>{title}</h2>
      <div className="flex items-center justify-center gap-3 mt-4">
        <svg width="46" height="10" viewBox="0 0 46 10" aria-hidden="true">
          <line x1="0" y1="5" x2="40" y2="5" stroke={C.gold} strokeWidth="1" />
          <circle cx="44" cy="5" r="2" fill={C.gold} />
        </svg>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M7 0 L8.6 5.4 L14 7 L8.6 8.6 L7 14 L5.4 8.6 L0 7 L5.4 5.4 Z" fill={C.gold} />
        </svg>
        <svg width="46" height="10" viewBox="0 0 46 10" aria-hidden="true">
          <circle cx="2" cy="5" r="2" fill={C.gold} />
          <line x1="6" y1="5" x2="46" y2="5" stroke={C.gold} strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer
      className="relative mt-16 py-10 text-center border-t overflow-hidden"
      style={{ borderColor: C.rule, background: C.greenDk, color: C.gold }}
    >
      <PalmFronds />
      <div className="relative flex flex-col items-center gap-3">
        <img src={logoUrl} alt="DW Invitational" className="h-10 opacity-90" style={{ filter: 'brightness(0) invert(1)' }} />
        <div className="smallcaps text-[10px]" style={{ color: C.gold }}>
          A Tradition Unlike Any Other · Reunion Resort · November 2026
        </div>
      </div>
    </footer>
  );
}
