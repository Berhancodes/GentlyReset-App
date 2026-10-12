-- One journal row per calendar date, not per plan day.
--
-- After a missed day the plan day doesn't move, so keying by (cycle_id, local_day)
-- made the next day's entry overwrite the missed day's. The app now upserts on
-- (cycle_id, calendar_date) and only uploads entries that have a valid date.

alter table public.journal_entries
  drop constraint journal_entries_cycle_day_unique;

alter table public.journal_entries
  add constraint journal_entries_cycle_date_unique unique (cycle_id, calendar_date);
