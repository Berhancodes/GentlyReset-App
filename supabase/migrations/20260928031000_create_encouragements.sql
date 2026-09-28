-- Phase 4G: preset encouragements. Not chat.
-- Reset_cycles / reset_day_completions / journal_entries RLS stay own-user.
-- Future blocked_users can be added inside are_accepted_friends.

create table public.encouragements (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles (id) on delete cascade,
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null
    check (kind in (
      'proud_of_you',
      'keep_going',
      'thinking_of_you',
      'you_got_this',
      'gentle_nudge'
    )),
  message text,
  created_at timestamptz not null default now(),
  read_at timestamptz,
  constraint encouragements_not_self check (sender_id <> recipient_id)
);

comment on table public.encouragements is
  'Preset friend encouragements. Not chat. Friends never see journal or reset answers.';

create index encouragements_recipient_created_at_idx
  on public.encouragements (recipient_id, created_at desc);

create index encouragements_sender_recipient_kind_created_at_idx
  on public.encouragements (sender_id, recipient_id, kind, created_at desc);

alter table public.encouragements enable row level security;

create policy encouragements_select_participants
  on public.encouragements
  for select
  to authenticated
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

revoke all on table public.encouragements from public;
revoke all on table public.encouragements from anon;
revoke all on table public.encouragements from authenticated;
grant select on table public.encouragements to authenticated;

create or replace function public.send_encouragement(friend_user_id uuid, encouragement_kind text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  created public.encouragements;
begin
  if current_user_id is null then
    return jsonb_build_object('ok', false, 'code', 'unauthenticated');
  end if;

  if friend_user_id is null or friend_user_id = current_user_id then
    return jsonb_build_object('ok', false, 'code', 'self');
  end if;

  if encouragement_kind is null or encouragement_kind not in (
    'proud_of_you',
    'keep_going',
    'thinking_of_you',
    'you_got_this',
    'gentle_nudge'
  ) then
    return jsonb_build_object('ok', false, 'code', 'invalid_kind');
  end if;

  -- Central friendship gate. Future blocked_users belong here via are_accepted_friends.
  if not public.are_accepted_friends(current_user_id, friend_user_id) then
    return jsonb_build_object('ok', false, 'code', 'not_friends');
  end if;

  if exists (
    select 1
    from public.encouragements e
    where e.sender_id = current_user_id
      and e.recipient_id = friend_user_id
      and e.kind = encouragement_kind
      and e.created_at > now() - interval '24 hours'
  ) then
    return jsonb_build_object('ok', false, 'code', 'too_soon');
  end if;

  insert into public.encouragements (sender_id, recipient_id, kind, message)
  values (current_user_id, friend_user_id, encouragement_kind, null)
  returning * into created;

  return jsonb_build_object(
    'ok', true,
    'code', 'sent',
    'encouragement_id', created.id,
    'kind', created.kind
  );
end;
$$;

create or replace function public.list_recent_encouragements()
returns table (
  encouragement_id uuid,
  sender_user_id uuid,
  username text,
  display_name text,
  avatar_url text,
  kind text,
  created_at timestamptz,
  read_at timestamptz
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
    e.id,
    p.id,
    p.username,
    p.display_name,
    p.avatar_url,
    e.kind,
    e.created_at,
    e.read_at
  from public.encouragements e
  join public.profiles p on p.id = e.sender_id
  where e.recipient_id = current_user_id
  order by e.created_at desc
  limit 20;
end;
$$;

create or replace function public.mark_encouragement_read(target_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  existing public.encouragements;
begin
  if current_user_id is null then
    return jsonb_build_object('ok', false, 'code', 'unauthenticated');
  end if;

  select * into existing
  from public.encouragements e
  where e.id = target_id;

  if not found then
    return jsonb_build_object('ok', false, 'code', 'not_found');
  end if;

  if existing.recipient_id <> current_user_id then
    return jsonb_build_object('ok', false, 'code', 'not_allowed');
  end if;

  if existing.read_at is null then
    update public.encouragements
    set read_at = now()
    where id = existing.id
    returning * into existing;
  end if;

  return jsonb_build_object(
    'ok', true,
    'code', 'read',
    'encouragement_id', existing.id
  );
end;
$$;

revoke all on function public.send_encouragement(uuid, text) from public;
revoke all on function public.send_encouragement(uuid, text) from anon;
grant execute on function public.send_encouragement(uuid, text) to authenticated;

revoke all on function public.list_recent_encouragements() from public;
revoke all on function public.list_recent_encouragements() from anon;
grant execute on function public.list_recent_encouragements() to authenticated;

revoke all on function public.mark_encouragement_read(uuid) from public;
revoke all on function public.mark_encouragement_read(uuid) from anon;
grant execute on function public.mark_encouragement_read(uuid) to authenticated;
