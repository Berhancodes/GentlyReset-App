-- Phase 4E: account-backed journal backup.
-- Reflections stay local-first. One row per cycle day, not per user day.
-- Friends have no access. Photos are not uploaded in this phase.

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  cycle_id uuid not null references public.reset_cycles (id) on delete cascade,
  local_day integer not null,
  calendar_date date,
  mood text,
  prompt text,
  body text not null,
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint journal_entries_local_day_range check (local_day between 1 and 30),
  constraint journal_entries_cycle_day_unique unique (cycle_id, local_day)
);

comment on table public.journal_entries is
  'Cycle-scoped journal reflections. Friends have no access. photo_url reserved.';

create index journal_entries_user_id_updated_at_idx
  on public.journal_entries (user_id, updated_at);

create trigger journal_entries_set_updated_at
  before update on public.journal_entries
  for each row
  execute function public.set_updated_at();

alter table public.journal_entries enable row level security;

create policy journal_entries_select_own
  on public.journal_entries
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy journal_entries_insert_own
  on public.journal_entries
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy journal_entries_update_own
  on public.journal_entries
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

revoke all on table public.journal_entries from public;
revoke all on table public.journal_entries from anon;
revoke all on table public.journal_entries from authenticated;
grant select, insert, update on table public.journal_entries to authenticated;
