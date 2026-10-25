-- 0002 — inscription : code d'invitation haché + création du profil en attente.
-- Le code n'est jamais dans ce fichier : le hash se pose à la main (voir en bas).
create extension if not exists pgcrypto with schema extensions;

create table public.app_settings (
  key   text primary key,
  value text not null
);

alter table public.app_settings enable row level security;
-- Ni politique ni droit d'API : table illisible depuis la page, seulement par les fonctions ci-dessous.
revoke all on public.app_settings from anon, authenticated;

-- Avant création du compte : refuse si le code est absent ou faux.
create function public.check_invite_code() returns trigger
language plpgsql security definer set search_path = '' as
$$
declare
  v_hash text;
  v_code text := new.raw_user_meta_data ->> 'invite_code';
begin
  select value into v_hash from public.app_settings where key = 'invite_code_hash';
  if v_hash is null or v_code is null or extensions.crypt(v_code, v_hash) <> v_hash then
    raise exception 'Code d''invitation invalide';
  end if;
  return new;
end
$$;

-- À chaque écriture des métadonnées (GoTrue les réécrit après l'insertion) : le code n'y reste jamais.
create function public.strip_invite_code() returns trigger
language plpgsql set search_path = '' as
$$
begin
  new.raw_user_meta_data := new.raw_user_meta_data - 'invite_code';
  return new;
end
$$;

-- Après création du compte : profil « en_attente » (rôle et statut par défaut de la table).
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as
$$
declare
  v_firstname text := left(trim(coalesce(new.raw_user_meta_data ->> 'firstname', '')), 40);
begin
  if v_firstname = '' then
    raise exception 'Prénom manquant';
  end if;
  insert into public.profiles (id, firstname) values (new.id, v_firstname);
  return new;
end
$$;

revoke execute on function public.check_invite_code() from public, anon, authenticated;
revoke execute on function public.handle_new_user()   from public, anon, authenticated;

create trigger on_auth_user_check_invite before insert on auth.users
  for each row execute function public.check_invite_code();
-- Nom en « z_ » : s'exécute après le contrôle du code (triggers dans l'ordre alphabétique).
create trigger z_strip_invite_code before insert or update of raw_user_meta_data on auth.users
  for each row execute function public.strip_invite_code();
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- À faire à la main (SQL Editor ou MCP), une fois par projet, avec le code choisi par Félicien :
--   insert into public.app_settings (key, value)
--   values ('invite_code_hash', extensions.crypt('<code>', extensions.gen_salt('bf')))
--   on conflict (key) do update set value = excluded.value;
