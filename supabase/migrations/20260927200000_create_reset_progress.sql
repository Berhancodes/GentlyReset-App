-- Phase 4D: account-backed reset backup.
-- Local ResetSnapshot remains the offline working copy.
-- Cloud history is normalized rows, not a completed_days JSON array.
-- Journal, companion, and friends stay out of this migration.

create table public.reset_cycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  sequence integer not null default 1,
  plan_id text not null,
  plan_version integer not null,
  current_day integer not null default 1,
  today_started boolean not null default false,
  today_completed boolean not null default false,
  reset_started_on date,
  last_seen_on date,
  last_completed_on date,
  streak integer not null default 0,
  missed_yesterday boolean not null default false,
  reset_type_id text not null,
  personalization jsonb not null default '{}'::jsonb,
  profile_accuracy text,
  status text not null default 'active',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reset_cycles_current_day_range check (current_day between 1 and 30),
  constraint reset_cycles_sequence_min check (sequence >= 1),
  constraint reset_cycles_status_allowed check (status in ('active', 'completed')),
  constraint reset_cycles_user_sequence_unique unique (user_id, sequence)
);

comment on table public.reset_cycles is
  'Cycle 1 account backup of local reset progress. Friends have no direct access.';

create unique index reset_cycles_one_active_per_user
  on public.reset_cycles (user_id)
  where status = 'active';

create index reset_cycles_user_id_status_idx
  on public.reset_cycles (user_id, status);

create trigger reset_cycles_set_updated_at
  before update on public.reset_cycles
  for each row
  execute function public.set_updated_at();

create table public.reset_day_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  cycle_id uuid not null references public.reset_cycles (id) on delete cascade,
  local_day integer not null,
  completed_on date,
  created_at timestamptz not null default now(),
  constraint reset_day_completions_local_day_range check (local_day between 1 and 30),
  constraint reset_day_completions_cycle_day_unique unique (cycle_id, local_day)
);

comment on table public.reset_day_completions is
  'Normalized local-day completions for a reset cycle. Unknown historical dates stay null.';

create index reset_day_completions_user_completed_on_idx
  on public.reset_day_completions (user_id, completed_on);

alter table public.reset_cycles enable row level security;
alter table public.reset_day_completions enable row level security;

create policy reset_cycles_select_own
  on public.reset_cycles
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy reset_cycles_insert_own
  on public.reset_cycles
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy reset_cycles_update_own
  on public.reset_cycles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy reset_day_completions_select_own
  on public.reset_day_completions
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy reset_day_completions_insert_own
  on public.reset_day_completions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy reset_day_completions_update_own
  on public.reset_day_completions
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

revoke all on table public.reset_cycles from public;
revoke all on table public.reset_cycles from anon;
grant select, insert, update on table public.reset_cycles to authenticated;

revoke all on table public.reset_day_completions from public;
revoke all on table public.reset_day_completions from anon;
grant select, insert, update on table public.reset_day_completions to authenticated;

comment on table public.profiles is
  'Auth identity profile. Reset progress is local-first with optional account-backed backup.';
