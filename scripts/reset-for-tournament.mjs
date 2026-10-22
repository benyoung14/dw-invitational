// Wipes the test data before the real tournament.
//
//   npm run reset:check   → dry run: backs up and shows what WOULD change, writes nothing
//   npm run reset:go      → backs up, then clears all scores and the R3 pairing slots
//
// Leaves players, handicaps, teams/team names, flight info and the locked
// R1/R2 pairings untouched. R3 slots are emptied (tee times kept) so they
// auto-fill from the real Mankles standings once R1 + R2 are fully scored.
// Undo with: npm run restore -- backups/<file>.json
import { readState, writeState, saveBackup, countScores } from './db.mjs';

const go = process.argv.includes('--confirm');

const before = await readState();
const data = before.data || {};
const backup = saveBackup(before, go ? 'before-reset' : 'dry-run');

const r3 = data.groups?.r3 || [];
const next = {
  ...data,
  scores: {},
  groups: {
    ...data.groups,
    r3: r3.map((g) => ({ ...g, playerIds: (g.playerIds || []).map(() => '') })),
  },
};

const names = Object.fromEntries((data.players || []).map((p) => [p.id, p.name]));
console.log(`Backup saved: ${backup}`);
console.log(`Live data last updated: ${before.updated_at}`);
console.log('');
console.log('Players with scores now →', countScores(data), '→ after reset: all 0');
console.log('R3 pairings now:');
for (const g of r3) {
  console.log(`  ${g.teeTime}: ${(g.playerIds || []).map((id) => names[id] || '(empty)').join(', ')}`);
}
console.log('  → after reset: every R3 slot empty (tee times kept)');
console.log(`Unchanged: ${data.players?.length ?? 0} players, ${data.teams?.length ?? 0} teams, R1/R2 pairings.`);
console.log('');

if (!go) {
  console.log('DRY RUN — nothing was changed. Run `npm run reset:go` to do it for real.');
  process.exit(0);
}

// Guard against someone editing between our read and our write.
const latest = await readState();
if (latest.updated_at !== before.updated_at) {
  console.error('ABORTED: the live data changed while this script was running. Nothing was written. Try again.');
  process.exit(1);
}

await writeState(next);

const after = await readState();
const counts = countScores(after.data);
const r3Empty = (after.data.groups?.r3 || []).every((g) => (g.playerIds || []).every((id) => !id));
if (Object.values(counts).some((n) => n > 0) || !r3Empty) {
  console.error('WARNING: reset written, but verification failed:', counts, 'R3 empty:', r3Empty);
  process.exit(1);
}
console.log('RESET DONE — scores cleared and R3 slots empty. Verified against the live database.');
console.log('Ask everyone to refresh the site once so no phone is holding old test scores.');
