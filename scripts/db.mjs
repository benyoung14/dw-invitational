// Shared helpers for the one-off Supabase scripts in this folder.
// Reads the Supabase URL + anon key from .env.local so the scripts can be
// run with plain `node` (or the npm scripts) — no `source .env.local` needed.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const BACKUP_DIR = path.join(ROOT, 'backups');

function loadEnv() {
  const env = { ...process.env };
  try {
    for (const line of readFileSync(path.join(ROOT, '.env.local'), 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !env[m[1]]) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    // fall through to the check below
  }
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (expected in .env.local).');
    process.exit(1);
  }
  return { url, key };
}

const { url, key } = loadEnv();
const headers = { apikey: key, Authorization: `Bearer ${key}` };

// Returns { data, updated_at } for the singleton app_state row.
export async function readState() {
  const res = await fetch(`${url}/rest/v1/app_state?id=eq.singleton&select=data,updated_at`, { headers });
  if (!res.ok) throw new Error(`Read failed: ${res.status} ${await res.text()}`);
  const row = (await res.json())[0];
  if (!row) throw new Error('No app_state row found.');
  return row;
}

export async function writeState(data) {
  const res = await fetch(`${url}/rest/v1/app_state`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify({ id: 'singleton', data, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`Write failed: ${res.status} ${await res.text()}`);
}

// Saves the full row to backups/<timestamp>-<label>.json and returns the path.
export function saveBackup(row, label) {
  mkdirSync(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const file = path.join(BACKUP_DIR, `${stamp}-${label}.json`);
  writeFileSync(file, JSON.stringify(row, null, 2));
  return file;
}

export const countScores = (data) =>
  Object.fromEntries(
    ['r1', 'r2', 'r3'].map((r) => [
      r,
      Object.values(data?.scores?.[r] || {}).filter((arr) => (arr || []).some(Number.isFinite)).length,
    ])
  );
