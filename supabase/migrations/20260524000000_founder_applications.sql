-- Migration: founder_applications table for the "Programa Fundador" launch (mayo 2026)
-- Run this in Supabase SQL Editor (DO NOT run automatically)
--
-- Modelo: postulaciones públicas para el programa fundador (20 cuentas free curadas:
-- 10 Kickstart Investment + 10 Kickstart Trading). El formulario es público (no requiere
-- login). Cuando Franco/Augusto aprueban un candidato, el flujo de aceptación crea
-- la cuenta + asigna el curso correspondiente + manda email de bienvenida.
--
-- Las decisiones (shortlist/accept/reject) las hace solo un usuario con role='admin'
-- desde el panel /admin (tab "Postulaciones").

create table if not exists public.founder_applications (
  id                    uuid          primary key default gen_random_uuid(),
  created_at            timestamptz   not null default now(),
  updated_at            timestamptz   not null default now(),

  -- Identidad del postulante
  full_name             text          not null,
  email                 text          not null,
  age                   integer       check (age >= 0 and age <= 120),
  country               text,
  city                  text,
  occupation            text,

  -- Preferencia de programa
  program_choice        text          not null check (program_choice in ('kickstart-investment', 'kickstart-trading', 'either')),

  -- Perfil
  experience_level      text          not null check (experience_level in ('zero', 'some', 'intermediate', 'advanced')),
  motivation            text          not null,      -- por qué quiere entrar a Flowdex (textarea, validamos largo en app)
  goals_6m              text          not null,      -- qué espera aprender o cambiar en próximos 6 meses
  weekly_hours          integer       check (weekly_hours >= 0 and weekly_hours <= 100),
  referral_source       text,

  -- Logística
  chat_platforms        text[]        not null default array[]::text[],   -- ['telegram'], ['discord'], ['telegram','discord']
  accepts_feedback      boolean       not null default false,
  accepts_participation boolean       not null default false,

  -- Notas libres del postulante
  additional_notes      text,

  -- Decisión administrativa
  status                text          not null default 'pending' check (status in ('pending', 'shortlisted', 'accepted', 'rejected', 'archived')),
  admin_notes           text,
  decision_at           timestamptz,
  decision_by           uuid          references auth.users(id) on delete set null,

  -- Si la postulación es aceptada y termina creando un usuario en auth, lo linkeamos
  granted_user_id       uuid          references auth.users(id) on delete set null,

  unique (email)
);

-- Auto-update updated_at (reusa la función set_updated_at de la migración de orders)
drop trigger if exists founder_applications_set_updated_at on public.founder_applications;
create trigger founder_applications_set_updated_at
  before update on public.founder_applications
  for each row execute function public.set_updated_at();

-- RLS
alter table public.founder_applications enable row level security;

-- Cualquier visitante (anon) puede INSERTAR su postulación.
-- No puede leer ni listar ni updatear. Solo crear.
drop policy if exists "founder_applications: anon insert" on public.founder_applications;
create policy "founder_applications: anon insert"
  on public.founder_applications for insert
  to anon
  with check (true);

-- Usuarios autenticados también pueden insertar (por si alguien aplica logueado)
drop policy if exists "founder_applications: authenticated insert" on public.founder_applications;
create policy "founder_applications: authenticated insert"
  on public.founder_applications for insert
  to authenticated
  with check (true);

-- Solo admins (profiles.role = 'admin') leen, actualizan y borran.
drop policy if exists "founder_applications: admin read" on public.founder_applications;
create policy "founder_applications: admin read"
  on public.founder_applications for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

drop policy if exists "founder_applications: admin update" on public.founder_applications;
create policy "founder_applications: admin update"
  on public.founder_applications for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

drop policy if exists "founder_applications: admin delete" on public.founder_applications;
create policy "founder_applications: admin delete"
  on public.founder_applications for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

-- Service role bypassa RLS por defecto, pero dejamos policy explícita por consistencia
drop policy if exists "founder_applications: service role full" on public.founder_applications;
create policy "founder_applications: service role full"
  on public.founder_applications for all
  to service_role
  using (true)
  with check (true);

-- Índices para el panel admin
create index if not exists founder_applications_status_idx
  on public.founder_applications (status, created_at desc);

create index if not exists founder_applications_program_idx
  on public.founder_applications (program_choice, status);

create index if not exists founder_applications_created_idx
  on public.founder_applications (created_at desc);
