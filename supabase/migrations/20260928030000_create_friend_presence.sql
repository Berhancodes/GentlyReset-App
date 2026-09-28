-- Phase 4G: limited friend progress. Do not widen reset or journal RLS.
-- Opening this file never grants friends journal or personalization.
-- Encouragements live in 20260928031000_create_encouragements.sql.

-- ---------------------------------------------------------------------------
-- Accepted-friend helper. Future blocked_users can be added here.
-- ---------------------------------------------------------------------------

create or replace function public.are_accepted_friends(left_user_id uuid, right_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    left_user_id is not null
    and right_user_id is not null
    and left_user_id <> right_user_id
    and exists (
      select 1
      from public.friendships f
      where f.status = 'accepted'
        and f.pair_low = least(left_user_id, right_user_id)
        and f.pair_high = greatest(left_user_id, right_user_id)
    );
$$;

revoke all on function public.are_accepted_friends(uuid, uuid) from public;
revoke all on function public.are_accepted_friends(uuid, uuid) from anon;
revoke all on function public.are_accepted_friends(uuid, uuid) from authenticated;

-- ---------------------------------------------------------------------------
-- Limited friend progress. Friends never SELECT reset rows.
-- completed_today uses stored today_completed only when last_seen_on is the
-- friend's timezone today; otherwise last_completed_on must equal today.
-- That matches Phase 4D rollover: yesterday's today_completed is not today.
-- ---------------------------------------------------------------------------

create or replace function public.list_friend_progress()
returns table (
  friendship_id uuid,
  user_id uuid,
  username text,
  display_name text,
  avatar_url text,
  current_day integer,
  cycle_length integer,
  completed_today boolean,
  streak integer
)
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;

  return query
  select
    f.id,
    p.id,
    p.username,
    p.display_name,
    p.avatar_url,
    coalesce(c.current_day, 1),
    30,
    case
      when c.id is null then false
      when c.last_seen_on is not distinct from (
        timezone(coalesce(nullif(p.timezone, ''), 'UTC'), now())
      )::date then c.today_completed
      when c.last_completed_on is not distinct from (
        timezone(coalesce(nullif(p.timezone, ''), 'UTC'), now())
      )::date then true
      else false
    end,
    coalesce(c.streak, 0)
  from public.friendships f
  join public.profiles p
    on p.id = case
      when f.requester_id = current_user_id then f.addressee_id
      else f.requester_id
    end
  left join public.reset_cycles c
    on c.user_id = p.id
    and c.sequence = 1
    and c.status = 'active'
  where f.status = 'accepted'
    and (f.requester_id = current_user_id or f.addressee_id = current_user_id)
  order by p.username;
end;
$$;

revoke all on function public.list_friend_progress() from public;
revoke all on function public.list_friend_progress() from anon;
grant execute on function public.list_friend_progress() to authenticated;
