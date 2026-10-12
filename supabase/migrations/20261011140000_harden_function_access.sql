-- Security advisor fixes before launch.
--
-- handle_new_user only runs as the auth.users insert trigger; nobody should be
-- able to call it through the API. Triggers still fire without EXECUTE grants.
revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon;
revoke all on function public.handle_new_user() from authenticated;

-- Pin search_path so these helpers can't be pointed at look-alike objects.
alter function public.set_updated_at() set search_path = public;
alter function public.normalize_profile_username() set search_path = public;
alter function public.canonicalize_username(text) set search_path = public;
