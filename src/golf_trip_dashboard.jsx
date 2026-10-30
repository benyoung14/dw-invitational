import { useState, useEffect, useMemo, useRef, Fragment as ReactFragment } from 'react';
const React = { Fragment: ReactFragment };
import { Trophy, Calendar, Users, ClipboardList, Flag, ChevronLeft, ChevronRight, Shield, Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudLightning, Snowflake, Droplets, Wind, DollarSign, Check, ChevronDown } from 'lucide-react';
import logoUrl from './assets/logo.svg';
import { supabase, TABLE, SHARED_ROW_ID } from './supabase';
import { buildXlsx, downloadBlob } from './xlsx';

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
  let pts = 0, filled = 0, birdies = 0;
  roundScores.forEach((gross, i) => {
    if (!Number.isFinite(gross)) return;
    filled++;
    const diff = gross - course.holes[i].par;
    if (diff <= -1) birdies++;
    if (diff <= -2) pts += 8;
    else if (diff === -1) pts += 4;
    else if (diff === 0) pts += 2;
    else if (diff === 1) pts += 1;
    else if (diff === 2) pts += 0;
    else pts -= 1; // triple bogey or worse
  });
  return { points: pts, filled, birdies };
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

  // `played` marks rounds where the team has a result, so a real 0 can be
  // told apart from a round that hasn't finished yet.
  const teamTotals = teams.map((t) => {
    const perRound = roundResults.map((rr) => rr.pointsByTeam?.get(t.id) ?? 0);
    const played = roundResults.map((rr) => !!rr.pointsByTeam?.has(t.id));
    const total = perRound.reduce((a, b) => a + b, 0);
    return { team: t, perRound, played, total };
  }).sort((a, b) => b.total - a.total);

  // Mankles display: for each round the player posted scores in, the
  // round value is (handicap + Stableford points). Total sums across
  // rounds. Unplayed rounds contribute 0. Ties on total are broken by
  // most gross birdies-or-better across all rounds.
  const mankles = players.map((p) => {
    const hcp = Math.round(p.handicap ?? 0);
    let total = 0;
    let filled = 0;
    let birdies = 0;
    const perRound = rounds.map((r) => {
      const course = courseById(r.courseId);
      const sp = stablefordPoints(p, r, scores, course, groups, players);
      if (sp && sp.filled > 0) {
        const roundValue = hcp + sp.points;
        total += roundValue;
        filled += sp.filled;
        birdies += sp.birdies;
        return { points: sp.points, roundValue, played: true };
      }
      return { points: 0, roundValue: 0, played: false };
    });
    return { player: p, perRound, total, filled, birdies };
  }).sort((a, b) => b.total - a.total || b.birdies - a.birdies);

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
  // When scores last changed (any phone). Saved beside the data as `scoresAt`;
  // older rows fall back to the row's updated_at.
  const [scoresAt, setScoresAt] = useState(null);
  const scoresAtRef = useRef(null);
  const savedScoresRef = useRef(null);
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

  const noteScoresAt = (s, rowUpdatedAt) => {
    const at = s?.scoresAt || rowUpdatedAt || null;
    if (s?.scores) savedScoresRef.current = JSON.stringify(s.scores);
    if (at) { scoresAtRef.current = at; setScoresAt(at); }
  };

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
        .select('data, updated_at')
        .eq('id', SHARED_ROW_ID)
        .maybeSingle()
        .then(({ data, error }) => {
          if (cancelled) return;
          if (error) console.warn('[supabase] load error', error);
          // If the user has already started editing before the fetch resolved,
          // don't clobber their work with the remote snapshot.
          if (isPristine()) { applyState(data?.data); noteScoresAt(data?.data, data?.updated_at); }
          setLoaded(true);
        });

      channel = supabase
        .channel('app_state_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: TABLE, filter: `id=eq.${SHARED_ROW_ID}` },
          (payload) => { applyState(payload.new?.data); noteScoresAt(payload.new?.data, payload.new?.updated_at); },
        )
        .subscribe();
    } else {
      try {
        const raw = localStorage.getItem('dw-invitational-v2');
        if (raw && isPristine()) { const saved = JSON.parse(raw); applyState(saved); noteScoresAt(saved); }
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
      const now = new Date().toISOString();
      const scoresJson = JSON.stringify(payload.scores);
      if (scoresJson !== savedScoresRef.current) {
        savedScoresRef.current = scoresJson;
        scoresAtRef.current = now;
        setScoresAt(now);
      }
      const data = scoresAtRef.current ? { ...payload, scoresAt: scoresAtRef.current } : payload;
      if (supabase) {
        const { error } = await supabase
          .from(TABLE)
          .upsert({ id: SHARED_ROW_ID, data, updated_at: now });
        if (error) console.warn('[supabase] save error', error);
      } else {
        try { localStorage.setItem('dw-invitational-v2', JSON.stringify(data)); } catch {}
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
    // mankles is best-first (birdie tiebreak included); reverse for low seeds first.
    const ranked = [...mankles].reverse();
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
      <MankTicker players={players} scores={scores} teams={teams} groups={groups} onClick={() => setTab('leaderboard')} />
      <WeatherStrip />
      <Nav tab={tab} setTab={setTab} />

      <main className="relative max-w-[1500px] mx-auto px-6 pb-20">
        <TopoPattern opacity={0.04} />
        <div className="relative" style={{ zIndex: 1 }}>
        {['leaderboard', 'teams', 'payouts', 'scorecard'].includes(tab) && <ScoresUpdated at={scoresAt} scores={scores} />}
        {tab === 'leaderboard' && <Leaderboard players={players} scores={scores} teams={teams} groups={groups} />}
        {tab === 'schedule'    && <Schedule players={players} groups={groups} setGroups={setGroups} />}
        {tab === 'roster'      && <Roster players={players} setPlayers={setPlayers} teams={teams} />}
        {tab === 'teams'       && <Teams players={players} scores={scores} teams={teams} setTeams={setTeams} groups={groups} />}
        {tab === 'payouts'     && <Payouts players={players} scores={scores} setScores={setScores} teams={teams} groups={groups} />}
        {tab === 'courses'     && <Courses groups={groups} />}
        {tab === 'scorecard'   && <Scorecard players={players} scores={scores} setScores={setScores} teams={teams} groups={groups} />}
        </div>
      </main>

      <Footer state={{ players, scores, teams, groups }} />
    </div>
  );
}

// "Scores updated Thu 4:12 PM" — so everyone can tell they're looking at the latest.
function ScoresUpdated({ at, scores }) {
  const hasScores = ROUNDS.some((r) => Object.keys(scores?.[r.id] || {}).length > 0);
  if (!hasScores || !at) return null;
  const d = new Date(at);
  if (Number.isNaN(d.getTime())) return null;
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const days = (Date.now() - d.getTime()) / 86400000;
  const when = new Date().toDateString() === d.toDateString()
    ? `today ${time}`
    : days < 6
      ? `${d.toLocaleDateString('en-US', { weekday: 'short' })} ${time}`
      : `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${time}`;
  return (
    <div className="pt-4 -mb-6 text-center text-[11px] italic" style={{ color: '#8e8870' }}>
      Scores updated {when}
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
// ============================================================
// MANKLES TICKER — scrolling leaderboard strip across the top
// ============================================================

// The Mankles trophy — a silver apple-shaped kitchen timer. The top half
// of the apple twists to set the dial; a seam runs around the middle,
// a short dark stem sits on top, and tiny tick marks suggest the dial.
function AppleTimer({ size = 18 }) {
  const id = useMemo(() => `appleg-${Math.random().toString(36).slice(2, 9)}`, []);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: '-3px' }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6f6f6" />
          <stop offset="0.4" stopColor="#d6d6d8" />
          <stop offset="0.7" stopColor="#9b9ca0" />
          <stop offset="1" stopColor="#6d6e72" />
        </linearGradient>
        <linearGradient id={`${id}-hi`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(255,255,255,0)" />
          <stop offset="0.3" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="0.6" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      {/* stem */}
      <rect x="11" y="2.5" width="2" height="3" rx="0.4" fill="#2a2a2a" />
      {/* leaf */}
      <path d="M13 4 Q 16 3 16.5 5 Q 14.5 5.5 13 4 Z" fill="#8e8870" />
      {/* apple body */}
      <path
        d="M12 5.5 C 6 5.5 3 10 3 14 C 3 18.5 7 22 12 22 C 17 22 21 18.5 21 14 C 21 10 18 5.5 12 5.5 Z"
        fill={`url(#${id})`}
        stroke="#5a5b60"
        strokeWidth="0.6"
      />
      {/* soft highlight */}
      <ellipse cx="8.5" cy="9.5" rx="3" ry="1.6" fill="rgba(255,255,255,0.5)" />
      {/* indicator arrow at top of dial */}
      <path d="M12 6.5 L 10.8 8 L 13.2 8 Z" fill="#1a1a1a" />
      {/* seam/dial line around apple middle (twist) */}
      <path
        d="M3.5 14 Q 12 16.5 20.5 14"
        fill="none"
        stroke="#2a2a2a"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
      {/* dial tick marks */}
      <g stroke="#2a2a2a" strokeWidth="0.5" strokeLinecap="round">
        <line x1="6"  y1="12.5" x2="6.6"  y2="13.2" />
        <line x1="9"  y1="11.6" x2="9.4"  y2="12.4" />
        <line x1="15" y1="11.6" x2="14.6" y2="12.4" />
        <line x1="18" y1="12.5" x2="17.4" y2="13.2" />
      </g>
    </svg>
  );
}

function MankTicker({ players, scores, teams, groups, onClick }) {
  const courseById = (id) => COURSES.find((c) => c.id === id);
  const { mankles } = useMemo(
    () => computeStandings(ROUNDS, teams, players, scores, courseById, groups),
    [players, scores, teams, groups]
  );
  const scored = mankles.filter((m) => m.filled > 0);
  if (scored.length === 0) {
    return (
      <div className="w-full py-1.5 overflow-hidden text-center" style={{ background: C.greenDkr, color: C.gold }}>
        <span className="smallcaps text-[10px]">Mankles · scoring opens once rounds begin</span>
      </div>
    );
  }
  // Build ticker content: silver-apple-timer trophy on the leader, then
  // all 15 ranked. Duplicated so the marquee scroll loop stays seamless.
  const entries = mankles.map((m, i) => ({
    rank: i + 1,
    name: m.player.name,
    pts: m.total,
    leader: i === 0 && m.total > 0,
  }));
  const content = (
    <>
      <span className="smallcaps mr-6" style={{ color: C.gold, letterSpacing: '0.12em' }}>
        MANKLES RACE
      </span>
      {entries.map((e, i) => (
        <span key={i} className="mr-6" style={{ color: e.leader ? C.gold : C.cream }}>
          {e.leader && (
            <span className="mr-2 inline-flex items-center" title="Mankles trophy — silver apple kitchen timer">
              <AppleTimer size={22} />
            </span>
          )}
          <span className="font-mono mr-1" style={{ opacity: 0.65 }}>{e.rank}.</span>
          <span>{e.name}</span>
          <span className="font-mono ml-1.5" style={{ opacity: 0.9 }}>{e.pts}</span>
          <span className="mx-3" style={{ opacity: 0.4 }}>·</span>
        </span>
      ))}
    </>
  );
  return (
    <button
      onClick={onClick}
      className="w-full py-2.5 overflow-hidden text-left relative cursor-pointer"
      style={{ background: C.greenDkr, color: C.cream, display: 'block' }}
      aria-label="Open leaderboard"
    >
      <style>{`
        @keyframes mank-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
      <div
        className="whitespace-nowrap text-sm"
        style={{
          display: 'inline-block',
          animation: `mank-marquee ${Math.max(28, entries.length * 2.4)}s linear infinite`,
          willChange: 'transform',
        }}
      >
        <span>{content}</span>
        <span aria-hidden="true">{content}</span>
      </div>
    </button>
  );
}

// ============================================================
// WEATHER — round-day forecast for Reunion Resort (Open-Meteo,
// free, no key). Last good forecast is cached so the strip still
// shows something if the weather service is slow or offline.
// ============================================================
const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=28.2636&longitude=-81.5884' +
  '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max' +
  '&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York&past_days=7&forecast_days=16';
const WEATHER_CACHE_KEY = 'dw-weather-v1';
const ROUND_DATES = { r1: '2026-11-05', r2: '2026-11-06', r3: '2026-11-07' };

// The weather code is the worst hour of the day, so a lone possible storm labels the whole
// day. Below 40% rain, say "Chance of …" instead so the label matches the rain number.
const weatherLook = (code, rain) => {
  const low = (rain ?? 0) < 40;
  if (code === 0) return { label: 'Sunny', Icon: Sun };
  if (code <= 2) return { label: 'Partly cloudy', Icon: CloudSun };
  if (code === 3) return { label: 'Cloudy', Icon: Cloud };
  if (code <= 48) return { label: 'Fog', Icon: CloudFog };
  if (code <= 57) return { label: low ? 'Chance of drizzle' : 'Drizzle', Icon: CloudDrizzle };
  if (code <= 67) return { label: low ? 'Chance of rain' : 'Rain', Icon: CloudRain };
  if (code <= 77) return { label: 'Snow', Icon: Snowflake };
  if (code <= 82) return { label: low ? 'Chance of showers' : 'Showers', Icon: CloudRain };
  if (code <= 86) return { label: 'Snow showers', Icon: Snowflake };
  return { label: low ? 'Chance of storms' : 'Thunderstorms', Icon: CloudLightning };
};

function WeatherStrip() {
  const [wx, setWx] = useState(() => {
    try { return JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY)) || null; } catch { return null; }
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(WEATHER_URL);
        if (!res.ok) return;
        const d = (await res.json()).daily;
        const days = {};
        d.time.forEach((t, i) => {
          days[t] = {
            code: d.weather_code[i],
            hi: d.temperature_2m_max[i],
            lo: d.temperature_2m_min[i],
            rain: d.precipitation_probability_max[i],
            wind: d.wind_speed_10m_max[i],
          };
        });
        const next = { days, fetchedAt: Date.now() };
        if (cancelled) return;
        setWx(next);
        try { localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(next)); } catch { /* storage full or blocked */ }
      } catch { /* offline — keep the cached forecast */ }
    };
    load();
    const id = setInterval(load, 30 * 60 * 1000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const updated = wx?.fetchedAt
    ? new Date(wx.fetchedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : null;

  return (
    <section className="w-full" style={{ background: C.creamLt, borderBottom: `1px solid ${C.rule}` }} aria-label="Round-day weather">
      <div className="max-w-[1500px] mx-auto px-3 md:px-6 py-3">
        <div className="flex items-baseline justify-between mb-2 px-1">
          <span className="smallcaps text-[10px] md:text-xs" style={{ color: C.goldDk }}>Round-day forecast · Reunion, FL</span>
          {updated && <span className="text-[10px] md:text-xs" style={{ color: C.goldDk, opacity: 0.8 }}>Updated {updated}</span>}
        </div>
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {ROUNDS.map((r) => {
            const day = wx?.days?.[ROUND_DATES[r.id]];
            const ok = day && Number.isFinite(day.hi);
            const look = ok ? weatherLook(day.code, day.rain) : null;
            const Icon = look?.Icon;
            const wet = ok && day.rain >= 40;
            return (
              <div
                key={r.id}
                className="rounded-md px-2 py-2 md:px-4 md:py-3 min-w-0 flex flex-col gap-1.5"
                style={{ background: '#fff', border: `1px solid ${C.rule}` }}
              >
                <div className="min-w-0">
                  <div className="smallcaps text-[10px] md:text-xs" style={{ color: C.goldDk }}>{r.day.slice(0, 3)} · {r.date}</div>
                  <div className="font-display text-sm md:text-lg leading-tight" style={{ color: C.greenDk }}>{r.course.split(' ').pop()}</div>
                </div>
                {ok ? (
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 min-w-0">
                    <div className="flex items-center gap-1 md:gap-2 min-w-0">
                      <Icon className="w-[18px] h-[18px] md:w-7 md:h-7 shrink-0" strokeWidth={1.6} style={{ color: wet ? C.green : C.goldDk }} aria-hidden="true" />
                      <div className="leading-tight min-w-0">
                        <div className="font-mono text-[12px] min-[400px]:text-[13px] md:text-base" style={{ color: C.ink }}>
                          <span className="whitespace-nowrap">{Math.round(day.hi)}°</span><span className="whitespace-nowrap" style={{ opacity: 0.55 }}>/{Math.round(day.lo)}°</span>
                        </div>
                        <div className="text-[10px] md:text-xs" style={{ color: C.ink, opacity: 0.7 }}>{look.label}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap md:flex-col gap-x-2 gap-y-0.5 text-[11px] md:text-sm min-w-0" style={{ color: C.ink }}>
                      <span className="inline-flex items-center gap-1 whitespace-nowrap" title="Chance of rain">
                        <Droplets size={13} className="shrink-0" aria-hidden="true" style={{ color: C.green }} />
                        <span className="font-mono" style={{ fontWeight: wet ? 700 : 400 }}>{Math.round(day.rain ?? 0)}%</span>
                      </span>
                      <span className="inline-flex items-center gap-1 whitespace-nowrap" title="Top wind speed">
                        <Wind size={13} className="shrink-0" aria-hidden="true" style={{ color: C.goldDk }} />
                        <span className="font-mono">{Math.round(day.wind)}<span className="text-[10px]"> mph</span></span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] md:text-sm" style={{ color: C.ink, opacity: 0.6 }}>
                    {wx ? 'Forecast not out yet' : 'Loading forecast…'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Nav({ tab, setTab }) {
  // Primary tabs: always visible on mobile. Secondary tabs: hidden
  // behind a "More" menu on mobile, visible inline on desktop.
  const PRIMARY = [
    { id: 'leaderboard', label: 'Leaderboard', short: 'Board', Icon: Trophy },
    { id: 'schedule',    label: 'Schedule',    short: 'Sched', Icon: Calendar },
    { id: 'payouts',     label: 'Payouts',     short: 'Payouts', Icon: DollarSign },
    { id: 'scorecard',   label: 'Scorecard',   short: 'Score', Icon: ClipboardList },
  ];
  const SECONDARY = [
    { id: 'roster',  label: 'Players', short: 'Players', Icon: Users },
    { id: 'teams',   label: 'Teams',   short: 'Teams',   Icon: Shield },
    { id: 'courses', label: 'Courses', short: 'Courses', Icon: Flag },
  ];
  const [moreOpen, setMoreOpen] = useState(false);
  const isSecondaryActive = SECONDARY.some((i) => i.id === tab);

  const Tab = ({ id, label, short, Icon, active, onClick }) => (
    <button
      onClick={onClick}
      className="relative flex-1 md:flex-initial px-1 md:px-2 lg:px-4 py-3 md:py-4 smallcaps flex flex-col md:flex-row items-center justify-center gap-1 md:gap-1.5 lg:gap-2 transition-colors text-[10px] md:text-xs"
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

  return (
    <nav className="border-b relative" style={{ background: C.creamLt, borderColor: C.rule }}>
      <div className="max-w-6xl mx-auto px-2 md:px-4 flex items-center justify-between md:justify-center gap-0 md:gap-1 lg:gap-6">
        {PRIMARY.map((item) => (
          <Tab key={item.id} {...item} active={tab === item.id} onClick={() => { setTab(item.id); setMoreOpen(false); }} />
        ))}
        {/* Desktop: show secondary tabs inline */}
        <div className="hidden md:contents">
          {SECONDARY.map((item) => (
            <Tab key={item.id} {...item} active={tab === item.id} onClick={() => setTab(item.id)} />
          ))}
        </div>
        {/* Mobile: "More" dropdown for secondary tabs */}
        <button
          onClick={() => setMoreOpen((o) => !o)}
          className="md:hidden relative flex-1 px-1 py-3 smallcaps flex flex-col items-center justify-center gap-1 text-[10px]"
          style={{ color: isSecondaryActive || moreOpen ? C.greenDk : '#6b6555' }}
          aria-expanded={moreOpen}
          aria-haspopup="menu"
        >
          <span className="inline-flex items-center justify-center" style={{ width: 16, height: 16 }}>
            <span style={{ width: 3, height: 3, borderRadius: 999, background: 'currentColor', marginRight: 2 }} />
            <span style={{ width: 3, height: 3, borderRadius: 999, background: 'currentColor', marginRight: 2 }} />
            <span style={{ width: 3, height: 3, borderRadius: 999, background: 'currentColor' }} />
          </span>
          <span className="leading-none">More</span>
          {isSecondaryActive && (
            <span className="absolute left-1 right-1 -bottom-px h-0.5" style={{ background: C.gold }} />
          )}
        </button>
      </div>
      {moreOpen && (
        <>
          {/* backdrop */}
          <div
            className="md:hidden fixed inset-0 z-30"
            style={{ background: 'rgba(0,0,0,0.1)' }}
            onClick={() => setMoreOpen(false)}
          />
          <div
            className="md:hidden absolute right-2 top-full z-40 rounded shadow-lg mt-1 min-w-[180px]"
            style={{ background: 'white', border: `1px solid ${C.rule}` }}
          >
            {SECONDARY.map((item) => {
              const active = tab === item.id;
              const Icon = item.Icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { setTab(item.id); setMoreOpen(false); }}
                  className="w-full px-4 py-3 text-left smallcaps text-xs flex items-center gap-2 border-b last:border-b-0"
                  style={{ color: active ? C.greenDk : C.ink, borderColor: C.rule, background: active ? C.creamLt : 'white' }}
                >
                  <Icon size={14} strokeWidth={1.5} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </nav>
  );
}

// ============================================================
// LEADERBOARD
// ============================================================
function Leaderboard({ players, scores, teams, groups }) {
  const teamName = (id) => (teams || []).find((t) => t.id === id)?.name || '';
  const courseById = (id) => COURSES.find((c) => c.id === id);
  const [showRules, setShowRules] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

  const { teamTotals, mankles, roundResults } = useMemo(
    () => computeStandings(ROUNDS, teams, players, scores, courseById, groups),
    [players, scores, teams, groups]
  );

  // Mankles prize money appears once every round is fully scored.
  const { allDone, manklesPrize, rounds: payRounds } = useMemo(
    () => computePayouts({ players, scores, teams, groups }),
    [players, scores, teams, groups]
  );

  const anyScores = teamTotals.some((t) => t.total > 0) || mankles.some((m) => m.filled > 0);
  const fmtPts = (n) => (Math.round(n * 10) / 10).toString();

  const buildShareText = () => {
    const lines = [];
    lines.push('🏌️ DW INVITATIONAL 2026 — LIVE LEADERBOARD');
    lines.push('');
    lines.push('TEAM STANDINGS');
    teamTotals.forEach((row, i) => {
      const marker = row.total > 0 ? `${i + 1}.` : '—';
      lines.push(`${marker} ${row.team.name} — ${fmtPts(row.total)} pts`);
    });
    lines.push('');
    lines.push('MANKLES LEADERS');
    mankles.slice(0, 5).forEach((row, i) => {
      lines.push(`${i + 1}. ${row.player.name} — ${row.total} pts`);
    });
    lines.push('');
    // Whatever host the page is served from (Netlify or the GitHub Pages backup).
    lines.push(window.location.origin + import.meta.env.BASE_URL);
    return lines.join('\n');
  };

  const share = async () => {
    const text = buildShareText();
    try {
      if (navigator.share) {
        await navigator.share({ title: 'DW Invitational Leaderboard', text });
        setShareStatus('Shared');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setShareStatus('Copied to clipboard');
      } else {
        setShareStatus('Copy manually');
      }
    } catch {
      setShareStatus('');
    }
    setTimeout(() => setShareStatus(''), 2200);
  };

  return (
    <section className="mt-10">
      <div className="flex justify-center mb-2">
        <GoldSeal size={56} />
      </div>
      <SectionTitle eyebrow="Live Standings" title="The Leaderboard" />

      {/* Action strip */}
      <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
        <button
          onClick={share}
          className="smallcaps text-[11px] px-3 py-2 rounded flex items-center gap-1.5"
          style={{ background: C.greenDk, color: C.gold, border: `1px solid ${C.greenDk}` }}
        >
          Share Leaderboard
        </button>
        <button
          onClick={() => setShowRules(true)}
          className="smallcaps text-[11px] px-3 py-2 rounded"
          style={{ background: 'white', color: C.greenDk, border: `1px solid ${C.rule}` }}
        >
          How Scoring Works
        </button>
        {shareStatus && (
          <span className="text-[11px] italic" style={{ color: C.goldDk }}>{shareStatus}</span>
        )}
      </div>

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}

      <RoundRecaps rounds={payRounds} players={players} scores={scores} />

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
                    <td key={idx} className="py-3 px-1 md:px-2 text-right align-middle text-xs md:text-sm font-mono" style={{ color: row.played[idx] ? C.ink : '#bfb89e' }}>
                      {row.played[idx] ? fmtPts(pts) : '—'}
                    </td>
                  ))}
                  <td className="py-3 px-1 md:px-3 text-right font-display text-base md:text-lg" style={{ color: row.total > 0 ? C.greenDk : '#bfb89e' }}>
                    {row.played.some(Boolean) ? fmtPts(row.total) : '—'}
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
                <th key={r.id} className="py-3 px-1 md:px-2 smallcaps text-[11px] text-right w-8 md:w-auto">R{idx + 1}</th>
              ))}
              <th className="py-3 px-1 md:px-3 smallcaps text-[11px] text-right w-12 md:w-auto" style={{ color: C.gold }}>Total</th>
              {allDone && <th className="py-3 px-1 md:px-3 smallcaps text-[11px] text-right w-14 md:w-auto" style={{ color: C.gold }}>$</th>}
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
                    {/* min-w-0 + shrink-0 keep the trophy inside the name cell on
                        phones instead of spilling over the R1 column; long
                        names wrap rather than truncate so the (hcp) stays visible. */}
                    <div className="leading-tight flex items-center gap-1 md:gap-2 min-w-0">
                      <span className="min-w-0 break-words">{playerLabel(row.player)}</span>
                      {leader && (
                        <span title="Mankles trophy — silver apple kitchen timer" className="inline-flex items-center shrink-0">
                          <AppleTimer size={20} />
                        </span>
                      )}
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
                  {allDone && (
                    <td className="py-3 pl-0 pr-2 md:px-3 text-right font-mono text-[11px] md:text-sm" style={{ color: manklesPrize.has(row.player.id) ? C.greenDk : '#bfb89e' }}>
                      {manklesPrize.has(row.player.id) ? fmtUsd(manklesPrize.get(row.player.id)) : '—'}
                    </td>
                  )}
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
        Mankles ties go to the most birdies across all rounds.
        Mankles pays $300 · 150 · 100 · 75 · 50 · 25 to the top six, shown here once Saturday's round is in.
      </p>
    </section>
  );
}

// ============================================================
// RULES MODAL — scoring & format reference
// ============================================================
// ============================================================
// ROUND RECAP — a few lighthearted lines per finished round, collapsed by
// default. Display only: reads the same numbers the leaderboard and payouts use.
// ============================================================
const RECAP_LINES = {
  points: [
    '{name} put up {n} points. Either a career day or a fraudulent handicap. We all know which.',
    '{n} points for {name}. Someone pull that GHIN and that bar tab, both are suspicious.',
    '{name} led the day with {n} points and has already brought it up four times. At dinner. Unprompted.',
  ],
  pointsTie: ['{name} tied at {n} points. Neither one is picking up the tab, so everybody loses.'],
  lowGross: [
    'Low gross: {name} with {a} {n}. Nobody asked you to try that hard.',
    '{name} shot {n}. Insufferable for the rest of the trip, effective immediately.',
    '{name} carded {a} {n} and is pretending it was no big deal. It was. You will hear about it.',
  ],
  birdies: [
    '{name} made {n} birdies. The rest of us made excuses and bad decisions.',
    'Birdie count: {name} with {n}. Lucky as hell and not even a little humble about it.',
    '{name} made {n} birdies. Drug testing is scheduled for tomorrow morning.',
  ],
  noBirdies: [
    'Zero birdies from the entire group. Fifteen grown adults, zero birdies. Outstanding work, everyone.',
    'Not one birdie all day. The course took everyone behind the woodshed.',
  ],
  blowUp: [
    'Blow-up hole: {name} made {a} {n} on hole {hole}, a par {par}. Somebody hide the sharp objects.',
    '{name} carded {a} {n} on hole {hole} (par {par}). The language on that hole has been reported to the club.',
    'Hole {hole} absolutely bent {name} over: {n} strokes on a par {par}. Thoughts and prayers.',
  ],
  noBlowUp: ['No triple bogeys or worse. Either everyone played well or the scorekeeper is on the take.'],
  skins: [
    '{name} robbed the skins pot: {n} {skins} for {amt}. First round is on {first}, and it is not optional.',
    '{name} walked off with {n} {skins} ({amt}). That money is going straight to the bar. As it should.',
  ],
  noSkins: ['Every hole was tied, so no skins. Fifteen golfers, all equally mediocre. Beautiful.'],
  mostStrokes: [
    '{name} shot {n}. Got the most golf for the money, and the most beers per stroke.',
    '{name} posted {a} {n}. The cart girl is on a first-name basis now.',
    '{name} went {n}. Still showed up to dinner strutting like the champion. Respect.',
  ],
};

// A one-time add-on for a certain player: on the first finished round where
// they get a recap highlight, the matching line gets this tacked on. Keyed by
// name, then by the kind of line they were mentioned in.
const RECAP_PLAYER_JABS = {
  'Nick Roy': {
    points: 'Great day for Nick, who was still somehow difficult about it.',
    pointsTie: 'Nick was difficult about sharing it, naturally.',
    lowGross: 'Best round of the day and Nick still found a way to be difficult.',
    birdies: 'Nick was still difficult about the ones that lipped out.',
    skins: 'Nick won money and still got sensitive about the split.',
    ctp: 'Nick still says his ball was closer on the other one too. Difficult as ever.',
    blowUp: "Nick is a little sensitive about this one, so don't bring it up. (Bring it up.)",
    mostStrokes: 'Go easy on him, Nick is sensitive about it.',
  },
};

// Same line every time for a given round, so the recap doesn't reshuffle on refresh.
const pickLine = (key, roundId) => {
  const list = RECAP_LINES[key];
  const seed = [...`${roundId}:${key}`].reduce((a, ch) => a + ch.charCodeAt(0), 0);
  return list[seed % list.length];
};
// "an 83", "an 8", "an 11" — everything else takes "a".
const article = (n) => (/^(8|11$|18$)/.test(String(n)) ? 'an' : 'a');
const fillLine = (tpl, vals) => tpl.replace(/\{(\w+)\}/g, (_, k) => (k === 'a' ? article(vals.n) : vals[k] ?? ''));
const joinNames = (list) => (list.length <= 2 ? list.join(' and ') : `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`);

const buildRecap = (payRound, players, scores) => {
  const { round, course, standings, skins, ctp } = payRound;
  const holes = course.holes;
  const id = round.id;
  const cards = players.map((p) => ({ player: p, card: scores?.[id]?.[p.id] || [] }));
  const gross = cards.map((c) => ({ ...c, total: c.card.reduce((a, v) => a + (v || 0), 0) }));
  const lines = [];

  // Most points (the daily-points prize)
  const top = standings[0]?.points;
  const leaders = standings.filter((s) => s.points === top).map((s) => s.player.name);
  if (top != null) {
    lines.push({ kind: leaders.length > 1 ? 'pointsTie' : 'points', icon: '🏆', text: fillLine(pickLine(leaders.length > 1 ? 'pointsTie' : 'points', id), { name: joinNames(leaders), n: top }) });
  }

  // Low gross
  const low = Math.min(...gross.map((g) => g.total));
  const lowNames = gross.filter((g) => g.total === low).map((g) => g.player.name);
  lines.push({ kind: 'lowGross', icon: '🎯', text: fillLine(pickLine('lowGross', id), { name: joinNames(lowNames), n: low }) });

  // Birdies (gross birdie or better)
  const birdies = cards.map((c) => ({ ...c, n: c.card.filter((v, i) => Number.isFinite(v) && v < holes[i].par).length }));
  const mostB = Math.max(...birdies.map((b) => b.n));
  const birdieNames = birdies.filter((b) => b.n === mostB).map((b) => b.player.name);
  if (mostB === 0) lines.push({ kind: 'noBirdies', icon: '🐦', text: pickLine('noBirdies', id) });
  else lines.push({ kind: 'birdies', icon: '🐦', text: fillLine(pickLine('birdies', id), { name: joinNames(birdieNames), n: mostB }).replace(/\b1 birdies\b/, '1 birdie') });

  // Skins
  if (skins && skins.totalSkins > 0) {
    const most = Math.max(...skins.skinsByPlayer.values());
    const names = players.filter((p) => skins.skinsByPlayer.get(p.id) === most).map((p) => p.name);
    lines.push({ kind: 'skins', icon: '💰', text: fillLine(pickLine('skins', id), {
      name: joinNames(names), first: names[0].split(' ')[0], n: most,
      skins: most === 1 ? 'skin' : 'skins', amt: fmtUsd(most * skins.payoutPerSkin) + (names.length > 1 ? ' each' : ''),
    }) });
  } else {
    lines.push({ kind: 'noSkins', icon: '💰', text: pickLine('noSkins', id) });
  }

  // Closest to the pin
  const [f, b] = ctp;
  lines.push({ kind: 'ctp', icon: '📍', text: f.winner && f.winner === b.winner
    ? `${f.winner.name} won both closest-to-the-pins. Dart-thrower.`
    : `Closest to the pin: ${ctp.map((c) => `${c.winner ? c.winner.name : 'not marked'} (${c.side === 'front' ? 'front 9' : 'back 9'})`).join(' and ')}.` });

  // Blow-up hole: the biggest number over par on one hole (triple bogey or worse)
  let worst = null;
  cards.forEach((c) => c.card.forEach((v, i) => {
    if (!Number.isFinite(v)) return;
    const over = v - holes[i].par;
    if (over >= 3 && (!worst || over > worst.over)) worst = { over, name: c.player.name, n: v, hole: holes[i].hole, par: holes[i].par };
  }));
  lines.push(worst
    ? { kind: 'blowUp', icon: '💥', text: fillLine(pickLine('blowUp', id), worst) }
    : { kind: 'noBlowUp', icon: '💥', text: pickLine('noBlowUp', id) });

  // Most strokes, said kindly
  const high = Math.max(...gross.map((g) => g.total));
  const highNames = gross.filter((g) => g.total === high).map((g) => g.player.name);
  if (high > low) lines.push({ kind: 'mostStrokes', icon: '🍺', text: fillLine(pickLine('mostStrokes', id), { name: joinNames(highNames), n: high }) });

  return lines;
};

// Every finished round's recap, with each RECAP_PLAYER_JABS add-on placed once:
// on the first round (in play order) where that player has a highlight.
const buildRecaps = (rounds, players, scores) => {
  const recaps = new Map(rounds.map((r) => [r.round.id, buildRecap(r, players, scores)]));
  Object.entries(RECAP_PLAYER_JABS).forEach(([name, jabs]) => {
    for (const r of rounds) {
      const lines = recaps.get(r.round.id);
      const i = lines.findIndex((l) => l.text.includes(name) && jabs[l.kind]);
      if (i === -1) continue;
      lines[i] = { ...lines[i], text: `${lines[i].text} ${jabs[lines[i].kind]}` };
      break;
    }
  });
  return recaps;
};

function RoundRecaps({ rounds, players, scores }) {
  const finished = (rounds || []).filter((r) => r.complete);
  const done = [...finished].reverse(); // latest first
  const [open, setOpen] = useState({});
  if (done.length === 0) return null;
  const recaps = buildRecaps(finished, players, scores);
  return (
    <div className="mb-8 space-y-2">
      {done.map((r) => {
        const isOpen = !!open[r.round.id];
        const lines = recaps.get(r.round.id);
        return (
          <div key={r.round.id} className="rounded overflow-hidden" style={{ border: `1px solid ${C.rule}`, background: 'white' }}>
            <button
              type="button"
              onClick={() => setOpen((o) => ({ ...o, [r.round.id]: !o[r.round.id] }))}
              aria-expanded={isOpen}
              className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left"
              style={{ background: C.greenDk, color: C.cream }}
            >
              <span>
                <span className="smallcaps text-[10px] block" style={{ color: C.gold }}>The Daily Recap</span>
                <span className="font-display text-lg">{r.round.day} at {r.round.course}</span>
              </span>
              <span className="flex items-center gap-1.5 smallcaps text-[10px] shrink-0" style={{ color: C.gold }}>
                {isOpen ? 'Hide' : 'Read it'}
                <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }} />
              </span>
            </button>
            {isOpen && (
              <ul className="px-4 py-3 space-y-2 text-sm" style={{ color: C.ink }}>
                {lines.map((l) => (
                  <li key={l.icon} className="flex gap-2.5">
                    <span aria-hidden="true">{l.icon}</span>
                    <span>{l.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RulesModal({ onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const Section = ({ title, children }) => (
    <div className="mb-5">
      <div className="smallcaps text-[11px] mb-1.5" style={{ color: C.goldDk }}>{title}</div>
      <div className="text-sm leading-relaxed" style={{ color: C.ink }}>{children}</div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(6,58,38,0.55)' }}
      onClick={onClose}
    >
      <div
        className="rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto"
        style={{ background: C.cream, border: `1px solid ${C.rule}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 flex items-center justify-between sticky top-0" style={{ background: C.greenDk, color: C.cream }}>
          <div>
            <div className="smallcaps text-[11px]" style={{ color: C.gold }}>Reference</div>
            <div className="font-display text-2xl">How Scoring Works</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="smallcaps text-[11px] px-3 py-1.5 rounded"
            style={{ background: C.gold, color: C.greenDkr }}
          >
            Close
          </button>
        </div>
        <div className="px-6 py-5">
          <Section title="Team Scoring — Rounds 1 & 2 (Best Ball)">
            For each hole, your team's score is the sum of the two lowest
            net scores from the three team members. Teams rank 1–5 on
            best-ball total; points awarded <b>20 / 15 / 10 / 5 / 0</b>.
          </Section>
          <Section title="Team Scoring — Round 3 (Singles Net)">
            Each player's net score for Nicklaus is ranked across the whole
            field (1st = lowest net). Points go to the player's team:
            <b> 15, 14, 13 … down to 1</b>.
          </Section>
          <Section title="Handicap Strokes">
            Everyone strokes off the lowest handicap in the field (Frank
            Barta, 8). Your strokes = <code>yourHcp − 8</code>, allocated
            to the hardest holes first (hole handicap 1 → H). The dashboard
            shows these as gold dots over each hole number on the Scorecard.
          </Section>
          <Section title="Mankles — Individual Award">
            Each round: <code>handicap + Stableford points</code>. Points
            per hole on <i>gross vs par</i>:
            <ul className="list-disc pl-5 mt-1">
              <li>Eagle or better = <b>8</b></li>
              <li>Birdie = <b>4</b></li>
              <li>Par = <b>2</b></li>
              <li>Bogey = <b>1</b></li>
              <li>Double bogey = <b>0</b></li>
              <li>Triple+ = <b>−1</b></li>
            </ul>
            Total across all 3 rounds wins the Mankles. Ties are broken by
            most gross birdies (or better) across all 3 rounds.
          </Section>
          <Section title="Skins — Side Game ($180/round)">
            Lowest <i>net</i> score on a hole wins the skin. Ties mean no
            skin on that hole (no carry-overs). Each round's $180 pot is
            split evenly across however many skins were won — e.g. 5 skins
            on Watson = $36 per skin.
          </Section>
          <Section title="Payouts">
            Each round: closest to the pin front 9 and back 9 (<b>$20</b> each),
            most Mankles points that day (<b>$50</b>), 2nd most (<b>$30</b>), and
            the <b>$180</b> skins pool. Team event: 1st <b>$450</b> ($150 each),
            2nd <b>$150</b> ($50 each). Mankles: <b>$300 / 150 / 100 / 75 / 50 / 25</b>.
            Ties split the money for the places they share. The Payouts tab adds it all up.
          </Section>
          <Section title="R3 Pairings">
            Day-3 groups auto-populate from the Mankles standings after
            R1 & R2: lowest total tees off first (10:50 AM group of 3),
            leaders tee off last (11:20 AM).
          </Section>
        </div>
      </div>
    </div>
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
      <SectionTitle eyebrow="Fifteen Competitors" title="Players" />

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

  const fmtPts = (n) => (Math.round(n * 10) / 10).toString();

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
              perRoundPlayed={row.played}
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

function TeamCard({ rank, team, members, roundResults, perRoundPoints, perRoundPlayed, total, fmtPts, onRename }) {
  const hasAny = perRoundPlayed.some(Boolean);
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
            const played = perRoundPlayed[idx];
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
                  <td className="py-2 px-3 text-right font-mono" style={{ color: played ? C.greenDk : '#bfb89e' }}>
                    {played ? fmtPts(pts) : '—'}
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

// ============================================================
// PAYOUTS — every prize, worked out from the scores + CTP ticks
// ============================================================
const CTP_PRIZE = 20;                    // per side, per round
const DAILY_POINTS_PRIZES = [50, 30];    // most / 2nd most Mankles points that day
const TEAM_PRIZES = [450, 150];          // split evenly across the team's players
const MANKLES_PRIZES = [300, 150, 100, 75, 50, 25];
const TOTAL_PURSE = ROUNDS.length * (2 * CTP_PRIZE + DAILY_POINTS_PRIZES[0] + DAILY_POINTS_PRIZES[1] + SKINS_POT_PER_ROUND)
  + TEAM_PRIZES[0] + TEAM_PRIZES[1] + MANKLES_PRIZES.reduce((a, b) => a + b, 0);

// CTP picks live inside `scores` (scores.ctp.r1 = { front, back }) rather than
// as a new top-level key: older copies of the page re-save `scores` untouched,
// so an out-of-date phone can't drop the ticks when it saves.
// Payment buckets: one per round, plus one for the team event + Mankles.
const FINAL_PAY_ID = 'final';
const PAY_BUCKETS = [...ROUNDS.map((r) => r.id), FINAL_PAY_ID];

const ctpForRound = (scores, roundId) => scores?.ctp?.[roundId] || {};

// Hand out place prizes down a best-first list. Tied entries share the prizes
// for every place they cover: two tied for 1st with [50, 30] get $40 each.
const splitPlacePrizes = (sorted, keyOf, prizes) => {
  const out = new Map();
  let i = 0;
  while (i < sorted.length && i < prizes.length) {
    let j = i;
    while (j + 1 < sorted.length && keyOf(sorted[j + 1]) === keyOf(sorted[i])) j++;
    let pot = 0;
    for (let k = i; k <= j; k++) pot += prizes[k] || 0;
    for (let k = i; k <= j; k++) out.set(sorted[k], pot / (j - i + 1));
    i = j + 1;
  }
  return out;
};

const roundComplete = (round, players, scores) => players.length > 0 && players.every((p) => {
  const arr = scores?.[round.id]?.[p.id];
  return Array.isArray(arr) && arr.length === 18 && arr.every(Number.isFinite);
});

// Everything the Payouts tab, the Leaderboard $ column and the export need.
// An item only counts toward a player's total once it is final.
const computePayouts = ({ players, scores, teams, groups }) => {
  const courseById = (id) => COURSES.find((c) => c.id === id);
  const byId = (id) => players.find((p) => p.id === id) || null;
  const { teamTotals, mankles } = computeStandings(ROUNDS, teams, players, scores, courseById, groups);
  const owed = new Map(players.map((p) => [p.id, { player: p, total: 0, items: [] }]));
  // Each item is tagged with the round it belongs to, so the Payouts tab can
  // show one day at a time. Team + Mankles money is tagged FINAL_PAY_ID: it is
  // won over the whole trip, so it shows under Whole Trip, not Saturday.
  const pay = (playerId, amount, label, roundId = FINAL_PAY_ID) => {
    const row = owed.get(playerId);
    if (!row || !(amount > 0)) return;
    row.total += amount;
    row.items.push({ label, amount, roundId });
  };

  const rounds = ROUNDS.map((round, ri) => {
    const course = courseById(round.courseId);
    const tag = `R${ri + 1}`;
    const complete = roundComplete(round, players, scores);

    const pick = ctpForRound(scores, round.id);
    const ctp = ['front', 'back'].map((side) => {
      const winner = byId(pick[side]);
      if (winner) pay(winner.id, CTP_PRIZE, `${tag} CTP ${side === 'front' ? 'front' : 'back'}`, round.id);
      return { side, winner, amount: CTP_PRIZE };
    });

    // Daily points = that round's Mankles value (handicap + Stableford points).
    const standings = players.map((p) => {
      const sp = stablefordPoints(p, round, scores, course, groups, players);
      const filled = sp?.filled || 0;
      return { player: p, filled, points: filled ? Math.round(p.handicap ?? 0) + sp.points : null };
    }).sort((a, b) => (b.points ?? -Infinity) - (a.points ?? -Infinity));
    const done = standings.filter((s) => s.filled === 18).length;
    const pointsPrizes = complete ? splitPlacePrizes(standings, (s) => s.points, DAILY_POINTS_PRIZES) : new Map();
    standings.forEach((s) => {
      s.prize = pointsPrizes.get(s) || 0;
      if (s.prize) pay(s.player.id, s.prize, `${tag} points`, round.id);
    });

    const skins = computeSkinsForRound(round, players, scores, course, groups);
    const skinsDone = !!skins && skins.holes.every((h) => h.status !== 'pending');
    if (skinsDone) {
      skins.skinsByPlayer.forEach((n, pid) => pay(pid, n * skins.payoutPerSkin, `${tag} skins ×${n}`, round.id));
    }

    return { round, course, tag, complete, done, ctp, standings, skins, skinsDone };
  });

  const allDone = rounds.every((r) => r.complete);

  // Team prizes: final once every round is fully scored; projected before that.
  const anyTeamPoints = teamTotals.some((t) => t.played.some(Boolean));
  const teamPrizeMap = anyTeamPoints ? splitPlacePrizes(teamTotals, (t) => t.total, TEAM_PRIZES) : new Map();
  const teamPrizes = teamTotals
    .filter((t) => teamPrizeMap.get(t))
    .map((t) => {
      const members = players.filter((p) => p.team === t.team.id);
      const amount = teamPrizeMap.get(t);
      const each = members.length ? amount / members.length : 0;
      if (allDone) members.forEach((p) => pay(p.id, each, 'Team event'));
      return { team: t.team, total: t.total, members, amount, each };
    });

  // Mankles: ties on points + birdies share; final once every round is in.
  const mankPrizeMap = allDone ? splitPlacePrizes(mankles, (m) => `${m.total}|${m.birdies}`, MANKLES_PRIZES) : new Map();
  const manklesPrize = new Map();
  mankles.forEach((m) => {
    const amt = mankPrizeMap.get(m) || 0;
    if (amt) {
      manklesPrize.set(m.player.id, amt);
      pay(m.player.id, amt, 'Mankles');
    }
  });

  const people = [...owed.values()].sort((a, b) => b.total - a.total || a.player.name.localeCompare(b.player.name));
  const paidOut = people.reduce((a, p) => a + p.total, 0);
  return { rounds, teamPrizes, allDone, manklesPrize, people, paidOut, purse: TOTAL_PURSE };
};

// ============================================================
// EXPORT — results workbook + raw data backup, for the year-to-year record
// ============================================================
const TOURNAMENT_NAME = 'DW Invitational 2026';

// Places with ties sharing a spot: [50, 48, 48, 40] → [1, 2, 2, 4].
const tiedPlaces = (keys) => keys.map((k) => keys.indexOf(k) + 1);

const buildResultsSheets = ({ players, scores, teams, groups }) => {
  const courseById = (id) => COURSES.find((c) => c.id === id);
  const teamName = (id) => teams.find((t) => t.id === id)?.name || '';
  const hcp = (p) => Math.round(p.handicap ?? 0);
  const pts = (n) => Math.round(n * 100) / 100;
  const sum = (a) => a.reduce((x, y) => x + y, 0);
  const head = (labels) => labels.map((v) => ({ v, s: 'head' }));
  const title = (v) => [{ v, s: 'title' }];
  const bold = (v) => ({ v, s: 'bold' });
  const money = (v) => ({ v, s: 'money' });
  const roundHead = ROUNDS.map((r, i) => `R${i + 1} ${r.course.split(' ').pop()}`);

  const { teamTotals, mankles, roundResults } = computeStandings(ROUNDS, teams, players, scores, courseById, groups);
  const skins = ROUNDS.map((r) => computeSkinsForRound(r, players, scores, courseById(r.courseId), groups));

  // ---- Summary ----
  const teamPlace = tiedPlaces(teamTotals.map((t) => t.total));
  const mankPlace = tiedPlaces(mankles.map((m) => `${m.total}|${m.birdies}`));
  const skinRows = players.map((p) => {
    const per = skins.map((s) => {
      const n = s?.skinsByPlayer.get(p.id) || 0;
      return { n, usd: n * (s?.payoutPerSkin || 0) };
    });
    return { p, per, n: sum(per.map((x) => x.n)), usd: sum(per.map((x) => x.usd)) };
  }).sort((a, b) => b.usd - a.usd || a.p.name.localeCompare(b.p.name));

  const summary = [
    title(`${TOURNAMENT_NAME} — Results`),
    ['Reunion Resort & Golf Club · November 4–8, 2026'],
    ['Exported', new Date().toLocaleString()],
    [],
    title('Team Standings'),
    head(['Place', 'Team', 'Players', ...roundHead, 'Total']),
    ...teamTotals.map((t, i) => [
      t.played.some(Boolean) ? teamPlace[i] : null,
      t.team.name,
      players.filter((p) => p.team === t.team.id).map((p) => p.name).join(', '),
      ...t.perRound.map((v, k) => (t.played[k] ? pts(v) : null)),
      pts(t.total),
    ]),
    [],
    title('Mankles'),
    head(['Place', 'Player', 'Team', 'Handicap', ...roundHead, 'Total', 'Birdies or better']),
    ...mankles.map((m, i) => [
      m.filled ? mankPlace[i] : null, m.player.name, teamName(m.player.team), hcp(m.player),
      ...m.perRound.map((r) => (r.played ? r.roundValue : null)), m.total, m.birdies,
    ]),
    [],
    title('Skins Winnings'),
    head(['Player', ...ROUNDS.flatMap((_, i) => [`R${i + 1} skins`, `R${i + 1} $`]), 'Total skins', 'Total $']),
    ...skinRows.map((r) => [r.p.name, ...r.per.flatMap((x) => [x.n, money(x.usd)]), r.n, money(r.usd)]),
  ];

  // ---- Round Results ----
  const roundRows = [];
  roundResults.forEach((rr, i) => {
    const r = rr.round;
    const fmt = r.format === 'netstroke' ? 'Singles net stroke' : 'Two best nets';
    roundRows.push(title(`Round ${i + 1} · ${r.course} · ${r.day} ${r.date} · ${fmt}`));
    if (r.format === 'bestball2net') {
      roundRows.push(head(['Place', 'Team', 'Best-ball net', 'Holes complete', 'Points']));
      const done = rr.sorted.map((x) => x.total);
      [...rr.results]
        .sort((a, b) => b.complete - a.complete || a.total - b.total)
        .forEach((res) => roundRows.push([
          res.complete ? done.indexOf(res.total) + 1 : null,
          res.team.name,
          res.filled ? res.total : null,
          res.filled,
          rr.pointsByTeam.has(res.team.id) ? pts(rr.pointsByTeam.get(res.team.id)) : null,
        ]));
    } else {
      roundRows.push(head(['Place', 'Player', 'Team', 'Net', 'Points to team']));
      const nets = rr.sorted.map((x) => x.net);
      rr.sorted.forEach((res) => roundRows.push([
        nets.indexOf(res.net) + 1, res.p.name, teamName(res.p.team), res.net, pts(rr.pointsByPlayer.get(res.p.id)),
      ]));
    }
    roundRows.push([]);
  });

  // ---- Hole-by-hole scores ----
  const holeRows = [head([
    'Round', 'Course', 'Date', 'Player', 'Team', 'Handicap', 'Strokes received',
    ...Array.from({ length: 18 }, (_, i) => `${i + 1}`), 'Out', 'In', 'Gross', 'Net', 'Mankles',
  ])];
  ROUNDS.forEach((r, i) => {
    const course = courseById(r.courseId);
    const par = course.holes.map((h) => h.par);
    holeRows.push([
      bold(`R${i + 1}`), bold(r.course), bold(`${r.day} ${r.date}`), bold('PAR'), null, null, null,
      ...par.map(bold), bold(sum(par.slice(0, 9))), bold(sum(par.slice(9))), bold(sum(par)),
    ]);
    players.forEach((p) => {
      const posted = scores?.[r.id]?.[p.id];
      if (!posted || !posted.some(Number.isFinite)) return;
      const g = course.holes.map((_, k) => (Number.isFinite(posted[k]) ? posted[k] : null));
      const part = (a) => (a.every(Number.isFinite) ? sum(a) : null);
      const complete = g.every(Number.isFinite);
      const nets = netHoleScores(p, r, scores, course, groups, players);
      const sp = stablefordPoints(p, r, scores, course, groups, players);
      holeRows.push([
        `R${i + 1}`, r.course, `${r.day} ${r.date}`, p.name, teamName(p.team), hcp(p),
        sum(strokesForRound(p, r, groups, players, course)),
        ...g, part(g.slice(0, 9)), part(g.slice(9)), complete ? sum(g) : null,
        complete ? sum(nets) : null, sp ? hcp(p) + sp.points : null,
      ]);
    });
  });

  // ---- Skins, hole by hole ----
  const skinHoleRows = [head(['Round', 'Hole', 'Par', 'Result', 'Winner / tied players', 'Low net', 'Payout'])];
  ROUNDS.forEach((r, i) => {
    const course = courseById(r.courseId);
    skins[i]?.holes.forEach((h) => skinHoleRows.push([
      `R${i + 1} ${r.course}`, h.hole, course.holes[h.hole - 1].par,
      h.status === 'won' ? 'Skin' : h.status === 'tied' ? 'Tied, no skin' : 'Not all scores in',
      h.status === 'won' ? h.winner.name : h.status === 'tied' ? h.tiedPlayers.map((p) => p.name).join(', ') : null,
      h.net ?? null,
      h.status === 'won' ? money(skins[i].payoutPerSkin) : null,
    ]));
  });

  // ---- Pairings + roster ----
  const nameOf = (id) => players.find((p) => p.id === id)?.name;
  const pairRows = [head(['Round', 'Course', 'Group', 'Tee time', 'Players'])];
  ROUNDS.forEach((r, i) => (groups?.[r.id] || []).forEach((g) => pairRows.push([
    `R${i + 1}`, r.course, g.name, g.teeTime, (g.playerIds || []).map(nameOf).filter(Boolean).join(', '),
  ])));
  const low = Math.min(...players.map(hcp));
  const playerRows = [
    head(['Player', 'Team', 'Handicap', 'Strokes off low man']),
    ...players.map((p) => [p.name, teamName(p.team), hcp(p), Math.max(0, hcp(p) - low)]),
  ];

  // ---- Payouts ----
  const pay = computePayouts({ players, scores, teams, groups });
  const payRows = [
    title('Payouts'),
    ['Total purse', money(pay.purse)],
    ['Decided', money(pay.paidOut)],
    [],
    head(['Player', 'Owed', 'Breakdown']),
    ...pay.people.filter((p) => p.total > 0).map((p) => [
      p.player.name, money(p.total), p.items.map((it) => `${it.label} ${fmtUsd(it.amount)}`).join(' · '),
    ]),
    [],
    head(['Round', 'Prize', 'Winner', 'Amount']),
  ];
  pay.rounds.forEach((d) => {
    d.ctp.forEach((c) => payRows.push([d.tag, `${c.side === 'front' ? 'Front' : 'Back'} 9 CTP`, c.winner?.name ?? 'Not decided', c.winner ? money(c.amount) : null]));
    d.standings.filter((x) => x.prize > 0).forEach((x) => payRows.push([d.tag, `Daily points (${x.points})`, x.player.name, money(x.prize)]));
    if (d.skinsDone) d.skins.skinsByPlayer.forEach((n, pid) => payRows.push([
      d.tag, `Skins ×${n}`, nameOf(pid), money(n * d.skins.payoutPerSkin),
    ]));
  });
  if (pay.allDone) {
    pay.teamPrizes.forEach((tp) => tp.members.forEach((p) => payRows.push(['Team', tp.team.name, p.name, money(tp.each)])));
    pay.manklesPrize.forEach((amt, pid) => payRows.push(['Mankles', 'Individual', nameOf(pid), money(amt)]));
  }

  return [
    { name: 'Payouts', rows: payRows, widths: [20, 22, 22, 12] },
    { name: 'Summary', rows: summary, widths: [12, 22, 44, 12, 12, 12, 12, 12, 12, 12] },
    { name: 'Round Results', rows: roundRows, widths: [10, 22, 16, 16, 14] },
    { name: 'Hole-by-Hole', rows: holeRows, freezeRows: 1, widths: [7, 15, 14, 18, 12, 9, 9, ...Array(18).fill(4.5), 6, 6, 7, 6, 9] },
    { name: 'Skins by Hole', rows: skinHoleRows, freezeRows: 1, widths: [20, 6, 5, 18, 36, 8, 10] },
    { name: 'Pairings', rows: pairRows, freezeRows: 1, widths: [7, 16, 10, 10, 60] },
    { name: 'Players', rows: playerRows, freezeRows: 1, widths: [20, 14, 10, 18] },
  ];
};

const exportResultsWorkbook = (state) =>
  downloadBlob(buildXlsx(buildResultsSheets(state)), `${TOURNAMENT_NAME} - Results.xlsx`);

// Same shape as the backups in backups/, so `npm run restore` can load it back.
const exportRawBackup = ({ players, scores, teams, groups }) => {
  const now = new Date().toISOString();
  const json = JSON.stringify({ exported_at: now, updated_at: now, data: { players, scores, teams, groups } }, null, 2);
  downloadBlob(new Blob([json], { type: 'application/json' }), `${TOURNAMENT_NAME} - Data Backup.json`);
};

// $2,200 for whole dollars, $22.50 otherwise.
const fmtUsd = (n) => {
  const whole = Number.isInteger(Math.round(n * 100) / 100);
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 })}`;
};

function Payouts({ players, scores, setScores, teams, groups }) {
  const [activeRound, setActiveRound] = useState(ROUNDS[0].id);
  const pay = useMemo(
    () => computePayouts({ players, scores, teams, groups }),
    [players, scores, teams, groups]
  );
  const day = pay.rounds.find((r) => r.round.id === activeRound);

  // "Who gets paid" shows what each player won over the whole trip or on one day
  // (that day's games only), or the Balance: won vs paid, and what is still owed.
  const [view, setView] = useState('all');
  const viewRound = ROUNDS.find((r) => r.id === view);
  const isLast = view === ROUNDS[ROUNDS.length - 1].id;
  const isBalance = view === 'balance';

  // Payments: scores.paid[roundId][playerId] = [{ method: 'cash' | 'venmo', amount }, ...].
  // Kept inside `scores` for the same reason as CTP picks. Tapping a method pays
  // whatever is still owed for the day in view (Balance = every day + team/Mankles), so an
  // earlier Venmo payment stays Venmo and a score change can be topped up.
  // When nothing is owed, tapping a method undoes the payments made that way.
  const [unlocked, setUnlocked] = useState(() => {
    try { return sessionStorage.getItem(SCORECARD_UNLOCK_KEY) === '1'; } catch { return false; }
  });
  const [pwAttempt, setPwAttempt] = useState('');
  const [pwError, setPwError] = useState(false);
  const tryUnlock = () => {
    if (pwAttempt !== SCORECARD_PASSWORD) { setPwError(true); return; }
    setUnlocked(true);
    try { sessionStorage.setItem(SCORECARD_UNLOCK_KEY, '1'); } catch {}
  };
  const viewDays = viewRound ? [view] : PAY_BUCKETS;
  const cents = (n) => Math.round(n * 100) / 100;
  const paidStatus = (row) => {
    const days = viewDays.map((d) => {
      const owed = cents(row.items.filter((it) => it.roundId === d).reduce((a, it) => a + it.amount, 0));
      const payments = Array.isArray(scores?.paid?.[d]?.[row.player.id]) ? scores.paid[d][row.player.id] : [];
      return { d, owed, payments, paid: cents(payments.reduce((a, p) => a + p.amount, 0)) };
    }).filter((x) => x.owed > 0 || x.payments.length);
    const paid = cents(days.reduce((a, x) => a + x.paid, 0));
    const methods = [...new Set(days.flatMap((x) => x.payments.map((p) => p.method)))];
    const due = days.some((x) => x.owed > x.paid);
    return { days, paid, methods, due, settled: days.length > 0 && days.every((x) => x.owed === x.paid) };
  };
  const setPaid = (row, method) => {
    if (!unlocked) return;
    const { days, due } = paidStatus(row);
    setScores((prev) => {
      const paid = { ...(prev?.paid || {}) };
      days.forEach(({ d, owed, payments, paid: already }) => {
        const next = due
          ? (owed > already ? [...payments, { method, amount: cents(owed - already) }] : payments)
          : payments.filter((p) => p.method !== method);
        const day = { ...(paid[d] || {}) };
        if (next.length) day[row.player.id] = next; else delete day[row.player.id];
        paid[d] = day;
      });
      return { ...prev, paid };
    });
  };
  const people = pay.people
    .map((row) => {
      const items = viewRound ? row.items.filter((it) => it.roundId === view) : row.items;
      const total = cents(items.reduce((a, it) => a + it.amount, 0));
      const view_ = { ...row, items, total };
      const status = paidStatus(view_);
      return { ...view_, status, left: cents(total - status.paid) };
    })
    .sort((a, b) => (isBalance ? b.left - a.left : 0) || b.total - a.total || a.player.name.localeCompare(b.player.name));
  const viewTotal = cents(people.reduce((a, p) => a + p.total, 0));
  const paidOutView = cents(people.reduce((a, row) => a + row.status.paid, 0));

  const dayPurse = 2 * CTP_PRIZE + DAILY_POINTS_PRIZES[0] + DAILY_POINTS_PRIZES[1] + SKINS_POT_PER_ROUND;

  return (
    <section className="mt-10">
      <SectionTitle eyebrow="Settle Up" title="The Payouts" />

      {/* WHO GETS PAID */}
      <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
        <span className="smallcaps text-[11px]" style={{ color: C.goldDk }}>Who Gets Paid</span>
        <div className="flex rounded overflow-hidden" role="group" aria-label="Show money for" style={{ border: `1px solid ${C.rule}` }}>
          {[{ id: 'all', label: 'Whole Trip' }, ...ROUNDS.map((r) => ({ id: r.id, label: r.day.slice(0, 3) })), { id: 'balance', label: 'Balance' }].map((opt, i) => {
            const active = view === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setView(opt.id)}
                aria-pressed={active}
                className={`smallcaps text-[10px] px-2.5 md:px-3 py-1.5 ${i ? 'border-l' : ''}`}
                style={{ borderColor: C.rule, background: active ? C.greenDk : 'white', color: active ? C.gold : C.greenDk }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mb-3 text-xs" style={{ color: '#6b6555' }}>
        {viewRound && <>{viewRound.day}'s games · {fmtUsd(viewTotal)} of {fmtUsd(dayPurse)} decided · Paid out {fmtUsd(paidOutView)}</>}
        {isLast && ' · Team event and Mankles are under Whole Trip'}
        {view === 'all' && <>Total winnings · {fmtUsd(viewTotal)} of {fmtUsd(pay.purse)} decided</>}
        {isBalance && <>Won {fmtUsd(viewTotal)} · Paid {fmtUsd(paidOutView)} · Still owed {fmtUsd(cents(viewTotal - paidOutView))}</>}
      </div>
      {!unlocked && view !== 'all' && (
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs" style={{ color: '#6b6555' }}>Scorekeeper: unlock to mark who's been paid</span>
          <input
            type="password"
            value={pwAttempt}
            onChange={(e) => { setPwAttempt(e.target.value); setPwError(false); }}
            onKeyDown={(e) => { if (e.key === 'Enter') tryUnlock(); }}
            placeholder="Password"
            aria-label="Scorekeeper password"
            className="w-32 text-xs bg-white outline-none rounded px-2 py-1.5"
            style={{ border: `1px solid ${pwError ? '#B0413E' : C.rule}`, color: C.ink }}
          />
          <button onClick={tryUnlock} className="smallcaps text-[10px] px-3 py-1.5 rounded" style={{ background: C.greenDk, color: C.gold }}>
            Unlock
          </button>
          {pwError && <span className="text-[11px]" style={{ color: '#B0413E' }}>Incorrect password.</span>}
        </div>
      )}
      <div className="rounded mb-10" style={{ border: `1px solid ${C.rule}`, background: 'white' }}>
        <table className="w-full text-sm tabular">
          <thead>
            <tr className="text-left" style={{ background: C.greenDk, color: C.cream }}>
              <th className="py-3 px-3 smallcaps text-[11px]">Player</th>
              <th className="py-3 px-3 smallcaps text-[11px] text-right" style={{ color: C.gold }}>{isBalance ? 'Left' : 'Won'}</th>
            </tr>
          </thead>
          <tbody>
            {people.map((row) => {
              const has = row.total > 0;
              return (
                <tr key={row.player.id} className="border-t" style={{ borderColor: C.rule }}>
                  <td className="py-2.5 px-3">
                    <div className="font-display text-base md:text-lg leading-tight" style={{ color: has ? C.ink : '#8e8870' }}>
                      {row.player.name}
                    </div>
                    {has && !isBalance && (
                      <div className="text-[11px] mt-0.5" style={{ color: '#6b6555' }}>
                        {row.items.map((it) => `${it.label} ${fmtUsd(it.amount)}`).join(' · ')}
                      </div>
                    )}
                    {isBalance && (has || row.status.paid > 0) && (
                      <div className="text-[11px] mt-0.5" style={{ color: '#6b6555' }}>
                        Won {fmtUsd(row.total)} · Paid {fmtUsd(row.status.paid)}
                      </div>
                    )}
                    {view !== 'all' && (
                      <PaidControls status={row.status} total={row.total} unlocked={unlocked} balance={isBalance} onPick={(m) => setPaid(row, m)} />
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right font-display text-lg md:text-xl font-mono align-top" style={{ color: (isBalance ? row.left > 0 : has) ? C.greenDk : '#bfb89e' }}>
                    {isBalance
                      ? (row.left > 0 ? fmtUsd(row.left) : row.left < 0 ? `−${fmtUsd(-row.left)}` : '—')
                      : (has ? fmtUsd(row.total) : '—')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* DAY SELECTOR */}
      <div className="mb-3 smallcaps text-[11px]" style={{ color: C.goldDk }}>Daily Games</div>
      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
        {ROUNDS.map((r) => {
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
              <div className="p-3 md:p-5">
                <div className="smallcaps text-[10px] md:text-[11px] mb-1" style={{ color: active ? C.gold : C.goldDk }}>
                  {r.day} {r.date}
                </div>
                <div className="font-display text-lg md:text-2xl leading-tight" style={{ color: active ? C.cream : C.greenDkr }}>
                  {r.course.split(' ').pop()}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <DayPayouts day={day} players={players} />

      {/* TEAM EVENT */}
      <div className="mt-10 mb-3 flex items-center gap-2">
        <span className="smallcaps text-[11px]" style={{ color: C.goldDk }}>Team Event</span>
        <StatusTag final={pay.allDone} pendingLabel="Projected" />
      </div>
      <div className="rounded" style={{ border: `1px solid ${C.rule}`, background: 'white' }}>
        {pay.teamPrizes.length === 0 ? TEAM_PRIZES.map((amt, i) => (
          <PrizeRow key={i} first={i === 0} label={`${i === 0 ? '1st' : '2nd'} place team`} amount={amt} who={null} />
        )) : pay.teamPrizes.map((tp, i) => (
          <PrizeRow
            key={tp.team.id}
            first={i === 0}
            label={`${tp.team.name} · ${Math.round(tp.total * 10) / 10} pts`}
            amount={tp.amount}
            who={tp.members.map((p) => p.name).join(', ')}
            note={`${fmtUsd(tp.each)} each`}
            dim={!pay.allDone}
          />
        ))}
      </div>

      <p className="mt-6 text-xs italic" style={{ color: '#6b6555' }}>
        Everything is worked out from the scores — the only thing to mark by hand is closest to the pin,
        on the Scorecard. Daily points = that day's Mankles score (handicap + Stableford points); they pay out once
        every player has finished the round. Skins pay once every hole is decided. Ties split the prize money for the
        places they share. Team and Mankles prizes pay after Saturday's round — Mankles payouts are on the Leaderboard.
      </p>
    </section>
  );
}

const PAY_METHODS = [{ id: 'cash', label: 'Cash' }, { id: 'venmo', label: 'Venmo' }];

function PaidControls({ status, total, unlocked, balance = false, onPick }) {
  const { days, paid, methods, due, settled } = status;
  if (days.length === 0) return null;
  const diff = Math.round((total - paid) * 100) / 100;
  const methodText = methods.map((m) => PAY_METHODS.find((x) => x.id === m)?.label).join(' + ');
  let note = null;
  if (settled) note = { text: `✓ Paid · ${methodText}`, color: C.greenDk };
  else if (paid > 0) {
    // On Balance, part-paid is normal (e.g. Thursday paid, Friday not yet), so it isn't flagged red.
    note = diff > 0 && balance
      ? { text: `Paid so far · ${methodText}`, color: '#6b6555' }
      : diff > 0
      ? { text: `Paid ${fmtUsd(paid)} (${methodText}) · owes ${fmtUsd(diff)} more`, color: '#B0413E' }
      : { text: `Paid ${fmtUsd(paid)} · overpaid ${fmtUsd(-diff)}`, color: '#B0413E' };
  }
  return (
    <div className="mt-1.5 flex items-center gap-2 flex-wrap">
      {unlocked && PAY_METHODS.map((m) => {
        const active = !due && methods.includes(m.id);
        return (
          <button
            key={m.id}
            type="button"
            aria-pressed={active}
            title={active ? `Undo ${m.label} payment` : `Mark paid by ${m.label}`}
            onClick={() => onPick(m.id)}
            className="flex items-center gap-1 smallcaps text-[10px] px-2.5 py-1 rounded-full"
            style={{ border: `1px solid ${active ? C.greenDk : C.rule}`, background: active ? C.greenDk : 'white', color: active ? C.gold : C.greenDk }}
          >
            {active && <Check size={11} strokeWidth={3} />}
            {m.label}
          </button>
        );
      })}
      {note && <span className="text-[11px] font-medium" style={{ color: note.color }}>{note.text}</span>}
    </div>
  );
}

function StatusTag({ final, pendingLabel = 'Pending' }) {
  return (
    <span
      className="smallcaps text-[9px] px-1.5 py-0.5 rounded-full"
      style={final
        ? { background: C.greenDk, color: C.gold }
        : { background: C.creamLt, color: '#8e8870', border: `1px solid ${C.rule}` }}
    >
      {final ? 'Final' : pendingLabel}
    </span>
  );
}

function PrizeRow({ label, amount, who, note, first = true, dim = false }) {
  return (
    <div className={`px-3 md:px-4 py-3 flex items-start justify-between gap-3 ${first ? '' : 'border-t'}`} style={{ borderColor: C.rule }}>
      <div className="min-w-0">
        <div className="smallcaps text-[10px]" style={{ color: C.goldDk }}>{label}</div>
        <div className="font-display text-base md:text-lg leading-tight" style={{ color: who ? (dim ? '#6b6555' : C.ink) : '#bfb89e' }}>
          {who || 'Not decided yet'}
        </div>
        {note && <div className="text-[11px] mt-0.5" style={{ color: '#6b6555' }}>{note}</div>}
      </div>
      <div className="font-display text-lg md:text-xl font-mono shrink-0" style={{ color: who && !dim ? C.greenDk : '#bfb89e' }}>
        {fmtUsd(amount)}
      </div>
    </div>
  );
}

function DayPayouts({ day, players }) {
  const { ctp, standings, complete, done, skins, skinsDone, course } = day;
  const total = players.length;

  // Most / 2nd most points: once final, list the paid players; before that, show who's leading.
  // Paid players grouped by score; a tie for 1st that covers both prizes is one group.
  const winnerGroups = [];
  standings.filter((s) => s.prize > 0).forEach((s) => {
    const g = winnerGroups.find((x) => x.points === s.points);
    if (g) g.list.push(s); else winnerGroups.push({ points: s.points, list: [s] });
  });
  const scored = standings.filter((s) => s.points !== null);
  const fmtWho = (list) => list.map((s) => `${s.player.name} (${s.points})`).join(', ');
  const top = scored.length ? scored.filter((s) => s.points === scored[0].points) : [];
  const nextPts = scored.find((s) => s.points < (scored[0]?.points ?? -Infinity))?.points;
  const second = top.length === 1 && nextPts !== undefined ? scored.filter((s) => s.points === nextPts) : [];

  const skinRows = players
    .map((p) => ({ player: p, n: skins?.skinsByPlayer.get(p.id) || 0 }))
    .filter((r) => r.n > 0)
    .sort((a, b) => b.n - a.n);
  const decidedHoles = skins ? skins.holes.filter((h) => h.status !== 'pending').length : 0;

  return (
    <div className="space-y-6">
      {/* CTP + POINTS */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="smallcaps text-[11px]" style={{ color: C.goldDk }}>Closest to the Pin & Daily Points</span>
          <StatusTag final={complete} pendingLabel={`${done}/${total} finished`} />
        </div>
        <div className="rounded" style={{ border: `1px solid ${C.rule}`, background: 'white' }}>
          {ctp.map((c, i) => (
            <PrizeRow
              key={c.side}
              first={i === 0}
              label={`${c.side === 'front' ? 'Front' : 'Back'} 9 CTP`}
              amount={c.amount}
              who={c.winner?.name}
              note={c.winner ? null : 'Tick the CTP box on the Scorecard'}
            />
          ))}
          {complete ? (
            winnerGroups.map((g, gi) => (
              <PrizeRow
                key={g.points}
                first={false}
                label={`${gi === 0 ? 'Most' : '2nd most'} points${g.list.length > 1 ? ' · tie' : ''}`}
                amount={g.list.reduce((a, s) => a + s.prize, 0)}
                who={fmtWho(g.list)}
                note={g.list.length > 1 ? `${fmtUsd(g.list[0].prize)} each` : null}
              />
            ))
          ) : (
            <>
              <PrizeRow first={false} label="Most points" amount={DAILY_POINTS_PRIZES[0]} dim
                who={top.length ? `Leading: ${fmtWho(top)}` : null}
                note={`Pays when all ${total} players finish`} />
              <PrizeRow first={false} label="2nd most points" amount={DAILY_POINTS_PRIZES[1]} dim
                who={second.length ? `Leading: ${fmtWho(second)}` : null} />
            </>
          )}
        </div>
      </div>

      {/* SKINS */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="smallcaps text-[11px]" style={{ color: C.goldDk }}>Skins · {fmtUsd(SKINS_POT_PER_ROUND)} Pool</span>
          <StatusTag final={skinsDone} pendingLabel={`${decidedHoles}/18 holes`} />
        </div>
        <div className="rounded" style={{ border: `1px solid ${C.rule}`, background: 'white' }}>
          <div className="px-3 md:px-4 py-3 flex justify-between gap-3 text-sm" style={{ color: '#6b6555' }}>
            <span>{skins?.totalSkins || 0} skin{skins?.totalSkins === 1 ? '' : 's'} won</span>
            <span>{skins?.totalSkins ? `${fmtUsd(skins.payoutPerSkin)} each${skinsDone ? '' : ' so far'}` : '—'}</span>
          </div>
          {skinRows.map((r) => (
            <div key={r.player.id} className="px-3 md:px-4 py-2.5 border-t flex justify-between gap-3" style={{ borderColor: C.rule }}>
              <span className="font-display text-base md:text-lg" style={{ color: skinsDone ? C.ink : '#6b6555' }}>
                {r.player.name} <span className="font-mono text-xs" style={{ color: '#8e8870' }}>×{r.n}</span>
              </span>
              <span className="font-display text-lg md:text-xl font-mono" style={{ color: skinsDone ? C.greenDk : '#bfb89e' }}>
                {fmtUsd(r.n * skins.payoutPerSkin)}
              </span>
            </div>
          ))}
          {skinsDone && skins.totalSkins === 0 && (
            <div className="px-3 md:px-4 py-2.5 border-t text-sm italic" style={{ borderColor: C.rule, color: '#8e8870' }}>
              Every hole tied — the {fmtUsd(SKINS_POT_PER_ROUND)} pool is unclaimed.
            </div>
          )}
        </div>

        <details className="mt-3">
          <summary className="smallcaps text-[11px] cursor-pointer" style={{ color: C.goldDk }}>Skins hole by hole</summary>
          <SkinsHoleTable skins={skins} course={course} />
          <p className="mt-2 text-xs italic" style={{ color: '#6b6555' }}>
            Net scoring (strokes off field low man) · Full field of {total} · A hole is decided once everyone has posted ·
            Ties get no skin (no carryovers) · The pool splits evenly across skins won.
          </p>
        </details>
      </div>
    </div>
  );
}

function SkinsHoleTable({ skins, course }) {
  return (
    <div className="mt-3 rounded" style={{ border: `1px solid ${C.rule}`, background: 'white' }}>
      <table className="w-full text-sm tabular">
        <thead>
          <tr className="text-left" style={{ background: C.greenDk, color: C.cream }}>
            <th className="py-3 px-2 smallcaps text-[11px] w-12 text-center">Hole</th>
            <th className="py-3 px-2 smallcaps text-[11px] w-12 text-center">Par</th>
            <th className="py-3 px-3 smallcaps text-[11px]">Result</th>
            <th className="py-3 px-3 smallcaps text-[11px] text-right">Net</th>
          </tr>
        </thead>
        <tbody>
          {skins?.holes.map((h) => {
            const par = course.holes[h.hole - 1].par;
            let resultCell, netCell;
            if (h.status === 'won') {
              resultCell = <span className="font-display" style={{ color: C.greenDk }}>{playerLabel(h.winner)}</span>;
              netCell = h.net;
            } else if (h.status === 'tied') {
              resultCell = (
                <span style={{ color: '#8e8870' }}>
                  <span className="italic">Tie — no skin</span>
                  <div className="text-[10px] mt-0.5">{h.tiedPlayers.map((p) => p.name).join(', ')}</div>
                </span>
              );
              netCell = h.net;
            } else {
              resultCell = <span style={{ color: '#bfb89e' }} className="italic">{h.posted}/{h.total} posted</span>;
              netCell = <span style={{ color: '#bfb89e' }}>—</span>;
            }
            return (
              <tr key={h.hole} className="border-t" style={{ borderColor: C.rule }}>
                <td className="py-2 px-2 font-mono text-center" style={{ color: C.greenDk }}>{h.hole}</td>
                <td className="py-2 px-2 font-mono text-center" style={{ color: '#6b6555' }}>{par}</td>
                <td className="py-2 px-3">{resultCell}</td>
                <td className="py-2 px-3 text-right font-mono" style={{ color: C.ink }}>{netCell}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// COURSES — scorecards & hole-by-hole
// ============================================================
function Courses({ groups }) {
  const [selectedId, setSelectedId] = useState(null);
  const selected = COURSES.find((c) => c.id === selectedId);

  if (selected) return <CourseDetail course={selected} onBack={() => setSelectedId(null)} />;

  return (
    <section className="mt-10">
      <SectionTitle eyebrow="Reunion Resort & Golf Club" title="The Courses" />

      <div className="grid md:grid-cols-3 gap-5">
        {ROUNDS.map((r) => {
          // Listed in play order; first tee time comes from the round's Group 1.
          const c = COURSES.find((x) => x.id === r.courseId);
          const firstTee = groups?.[r.id]?.[0]?.teeTime;
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
                  <span>{r.day} {r.date} · First tee</span>
                  <span className="font-mono" style={{ color: C.greenDk }}>{firstTee || '—'}</span>
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
      const max = maxHoleScore(course.holes[holeIdx].par);
      arr[holeIdx] = Number.isFinite(v) && v >= 1 && v <= max ? v : null;
      next[activeRound] = { ...next[activeRound], [playerId]: arr };
      return next;
    });
  };

  // One CTP winner per side per round: ticking a player moves the win to them,
  // ticking the current winner clears it.
  const ctp = ctpForRound(scores, activeRound);
  const toggleCtp = (playerId, side) => {
    if (!unlocked) return;
    setScores((prev) => {
      const cur = prev?.ctp?.[activeRound] || {};
      const nextRound = { ...cur, [side]: cur[side] === playerId ? null : playerId };
      return { ...prev, ctp: { ...(prev?.ctp || {}), [activeRound]: nextRound } };
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

      {unlocked && <CardCheck round={round} players={players} scores={scores} ctp={ctp} />}

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
            ctp={{ front: ctp.front === p.id, back: ctp.back === p.id }}
            onToggleCtp={(side) => toggleCtp(p.id, side)}
          />
        ))}
      </div>

      <p className="mt-6 text-xs italic text-center" style={{ color: '#6b6555' }}>
        Type a number into any hole to record a score. Totals update live and save automatically.
      </p>
    </section>
  );
}

// Round check-in for the scorekeeper: which cards are still missing or
// unfinished, and whether both CTPs are marked.
function CardCheck({ round, players, scores, ctp }) {
  const counts = players.map((p) => ({
    player: p,
    filled: (scores?.[round.id]?.[p.id] || []).filter((v) => Number.isFinite(v)).length,
  }));
  const done = counts.filter((c) => c.filled === 18).length;
  if (counts.every((c) => c.filled === 0)) return null;
  const partial = counts.filter((c) => c.filled > 0 && c.filled < 18);
  const notStarted = counts.filter((c) => c.filled === 0);
  const ctpMissing = ['front', 'back'].filter((side) => !ctp?.[side]).map((side) => (side === 'front' ? 'front 9' : 'back 9'));
  const allGood = done === players.length && ctpMissing.length === 0;
  return (
    <div
      className="mb-4 px-4 py-3 rounded text-[13px] space-y-0.5"
      style={allGood
        ? { background: C.creamLt, border: `1px solid ${C.rule}`, color: C.greenDk }
        : { background: '#FFF6E0', border: '1px solid #EBCB85', color: '#7A5200' }}
    >
      <div className="font-semibold">
        {allGood ? `✓ All ${players.length} cards in and both CTPs marked` : `${round.day}: ${done} of ${players.length} cards complete`}
      </div>
      {partial.length > 0 && <div>Unfinished: {partial.map((c) => `${c.player.name} (${c.filled}/18)`).join(', ')}</div>}
      {notStarted.length > 0 && <div>Not started: {notStarted.map((c) => c.player.name).join(', ')}</div>}
      {!allGood && ctpMissing.length > 0 && <div>CTP not marked yet: {ctpMissing.join(' and ')}</div>}
    </div>
  );
}

function CtpBox({ side, checked, disabled, onClick }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={`Closest to the pin, ${side} nine`}
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 py-1 smallcaps text-[10px] whitespace-nowrap disabled:cursor-not-allowed"
      style={{ color: checked ? C.gold : 'rgba(245,239,224,0.7)', opacity: disabled && !checked ? 0.5 : 1 }}
    >
      <span
        className="inline-flex items-center justify-center rounded-sm"
        style={{ width: 16, height: 16, border: `1px solid ${C.gold}`, background: checked ? C.gold : 'transparent' }}
      >
        {checked && <Check size={12} strokeWidth={3} style={{ color: C.greenDkr }} />}
      </span>
      CTP {side === 'front' ? 'F9' : 'B9'}
    </button>
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

function PlayerScorecard({ player, course, teams, round, allPlayers, groups, playerScores, onSetHole, disabled, ctp, onToggleCtp }) {
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
  const warnings = disabled ? [] : cardWarnings(playerScores, course.holes);

  return (
    <div className="rounded overflow-hidden" style={{ border: `1px solid ${C.rule}`, background: 'white' }}>
      {/* Player header */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-y-1" style={{ background: C.greenDk, color: C.cream }}>
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
        <div className="w-full flex items-center gap-4">
          {['front', 'back'].map((side) => (
            <CtpBox key={side} side={side} checked={!!ctp?.[side]} disabled={disabled} onClick={() => onToggleCtp(side)} />
          ))}
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="px-4 py-2 text-[12px] flex flex-wrap gap-x-3 gap-y-0.5" style={{ background: '#FFF6E0', color: '#7A5200', borderBottom: `1px solid ${C.rule}` }}>
          <span className="font-semibold">Double-check:</span>
          {warnings.map((w) => <span key={w}>{w}</span>)}
        </div>
      )}

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

// Highest score accepted on a hole (triple par). Anything above it — or a 0 —
// is almost certainly a typo like a double-tapped "44", so it is shown in red
// and not saved until corrected.
const maxHoleScore = (par) => par * 3;

// Scores that are allowed but worth a second look when a card is typed in:
// an ace on a par 4/5, or 5+ over par on one hole.
const isUnusualScore = (v, par) => Number.isFinite(v) && ((v === 1 && par >= 4) || v >= par + 5);

// Gentle checks for one card. Nothing here blocks saving — it just points at
// what to double-check against the paper card.
const cardWarnings = (playerScores, holes) => {
  const filled = playerScores.filter((v) => Number.isFinite(v)).length;
  const out = [];
  if (filled > 0 && filled < holes.length) {
    const blank = holes.map((h, i) => (Number.isFinite(playerScores[i]) ? null : h.hole)).filter(Boolean);
    out.push(blank.length <= 4
      ? `Blank: hole${blank.length > 1 ? 's' : ''} ${blank.join(', ')}`
      : `${blank.length} holes still blank`);
  }
  holes.forEach((h, i) => {
    const v = playerScores[i];
    if (isUnusualScore(v, h.par)) out.push(`Hole ${h.hole}: ${v === 1 ? 'hole-in-one' : v} on a par ${h.par}?`);
  });
  return out;
};

function ScoreInput({ value, par, onChange, disabled }) {
  const unusual = !disabled && isUnusualScore(value, par);
  const [draft, setBadDraft] = useState(null);
  // A saved score (e.g. arriving from another phone) always wins over a stale typo.
  const badDraft = Number.isFinite(value) ? null : draft;
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
      value={badDraft ?? value ?? ''}
      readOnly={disabled}
      onChange={(e) => {
        if (disabled) return;
        const digits = e.target.value.replace(/\D/g, '').slice(0, 2);
        const n = parseInt(digits, 10);
        const ok = digits === '' || (n >= 1 && n <= maxHoleScore(par));
        setBadDraft(ok ? null : digits);
        onChange(ok ? digits : '');
      }}
      placeholder="—"
      title={badDraft ? `Not saved — max ${maxHoleScore(par)} on a par ${par}` : undefined}
      aria-invalid={!!badDraft}
      // 16px text stops iPhone Safari from zooming in on every tap.
      className="w-full text-center font-mono text-base bg-transparent outline-none rounded py-2 px-0 transition-colors"
      style={{
        border: badDraft ? '2px solid #C62828' : unusual ? '2px solid #D99A1E' : `1px solid ${filled ? C.gold : C.rule}`,
        background: badDraft ? '#FDECEA' : unusual ? '#FFF6E0' : 'transparent',
        color: badDraft ? '#C62828' : color,
        fontWeight: filled || badDraft ? 600 : 400,
        textDecoration: badDraft ? 'line-through' : 'none',
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

function Footer({ state }) {
  const link = 'smallcaps text-[10px] underline underline-offset-2 hover:opacity-100';
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
        <div className="flex items-center gap-2 mt-2 text-[10px]" style={{ color: C.gold, opacity: 0.6 }}>
          <span className="smallcaps">Export results:</span>
          <button onClick={() => exportResultsWorkbook(state)} className={link} style={{ color: C.gold }}>Excel</button>
          <span aria-hidden="true">·</span>
          <button onClick={() => exportRawBackup(state)} className={link} style={{ color: C.gold }}>Raw data</button>
        </div>
      </div>
    </footer>
  );
}
