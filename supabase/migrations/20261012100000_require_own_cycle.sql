-- Journal entries and day completions must point at the writer's own reset cycle.
--
-- The insert/update policies only checked user_id, so a signed-in user who knew
-- another user's cycle UUID could attach rows to it and take that user's
-- (cycle_id, calendar_date) / (cycle_id, local_day) slots, blocking their backup.

create or replace function public.owns_reset_cycle(target_cycle_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.reset_cycles c
    where c.id = target_cycle_id and c.user_id = auth.uid()
  );
$$;

revoke all on function public.owns_reset_cycle(uuid) from public;
revoke all on function public.owns_reset_cycle(uuid) from anon;
grant execute on function public.owns_reset_cycle(uuid) to authenticated;

drop policy journal_entries_insert_own on public.journal_entries;
create policy journal_entries_insert_own
  on public.journal_entries
  for insert
  to authenticated
  with check (auth.uid() = user_id and public.owns_reset_cycle(cycle_id));

drop policy journal_entries_update_own on public.journal_entries;
create policy journal_entries_update_own
  on public.journal_entries
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id and public.owns_reset_cycle(cycle_id));

drop policy reset_day_completions_insert_own on public.reset_day_completions;
create policy reset_day_completions_insert_own
  on public.reset_day_completions
  for insert
  to authenticated
  with check (auth.uid() = user_id and public.owns_reset_cycle(cycle_id));

drop policy reset_day_completions_update_own on public.reset_day_completions;
create policy reset_day_completions_update_own
  on public.reset_day_completions
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id and public.owns_reset_cycle(cycle_id));
