-- Username safety and user reports.
--
-- 1. Offensive and reserved usernames are refused by the database itself, so no
--    client can get around the check. Look-alike spellings (b4dw0rd, bad_word)
--    are folded before matching.
-- 2. Profiles accept direct client writes to `timezone` only. Usernames already
--    go through claim_username(); display names and avatars have no client path.
-- 3. user_reports + report_user(): a friend can be reported for review. Reports
--    are write-only for users; only the owner reads them in the dashboard.

-- ---------------------------------------------------------------------------
-- 1. Username blocklist
-- ---------------------------------------------------------------------------

create or replace function public.username_is_blocked(normalized text)
returns boolean
language plpgsql
immutable
set search_path = public
as $$
declare
  -- Digits and symbols people swap in for letters; underscores dropped.
  folded text := translate(lower(coalesce(normalized, '')), '0134578@$_', 'oieastbas');
  -- Words blocked anywhere inside a name. Kept to terms that rarely appear
  -- inside innocent words, so ordinary names aren't caught.
  blocked_fragments text[] := array[
    'nigg', 'nigr', 'faggot', 'retard', 'kike', 'chink', 'tranny', 'wetback',
    'fuck', 'fuk', 'shit', 'cunt', 'pussy', 'porn', 'whore', 'slut', 'bitch',
    'penis', 'vagina', 'dildo', 'jizz', 'nazi', 'hitler', 'kkk', 'rapist',
    'molest', 'pedophil', 'paedo', 'killyourself'
  ];
  -- Words blocked only as the whole name, because they hide inside real words
  -- (class, grape, peacock, sussex).
  blocked_whole text[] := array[
    'ass', 'arse', 'cock', 'dick', 'rape', 'sex', 'fag', 'spic', 'coon', 'twat',
    'tits', 'cum', 'anal', 'butt', 'kys', 'pedo'
  ];
  -- Names that could pass as the app, its staff, or a platform.
  reserved_whole text[] := array[
    'admin', 'administrator', 'root', 'system', 'support', 'help', 'helpdesk',
    'staff', 'team', 'mod', 'moderator', 'official', 'security', 'billing',
    'apple', 'appstore', 'google', 'null', 'undefined', 'everyone', 'me', 'you'
  ];
  reserved_prefixes text[] := array['gentlyreset', 'gentlereset', 'official', 'admin', 'support', 'moderator'];
  fragment text;
begin
  if folded = '' then
    return false;
  end if;

  if folded = any (blocked_whole) or folded = any (reserved_whole) then
    return true;
  end if;

  foreach fragment in array reserved_prefixes loop
    if left(folded, length(fragment)) = fragment then
      return true;
    end if;
  end loop;

  foreach fragment in array blocked_fragments loop
    if position(fragment in folded) > 0 then
      return true;
    end if;
  end loop;

  return false;
end;
$$;

revoke all on function public.username_is_blocked(text) from public;
revoke all on function public.username_is_blocked(text) from anon;
grant execute on function public.username_is_blocked(text) to authenticated;

create or replace function public.normalize_profile_username()
returns trigger
language plpgsql
set search_path = public
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

  if public.username_is_blocked(normalized) then
    raise exception 'username_not_allowed' using errcode = '22023';
  end if;

  new.username := normalized;
  return new;
end;
$$;

-- Same as the rate-limited version, plus the 'username_not_allowed' answer.
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

    if public.username_is_blocked(normalized) then
      return jsonb_build_object('ok', false, 'code', 'username_not_allowed');
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
      if sqlerrm = 'username_not_allowed' then
        return jsonb_build_object('ok', false, 'code', 'username_not_allowed');
      end if;
      raise;
  end;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. Profiles: clients may only write their time zone directly
-- ---------------------------------------------------------------------------

revoke update on table public.profiles from authenticated;
grant update (timezone) on table public.profiles to authenticated;

alter table public.profiles
  drop constraint if exists profiles_display_name_length;

alter table public.profiles
  add constraint profiles_display_name_length
  check (display_name is null or char_length(display_name) <= 30);

-- ---------------------------------------------------------------------------
-- 3. Reports
-- ---------------------------------------------------------------------------

create table if not exists public.user_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  reported_user_id uuid not null references public.profiles (id) on delete cascade,
  reported_username text,
  reason text not null check (reason in ('offensive_username', 'harassment', 'other')),
  details text check (details is null or char_length(details) <= 500),
  status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed')),
  created_at timestamptz not null default now()
);

comment on table public.user_reports is
  'Reports filed in the app. Users can file them through report_user() only; nobody but the owner reads them.';

create index if not exists user_reports_status_created_idx
  on public.user_reports (status, created_at desc);

alter table public.user_reports enable row level security;
-- No policies: clients can't read or write the table directly.
revoke all on table public.user_reports from anon, authenticated;

create or replace function public.report_user(
  target_user_id uuid,
  report_reason text,
  report_details text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  target_username text;
begin
  if current_user_id is null then
    return jsonb_build_object('ok', false, 'code', 'unauthenticated');
  end if;

  if target_user_id is null or target_user_id = current_user_id then
    return jsonb_build_object('ok', false, 'code', 'self');
  end if;

  if report_reason not in ('offensive_username', 'harassment', 'other') then
    return jsonb_build_object('ok', false, 'code', 'invalid_reason');
  end if;

  if not public.consume_rate_limit('report_user', 10, 3600) then
    return jsonb_build_object('ok', false, 'code', 'rate_limited');
  end if;

  select username into target_username from public.profiles where id = target_user_id;
  if not found then
    return jsonb_build_object('ok', false, 'code', 'not_found');
  end if;

  insert into public.user_reports (reporter_id, reported_user_id, reported_username, reason, details)
  values (
    current_user_id,
    target_user_id,
    target_username,
    report_reason,
    nullif(left(btrim(coalesce(report_details, '')), 500), '')
  );

  return jsonb_build_object('ok', true, 'code', 'reported');
end;
$$;

revoke all on function public.report_user(uuid, text, text) from public;
revoke all on function public.report_user(uuid, text, text) from anon;
grant execute on function public.report_user(uuid, text, text) to authenticated;
