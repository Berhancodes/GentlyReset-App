-- Recorded from the live database (applied October 17, 2026) so the repo matches
-- production. Narrows the "pedo" match to whole usernames so names like "torpedo"
-- aren't blocked, while "pedophil"/"paedo" fragments still are.
create or replace function public.username_is_blocked(normalized text)
returns boolean
language plpgsql
immutable
set search_path = public
as $$
declare
  folded text := translate(lower(coalesce(normalized, '')), '0134578@$_', 'oieastbas');
  blocked_fragments text[] := array[
    'nigg', 'nigr', 'faggot', 'retard', 'kike', 'chink', 'tranny', 'wetback',
    'fuck', 'fuk', 'shit', 'cunt', 'pussy', 'porn', 'whore', 'slut', 'bitch',
    'penis', 'vagina', 'dildo', 'jizz', 'nazi', 'hitler', 'kkk', 'rapist',
    'molest', 'pedophil', 'paedo', 'killyourself'
  ];
  blocked_whole text[] := array[
    'ass', 'arse', 'cock', 'dick', 'rape', 'sex', 'fag', 'spic', 'coon', 'twat',
    'tits', 'cum', 'anal', 'butt', 'kys', 'pedo'
  ];
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
