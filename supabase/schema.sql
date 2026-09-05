-- Run this once in the Supabase project's SQL Editor.

create table if not exists leaderboard (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('open', 'ladies-kids')),
  name text not null default '---',
  time text not null default '0:00.000',
  phone text,
  created_at timestamptz not null default now()
);

alter table leaderboard enable row level security;

-- This app has no login system — every visitor uses the public anon key,
-- so these policies allow anyone with the site URL to read/write/delete.
-- Fine for a supervised event kiosk; add auth first if that's not acceptable.
create policy "Public read access" on leaderboard
  for select using (true);

create policy "Public insert access" on leaderboard
  for insert with check (true);

create policy "Public update access" on leaderboard
  for update using (true);

create policy "Public delete access" on leaderboard
  for delete using (true);

-- Enables live sync across devices (Leaderboard/Edit/Data pages update
-- automatically without a refresh). In the dashboard this is the same as
-- toggling Database -> Replication -> supabase_realtime -> leaderboard on.
alter publication supabase_realtime add table leaderboard;
