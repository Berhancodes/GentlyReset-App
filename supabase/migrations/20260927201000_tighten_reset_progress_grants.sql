-- Phase 4D: authenticated clients may SELECT/INSERT/UPDATE own reset rows.
-- RLS has no DELETE policies; this removes leftover default table grants
-- so normal clients cannot delete completion history.

revoke all on table public.reset_cycles from authenticated;
grant select, insert, update on table public.reset_cycles to authenticated;

revoke all on table public.reset_day_completions from authenticated;
grant select, insert, update on table public.reset_day_completions to authenticated;
