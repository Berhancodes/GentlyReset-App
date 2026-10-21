-- Security review fixes (October 19, 2026).
--
-- 1. Friend-request push spam: sending, cancelling and re-sending a request
--    pushed a notification every time (up to the 20/hour request limit). Now a
--    person gets at most one "new friend request" push from the same sender per
--    24 hours. The request itself still goes through; only the push is skipped.
-- 2. The two trigger helpers were executable by anon/authenticated through the
--    API. They can't do anything when called directly, but nothing needs that
--    access, so it's removed.

create or replace function public.push_on_friendship_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'pending'
     and (tg_op = 'INSERT' or old.status <> 'pending' or old.requester_id <> new.requester_id)
     -- One request push per sender → recipient per day. Counted against the caller.
     and public.consume_rate_limit('push_friend_request:' || new.addressee_id::text, 1, 86400) then
    perform public.send_friend_push(
      new.addressee_id,
      'new friend request',
      public.push_display_name(new.requester_id) || ' wants to be friends on Gently Reset',
      jsonb_build_object('type', 'friend_request', 'url', '/world')
    );
  elsif new.status = 'accepted' and tg_op = 'UPDATE' and old.status <> 'accepted' then
    perform public.send_friend_push(
      new.requester_id,
      'you''re friends now 🤍',
      public.push_display_name(new.addressee_id) || ' accepted your friend request',
      jsonb_build_object('type', 'friend_accepted', 'url', '/world')
    );
  end if;
  return new;
end;
$$;

revoke all on function public.push_on_friendship_change() from public;
revoke all on function public.push_on_friendship_change() from anon;
revoke all on function public.push_on_friendship_change() from authenticated;

revoke all on function public.set_updated_at() from public;
revoke all on function public.set_updated_at() from anon;
revoke all on function public.set_updated_at() from authenticated;
revoke all on function public.normalize_profile_username() from public;
revoke all on function public.normalize_profile_username() from anon;
revoke all on function public.normalize_profile_username() from authenticated;
