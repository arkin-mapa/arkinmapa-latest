-- Enable RLS
alter table auth.users enable row level security;

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  role text check (role in ('admin', 'user')) default 'user' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create plans table
create table public.plans (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  duration integer not null,
  price numeric not null,
  bandwidth text not null,
  device_limit integer not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create vouchers table
create table public.vouchers (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  plan_id uuid references public.plans on delete cascade not null,
  status text check (status in ('available', 'used')) default 'available' not null,
  user_id uuid references auth.users on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create purchase_requests table
create table public.purchase_requests (
  id uuid default gen_random_uuid() primary key,
  plan_id uuid references public.plans on delete cascade not null,
  user_id uuid references auth.users not null,
  customer_name text not null,
  quantity integer not null,
  payment_method text check (payment_method in ('gcash', 'bank-transfer')) not null,
  status text check (status in ('pending', 'confirmed', 'rejected')) default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS) policies

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Plans policies
create policy "Plans are viewable by everyone"
  on plans for select
  using (true);

create policy "Only admins can insert plans"
  on plans for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Only admins can update plans"
  on plans for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Only admins can delete plans"
  on plans for delete
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Vouchers policies
create policy "Admins can view all vouchers"
  on vouchers for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Users can view their own vouchers"
  on vouchers for select
  using (
    auth.uid() = user_id
  );

create policy "Only admins can insert vouchers"
  on vouchers for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Only admins can update vouchers"
  on vouchers for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Only admins can delete vouchers"
  on vouchers for delete
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Purchase requests policies
create policy "Admins can view all purchase requests"
  on purchase_requests for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Users can view their own purchase requests"
  on purchase_requests for select
  using (
    auth.uid() = user_id
  );

create policy "Users can insert purchase requests"
  on purchase_requests for insert
  with check (
    auth.uid() = user_id
  );

create policy "Only admins can update purchase requests"
  on purchase_requests for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.vouchers enable row level security;
alter table public.purchase_requests enable row level security;

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    case
      when new.email = 'arkinmapa@gmail.com' then 'admin'
      else 'user'
    end
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();