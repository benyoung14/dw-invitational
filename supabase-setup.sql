-- Run this once in your Supabase project's SQL editor.
-- It creates a single-row "app_state" table that holds the full dashboard
-- payload (players, scores, teams, groups) as JSON, and opens read/write
-- access to the anon role so any visitor with the URL can edit.
-- Change the policies below if you later want to gate writes behind auth.

create table if not exists public.app_state (
  id          text primary key default 'singleton',
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.app_state enable row level security;

-- Open policies — anyone can read and write the singleton row.
drop policy if exists "anyone can read"   on public.app_state;
drop policy if exists "anyone can insert" on public.app_state;
drop policy if exists "anyone can update" on public.app_state;

create policy "anyone can read"   on public.app_state for select using (true);
create policy "anyone can insert" on public.app_state for insert with check (true);
create policy "anyone can update" on public.app_state for update using (true) with check (true);

-- Seed the singleton row.
insert into public.app_state (id, data) values ('singleton', '{}'::jsonb)
on conflict (id) do nothing;

-- Enable realtime so other browsers receive updates live.
alter publication supabase_realtime add table public.app_state;
