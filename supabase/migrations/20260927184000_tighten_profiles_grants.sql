-- Phase 4B: authenticated clients may only SELECT/UPDATE their own profile.
-- RLS already blocks INSERT/DELETE; this removes leftover default table grants.

revoke all on table public.profiles from authenticated;
grant select, update on table public.profiles to authenticated;
