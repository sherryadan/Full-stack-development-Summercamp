-- Taskflow schema
-- Run this in the Supabase SQL Editor. Do not run it from the app.

create type public.task_priority as enum ('low', 'medium', 'high');

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  priority public.task_priority not null default 'medium',
  completed boolean not null default false,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),

  constraint tasks_title_not_blank
    check (char_length(btrim(title)) > 0),
  constraint tasks_title_length
    check (char_length(title) <= 200),
  constraint tasks_description_length
    check (description is null or char_length(description) <= 2000)
);

create index tasks_user_id_idx
  on public.tasks (user_id);

create index tasks_user_created_at_idx
  on public.tasks (user_id, created_at desc);

alter table public.tasks enable row level security;

create policy "Users can read their own tasks"
  on public.tasks
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on public.tasks
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on public.tasks
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.tasks
  for delete
  to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete
  on table public.tasks
  to authenticated;

-- ------------------------------------------------------------------
-- User profiles
-- Email and password are owned by Supabase Auth (auth.users).
-- The password is hashed server-side and is never stored here.
-- This table mirrors email + name so the app can read them easily.
-- ------------------------------------------------------------------

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text not null,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
-- The name comes from raw_user_meta_data, so the client must pass
-- "name" inside options.data when calling signUp.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.users enable row level security;

create policy "Users can read their own profile"
  on public.users
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

grant select, update
  on table public.users
  to authenticated;
