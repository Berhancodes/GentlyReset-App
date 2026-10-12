-- In-app account deletion (App Store Review Guideline 5.1.1(v)).
--
-- Deletes the signed-in user's auth record. Every app table hangs off it with
-- ON DELETE CASCADE (auth.users -> profiles -> reset_cycles, reset_day_completions,
-- journal_entries, friendships, friend_invite_tokens, encouragements), so one
-- delete removes all of that user's data. Nobody can delete anyone else: the
-- target is always auth.uid().

create or replace function public.delete_my_account()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    return jsonb_build_object('ok', false, 'code', 'unauthenticated');
  end if;

  delete from auth.users where id = current_user_id;

  if not found then
    return jsonb_build_object('ok', false, 'code', 'not_found');
  end if;

  return jsonb_build_object('ok', true, 'code', 'deleted');
end;
$$;

revoke all on function public.delete_my_account() from public;
revoke all on function public.delete_my_account() from anon;
grant execute on function public.delete_my_account() to authenticated;
