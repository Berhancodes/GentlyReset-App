-- Rate limits on the friend actions a script could abuse.
--
-- Friend requests: 20 per hour. Username lookups: 30 per minute. Username
-- changes: 10 per hour. Counted per signed-in user in a private table that only
-- these functions can touch. Normal use never comes close.

create table public.rate_limit_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  action text not null,
  created_at timestamptz not null default now()
);

create index rate_limit_events_lookup_idx
  on public.rate_limit_events (user_id, action, created_at desc);

alter table public.rate_limit_events enable row level security;
revoke all on table public.rate_limit_events from public;
revoke all on table public.rate_limit_events from anon;
revoke all on table public.rate_limit_events from authenticated;

-- Records one use of `limited_action` by the caller and reports whether it was
-- within `max_uses` per `window_seconds`. Old events for that action are cleared
-- as it goes, so the table stays small.
create or replace function public.consume_rate_limit(
  limited_action text,
  max_uses integer,
  window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  recent_uses integer;
begin
  if current_user_id is null then
    return false;
  end if;

  delete from public.rate_limit_events e
  where e.user_id = current_user_id
    and e.action = limited_action
    and e.created_at < now() - make_interval(secs => window_seconds);

  select count(*) into recent_uses
  from public.rate_limit_events e
  where e.user_id = current_user_id
    and e.action = limited_action;

  if recent_uses >= max_uses then
    return false;
  end if;

  insert into public.rate_limit_events (user_id, action) values (current_user_id, limited_action);
  return true;
end;
$$;

revoke all on function public.consume_rate_limit(text, integer, integer) from public;
revoke all on function public.consume_rate_limit(text, integer, integer) from anon;
revoke all on function public.consume_rate_limit(text, integer, integer) from authenticated;

-- Username changes: 10 per hour. Counted before the inner block, so a taken name
-- (which rolls that block back) still uses up an attempt; otherwise this could be
-- used to test which usernames exist without limit.
create or replace function public.claim_username(desired_username text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  normalized text;
begin
  if current_user_id is null then
    return jsonb_build_object('ok', false, 'code', 'unauthenticated');
  end if;

  if not public.consume_rate_limit('claim_username', 10, 3600) then
    return jsonb_build_object('ok', false, 'code', 'rate_limited');
  end if;

  begin
    normalized := public.canonicalize_username(desired_username);
    if normalized is null then
      return jsonb_build_object('ok', false, 'code', 'invalid_username');
    end if;

    update public.profiles
    set username = normalized
    where id = current_user_id;

    if not found then
      return jsonb_build_object('ok', false, 'code', 'not_found');
    end if;

    return jsonb_build_object('ok', true, 'code', 'claimed', 'username', normalized);
  exception
    when unique_violation then
      return jsonb_build_object('ok', false, 'code', 'username_taken');
    when others then
      if sqlerrm = 'invalid_username' then
        return jsonb_build_object('ok', false, 'code', 'invalid_username');
      end if;
      raise;
  end;
end;
$$;

-- Username lookups: 30 per minute. No longer STABLE, since it now records a use.
-- Over the limit it raises 'rate_limited' for the app to show a gentle message.
create or replace function public.search_user_by_username(target_username text)
returns table (
  user_id uuid,
  username text,
  display_name text,
  avatar_url text
)
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  normalized text;
begin
  if current_user_id is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;

  if not public.consume_rate_limit('search_user_by_username', 30, 60) then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  normalized := public.canonicalize_username(target_username);
  if normalized is null then
    return;
  end if;

  return query
  select p.id, p.username, p.display_name, p.avatar_url
  from public.profiles p
  where p.username = normalized
  limit 1;
end;
$$;

-- Friend requests: 20 per hour.
create or replace function public.send_friend_request(target_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  existing public.friendships;
  created public.friendships;
begin
  if current_user_id is null then
    return jsonb_build_object('ok', false, 'code', 'unauthenticated');
  end if;

  if target_user_id is null or target_user_id = current_user_id then
    return jsonb_build_object('ok', false, 'code', 'self');
  end if;

  if not public.consume_rate_limit('send_friend_request', 20, 3600) then
    return jsonb_build_object('ok', false, 'code', 'rate_limited');
  end if;

  if not exists (select 1 from public.profiles p where p.id = target_user_id) then
    return jsonb_build_object('ok', false, 'code', 'not_found');
  end if;

  select * into existing
  from public.friendships f
  where f.pair_low = least(current_user_id, target_user_id)
    and f.pair_high = greatest(current_user_id, target_user_id);

  if found then
    if existing.status = 'accepted' then
      return jsonb_build_object('ok', true, 'code', 'already_friends', 'friendship_id', existing.id, 'status', existing.status);
    end if;

    if existing.status = 'pending' and existing.requester_id = current_user_id then
      return jsonb_build_object('ok', true, 'code', 'already_pending', 'friendship_id', existing.id, 'status', existing.status);
    end if;

    if existing.status = 'pending' and existing.addressee_id = current_user_id then
      update public.friendships
      set status = 'accepted', accepted_at = now()
      where id = existing.id
      returning * into existing;

      return jsonb_build_object('ok', true, 'code', 'accepted_existing', 'friendship_id', existing.id, 'status', 'accepted');
    end if;

    if existing.status = 'declined' then
      update public.friendships
      set requester_id = current_user_id,
          addressee_id = target_user_id,
          status = 'pending',
          accepted_at = null
      where id = existing.id
      returning * into existing;

      return jsonb_build_object('ok', true, 'code', 'sent', 'friendship_id', existing.id, 'status', 'pending');
    end if;
  end if;

  insert into public.friendships (requester_id, addressee_id, status)
  values (current_user_id, target_user_id, 'pending')
  returning * into created;

  return jsonb_build_object('ok', true, 'code', 'sent', 'friendship_id', created.id, 'status', 'pending');
exception
  when unique_violation then
    select * into existing
    from public.friendships f
    where f.pair_low = least(current_user_id, target_user_id)
      and f.pair_high = greatest(current_user_id, target_user_id);

    if found then
      return jsonb_build_object(
        'ok', true,
        'code', case when existing.status = 'accepted' then 'already_friends' else 'already_pending' end,
        'friendship_id', existing.id,
        'status', existing.status
      );
    end if;

    return jsonb_build_object('ok', false, 'code', 'conflict');
end;
$$;
