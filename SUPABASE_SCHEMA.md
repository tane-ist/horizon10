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

-- Allow anon read
create policy if not exists "Categories anonymous read" on public.categories for select using (true);
create policy if not exists "Products anonymous read" on public.products for select using (true);

-- Allow authenticated insert/update/delete (adjust as needed)
create policy if not exists "Categories authenticated write" on public.categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy if not exists "Products authenticated write" on public.products for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
```

Notes:
- `products.category_id` foreign keys to `categories.id`.
- Keep column names aligned with app usage: `created_at`/`updated_at` on products; `createdAt`/`updatedAt` on categories to match current code.
- You can switch to UUIDs if preferred; update the app accordingly.
