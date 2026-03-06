-- ================================================================
-- Revend Database Schema — v1.0
-- Price comparison platform for used devices
-- ================================================================

-- ── Extensions ────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- fast text search

-- ── Brands ────────────────────────────────────────────────────
create table if not exists brands (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  slug        text not null unique,
  logo_url    text,
  sort_order  integer default 99,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- ── Categories ────────────────────────────────────────────────
create table if not exists categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  slug        text not null unique,
  icon        text,          -- Lucide icon name (e.g. 'Smartphone', 'Tablet', 'Laptop')
  sort_order  integer default 99,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- ── Device Families (e.g. "iPhone 17 Pro Max") ────────────────
create table if not exists device_families (
  id            uuid primary key default uuid_generate_v4(),
  brand_id      uuid not null references brands(id) on delete cascade,
  category_id   uuid not null references categories(id) on delete cascade,
  name          text not null,           -- "iPhone 17 Pro Max"
  slug          text not null unique,    -- "iphone-17-pro-max"
  image_url     text,                    -- "/images/iphone17promax.png"
  released_year integer,
  is_popular    boolean default false,
  is_active     boolean default true,
  created_at    timestamptz default now(),
  unique(brand_id, name)
);

create index if not exists idx_families_brand    on device_families(brand_id);
create index if not exists idx_families_category on device_families(category_id);
create index if not exists idx_families_slug     on device_families(slug);

-- Full-text search on device family name
create index if not exists idx_families_name_trgm on device_families using gin(name gin_trgm_ops);

-- ── Device Variants (specific sellable units) ─────────────────
create table if not exists devices (
  id            uuid primary key default uuid_generate_v4(),
  family_id     uuid not null references device_families(id) on delete cascade,
  storage_gb    integer,               -- 128, 256, 512, 1024
  carrier       text default 'unlocked', -- unlocked, verizon, att, etc.
  color         text,                  -- optional
  msrp_cents    integer,               -- original retail price in cents
  model_number  text,                  -- e.g. "A3293"
  is_active     boolean default true,
  created_at    timestamptz default now()
);

create index if not exists idx_devices_family on devices(family_id);

-- ── Conditions ────────────────────────────────────────────────
create table if not exists conditions (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null unique,  -- "Like New", "Good", "Fair", "Poor"
  slug            text not null unique,  -- "like-new", "good", "fair", "poor"
  description     text,
  icon            text,                  -- Lucide icon name (e.g. 'Sparkles', 'Check', 'AlertCircle')
  price_mult      numeric(4,3) default 1.000, -- price multiplier vs "Good"
  sort_order      integer default 99,
  created_at      timestamptz default now()
);

-- ── Buyers (buyback companies) ────────────────────────────────
create table if not exists buyers (
  id                uuid primary key default uuid_generate_v4(),
  name              text not null unique,
  slug              text not null unique,
  website           text,
  logo_url          text,
  tagline           text,
  payment_methods   text[],            -- ['paypal', 'venmo', 'check']
  payment_speed_days integer,          -- how fast they pay
  bbb_rating        text,              -- "A+", "A", "B", etc.
  trust_score       integer default 70,-- 0-100
  is_featured       boolean default false,
  is_active         boolean default true,
  affiliate_url     text,              -- tracking URL template
  affiliate_param   text,              -- query param for tracking
  cpa_percent       numeric(5,2),      -- our CPA % (e.g. 4.00)
  created_at        timestamptz default now()
);

-- ── Offers (live prices from buyers) ──────────────────────────
create table if not exists offers (
  id            uuid primary key default uuid_generate_v4(),
  device_id     uuid not null references devices(id) on delete cascade,
  buyer_id      uuid not null references buyers(id) on delete cascade,
  condition_id  uuid not null references conditions(id) on delete cascade,
  offer_cents   integer not null,       -- offer price in cents
  is_active     boolean default true,
  fetched_at    timestamptz default now(),
  expires_at    timestamptz,            -- null = no expiry
  created_at    timestamptz default now(),
  unique(device_id, buyer_id, condition_id)
);

create index if not exists idx_offers_device    on offers(device_id);
create index if not exists idx_offers_buyer     on offers(buyer_id);
create index if not exists idx_offers_condition on offers(condition_id);
create index if not exists idx_offers_active    on offers(is_active, offer_cents desc);

-- ── Price History ─────────────────────────────────────────────
create table if not exists price_history (
  id            uuid primary key default uuid_generate_v4(),
  device_id     uuid not null references devices(id) on delete cascade,
  buyer_id      uuid not null references buyers(id) on delete cascade,
  condition_id  uuid not null references conditions(id) on delete cascade,
  offer_cents   integer not null,
  recorded_at   timestamptz default now()
);

create index if not exists idx_price_history_device on price_history(device_id, recorded_at desc);

-- ── Affiliate Clicks (revenue tracking) ───────────────────────
create table if not exists affiliate_clicks (
  id            uuid primary key default uuid_generate_v4(),
  device_id     uuid references devices(id),
  buyer_id      uuid references buyers(id),
  condition_id  uuid references conditions(id),
  offer_cents   integer,               -- price shown when clicked
  session_id    text,                  -- anonymous session
  ip_hash       text,                  -- hashed IP for dedup
  user_agent    text,
  referrer      text,
  clicked_at    timestamptz default now()
);

create index if not exists idx_clicks_buyer   on affiliate_clicks(buyer_id, clicked_at desc);
create index if not exists idx_clicks_device  on affiliate_clicks(device_id, clicked_at desc);

-- ── Price Alerts (future feature) ─────────────────────────────
create table if not exists price_alerts (
  id            uuid primary key default uuid_generate_v4(),
  device_id     uuid not null references devices(id) on delete cascade,
  condition_id  uuid not null references conditions(id),
  email         text not null,
  target_cents  integer,               -- alert when price >= this
  is_active     boolean default true,
  triggered_at  timestamptz,
  created_at    timestamptz default now()
);

-- ── Convenience Views ─────────────────────────────────────────

-- Best offer per device per condition (for quick lookups)
create or replace view best_offers as
select
  d.id            as device_id,
  df.id           as family_id,
  df.slug         as family_slug,
  df.name         as family_name,
  df.image_url,
  b.name          as brand_name,
  cat.name        as category_name,
  c.slug          as condition_slug,
  c.name          as condition_name,
  max(o.offer_cents) as best_offer_cents,
  buyer.name      as best_buyer_name,
  buyer.slug      as best_buyer_slug,
  d.storage_gb,
  d.carrier
from offers o
join devices d        on d.id = o.device_id
join device_families df on df.id = d.family_id
join brands b         on b.id = df.brand_id
join categories cat   on cat.id = df.category_id
join conditions c     on c.id = o.condition_id
join buyers buyer     on buyer.id = o.buyer_id
where o.is_active = true
  and df.is_active = true
  and buyer.is_active = true
group by d.id, df.id, df.slug, df.name, df.image_url,
         b.name, cat.name, c.slug, c.name, d.storage_gb, d.carrier,
         buyer.name, buyer.slug;

-- ── Row Level Security ────────────────────────────────────────
-- All public reads, no direct writes from client
alter table brands           enable row level security;
alter table categories       enable row level security;
alter table device_families  enable row level security;
alter table devices          enable row level security;
alter table conditions       enable row level security;
alter table buyers           enable row level security;
alter table offers           enable row level security;
alter table affiliate_clicks enable row level security;

-- Public read access
create policy "public_read" on brands           for select using (is_active = true);
create policy "public_read" on categories       for select using (is_active = true);
create policy "public_read" on device_families  for select using (is_active = true);
create policy "public_read" on devices          for select using (is_active = true);
create policy "public_read" on conditions       for select using (true);
create policy "public_read" on buyers           for select using (is_active = true);
create policy "public_read" on offers           for select using (is_active = true);

-- Affiliate clicks: insert only (no read from client)
create policy "insert_only" on affiliate_clicks for insert with check (true);

-- Service role can do anything (used by our backend)
-- (service_role bypasses RLS by default in Supabase)
