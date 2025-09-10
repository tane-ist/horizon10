## Supabase Tables

Run these in Supabase SQL editor.

```sql
-- Categories
create table if not exists public.categories (
  id bigint primary key,
  name text not null,
  description text,
  createdAt timestamptz default now(),
  updatedAt timestamptz
);

-- Products
create table if not exists public.products (
  id text primary key,
  name text not null,
  description text,
  price numeric not null,
  category_id bigint references public.categories(id) on delete set null,
  stock integer default 0,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz
);

-- RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;

-- Policies (drop then create to avoid conflicts)
-- Categories: allow anonymous select
drop policy if exists "Categories anonymous read" on public.categories;
create policy "Categories anonymous read" on public.categories
for select using (true);

-- Products: allow anonymous select
drop policy if exists "Products anonymous read" on public.products;
create policy "Products anonymous read" on public.products
for select using (true);

-- Allow authenticated write (insert/update/delete)
-- Categories write
drop policy if exists "Categories authenticated write" on public.categories;
create policy "Categories authenticated write" on public.categories
for all to authenticated
using (true)
with check (true);

-- Products write
drop policy if exists "Products authenticated write" on public.products;
create policy "Products authenticated write" on public.products
for all to authenticated
using (true)
with check (true);
```

Notes:
- `products.category_id` foreign keys to `categories.id`.
- Keep column names aligned with app usage: `created_at`/`updated_at` on products; `createdAt`/`updatedAt` on categories to match current code.
- You can switch to UUIDs if preferred; update the app accordingly.

## Alternative: UUID-based schema (runnable)

```sql
-- Extensions (for gen_random_uuid)
create extension if not exists pgcrypto;

-- Roles
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

-- Profiles (FK to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  phone text unique,
  tabdk_no text unique,
  role_id uuid references public.roles(id)
);

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null,
  category_id uuid references public.categories(id) on delete set null,
  image_url text,
  stock integer not null default 0,
  supplier_id uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  status text not null default 'pending',
  total_amount numeric not null,
  created_at timestamptz default now()
);

-- Order Items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null,
  price numeric not null
);

-- Enable RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.roles enable row level security;
alter table public.profiles enable row level security;

-- Policies
-- Public read for categories/products
drop policy if exists "Categories anonymous read" on public.categories;
create policy "Categories anonymous read" on public.categories for select using (true);

drop policy if exists "Products anonymous read" on public.products;
create policy "Products anonymous read" on public.products for select using (true);

-- Authenticated write for categories/products
drop policy if exists "Categories authenticated write" on public.categories;
create policy "Categories authenticated write" on public.categories for all to authenticated using (true) with check (true);

drop policy if exists "Products authenticated write" on public.products;
create policy "Products authenticated write" on public.products for all to authenticated using (true) with check (true);

-- Profiles: user can read own profile and service can write
create policy if not exists "Profiles self read" on public.profiles for select using (auth.uid() = id);
create policy if not exists "Profiles self update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
```
