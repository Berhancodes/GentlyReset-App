-- Phase 4F: private request-based friendships.
-- Journal, reset progress, and RevenueCat are untouched.
-- Opening an invite never creates a friendship.

-- ---------------------------------------------------------------------------
-- Username: store lowercase, enforce case-insensitive uniqueness.
-- Live profiles had 0 usernames when this migration was written.
-- ---------------------------------------------------------------------------

drop index if exists public.profiles_username_unique;

create unique index profiles_username_lower_unique
  on public.profiles (lower(username))
  where username is not null;

alter table public.profiles
  drop constraint if exists profiles_username_format;

alter table public.profiles
  add constraint profiles_username_format
  check (username is null or username ~ '^[a-z0-9_]{3,20}$');

create or replace function public.canonicalize_username(raw text)
returns text
language plpgsql
immutable
as $$
declare
  normalized text;
begin
  if raw is null then
    return null;
  end if;

  normalized := lower(btrim(raw));
  if left(normalized, 1) = '@' then
    normalized := substr(normalized, 2);
  end if;
  normalized := btrim(normalized);

  if normalized = '' then
    return null;
  end if;

  if normalized !~ '^[a-z0-9_]{3,20}$' then
    return null;
  end if;

  return normalized;
end;
$$;

create or replace function public.normalize_profile_username()
returns trigger
language plpgsql
as $$
declare
  trimmed text;
  normalized text;
begin
  if new.username is null then
    return new;
  end if;

  trimmed := btrim(new.username);
  if trimmed = '' then
    new.username := null;
    return new;
  end if;

  normalized := public.canonicalize_username(new.username);
  if normalized is null then
    raise exception 'invalid_username' using errcode = '22023';
  end if;

  new.username := normalized;
  return new;
end;
$$;

drop trigger if exists profiles_normalize_username on public.profiles;

create trigger profiles_normalize_username
  before insert or update of username on public.profiles
  for each row
  execute function public.normalize_profile_username();

-- ---------------------------------------------------------------------------
-- Friendships: one canonical row per pair.
-- ---------------------------------------------------------------------------

create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  addressee_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  accepted_at timestamptz,
  pair_low uuid generated always as (least(requester_id, addressee_id)) stored,
  pair_high uuid generated always as (greatest(requester_id, addressee_id)) stored,
  constraint friendships_not_self check (requester_id <> addressee_id),
  constraint friendships_pair_unique unique (pair_low, pair_high)
);

comment on table public.friendships is
  'Private request-based friendships. One row per pair. Friends never see journal or reset answers.';

create index friendships_requester_status_idx
  on public.friendships (requester_id, status);

create index friendships_addressee_status_idx
  on public.friendships (addressee_id, status);

create trigger friendships_set_updated_at
  before update on public.friendships
  for each row
  execute function public.set_updated_at();

alter table public.friendships enable row level security;

create policy friendships_select_participants
  on public.friendships
  for select
  to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

revoke all on table public.friendships from public;
revoke all on table public.friendships from anon;
revoke all on table public.friendships from authenticated;
grant select on table public.friendships to authenticated;

-- ---------------------------------------------------------------------------
-- Invite tokens: opaque, reusable while active. Resolve does not befriend.
-- ---------------------------------------------------------------------------

create table public.friend_invite_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  token text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz
);

comment on table public.friend_invite_tokens is
  'Opaque friend-invite tokens. Opening a token never creates a friendship.';

create index friend_invite_tokens_user_id_idx
  on public.friend_invite_tokens (user_id);

alter table public.friend_invite_tokens enable row level security;

create policy friend_invite_tokens_select_own
  on public.friend_invite_tokens
  for select
  to authenticated
  using (auth.uid() = user_id);

revoke all on table public.friend_invite_tokens from public;
revoke all on table public.friend_invite_tokens from anon;
revoke all on table public.friend_invite_tokens from authenticated;
grant select on table public.friend_invite_tokens to authenticated;

-- ---------------------------------------------------------------------------
-- RPCs. SECURITY DEFINER so profile joins can return only public identity.
-- ---------------------------------------------------------------------------

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
$$;

create or replace function public.search_user_by_username(target_username text)
returns table (
  user_id uuid,
  username text,
  display_name text,
  avatar_url text
)
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  current_user_id uuid := auth.uid();
  normalized text;
begin
  if current_user_id is null then
    raise exception 'not_authenticated' using errcode = '42501';
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

create or replace function public.list_friends()
returns table (
  friendship_id uuid,
  friend_user_id uuid,
  username text,
  display_name text,
  avatar_url text,
  accepted_at timestamptz
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
    case
      when f.requester_id = current_user_id then f.addressee_id
      else f.requester_id
    end,
    p.username,
    p.display_name,
    p.avatar_url,
    f.accepted_at
  from public.friendships f
  join public.profiles p
    on p.id = case
      when f.requester_id = current_user_id then f.addressee_id
      else f.requester_id
    end
  where f.status = 'accepted'
    and (f.requester_id = current_user_id or f.addressee_id = current_user_id)
  order by f.accepted_at desc nulls last, p.username;
end;
$$;

create or replace function public.list_incoming_friend_requests()
returns table (
  friendship_id uuid,
  user_id uuid,
  username text,
  display_name text,
  avatar_url text,
  created_at timestamptz
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
  select f.id, p.id, p.username, p.display_name, p.avatar_url, f.created_at
  from public.friendships f
  join public.profiles p on p.id = f.requester_id
  where f.status = 'pending'
    and f.addressee_id = current_user_id
  order by f.created_at desc;
end;
$$;

create or replace function public.list_outgoing_friend_requests()
returns table (
  friendship_id uuid,
  user_id uuid,
  username text,
  display_name text,
  avatar_url text,
  created_at timestamptz
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
  select f.id, p.id, p.username, p.display_name, p.avatar_url, f.created_at
  from public.friendships f
  join public.profiles p on p.id = f.addressee_id
  where f.status = 'pending'
    and f.requester_id = current_user_id
  order by f.created_at desc;
end;
$$;

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

  if not exists (select 1 from public.profiles p where p.id = target_user_id) then
    return jsonb_build_object('ok', false, 'code', 'not_found');
  end if;

  select * into existing
  from public.friendships f
  where f.pair_low = least(current_user_id, target_user_id)
    and f.pair_high = greatest(current_user_id, target_user_id);

  if found then
    if existing.status = 'accepted' then
      return jsonb_build_object(
        'ok', true,
        'code', 'already_friends',
        'friendship_id', existing.id,
        'status', existing.status
      );
    end if;

    if existing.status = 'pending' and existing.requester_id = current_user_id then
      return jsonb_build_object(
        'ok', true,
        'code', 'already_pending',
        'friendship_id', existing.id,
        'status', existing.status
      );
    end if;

    if existing.status = 'pending' and existing.addressee_id = current_user_id then
      update public.friendships
      set status = 'accepted',
          accepted_at = now()
      where id = existing.id
      returning * into existing;

      return jsonb_build_object(
        'ok', true,
        'code', 'accepted_existing',
        'friendship_id', existing.id,
        'status', 'accepted'
      );
    end if;

    if existing.status = 'declined' then
      update public.friendships
      set requester_id = current_user_id,
          addressee_id = target_user_id,
          status = 'pending',
          accepted_at = null
      where id = existing.id
      returning * into existing;

      return jsonb_build_object(
        'ok', true,
        'code', 'sent',
        'friendship_id', existing.id,
        'status', 'pending'
      );
    end if;
  end if;

  insert into public.friendships (requester_id, addressee_id, status)
  values (current_user_id, target_user_id, 'pending')
  returning * into created;

  return jsonb_build_object(
    'ok', true,
    'code', 'sent',
    'friendship_id', created.id,
    'status', 'pending'
  );
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

create or replace function public.accept_friend_request(request_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  existing public.friendships;
begin
  if current_user_id is null then
    return jsonb_build_object('ok', false, 'code', 'unauthenticated');
  end if;

  select * into existing
  from public.friendships f
  where f.id = request_id;

  if not found then
    return jsonb_build_object('ok', false, 'code', 'not_found');
  end if;

  if existing.addressee_id <> current_user_id then
    return jsonb_build_object('ok', false, 'code', 'not_allowed');
  end if;

  if existing.status <> 'pending' then
    return jsonb_build_object('ok', false, 'code', 'not_pending');
  end if;

  update public.friendships
  set status = 'accepted',
      accepted_at = now()
  where id = existing.id
  returning * into existing;

  return jsonb_build_object(
    'ok', true,
    'code', 'accepted',
    'friendship_id', existing.id,
    'status', 'accepted'
  );
end;
$$;

create or replace function public.decline_friend_request(request_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  existing public.friendships;
begin
  if current_user_id is null then
    return jsonb_build_object('ok', false, 'code', 'unauthenticated');
  end if;

  select * into existing
  from public.friendships f
  where f.id = request_id;

  if not found then
    return jsonb_build_object('ok', false, 'code', 'not_found');
  end if;

  if existing.addressee_id <> current_user_id then
    return jsonb_build_object('ok', false, 'code', 'not_allowed');
  end if;

  if existing.status <> 'pending' then
    return jsonb_build_object('ok', false, 'code', 'not_pending');
  end if;

  update public.friendships
  set status = 'declined',
      accepted_at = null
  where id = existing.id
  returning * into existing;

  return jsonb_build_object(
    'ok', true,
    'code', 'declined',
    'friendship_id', existing.id,
    'status', 'declined'
  );
end;
$$;

create or replace function public.cancel_friend_request(request_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  existing public.friendships;
begin
  if current_user_id is null then
    return jsonb_build_object('ok', false, 'code', 'unauthenticated');
  end if;

  select * into existing
  from public.friendships f
  where f.id = request_id;

  if not found then
    return jsonb_build_object('ok', false, 'code', 'not_found');
  end if;

  if existing.requester_id <> current_user_id then
    return jsonb_build_object('ok', false, 'code', 'not_allowed');
  end if;

  if existing.status <> 'pending' then
    return jsonb_build_object('ok', false, 'code', 'not_pending');
  end if;

  delete from public.friendships where id = existing.id;

  return jsonb_build_object(
    'ok', true,
    'code', 'cancelled',
    'friendship_id', existing.id
  );
end;
$$;

create or replace function public.remove_friend(friendship_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  existing public.friendships;
begin
  if current_user_id is null then
    return jsonb_build_object('ok', false, 'code', 'unauthenticated');
  end if;

  select * into existing
  from public.friendships f
  where f.id = friendship_id;

  if not found then
    return jsonb_build_object('ok', false, 'code', 'not_found');
  end if;

  if existing.requester_id <> current_user_id and existing.addressee_id <> current_user_id then
    return jsonb_build_object('ok', false, 'code', 'not_allowed');
  end if;

  if existing.status <> 'accepted' then
    return jsonb_build_object('ok', false, 'code', 'not_friends');
  end if;

  delete from public.friendships where id = existing.id;

  return jsonb_build_object(
    'ok', true,
    'code', 'removed',
    'friendship_id', existing.id
  );
end;
$$;

create or replace function public.create_friend_invite()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  has_username boolean;
  existing_token text;
  created_token text;
begin
  if current_user_id is null then
    return jsonb_build_object('ok', false, 'code', 'unauthenticated');
  end if;

  select p.username is not null into has_username
  from public.profiles p
  where p.id = current_user_id;

  if has_username is not true then
    return jsonb_build_object('ok', false, 'code', 'username_required');
  end if;

  select t.token into existing_token
  from public.friend_invite_tokens t
  where t.user_id = current_user_id
    and t.revoked_at is null
    and (t.expires_at is null or t.expires_at > now())
  order by t.created_at desc
  limit 1;

  if existing_token is not null then
    return jsonb_build_object('ok', true, 'code', 'reused', 'token', existing_token);
  end if;

  created_token := encode(extensions.gen_random_bytes(32), 'hex');

  insert into public.friend_invite_tokens (user_id, token, expires_at)
  values (current_user_id, created_token, now() + interval '30 days');

  return jsonb_build_object('ok', true, 'code', 'created', 'token', created_token);
end;
$$;

create or replace function public.resolve_friend_invite(invite_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  current_user_id uuid := auth.uid();
  invite public.friend_invite_tokens;
  inviter public.profiles;
begin
  if current_user_id is null then
    return jsonb_build_object('ok', false, 'code', 'unauthenticated');
  end if;

  if invite_token is null or btrim(invite_token) = '' then
    return jsonb_build_object('ok', false, 'code', 'invalid_token');
  end if;

  select * into invite
  from public.friend_invite_tokens t
  where t.token = btrim(invite_token);

  if not found then
    return jsonb_build_object('ok', false, 'code', 'not_found');
  end if;

  if invite.revoked_at is not null then
    return jsonb_build_object('ok', false, 'code', 'revoked');
  end if;

  if invite.expires_at is not null and invite.expires_at <= now() then
    return jsonb_build_object('ok', false, 'code', 'expired');
  end if;

  select * into inviter
  from public.profiles p
  where p.id = invite.user_id;

  if not found then
    return jsonb_build_object('ok', false, 'code', 'not_found');
  end if;

  return jsonb_build_object(
    'ok', true,
    'code', 'resolved',
    'user_id', inviter.id,
    'username', inviter.username,
    'display_name', inviter.display_name,
    'avatar_url', inviter.avatar_url
  );
end;
$$;

revoke all on function public.canonicalize_username(text) from public;
revoke all on function public.canonicalize_username(text) from anon;
grant execute on function public.canonicalize_username(text) to authenticated;

revoke all on function public.claim_username(text) from public;
revoke all on function public.claim_username(text) from anon;
grant execute on function public.claim_username(text) to authenticated;

revoke all on function public.search_user_by_username(text) from public;
revoke all on function public.search_user_by_username(text) from anon;
grant execute on function public.search_user_by_username(text) to authenticated;

revoke all on function public.list_friends() from public;
revoke all on function public.list_friends() from anon;
grant execute on function public.list_friends() to authenticated;

revoke all on function public.list_incoming_friend_requests() from public;
revoke all on function public.list_incoming_friend_requests() from anon;
grant execute on function public.list_incoming_friend_requests() to authenticated;

revoke all on function public.list_outgoing_friend_requests() from public;
revoke all on function public.list_outgoing_friend_requests() from anon;
grant execute on function public.list_outgoing_friend_requests() to authenticated;

revoke all on function public.send_friend_request(uuid) from public;
revoke all on function public.send_friend_request(uuid) from anon;
grant execute on function public.send_friend_request(uuid) to authenticated;

revoke all on function public.accept_friend_request(uuid) from public;
revoke all on function public.accept_friend_request(uuid) from anon;
grant execute on function public.accept_friend_request(uuid) to authenticated;

revoke all on function public.decline_friend_request(uuid) from public;
revoke all on function public.decline_friend_request(uuid) from anon;
grant execute on function public.decline_friend_request(uuid) to authenticated;

revoke all on function public.cancel_friend_request(uuid) from public;
revoke all on function public.cancel_friend_request(uuid) from anon;
grant execute on function public.cancel_friend_request(uuid) to authenticated;

revoke all on function public.remove_friend(uuid) from public;
revoke all on function public.remove_friend(uuid) from anon;
grant execute on function public.remove_friend(uuid) to authenticated;

revoke all on function public.create_friend_invite() from public;
revoke all on function public.create_friend_invite() from anon;
grant execute on function public.create_friend_invite() to authenticated;

revoke all on function public.resolve_friend_invite(text) from public;
revoke all on function public.resolve_friend_invite(text) from anon;
grant execute on function public.resolve_friend_invite(text) to authenticated;
