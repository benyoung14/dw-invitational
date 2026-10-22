// Puts a backup made by reset-for-tournament.mjs back into the live database.
//
//   npm run restore -- backups/<file>.json             → dry run: shows what would be restored
//   npm run restore -- backups/<file>.json --confirm   → restores it
//
// Saves a backup of the current live data first, so a restore can itself be undone.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT, readState, writeState, saveBackup, countScores } from './db.mjs';

const file = process.argv.slice(2).find((a) => !a.startsWith('--'));
const go = process.argv.includes('--confirm');
if (!file) {
  console.error('Usage: npm run restore -- backups/<file>.json [--confirm]');
  process.exit(1);
}

const backup = JSON.parse(readFileSync(path.resolve(ROOT, file), 'utf8'));
if (!backup?.data?.players) {
  console.error(`${file} doesn't look like an app_state backup.`);
  process.exit(1);
}

const current = await readState();
console.log(`Restoring from: ${file} (saved from data last updated ${backup.updated_at})`);
console.log('Players with scores: live now →', countScores(current.data), '| in backup →', countScores(backup.data));

if (!go) {
  console.log('DRY RUN — nothing was changed. Add --confirm to restore.');
  process.exit(0);
}

console.log(`Current live data backed up to: ${saveBackup(current, 'before-restore')}`);
await writeState(backup.data);
const after = await readState();
if (JSON.stringify(after.data) !== JSON.stringify(backup.data)) {
  console.error('WARNING: restore written, but the live data does not match the backup.');
  process.exit(1);
}
console.log('RESTORE DONE — verified against the live database. Ask everyone to refresh the site.');
