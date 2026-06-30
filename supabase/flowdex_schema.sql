-- Flowdex auth + courses schema
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  phone text,
  role text not null default 'user' check (role in ('user', 'admin'))
);

-- Teléfono de contacto del alumno. Se captura en el checkout (obligatorio).
alter table public.profiles
  add column if not exists phone text;

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price numeric(10, 2) not null check (price >= 0),
  discount_price numeric(10, 2) check (discount_price is null or discount_price >= 0),
  slug text not null unique
);

alter table public.courses
  add column if not exists discount_price numeric(10, 2)
  check (discount_price is null or discount_price >= 0);

create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_percentage numeric(5, 2) check (discount_percentage is null or (discount_percentage >= 0 and discount_percentage <= 100)),
  discount_amount numeric(10, 2) check (discount_amount is null or discount_amount >= 0),
  valid_until timestamptz,
  max_uses integer check (max_uses is null or max_uses >= 0),
  current_uses integer not null default 0 check (current_uses >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (discount_percentage is not null or discount_amount is not null)
);

create index if not exists promo_codes_code_idx on public.promo_codes (code);
create index if not exists promo_codes_is_active_idx on public.promo_codes (is_active);

create table if not exists public.user_courses (
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  granted_at timestamptz not null default now(),
  expires_at timestamptz,
  is_active boolean not null default true,
  primary key (user_id, course_id)
);

alter table public.user_courses add column if not exists granted_at timestamptz;
alter table public.user_courses add column if not exists expires_at timestamptz;
update public.user_courses set granted_at = coalesce(granted_at, now()) where granted_at is null;
alter table public.user_courses alter column granted_at set default now();
alter table public.user_courses alter column granted_at set not null;

update public.user_courses uc
set expires_at =
  case
    when c.slug = 'membresia' then uc.granted_at + interval '30 days'
    when c.slug = 'inner-circle' then uc.granted_at + interval '365 days'
    when c.slug in ('kickstart-investment', 'expert-investment', 'kickstart-trading', 'trading-lab')
      then uc.granted_at + interval '4 months'
    else uc.granted_at + interval '90 days'
  end
from public.courses c
where c.id = uc.course_id
  and uc.expires_at is null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'user_courses'
      and column_name = 'purchased_at'
  ) then
    execute 'update public.user_courses set granted_at = purchased_at where purchased_at is not null';
    execute 'alter table public.user_courses drop column purchased_at';
  end if;
end $$;

create index if not exists user_courses_user_id_idx on public.user_courses (user_id);
create index if not exists user_courses_course_id_idx on public.user_courses (course_id);

create table if not exists public.course_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  completed_modules jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

create index if not exists course_progress_user_id_idx on public.course_progress (user_id);
create index if not exists course_progress_course_id_idx on public.course_progress (course_id);

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = uid and role = 'admin'
  );
$$;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = case
      when excluded.full_name is null or excluded.full_name = '' then public.profiles.full_name
      else excluded.full_name
    end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user_profile();

insert into public.profiles (id, email, full_name)
select
  u.id,
  coalesce(u.email, ''),
  coalesce(u.raw_user_meta_data ->> 'full_name', '')
from auth.users u
on conflict (id) do update set
  email = excluded.email,
  full_name = case
    when excluded.full_name is null or excluded.full_name = '' then public.profiles.full_name
    else excluded.full_name
  end;

update public.profiles
set role = 'admin'
where lower(email) = 'admin@example.com';

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.user_courses enable row level security;
alter table public.promo_codes enable row level security;
alter table public.course_progress enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
on public.profiles
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Authenticated users can read courses" on public.courses;
create policy "Authenticated users can read courses"
on public.courses
for select
to authenticated
using (true);

drop policy if exists "Users can read own courses" on public.user_courses;
create policy "Users can read own courses"
on public.user_courses
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Admins can read all user courses" on public.user_courses;
create policy "Admins can read all user courses"
on public.user_courses
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Service role can manage user courses" on public.user_courses;
create policy "Service role can manage user courses"
on public.user_courses
for all
to service_role
using (true)
with check (true);

drop policy if exists "Users can read own course progress" on public.course_progress;
create policy "Users can read own course progress"
on public.course_progress
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own course progress" on public.course_progress;
create policy "Users can insert own course progress"
on public.course_progress
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own course progress" on public.course_progress;
create policy "Users can update own course progress"
on public.course_progress
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Admins can read all course progress" on public.course_progress;
create policy "Admins can read all course progress"
on public.course_progress
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Service role can manage course progress" on public.course_progress;
create policy "Service role can manage course progress"
on public.course_progress
for all
to service_role
using (true)
with check (true);

drop policy if exists "Admins can read promo codes" on public.promo_codes;
create policy "Admins can read promo codes"
on public.promo_codes
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Service role can manage promo codes" on public.promo_codes;
create policy "Service role can manage promo codes"
on public.promo_codes
for all
to service_role
using (true)
with check (true);

insert into public.courses (name, description, price, slug)
values
  ('Kickstart Investment', 'Programa base para iniciar en inversion.', 99.00, 'kickstart-investment'),
  ('Expert Investment', 'Nivel avanzado para estrategias de inversion.', 299.00, 'expert-investment'),
  ('Kickstart Trading', 'Fundamentos practicos para empezar en trading.', 99.00, 'kickstart-trading'),
  ('Trading Lab', 'Laboratorio avanzado de trading con casos reales.', 299.00, 'trading-lab'),
  ('Inner Circle', 'Acceso premium a sesiones y recursos exclusivos.', 299.00, 'inner-circle'),
  ('Inner Circle · Inversiones (Progreso)', 'Curso tecnico interno para persistir progreso remoto de la disciplina de inversiones de Inner Circle.', 0.00, 'inner-circle-inversiones'),
  ('Inner Circle · Trading (Progreso)', 'Curso tecnico interno para persistir progreso remoto de la disciplina de trading de Inner Circle.', 0.00, 'inner-circle-trading'),
  ('Membresía', 'Acceso recurrente a contenido y comunidad.', 50.00, 'membresia')
on conflict (slug)
do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price;

update public.courses
set discount_price = case
  when slug = 'expert-investment' then 200.00
  when slug = 'trading-lab' then 200.00
  else discount_price
end
where slug in ('expert-investment', 'trading-lab');

-- Nota de integracion:
-- 1) El endpoint POST /api/purchases/grant puede registrar compras del usuario autenticado.
-- 2) El endpoint POST /api/admin/grant-course habilita cursos manualmente para cualquier usuario (rol admin).
-- 3) El panel /admin consulta perfiles, cursos y asignaciones desde estas tablas.
