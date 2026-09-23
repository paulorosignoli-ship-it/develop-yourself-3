-- Run this once in the Supabase SQL editor (or via `supabase db push`)
-- to create the table the app writes to.
--
-- The app talks to Supabase only from server-side Route Handlers using the
-- SERVICE ROLE key (see lib/supabase.ts), so Row Level Security can stay
-- fully locked down — no anonymous client-side access is needed at all.

create extension if not exists "pgcrypto";

create table if not exists public.diagnostic_results (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  name text not null,
  email text not null,
  role text not null,
  company text not null,
  company_size text,

  -- raw answers: { [questionIndex: number]: 0 | 1 | 2 | 3 }
  answers jsonb not null,

  -- computed, denormalized for easy querying / future benchmark reports
  scores jsonb not null,       -- { strategy, value, influence, organization, future }
  total integer not null,      -- 20-80
  profile_id text not null,    -- executor | integrator | strategic | architect
  bottleneck text not null     -- strategy | value | influence | organization | future
);

create index if not exists diagnostic_results_created_at_idx
  on public.diagnostic_results (created_at desc);

create index if not exists diagnostic_results_company_idx
  on public.diagnostic_results (company);

-- Row Level Security: locked down by default. The app never uses the
-- anon/public key, only the service role key (server-side only), which
-- bypasses RLS entirely. This just makes sure that stays true even if a
-- client key is ever introduced later by mistake.
alter table public.diagnostic_results enable row level security;
