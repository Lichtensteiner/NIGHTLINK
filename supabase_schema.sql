-- 1️⃣ TABLE PRINCIPALE : users
create type user_role as enum ('employee', 'employer', 'admin');

create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  first_name text,
  last_name text,
  email text unique,
  phone text unique,
  role user_role default 'employee',
  rating numeric default 5.0,
  total_reviews integer default 0,
  city text,
  country text,
  verified boolean default false,
  profile_photo text,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone." on public.users
  for select using (true);

create policy "Users can insert their own profile." on public.users
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.users
  for update using (auth.uid() = id);

-- 2️⃣ TABLE : establishments
create table public.establishments (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  type text check (type in ('bar', 'club', 'lounge', 'snack-bar', 'restaurant')),
  address text,
  city text,
  country text,
  description text,
  owner_id uuid references public.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.establishments enable row level security;

create policy "Establishments are viewable by everyone." on public.establishments
  for select using (true);

create policy "Employers can create establishments." on public.establishments
  for insert with check (auth.uid() = owner_id);

create policy "Owners can update their establishments." on public.establishments
  for update using (auth.uid() = owner_id);

-- 3️⃣ TABLE : jobs
create table public.jobs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  salary numeric,
  contract_type text,
  status text default 'open' check (status in ('open', 'closed')),
  establishment_id uuid references public.establishments(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.jobs enable row level security;

create policy "Jobs are viewable by everyone." on public.jobs
  for select using (true);

-- 4️⃣ TABLE : missions
create table public.missions (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  date date not null,
  start_time time,
  end_time time,
  price numeric,
  status text default 'open' check (status in ('open', 'assigned', 'completed', 'cancelled')),
  employee_id uuid references public.users(id),
  establishment_id uuid references public.establishments(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.missions enable row level security;

create policy "Missions are viewable by everyone." on public.missions
  for select using (true);

create policy "Employers can create missions." on public.missions
  for insert with check (
    exists (
      select 1 from public.establishments
      where id = establishment_id and owner_id = auth.uid()
    )
  );

create policy "Employees can apply to missions." on public.missions
  for update using (auth.uid() = employee_id or exists (
      select 1 from public.establishments
      where id = establishment_id and owner_id = auth.uid()
  ));

-- 5️⃣ TABLE : reviews
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  reviewer_id uuid references public.users(id),
  target_user_id uuid references public.users(id),
  mission_id uuid references public.missions(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone." on public.reviews
  for select using (true);

create policy "Users can create reviews." on public.reviews
  for insert with check (auth.uid() = reviewer_id);

-- Triggers for auto-updating timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_updated
  before update on public.users
  for each row execute procedure public.handle_updated_at();

-- Trigger to create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, role, first_name, last_name)
  values (
    new.id,
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'employee'),
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ⚡️ ENABLE REALTIME
-- Add tables to the publication to enable real-time subscriptions
alter publication supabase_realtime add table public.users;
alter publication supabase_realtime add table public.establishments;
alter publication supabase_realtime add table public.missions;
alter publication supabase_realtime add table public.reviews;

