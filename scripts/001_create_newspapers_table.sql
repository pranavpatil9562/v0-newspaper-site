-- Create newspapers table to store newspaper metadata and image URLs
create table if not exists public.newspapers (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  title text not null,
  image_urls text[] not null default array[]::text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create index on date for faster queries
create index if not exists idx_newspapers_date on public.newspapers(date desc);

-- Enable RLS
alter table public.newspapers enable row level security;

-- Allow anyone to view newspapers (public reading)
create policy "Anyone can view newspapers"
  on public.newspapers for select
  using (true);

-- Create admin users table to manage permissions
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Enable RLS on admin_users
alter table public.admin_users enable row level security;

-- Only authenticated users can view admin status
create policy "Users can view their own admin status"
  on public.admin_users for select
  using (auth.uid() = id);
