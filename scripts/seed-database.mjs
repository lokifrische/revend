// Seed Revend Supabase database with all devices, buyers, conditions, and mock offers
import { createClient } from '/home/openclaw/.openclaw/workspace/revend/node_modules/@supabase/supabase-js/dist/index.mjs';

// Load from .env.local or environment variables — NEVER hardcode keys
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '../.env.local');
try {
  readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) process.env[k.trim()] = v.join('=').trim();
  });
} catch {}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://msvobzzeteeoddjtxfji.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_KEY) { console.error('❌ SUPABASE_SERVICE_ROLE_KEY not set — add to .env.local'); process.exit(1); }

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function upsert(table, data, conflict = 'id') {
  const { error } = await db.from(table).upsert(data, { onConflict: conflict, ignoreDuplicates: false });
  if (error) throw new Error(`${table}: ${error.message}`);
}

// ── Brands ────────────────────────────────────────────────────
const brands = [
  { name: 'Apple',     slug: 'apple',     logo_url: '/brands/apple.svg',     sort_order: 1 },
  { name: 'Samsung',   slug: 'samsung',   logo_url: '/brands/samsung.svg',   sort_order: 2 },
  { name: 'Google',    slug: 'google',    logo_url: '/brands/google.svg',    sort_order: 3 },
  { name: 'OnePlus',   slug: 'oneplus',   logo_url: '/brands/oneplus.svg',   sort_order: 4 },
  { name: 'Microsoft', slug: 'microsoft', logo_url: '/brands/microsoft.svg', sort_order: 5 },
  { name: 'Sony',      slug: 'sony',      logo_url: '/brands/sony.svg',      sort_order: 6 },
  { name: 'Nintendo',  slug: 'nintendo',  logo_url: '/brands/nintendo.svg',  sort_order: 7 },
  { name: 'Meta',      slug: 'meta',      logo_url: null,                    sort_order: 8 },
  { name: 'Valve',     slug: 'valve',     logo_url: null,                    sort_order: 9 },
  { name: 'Bose',      slug: 'bose',      logo_url: null,                    sort_order: 10 },
];

// ── Categories ────────────────────────────────────────────────
const categories = [
  { name: 'Phones',      slug: 'phones',      icon: '📱', sort_order: 1 },
  { name: 'Tablets',     slug: 'tablets',     icon: '💻', sort_order: 2 },
  { name: 'Laptops',     slug: 'laptops',     icon: '🖥️', sort_order: 3 },
  { name: 'Smartwatches',slug: 'smartwatches',icon: '⌚', sort_order: 4 },
  { name: 'Consoles',    slug: 'consoles',    icon: '🎮', sort_order: 5 },
  { name: 'Headphones',  slug: 'headphones',  icon: '🎧', sort_order: 6 },
];

// ── Conditions ────────────────────────────────────────────────
const conditions = [
  { name: 'Like New',  slug: 'like-new', description: 'No scratches, works perfectly, original packaging preferred', icon: '⭐', price_mult: 1.000, sort_order: 1 },
  { name: 'Good',      slug: 'good',     description: 'Minor scratches, fully functional', icon: '✅', price_mult: 0.850, sort_order: 2 },
  { name: 'Fair',      slug: 'fair',     description: 'Visible wear, fully functional', icon: '🔄', price_mult: 0.650, sort_order: 3 },
  { name: 'Poor',      slug: 'poor',     description: 'Heavy wear or minor damage, still works', icon: '⚠️', price_mult: 0.400, sort_order: 4 },
];

// ── Buyers ────────────────────────────────────────────────────
const buyers = [
  { name: 'BuyBackTree', slug: 'buybacktree', website: 'https://buybacktree.com', tagline: 'Fast cash for your devices', payment_methods: ['paypal','venmo','zelle','cashapp'], payment_speed_days: 2, bbb_rating: 'A+', trust_score: 95, is_featured: true, cpa_percent: 4.00 },
  { name: 'Gazelle',     slug: 'gazelle',     website: 'https://www.gazelle.com',  tagline: 'The simple way to sell your phone', payment_methods: ['check','paypal'], payment_speed_days: 5, trust_score: 82, cpa_percent: 3.50 },
  { name: 'Decluttr',    slug: 'decluttr',    website: 'https://www.decluttr.com', tagline: 'Sell your tech instantly', payment_methods: ['paypal','check','bank_transfer'], payment_speed_days: 3, trust_score: 80, cpa_percent: 3.00 },
  { name: 'GadgetGone',  slug: 'gadgetgone',  website: 'https://www.gadgetgone.com',tagline: 'Top prices for your gadgets', payment_methods: ['paypal','check'], payment_speed_days: 3, trust_score: 78, cpa_percent: 3.50 },
  { name: "SellYourMac", slug: 'sellyourmac', website: 'https://www.sellyourmac.com',tagline: 'Best prices for Apple devices', payment_methods: ['paypal','check'], payment_speed_days: 4, trust_score: 76, cpa_percent: 3.00 },
  { name: 'ItsWorthMore',slug: 'itsworthmore',website: 'https://www.itsworthmore.com',tagline: 'We pay more', payment_methods: ['paypal','check','venmo'], payment_speed_days: 2, trust_score: 84, cpa_percent: 4.00 },
  { name: 'Swappa',      slug: 'swappa',      website: 'https://swappa.com',       tagline: 'Buy and sell directly', payment_methods: ['paypal'], payment_speed_days: 1, trust_score: 90, cpa_percent: 2.50 },
];

// ── Device Families ───────────────────────────────────────────
// Format: [brand_slug, category_slug, name, slug, image_path, year, popular, storages[], msrp_cents, max_offer_cents]
const deviceFamilies = [
  // iPhones
  ['apple','phones','iPhone 17 Pro Max','iphone-17-pro-max','/images/iphone17promax.png',2025,true,['256GB','512GB','1TB'],119900,82000],
  ['apple','phones','iPhone 17 Pro','iphone-17-pro','/images/iphone17pro.png',2025,true,['128GB','256GB','512GB','1TB'],99900,76000],
  ['apple','phones','iPhone 17 Air','iphone-17-air','/images/iphoneair.png',2025,true,['128GB','256GB','512GB'],89900,59000],
  ['apple','phones','iPhone 17','iphone-17','/images/iphone17.png',2025,true,['128GB','256GB','512GB'],79900,68000],
  ['apple','phones','iPhone 16 Pro Max','iphone-16-pro-max','/images/iphone16promax.png',2024,true,['256GB','512GB','1TB'],119900,82000],
  ['apple','phones','iPhone 16 Pro','iphone-16-pro','/images/iphone16pro.png',2024,true,['128GB','256GB','512GB','1TB'],99900,68000],
  ['apple','phones','iPhone 16 Plus','iphone-16-plus','/images/iphone16plus.png',2024,false,['128GB','256GB','512GB'],89900,52000],
  ['apple','phones','iPhone 16','iphone-16','/images/iphone16.png',2024,true,['128GB','256GB','512GB'],79900,56000],
  ['apple','phones','iPhone 16e','iphone-16e','/images/iphone16e.png',2025,false,['128GB','256GB'],59900,31000],
  ['apple','phones','iPhone 15 Pro Max','iphone-15-pro-max','/images/iphone15promax.png',2023,true,['256GB','512GB','1TB'],119900,56000],
  ['apple','phones','iPhone 15 Pro','iphone-15-pro','/images/iphone15pro.png',2023,true,['128GB','256GB','512GB','1TB'],99900,46000],
  ['apple','phones','iPhone 15 Plus','iphone-15-plus','/images/iphone15plus.png',2023,false,['128GB','256GB','512GB'],89900,36000],
  ['apple','phones','iPhone 15','iphone-15','/images/iphone15.png',2023,false,['128GB','256GB','512GB'],79900,41000],
  ['apple','phones','iPhone 14 Pro Max','iphone-14-pro-max','/images/iphone14promax.png',2022,false,['128GB','256GB','512GB','1TB'],109900,41000],
  ['apple','phones','iPhone 14 Pro','iphone-14-pro','/images/iphone14pro.png',2022,false,['128GB','256GB','512GB','1TB'],99900,34000],
  ['apple','phones','iPhone 14 Plus','iphone-14-plus','/images/iphone14plus.png',2022,false,['128GB','256GB','512GB'],89900,25500],
  ['apple','phones','iPhone 14','iphone-14','/images/iphone14.png',2022,false,['128GB','256GB','512GB'],79900,29000],
  ['apple','phones','iPhone 13 Pro Max','iphone-13-pro-max','/images/iphone13promax.png',2021,false,['128GB','256GB','512GB','1TB'],109900,32000],
  ['apple','phones','iPhone 13 Pro','iphone-13-pro','/images/iphone13pro.png',2021,false,['128GB','256GB','512GB','1TB'],99900,26000],
  ['apple','phones','iPhone 13','iphone-13','/images/iphone13.png',2021,false,['128GB','256GB','512GB'],79900,19000],
  ['apple','phones','iPhone 12 Pro Max','iphone-12-pro-max','/images/iphone12promax.png',2020,false,['128GB','256GB','512GB'],109900,16000],
  ['apple','phones','iPhone 12 Pro','iphone-12-pro','/images/iphone12pro.png',2020,false,['128GB','256GB','512GB'],99900,14000],
  ['apple','phones','iPhone 12','iphone-12','/images/iphone12.png',2020,false,['64GB','128GB','256GB'],79900,11000],
  ['apple','phones','iPhone 11 Pro Max','iphone-11-pro-max','/images/iphone11promax.png',2019,false,['64GB','256GB','512GB'],109900,9000],
  ['apple','phones','iPhone 11 Pro','iphone-11-pro','/images/iphone11pro.png',2019,false,['64GB','256GB','512GB'],99900,8000],
  ['apple','phones','iPhone 11','iphone-11','/images/iphone11.png',2019,false,['64GB','128GB','256GB'],69900,7500],
  // Samsung Galaxy S
  ['samsung','phones','Galaxy S25 Ultra','galaxy-s25-ultra','/images/s25ultra.png',2025,true,['256GB','512GB','1TB'],129900,71000],
  ['samsung','phones','Galaxy S25+','galaxy-s25-plus','/images/s25plus.png',2025,true,['256GB','512GB'],99900,61000],
  ['samsung','phones','Galaxy S25','galaxy-s25','/images/s25.png',2025,true,['128GB','256GB'],79900,51000],
  ['samsung','phones','Galaxy S24 Ultra','galaxy-s24-ultra','/images/s24ultra.png',2024,false,['256GB','512GB','1TB'],129900,58000],
  ['samsung','phones','Galaxy S24+','galaxy-s24-plus','/images/s24plus.png',2024,false,['256GB','512GB'],99900,48000],
  ['samsung','phones','Galaxy S24','galaxy-s24','/images/s24.png',2024,false,['128GB','256GB'],79900,38000],
  ['samsung','phones','Galaxy S23 Ultra','galaxy-s23-ultra','/images/s23ultra.png',2023,false,['256GB','512GB','1TB'],119900,43000],
  ['samsung','phones','Galaxy S23+','galaxy-s23-plus','/images/s23plus.png',2023,false,['256GB','512GB'],99900,34000],
  ['samsung','phones','Galaxy S23','galaxy-s23','/images/s23.png',2023,false,['128GB','256GB'],79900,29000],
  ['samsung','phones','Galaxy S22 Ultra','galaxy-s22-ultra','/images/s22ultra.png',2022,false,['128GB','256GB','512GB'],119900,28000],
  ['samsung','phones','Galaxy S22','galaxy-s22','/images/s22.png',2022,false,['128GB','256GB'],79900,19500],
  // Samsung Z series
  ['samsung','phones','Galaxy Z Fold6','galaxy-z-fold6','/images/zfold6.png',2024,false,['256GB','512GB'],179900,69000],
  ['samsung','phones','Galaxy Z Flip7','galaxy-z-flip7','/images/zflip7.png',2025,false,['256GB','512GB'],99900,49000],
  ['samsung','phones','Galaxy Z Flip6','galaxy-z-flip6','/images/zflip6.png',2024,false,['256GB','512GB'],99900,38000],
  // Samsung A series
  ['samsung','phones','Galaxy A55','galaxy-a55','/images/galaxya55.png',2024,false,['128GB','256GB'],44999,14500],
  ['samsung','phones','Galaxy A35','galaxy-a35','/images/galaxya35.png',2024,false,['128GB','256GB'],38999,10500],
  // Google Pixel
  ['google','phones','Pixel 9 Pro XL','pixel-9-pro-xl','/images/pixel9proxl.png',2024,false,['128GB','256GB','512GB','1TB'],109900,54000],
  ['google','phones','Pixel 9 Pro','pixel-9-pro','/images/pixel9pro.png',2024,true,['128GB','256GB','512GB','1TB'],99900,49000],
  ['google','phones','Pixel 9','pixel-9','/images/pixel9.png',2024,false,['128GB','256GB'],79900,36000],
  ['google','phones','Pixel 8 Pro','pixel-8-pro','/images/pixel8pro.png',2023,false,['128GB','256GB','512GB','1TB'],99900,36000],
  ['google','phones','Pixel 8','pixel-8','/images/pixel8.png',2023,false,['128GB','256GB'],69900,27000],
  ['google','phones','Pixel 7 Pro','pixel-7-pro','/images/pixel7pro.png',2022,false,['128GB','256GB','512GB'],89900,21000],
  ['google','phones','Pixel 7','pixel-7','/images/pixel7.png',2022,false,['128GB','256GB'],59900,15500],
  ['google','phones','Pixel 6 Pro','pixel-6-pro','/images/pixel6pro.png',2021,false,['128GB','256GB','512GB'],89900,9500],
  ['google','phones','Pixel 6','pixel-6','/images/pixel6.png',2021,false,['128GB','256GB'],59900,7000],
  // OnePlus
  ['oneplus','phones','OnePlus 12','oneplus-12','/images/oneplus12.png',2024,false,['256GB','512GB'],79999,32000],
  // Samsung Galaxy Tab
  ['samsung','tablets','Galaxy Tab S9 Ultra','galaxy-tab-s9-ultra','/images/tabs9ultra.png',2023,true,['256GB','512GB','1TB'],119999,58000],
  ['samsung','tablets','Galaxy Tab S9+','galaxy-tab-s9-plus','/images/tabs9plus.png',2023,false,['256GB','512GB'],99999,42000],
  ['samsung','tablets','Galaxy Tab S9','galaxy-tab-s9','/images/tabs9.png',2023,false,['128GB','256GB'],79999,31000],
  // iPads
  ['apple','tablets','iPad Pro 13" M4','ipad-pro-13-m4','/images/ipadpro13.png',2024,true,['256GB','512GB','1TB','2TB'],129900,68000],
  ['apple','tablets','iPad Pro 11" M4','ipad-pro-11-m4','/images/ipadpro11.png',2024,false,['256GB','512GB','1TB','2TB'],99900,55000],
  ['apple','tablets','iPad Air 13" M2','ipad-air-13-m2','/images/ipadair13.png',2024,false,['128GB','256GB','512GB','1TB'],79900,42000],
  ['apple','tablets','iPad Air 11" M2','ipad-air-11-m2','/images/ipadair11.png',2024,false,['128GB','256GB','512GB','1TB'],59900,34000],
  ['apple','tablets','iPad mini 7','ipad-mini-7','/images/ipadmini7.png',2024,false,['128GB','256GB','512GB'],49900,27000],
  ['apple','tablets','iPad 10th Gen','ipad-10th-gen','/images/ipad10.png',2022,false,['64GB','256GB'],44900,19500],
  // MacBooks
  ['apple','laptops','MacBook Air 13" M4','macbook-air-13-m4','/images/mba13m4.png',2025,true,['256GB','512GB','1TB','2TB'],129900,72000],
  ['apple','laptops','MacBook Air 15" M3','macbook-air-15-m3','/images/mba15.png',2024,false,['256GB','512GB','1TB','2TB'],129900,78000],
  ['apple','laptops','MacBook Air 13" M3','macbook-air-13-m3','/images/mba13.png',2024,false,['256GB','512GB','1TB','2TB'],109900,64000],
  ['apple','laptops','MacBook Pro 16" M4','macbook-pro-16-m4','/images/mbp16m4.png',2024,true,['512GB','1TB','2TB'],249900,138000],
  ['apple','laptops','MacBook Pro 14" M4','macbook-pro-14-m4','/images/mbp14m4.png',2024,false,['512GB','1TB','2TB'],199900,105000],
  ['apple','laptops','MacBook Pro 16" M3','macbook-pro-16-m3','/images/mbp16.png',2023,false,['512GB','1TB','2TB'],249900,124000],
  ['apple','laptops','MacBook Pro 14" M3','macbook-pro-14-m3','/images/mbp14.png',2023,false,['512GB','1TB','2TB'],199900,98000],
  // Surface
  ['microsoft','laptops','Surface Laptop 7','surface-laptop-7','/images/surfacelaptop7.png',2024,false,['256GB','512GB','1TB'],129999,68000],
  ['microsoft','laptops','Surface Laptop 6','surface-laptop-6','/images/surfacelaptop6.png',2024,false,['256GB','512GB','1TB'],159999,54000],
  // Apple Watch
  ['apple','smartwatches','Apple Watch Ultra 3','apple-watch-ultra-3','/images/awultra3.png',2025,true,['64GB'],79900,52000],
  ['apple','smartwatches','Apple Watch Ultra 2','apple-watch-ultra-2','/images/awultra2.png',2023,true,['64GB'],79900,48000],
  ['apple','smartwatches','Apple Watch Series 11','apple-watch-series-11','/images/aws11.png',2025,false,['64GB'],39900,28000],
  ['apple','smartwatches','Apple Watch Series 10','apple-watch-series-10','/images/aws10.png',2024,false,['64GB'],39900,24000],
  ['apple','smartwatches','Apple Watch Series 9','apple-watch-series-9','/images/aws9.png',2023,false,['64GB'],39900,19000],
  ['apple','smartwatches','Apple Watch SE 2nd Gen','apple-watch-se-2','/images/awse2.png',2022,false,['32GB'],24900,11000],
  // Galaxy Watch
  ['samsung','smartwatches','Galaxy Watch 7','galaxy-watch-7','/images/gw7.png',2024,false,['16GB'],29999,16500],
  ['samsung','smartwatches','Galaxy Watch 6','galaxy-watch-6','/images/gw6.png',2023,false,['16GB'],29999,12000],
  // Consoles
  ['sony','consoles','PlayStation 5','playstation-5','/images/ps5.png',2020,true,['825GB'],49999,29000],
  ['sony','consoles','PlayStation 5 Slim','playstation-5-slim','/images/ps5slim.png',2023,false,['1TB'],44999,26000],
  ['nintendo','consoles','Nintendo Switch 2','nintendo-switch-2','/images/switch2.png',2025,true,['256GB'],44999,31000],
  ['nintendo','consoles','Nintendo Switch OLED','nintendo-switch-oled','/images/switcholed.png',2021,false,['64GB'],34999,18500],
  ['nintendo','consoles','Nintendo Switch','nintendo-switch','/images/switch.png',2017,false,['32GB'],29999,9500],
  ['microsoft','consoles','Xbox Series X','xbox-series-x','/images/xboxx.png',2020,true,['1TB'],49999,24000],
  ['microsoft','consoles','Xbox Series S','xbox-series-s','/images/xboxs.png',2020,false,['512GB'],29999,13000],
  ['meta','consoles','Meta Quest 3','meta-quest-3','/images/quest3.png',2023,true,['128GB','512GB'],49999,22000],
  ['meta','consoles','Meta Quest 3S','meta-quest-3s','/images/quest3s.png',2024,false,['128GB','256GB'],29999,16000],
  ['valve','consoles','Steam Deck OLED','steam-deck-oled','/images/steamdeckoled.png',2023,false,['512GB','1TB'],54999,31000],
  // Headphones
  ['apple','headphones','AirPods Pro 2nd Gen','airpods-pro-2','/images/airpodspro2.png',2022,false,['N/A'],24900,9500],
  ['sony','headphones','Sony WH-1000XM6','sony-wh-1000xm6','/images/sonyxm6.png',2025,false,['N/A'],39999,18000],
  ['sony','headphones','Sony WH-1000XM5','sony-wh-1000xm5','/images/xm5.png',2022,false,['N/A'],34999,14000],
  ['sony','headphones','Sony WH-1000XM4','sony-wh-1000xm4','/images/xm4.png',2020,false,['N/A'],27999,9500],
  ['bose','headphones','Bose QuietComfort Ultra','bose-quietcomfort-ultra','/images/boseqcultra.png',2023,false,['N/A'],37900,15500],
  ['bose','headphones','Bose QuietComfort 45','bose-quietcomfort-45','/images/boseqc45.png',2021,false,['N/A'],27900,9000],
];

// Mock offer generator — realistic prices per buyer
function generateOffers(deviceMaxCents, conditionId, conditionMult, buyerId, buyerIdx) {
  // Each buyer offers slightly different prices ±15%
  const variance = 0.85 + (buyerIdx * 0.05);
  return Math.round(deviceMaxCents * conditionMult * variance / 100) * 100;
}

async function main() {
  console.log('🌱 Seeding Revend database...\n');
  // Clean slate
  await db.from('offers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await db.from('devices').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await db.from('device_families').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await db.from('buyers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await db.from('conditions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await db.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await db.from('brands').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('Cleaned existing data');

  // 1. Brands
  console.log('Inserting brands...');
  for (const b of brands) {
    const { error } = await db.from('brands').upsert(b, { onConflict: 'slug' });
    if (error) console.error('brand error:', error.message);
  }
  
  // 2. Categories
  console.log('Inserting categories...');
  for (const c of categories) {
    const { error } = await db.from('categories').upsert(c, { onConflict: 'slug' });
    if (error) console.error('category error:', error.message);
  }

  // 3. Conditions
  console.log('Inserting conditions...');
  for (const c of conditions) {
    const { error } = await db.from('conditions').upsert(c, { onConflict: 'slug' });
    if (error) console.error('condition error:', error.message);
  }

  // 4. Buyers
  console.log('Inserting buyers...');
  for (const b of buyers) {
    const { error } = await db.from('buyers').upsert(b, { onConflict: 'slug' });
    if (error) console.error('buyer error:', error.message);
  }

  // Fetch IDs
  const { data: brandRows } = await db.from('brands').select('id, slug');
  const { data: catRows } = await db.from('categories').select('id, slug');
  const { data: condRows } = await db.from('conditions').select('id, slug, price_mult');
  const { data: buyerRows } = await db.from('buyers').select('id, slug');

  const brandMap = Object.fromEntries(brandRows.map(r => [r.slug, r.id]));
  const catMap = Object.fromEntries(catRows.map(r => [r.slug, r.id]));
  const condMap = Object.fromEntries(condRows.map(r => [r.slug, { id: r.id, mult: r.price_mult }]));
  const buyerList = buyerRows;

  // 5. Device families + variants + offers
  console.log('Inserting device families, variants, and mock offers...');
  let familyCount = 0, deviceCount = 0, offerCount = 0;

  for (const [bSlug, cSlug, name, slug, imageUrl, year, popular, storages, msrp, maxOffer] of deviceFamilies) {
    // Insert family
    const { data: family, error: fErr } = await db.from('device_families').upsert({
      brand_id: brandMap[bSlug],
      category_id: catMap[cSlug],
      name, slug,
      image_url: imageUrl,
      released_year: year,
      is_popular: popular
    }, { onConflict: 'slug' }).select('id').single();
    
    if (fErr) { console.error(`Family ${slug}:`, fErr.message); continue; }
    familyCount++;

    // Insert device variants
    for (const storage of storages) {
      const storageGb = storage === 'N/A' ? null : parseInt(storage);
      const msrpAdj = storageGb && storageGb > 256 ? msrp + (storageGb - 256) * 20 : msrp;
      
      const { data: device, error: dErr } = await db.from('devices').insert({
        family_id: family.id,
        storage_gb: storageGb,
        carrier: 'unlocked',
        msrp_cents: msrpAdj
      }).select('id').single();
      
      if (dErr) { console.error(`Device ${slug} ${storage}:`, dErr.message); continue; }
      deviceCount++;

      // Insert mock offers from each buyer for each condition
      for (const [condSlug, condData] of Object.entries(condMap)) {
        for (let i = 0; i < Math.min(buyerList.length, 5); i++) {
          const buyer = buyerList[i];
          const offerCents = generateOffers(maxOffer, condData.id, condData.mult, buyer.id, i);
          if (offerCents <= 0) continue;
          
          const { error: oErr } = await db.from('offers').insert({
            device_id: device.id,
            buyer_id: buyer.id,
            condition_id: condData.id,
            offer_cents: offerCents,
            is_active: true
          });
          
          if (oErr) { console.error(`Offer error:`, oErr.message); }
          else offerCount++;
        }
      }
    }
  }

  console.log(`\n✅ Done!`);
  console.log(`   Families: ${familyCount}`);
  console.log(`   Devices: ${deviceCount}`);
  console.log(`   Offers: ${offerCount}`);
}

main().catch(console.error);
