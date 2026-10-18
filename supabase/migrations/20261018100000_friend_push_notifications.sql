-- Push notifications for friend events only: an encouragement arrives, someone
-- sends you a friend request, or someone accepts yours. Nothing about resets or
-- journals is ever pushed. Daily reminders are local notifications on the phone.
--
-- Each phone stores its Expo push token here while the person has friend
-- notifications switched on. Tokens are only readable by the server functions;
-- the app can add or remove its own token and nothing else.

create extension if not exists pg_net with schema extensions;

create table public.push_tokens (
  token text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  platform text not null check (platform in ('ios', 'android')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint push_tokens_expo_format check (token ~ '^Expo(nent)?PushToken\[[A-Za-z0-9_-]+\]$')
);

create index push_tokens_user_idx on public.push_tokens (user_id);

comment on table public.push_tokens is
  'Expo push tokens for friend notifications. Server-only reads; one row per phone.';

alter table public.push_tokens enable row level security;
revoke all on table public.push_tokens from public;
revoke all on table public.push_tokens from anon;
revoke all on table public.push_tokens from authenticated;

-- Saves this phone's token for the signed-in person. A phone that changes hands
-- (sign out, sign in as someone else) moves its token to the new person.
create or replace function public.register_push_token(push_token text, push_platform text)
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

  if push_token is null or push_token !~ '^Expo(nent)?PushToken\[[A-Za-z0-9_-]+\]$' then
    return jsonb_build_object('ok', false, 'code', 'invalid_token');
  end if;

  if push_platform is null or push_platform not in ('ios', 'android') then
    return jsonb_build_object('ok', false, 'code', 'invalid_platform');
  end if;

  insert into public.push_tokens (token, user_id, platform)
  values (push_token, current_user_id, push_platform)
  on conflict (token) do update
    set user_id = excluded.user_id,
        platform = excluded.platform,
        updated_at = now();

  return jsonb_build_object('ok', true, 'code', 'registered');
end;
$$;

-- Removes this phone's token (notifications switched off, or signing out).
create or replace function public.unregister_push_token(push_token text)
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

  delete from public.push_tokens t
  where t.token = push_token
    and t.user_id = current_user_id;

  return jsonb_build_object('ok', true, 'code', 'unregistered');
end;
$$;

revoke all on function public.register_push_token(text, text) from public;
revoke all on function public.register_push_token(text, text) from anon;
grant execute on function public.register_push_token(text, text) to authenticated;

revoke all on function public.unregister_push_token(text) from public;
revoke all on function public.unregister_push_token(text) from anon;
grant execute on function public.unregister_push_token(text) to authenticated;

-- How a person is named in someone else's notification: @username, else their
-- display name, else "a friend". Never anything from their reset or journal.
create or replace function public.push_display_name(person_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select coalesce('@' || nullif(p.username, ''), nullif(btrim(p.display_name), ''))
      from public.profiles p
      where p.id = person_id
    ),
    'a friend'
  );
$$;

-- Sends one notification to every phone of `recipient` through Expo's push
-- service. Fire-and-forget: pg_net posts after the transaction commits, so a
-- slow or failed push never blocks or undoes the friend action itself.
create or replace function public.send_friend_push(
  recipient uuid,
  push_title text,
  push_body text,
  push_data jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  messages jsonb;
begin
  select jsonb_agg(
    jsonb_build_object(
      'to', t.token,
      'title', push_title,
      'body', push_body,
      'data', push_data,
      'sound', 'default'
    )
  )
  into messages
  from public.push_tokens t
  where t.user_id = recipient;

  if messages is null then
    return;
  end if;

  perform net.http_post(
    url := 'https://exp.host/--/api/v2/push/send',
    body := messages,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Accept', 'application/json'
    ),
    timeout_milliseconds := 5000
  );
exception
  when others then
    -- Notifications are a bonus; never let them break sending a friend action.
    return;
end;
$$;

revoke all on function public.push_display_name(uuid) from public;
revoke all on function public.push_display_name(uuid) from anon;
revoke all on function public.push_display_name(uuid) from authenticated;
revoke all on function public.send_friend_push(uuid, text, text, jsonb) from public;
revoke all on function public.send_friend_push(uuid, text, text, jsonb) from anon;
revoke all on function public.send_friend_push(uuid, text, text, jsonb) from authenticated;

-- An encouragement arrived. Same preset wording the app shows (ENCOURAGEMENT_COPY).
create or replace function public.push_on_encouragement()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  copy text;
begin
  copy := case new.kind
    when 'proud_of_you' then 'proud of you 🌱'
    when 'keep_going' then 'keep going, you''ve got this'
    when 'thinking_of_you' then 'thinking of you today'
    when 'you_got_this' then 'you got this'
    when 'gentle_nudge' then 'just a little nudge 💛'
    else 'sent you some encouragement'
  end;

  perform public.send_friend_push(
    new.recipient_id,
    public.push_display_name(new.sender_id) || ' 🤍',
    copy,
    jsonb_build_object('type', 'encouragement', 'url', '/world')
  );
  return new;
end;
$$;

-- A friend request was sent (new, or re-sent after a decline), or one was accepted.
create or replace function public.push_on_friendship_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'pending'
     and (tg_op = 'INSERT' or old.status <> 'pending' or old.requester_id <> new.requester_id) then
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

revoke all on function public.push_on_encouragement() from public;
revoke all on function public.push_on_encouragement() from anon;
revoke all on function public.push_on_encouragement() from authenticated;
revoke all on function public.push_on_friendship_change() from public;
revoke all on function public.push_on_friendship_change() from anon;
revoke all on function public.push_on_friendship_change() from authenticated;

create trigger encouragements_push
  after insert on public.encouragements
  for each row execute function public.push_on_encouragement();

create trigger friendships_push
  after insert or update of status, requester_id on public.friendships
  for each row execute function public.push_on_friendship_change();
