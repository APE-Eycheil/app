-- 0001 — profils, rôles, statut de validation. NON TESTÉ : relire et exécuter d'abord sur le projet de test.
create type public.app_role   as enum ('membre', 'bureau', 'admin');
create type public.app_status as enum ('en_attente', 'valide', 'refuse', 'desactive');

create table public.profiles (
  id           uuid primary key references auth.users on delete cascade,
  firstname    text not null,
  role         public.app_role   not null default 'membre',
  status       public.app_status not null default 'en_attente',
  is_treasurer boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- search_path vide : une fonction security definer nomme explicitement ses tables.
create function public.is_validated() returns boolean
language sql stable security definer set search_path = '' as
$$ select exists (select 1 from public.profiles where id = (select auth.uid()) and status = 'valide') $$;

create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as
$$ select exists (select 1 from public.profiles where id = (select auth.uid()) and status = 'valide' and role = 'admin') $$;

-- Exécutables par les comptes connectés seulement (pas anon, pas appelables en RPC sans compte).
revoke execute on function public.is_validated() from public, anon;
revoke execute on function public.is_admin()     from public, anon;
grant  execute on function public.is_validated() to authenticated;
grant  execute on function public.is_admin()     to authenticated;

-- Droits d'API (« Automatically expose new tables » est désactivé) : connecté seulement, jamais anon.
-- Pas d'insert ni de delete : les profils sont créés par la fonction d'inscription.
grant select, update on public.profiles to authenticated;

-- Lecture : son propre profil, ou tous si compte validé.
create policy profiles_select on public.profiles for select
  using (id = (select auth.uid()) or public.is_validated());

-- Modification (rôle, statut, trésorier) : administrateurs uniquement. Aucun insert direct depuis la page.
create policy profiles_admin_update on public.profiles for update
  using (public.is_admin()) with check (public.is_admin());
