// Mock data — ready to swap for real Supabase queries

export interface Brand {
  id: string
  name: string
  slug: string
  logo: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  deviceCount: number
}

export interface Device {
  id: string
  name: string
  slug: string
  brand: string
  brandSlug: string
  category: string
  categorySlug: string
  image: string
  storage: string[]
  maxOffer: number
  releaseYear: number
  popular?: boolean
}

export interface Condition {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  priceMultiplier: number
  color: string
}

export interface Buyer {
  id: string
  name: string
  slug: string
  logo: string
  rating: number
  reviewCount: number
  paymentMethods: string[]
  paymentSpeedDays: number
  promoCode?: string
  verified: boolean
  yearsActive: number
  tagline: string
  acceptedConditions: string[]
  website: string
}

export interface BuyerOffer {
  buyer: Buyer
  offerPrice: number
  offerCents: number
  isBestOffer: boolean
  shippingFree: boolean
  lockDays: number
  deviceId: string
  conditionId: string
}

// ─── CATEGORIES ────────────────────────────────────────────
export const categories: Category[] = [
  { id: 'cat-phones', name: 'Phones', slug: 'phones', icon: 'Smartphone', deviceCount: 312 },
  { id: 'cat-tablets', name: 'Tablets', slug: 'tablets', icon: 'Tablet', deviceCount: 87 },
  { id: 'cat-watches', name: 'Smartwatches', slug: 'smartwatches', icon: 'Watch', deviceCount: 64 },
  { id: 'cat-laptops', name: 'Laptops', slug: 'laptops', icon: 'Laptop', deviceCount: 95 },
  { id: 'cat-consoles', name: 'Consoles', slug: 'consoles', icon: 'Gamepad2', deviceCount: 28 },
  { id: 'cat-headphones', name: 'Headphones', slug: 'headphones', icon: 'Headphones', deviceCount: 41 },
]

// ─── BRANDS ────────────────────────────────────────────────
export const brands: Brand[] = [
  { id: 'b-apple', name: 'Apple', slug: 'apple', logo: '/brands/apple.svg' },
  { id: 'b-samsung', name: 'Samsung', slug: 'samsung', logo: '/brands/samsung.svg' },
  { id: 'b-google', name: 'Google', slug: 'google', logo: '/brands/google.svg' },
  { id: 'b-oneplus', name: 'OnePlus', slug: 'oneplus', logo: '/brands/oneplus.svg' },
  { id: 'b-microsoft', name: 'Microsoft', slug: 'microsoft', logo: '/brands/microsoft.svg' },
  { id: 'b-sony', name: 'Sony', slug: 'sony', logo: '/brands/sony.svg' },
  { id: 'b-nintendo', name: 'Nintendo', slug: 'nintendo', logo: '/brands/nintendo.svg' },
]

// ─── CONDITIONS ────────────────────────────────────────────
// Slugs match the live Supabase DB (like-new, good, fair, poor)
export const conditions: Condition[] = [
  {
    id: 'cond-like-new',
    name: 'Like New',
    slug: 'like-new',
    description: 'No scratches, works perfectly. Original packaging preferred.',
    icon: 'Sparkles',
    priceMultiplier: 1.0,
    color: 'teal',
  },
  {
    id: 'cond-good',
    name: 'Good',
    slug: 'good',
    description: 'Minor scratches only. Fully functional.',
    icon: 'Check',
    priceMultiplier: 0.85,
    color: 'blue',
  },
  {
    id: 'cond-fair',
    name: 'Fair',
    slug: 'fair',
    description: 'Visible wear or minor dents. Fully functional.',
    icon: 'AlertCircle',
    priceMultiplier: 0.65,
    color: 'amber',
  },
  {
    id: 'cond-poor',
    name: 'Poor',
    slug: 'poor',
    description: 'Heavy wear or damage — device still powers on.',
    icon: 'XCircle',
    priceMultiplier: 0.40,
    color: 'red',
  },
]

// ─── BUYERS ────────────────────────────────────────────────
export const buyers: Buyer[] = [
  {
    id: 'b-buybacktree',
    name: 'BuyBackTree',
    slug: 'buybacktree',
    logo: 'BBT',
    rating: 4.8,
    reviewCount: 2847,
    paymentMethods: ['PayPal', 'Venmo', 'Zelle', 'Cash App'],
    paymentSpeedDays: 2,
    promoCode: 'REVEND10',
    verified: true,
    yearsActive: 8,
    tagline: 'Fast payment, BBB accredited, free shipping label',
    acceptedConditions: ['flawless', 'good', 'fair', 'broken'],
    website: 'https://buybacktree.com',
  },
  {
    id: 'b-gazelle',
    name: 'Gazelle',
    slug: 'gazelle',
    logo: 'GZL',
    rating: 4.6,
    reviewCount: 18420,
    paymentMethods: ['PayPal', 'Amazon Gift Card', 'Check'],
    paymentSpeedDays: 5,
    verified: true,
    yearsActive: 15,
    tagline: 'America\'s most trusted phone buyback since 2009',
    acceptedConditions: ['flawless', 'good', 'fair'],
    website: 'https://www.gazelle.com',
  },
  {
    id: 'b-gadgetgone',
    name: 'GadgetGone',
    slug: 'gadgetgone',
    logo: 'GGO',
    rating: 4.5,
    reviewCount: 9203,
    paymentMethods: ['PayPal', 'Venmo', 'Check'],
    paymentSpeedDays: 3,
    promoCode: 'REVEND5',
    verified: true,
    yearsActive: 6,
    tagline: 'Competitive prices, quick turnaround',
    acceptedConditions: ['flawless', 'good', 'fair'],
    website: 'https://www.gadgetgone.com',
  },
  {
    id: 'b-itsworthmore',
    name: 'ItsWorthMore',
    slug: 'itsworthmore',
    logo: 'IWM',
    rating: 4.3,
    reviewCount: 6841,
    paymentMethods: ['PayPal', 'Check'],
    paymentSpeedDays: 7,
    verified: true,
    yearsActive: 5,
    tagline: 'Transparent pricing, no hidden fees',
    acceptedConditions: ['flawless', 'good', 'fair', 'broken'],
    website: 'https://www.itsworthmore.com',
  },
  {
    id: 'b-swappa',
    name: 'Swappa',
    slug: 'swappa',
    logo: 'SWP',
    rating: 4.4,
    reviewCount: 22100,
    paymentMethods: ['PayPal'],
    paymentSpeedDays: 1,
    verified: true,
    yearsActive: 13,
    tagline: 'Peer-to-peer marketplace, instant PayPal',
    acceptedConditions: ['flawless', 'good', 'fair'],
    website: 'https://swappa.com',
  },
  {
    id: 'b-decluttr',
    name: 'Decluttr',
    slug: 'decluttr',
    logo: 'DCL',
    rating: 4.2,
    reviewCount: 11340,
    paymentMethods: ['PayPal', 'Direct Deposit', 'Check'],
    paymentSpeedDays: 4,
    verified: true,
    yearsActive: 10,
    tagline: 'Sell your tech in minutes, get paid fast',
    acceptedConditions: ['flawless', 'good', 'fair'],
    website: 'https://www.decluttr.com',
  },
  {
    id: 'b-sellyourmac',
    name: 'SellYourMac',
    slug: 'sellyourmac',
    logo: 'SYM',
    rating: 4.5,
    reviewCount: 3812,
    paymentMethods: ['PayPal', 'Check', 'Zelle'],
    paymentSpeedDays: 3,
    verified: true,
    yearsActive: 7,
    tagline: 'Mac specialist — top dollar for Apple laptops & desktops',
    acceptedConditions: ['flawless', 'good', 'fair'],
    website: 'https://www.sellyourmac.com',
  },
]

// ─── DEVICES ───────────────────────────────────────────────
// All IDs use the slug as the ID pattern for uniqueness.
export const devices: Device[] = [
  // ── iPhone 17 lineup ──────────────────────────────────────
  { id: 'iphone-17-pro-max', name: 'iPhone 17 Pro Max', slug: 'iphone-17-pro-max', brand: 'Apple', brandSlug: 'apple', category: 'Phones', categorySlug: 'phones', image: '/images/iphone17promax.png', storage: ['256GB', '512GB', '1TB'], maxOffer: 820, releaseYear: 2025, popular: true },
  { id: 'iphone-17-pro', name: 'iPhone 17 Pro', slug: 'iphone-17-pro', brand: 'Apple', brandSlug: 'apple', category: 'Phones', categorySlug: 'phones', image: '/images/iphone17pro.png', storage: ['128GB', '256GB', '512GB', '1TB'], maxOffer: 760, releaseYear: 2025, popular: true },
  { id: 'iphone-17', name: 'iPhone 17', slug: 'iphone-17', brand: 'Apple', brandSlug: 'apple', category: 'Phones', categorySlug: 'phones', image: '/images/iphone17.png', storage: ['128GB', '256GB', '512GB'], maxOffer: 680, releaseYear: 2025, popular: true },
  { id: 'iphone-air', name: 'iPhone Air', slug: 'iphone-air', brand: 'Apple', brandSlug: 'apple', category: 'Phones', categorySlug: 'phones', image: '/images/iphoneair.png', storage: ['128GB', '256GB', '512GB'], maxOffer: 590, releaseYear: 2025, popular: true },
  // ── iPhone 16 lineup ──────────────────────────────────────
  { id: 'iphone-16-pro-max', name: 'iPhone 16 Pro Max', slug: 'iphone-16-pro-max', brand: 'Apple', brandSlug: 'apple', category: 'Phones', categorySlug: 'phones', image: '/images/iphone16promax.png', storage: ['256GB', '512GB', '1TB'], maxOffer: 820, releaseYear: 2024, popular: true },
  { id: 'iphone-16-pro', name: 'iPhone 16 Pro', slug: 'iphone-16-pro', brand: 'Apple', brandSlug: 'apple', category: 'Phones', categorySlug: 'phones', image: '/images/iphone16pro.png', storage: ['128GB', '256GB', '512GB', '1TB'], maxOffer: 680, releaseYear: 2024, popular: true },
  { id: 'iphone-16', name: 'iPhone 16', slug: 'iphone-16', brand: 'Apple', brandSlug: 'apple', category: 'Phones', categorySlug: 'phones', image: '/images/iphone16.png', storage: ['128GB', '256GB', '512GB'], maxOffer: 560, releaseYear: 2024, popular: true },
  { id: 'iphone-16-plus', name: 'iPhone 16 Plus', slug: 'iphone-16-plus', brand: 'Apple', brandSlug: 'apple', category: 'Phones', categorySlug: 'phones', image: '/images/iphone16plus.png', storage: ['128GB', '256GB', '512GB'], maxOffer: 520, releaseYear: 2024 },
  { id: 'iphone-16e', name: 'iPhone 16e', slug: 'iphone-16e', brand: 'Apple', brandSlug: 'apple', category: 'Phones', categorySlug: 'phones', image: '/images/iphone16e.png', storage: ['128GB', '256GB'], maxOffer: 310, releaseYear: 2025 },
  // ── iPhone 15 lineup ──────────────────────────────────────
  { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max', brand: 'Apple', brandSlug: 'apple', category: 'Phones', categorySlug: 'phones', image: '/images/iphone15promax.png', storage: ['256GB', '512GB', '1TB'], maxOffer: 560, releaseYear: 2023, popular: true },
  { id: 'iphone-15-pro', name: 'iPhone 15 Pro', slug: 'iphone-15-pro', brand: 'Apple', brandSlug: 'apple', category: 'Phones', categorySlug: 'phones', image: '/images/iphone15pro.png', storage: ['128GB', '256GB', '512GB', '1TB'], maxOffer: 460, releaseYear: 2023 },
  { id: 'iphone-15', name: 'iPhone 15', slug: 'iphone-15', brand: 'Apple', brandSlug: 'apple', category: 'Phones', categorySlug: 'phones', image: '/images/iphone15.png', storage: ['128GB', '256GB', '512GB'], maxOffer: 410, releaseYear: 2023 },
  { id: 'iphone-15-plus', name: 'iPhone 15 Plus', slug: 'iphone-15-plus', brand: 'Apple', brandSlug: 'apple', category: 'Phones', categorySlug: 'phones', image: '/images/iphone15plus.png', storage: ['128GB', '256GB', '512GB'], maxOffer: 360, releaseYear: 2023 },
  // ── iPhone 14 lineup ──────────────────────────────────────
  { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max', slug: 'iphone-14-pro-max', brand: 'Apple', brandSlug: 'apple', category: 'Phones', categorySlug: 'phones', image: '/images/iphone14promax.png', storage: ['128GB', '256GB', '512GB', '1TB'], maxOffer: 410, releaseYear: 2022 },
  { id: 'iphone-14-pro', name: 'iPhone 14 Pro', slug: 'iphone-14-pro', brand: 'Apple', brandSlug: 'apple', category: 'Phones', categorySlug: 'phones', image: '/images/iphone14pro.png', storage: ['128GB', '256GB', '512GB', '1TB'], maxOffer: 340, releaseYear: 2022 },
  { id: 'iphone-14', name: 'iPhone 14', slug: 'iphone-14', brand: 'Apple', brandSlug: 'apple', category: 'Phones', categorySlug: 'phones', image: '/images/iphone14.png', storage: ['128GB', '256GB', '512GB'], maxOffer: 290, releaseYear: 2022 },
  { id: 'iphone-14-plus', name: 'iPhone 14 Plus', slug: 'iphone-14-plus', brand: 'Apple', brandSlug: 'apple', category: 'Phones', categorySlug: 'phones', image: '/images/iphone14plus.png', storage: ['128GB', '256GB', '512GB'], maxOffer: 255, releaseYear: 2022 },
  // ── iPhone 13 lineup ──────────────────────────────────────
  { id: 'iphone-13-pro-max', name: 'iPhone 13 Pro Max', slug: 'iphone-13-pro-max', brand: 'Apple', brandSlug: 'apple', category: 'Phones', categorySlug: 'phones', image: '/images/iphone13promax.png', storage: ['128GB', '256GB', '512GB', '1TB'], maxOffer: 320, releaseYear: 2021 },
  { id: 'iphone-13', name: 'iPhone 13', slug: 'iphone-13', brand: 'Apple', brandSlug: 'apple', category: 'Phones', categorySlug: 'phones', image: '/images/iphone13.png', storage: ['128GB', '256GB', '512GB'], maxOffer: 190, releaseYear: 2021 },
  // ── Older iPhones ─────────────────────────────────────────
  { id: 'iphone-12', name: 'iPhone 12', slug: 'iphone-12', brand: 'Apple', brandSlug: 'apple', category: 'Phones', categorySlug: 'phones', image: '/images/iphone12.png', storage: ['64GB', '128GB', '256GB'], maxOffer: 110, releaseYear: 2020 },
  { id: 'iphone-11', name: 'iPhone 11', slug: 'iphone-11', brand: 'Apple', brandSlug: 'apple', category: 'Phones', categorySlug: 'phones', image: '/images/iphone11.png', storage: ['64GB', '128GB', '256GB'], maxOffer: 75, releaseYear: 2019 },
  // ── Samsung Galaxy S25 lineup ─────────────────────────────
  { id: 'galaxy-s25-ultra', name: 'Samsung Galaxy S25 Ultra', slug: 'galaxy-s25-ultra', brand: 'Samsung', brandSlug: 'samsung', category: 'Phones', categorySlug: 'phones', image: '/images/s25ultra.png', storage: ['256GB', '512GB', '1TB'], maxOffer: 710, releaseYear: 2025, popular: true },
  { id: 'galaxy-s25-plus', name: 'Samsung Galaxy S25+', slug: 'galaxy-s25-plus', brand: 'Samsung', brandSlug: 'samsung', category: 'Phones', categorySlug: 'phones', image: '/images/s25plus.png', storage: ['256GB', '512GB'], maxOffer: 610, releaseYear: 2025 },
  { id: 'galaxy-s25', name: 'Samsung Galaxy S25', slug: 'galaxy-s25', brand: 'Samsung', brandSlug: 'samsung', category: 'Phones', categorySlug: 'phones', image: '/images/s25.png', storage: ['128GB', '256GB'], maxOffer: 510, releaseYear: 2025, popular: true },
  // ── Samsung Galaxy S24 lineup ─────────────────────────────
  { id: 'galaxy-s24-ultra', name: 'Samsung Galaxy S24 Ultra', slug: 'galaxy-s24-ultra', brand: 'Samsung', brandSlug: 'samsung', category: 'Phones', categorySlug: 'phones', image: '/images/s24ultra.png', storage: ['256GB', '512GB', '1TB'], maxOffer: 580, releaseYear: 2024 },
  { id: 'galaxy-s24-plus', name: 'Samsung Galaxy S24+', slug: 'galaxy-s24-plus', brand: 'Samsung', brandSlug: 'samsung', category: 'Phones', categorySlug: 'phones', image: '/images/s24plus.png', storage: ['256GB', '512GB'], maxOffer: 480, releaseYear: 2024 },
  { id: 'galaxy-s24', name: 'Samsung Galaxy S24', slug: 'galaxy-s24', brand: 'Samsung', brandSlug: 'samsung', category: 'Phones', categorySlug: 'phones', image: '/images/s24.png', storage: ['128GB', '256GB'], maxOffer: 380, releaseYear: 2024 },
  // ── Samsung Galaxy S23 lineup ─────────────────────────────
  { id: 'galaxy-s23-ultra', name: 'Samsung Galaxy S23 Ultra', slug: 'galaxy-s23-ultra', brand: 'Samsung', brandSlug: 'samsung', category: 'Phones', categorySlug: 'phones', image: '/images/s23ultra.png', storage: ['256GB', '512GB', '1TB'], maxOffer: 430, releaseYear: 2023 },
  { id: 'galaxy-s23-plus', name: 'Samsung Galaxy S23+', slug: 'galaxy-s23-plus', brand: 'Samsung', brandSlug: 'samsung', category: 'Phones', categorySlug: 'phones', image: '/images/s23plus.png', storage: ['256GB', '512GB'], maxOffer: 340, releaseYear: 2023 },
  { id: 'galaxy-s23', name: 'Samsung Galaxy S23', slug: 'galaxy-s23', brand: 'Samsung', brandSlug: 'samsung', category: 'Phones', categorySlug: 'phones', image: '/images/s23.png', storage: ['128GB', '256GB'], maxOffer: 290, releaseYear: 2023 },
  // ── Samsung Galaxy S22 lineup ─────────────────────────────
  { id: 'galaxy-s22-ultra', name: 'Samsung Galaxy S22 Ultra', slug: 'galaxy-s22-ultra', brand: 'Samsung', brandSlug: 'samsung', category: 'Phones', categorySlug: 'phones', image: '/images/s22ultra.png', storage: ['128GB', '256GB', '512GB'], maxOffer: 280, releaseYear: 2022 },
  { id: 'galaxy-s22', name: 'Samsung Galaxy S22', slug: 'galaxy-s22', brand: 'Samsung', brandSlug: 'samsung', category: 'Phones', categorySlug: 'phones', image: '/images/s22.png', storage: ['128GB', '256GB'], maxOffer: 195, releaseYear: 2022 },
  // ── Samsung Galaxy Z series ───────────────────────────────
  { id: 'galaxy-z-fold6', name: 'Samsung Galaxy Z Fold6', slug: 'galaxy-z-fold6', brand: 'Samsung', brandSlug: 'samsung', category: 'Phones', categorySlug: 'phones', image: '/images/zfold6.png', storage: ['256GB', '512GB'], maxOffer: 690, releaseYear: 2024 },
  { id: 'galaxy-z-flip7', name: 'Samsung Galaxy Z Flip7', slug: 'galaxy-z-flip7', brand: 'Samsung', brandSlug: 'samsung', category: 'Phones', categorySlug: 'phones', image: '/images/zflip7.png', storage: ['256GB', '512GB'], maxOffer: 490, releaseYear: 2025 },
  { id: 'galaxy-z-flip6', name: 'Samsung Galaxy Z Flip6', slug: 'galaxy-z-flip6', brand: 'Samsung', brandSlug: 'samsung', category: 'Phones', categorySlug: 'phones', image: '/images/zflip6.png', storage: ['256GB', '512GB'], maxOffer: 380, releaseYear: 2024 },
  // ── Samsung Galaxy A series ───────────────────────────────
  { id: 'galaxy-a55', name: 'Samsung Galaxy A55', slug: 'galaxy-a55', brand: 'Samsung', brandSlug: 'samsung', category: 'Phones', categorySlug: 'phones', image: '/images/galaxya55.png', storage: ['128GB', '256GB'], maxOffer: 145, releaseYear: 2024 },
  { id: 'galaxy-a35', name: 'Samsung Galaxy A35', slug: 'galaxy-a35', brand: 'Samsung', brandSlug: 'samsung', category: 'Phones', categorySlug: 'phones', image: '/images/galaxya35.png', storage: ['128GB', '256GB'], maxOffer: 105, releaseYear: 2024 },
  // ── Google Pixel 9 lineup ─────────────────────────────────
  { id: 'pixel-9-pro-xl', name: 'Google Pixel 9 Pro XL', slug: 'pixel-9-pro-xl', brand: 'Google', brandSlug: 'google', category: 'Phones', categorySlug: 'phones', image: '/images/pixel9proxl.png', storage: ['128GB', '256GB', '512GB', '1TB'], maxOffer: 540, releaseYear: 2024 },
  { id: 'pixel-9-pro', name: 'Google Pixel 9 Pro', slug: 'pixel-9-pro', brand: 'Google', brandSlug: 'google', category: 'Phones', categorySlug: 'phones', image: '/images/pixel9pro.png', storage: ['128GB', '256GB', '512GB', '1TB'], maxOffer: 490, releaseYear: 2024, popular: true },
  { id: 'pixel-9', name: 'Google Pixel 9', slug: 'pixel-9', brand: 'Google', brandSlug: 'google', category: 'Phones', categorySlug: 'phones', image: '/images/pixel9.png', storage: ['128GB', '256GB'], maxOffer: 360, releaseYear: 2024 },
  // ── Google Pixel 8 lineup ─────────────────────────────────
  { id: 'pixel-8-pro', name: 'Google Pixel 8 Pro', slug: 'pixel-8-pro', brand: 'Google', brandSlug: 'google', category: 'Phones', categorySlug: 'phones', image: '/images/pixel8pro.png', storage: ['128GB', '256GB', '512GB', '1TB'], maxOffer: 360, releaseYear: 2023 },
  { id: 'pixel-8', name: 'Google Pixel 8', slug: 'pixel-8', brand: 'Google', brandSlug: 'google', category: 'Phones', categorySlug: 'phones', image: '/images/pixel8.png', storage: ['128GB', '256GB'], maxOffer: 270, releaseYear: 2023 },
  // ── Google Pixel 7 lineup ─────────────────────────────────
  { id: 'pixel-7-pro', name: 'Google Pixel 7 Pro', slug: 'pixel-7-pro', brand: 'Google', brandSlug: 'google', category: 'Phones', categorySlug: 'phones', image: '/images/pixel7pro.png', storage: ['128GB', '256GB', '512GB'], maxOffer: 210, releaseYear: 2022 },
  { id: 'pixel-7', name: 'Google Pixel 7', slug: 'pixel-7', brand: 'Google', brandSlug: 'google', category: 'Phones', categorySlug: 'phones', image: '/images/pixel7.png', storage: ['128GB', '256GB'], maxOffer: 155, releaseYear: 2022 },
  // ── Google Pixel 6 lineup ─────────────────────────────────
  { id: 'pixel-6-pro', name: 'Google Pixel 6 Pro', slug: 'pixel-6-pro', brand: 'Google', brandSlug: 'google', category: 'Phones', categorySlug: 'phones', image: '/images/pixel6pro.png', storage: ['128GB', '256GB', '512GB'], maxOffer: 95, releaseYear: 2021 },
  { id: 'pixel-6', name: 'Google Pixel 6', slug: 'pixel-6', brand: 'Google', brandSlug: 'google', category: 'Phones', categorySlug: 'phones', image: '/images/pixel6.png', storage: ['128GB', '256GB'], maxOffer: 70, releaseYear: 2021 },
  // ── OnePlus ───────────────────────────────────────────────
  { id: 'oneplus-12', name: 'OnePlus 12', slug: 'oneplus-12', brand: 'OnePlus', brandSlug: 'oneplus', category: 'Phones', categorySlug: 'phones', image: '/images/oneplus12.png', storage: ['256GB', '512GB'], maxOffer: 320, releaseYear: 2024 },
  // ── iPad Pro ──────────────────────────────────────────────
  { id: 'ipad-pro-13-m4', name: 'iPad Pro 13" M4', slug: 'ipad-pro-13-m4', brand: 'Apple', brandSlug: 'apple', category: 'Tablets', categorySlug: 'tablets', image: '/images/ipadpro13.png', storage: ['256GB', '512GB', '1TB', '2TB'], maxOffer: 680, releaseYear: 2024, popular: true },
  { id: 'ipad-pro-11-m4', name: 'iPad Pro 11" M4', slug: 'ipad-pro-11-m4', brand: 'Apple', brandSlug: 'apple', category: 'Tablets', categorySlug: 'tablets', image: '/images/ipadpro11.png', storage: ['256GB', '512GB', '1TB', '2TB'], maxOffer: 550, releaseYear: 2024 },
  // ── iPad Air ──────────────────────────────────────────────
  { id: 'ipad-air-13-m2', name: 'iPad Air 13" M2', slug: 'ipad-air-13-m2', brand: 'Apple', brandSlug: 'apple', category: 'Tablets', categorySlug: 'tablets', image: '/images/ipadair13.png', storage: ['128GB', '256GB', '512GB', '1TB'], maxOffer: 420, releaseYear: 2024 },
  { id: 'ipad-air-11-m2', name: 'iPad Air 11" M2', slug: 'ipad-air-11-m2', brand: 'Apple', brandSlug: 'apple', category: 'Tablets', categorySlug: 'tablets', image: '/images/ipadair11.png', storage: ['128GB', '256GB', '512GB', '1TB'], maxOffer: 340, releaseYear: 2024 },
  // ── iPad mini & iPad ──────────────────────────────────────
  { id: 'ipad-mini-7', name: 'iPad mini 7', slug: 'ipad-mini-7', brand: 'Apple', brandSlug: 'apple', category: 'Tablets', categorySlug: 'tablets', image: '/images/ipadmini7.png', storage: ['128GB', '256GB', '512GB'], maxOffer: 270, releaseYear: 2024 },
  { id: 'ipad-10th-gen', name: 'iPad 10th Gen', slug: 'ipad-10th-gen', brand: 'Apple', brandSlug: 'apple', category: 'Tablets', categorySlug: 'tablets', image: '/images/ipad10.png', storage: ['64GB', '256GB'], maxOffer: 195, releaseYear: 2022 },
  // ── Samsung Galaxy Tab ────────────────────────────────────
  { id: 'galaxy-tab-s9-ultra', name: 'Samsung Galaxy Tab S9 Ultra', slug: 'galaxy-tab-s9-ultra', brand: 'Samsung', brandSlug: 'samsung', category: 'Tablets', categorySlug: 'tablets', image: '/images/tabs9ultra.png', storage: ['256GB', '512GB', '1TB'], maxOffer: 580, releaseYear: 2023, popular: true },
  { id: 'galaxy-tab-s9-plus', name: 'Samsung Galaxy Tab S9+', slug: 'galaxy-tab-s9-plus', brand: 'Samsung', brandSlug: 'samsung', category: 'Tablets', categorySlug: 'tablets', image: '/images/tabs9plus.png', storage: ['256GB', '512GB'], maxOffer: 420, releaseYear: 2023 },
  { id: 'galaxy-tab-s9', name: 'Samsung Galaxy Tab S9', slug: 'galaxy-tab-s9', brand: 'Samsung', brandSlug: 'samsung', category: 'Tablets', categorySlug: 'tablets', image: '/images/tabs9.png', storage: ['128GB', '256GB'], maxOffer: 310, releaseYear: 2023 },
  // ── Apple Watch ───────────────────────────────────────────
  { id: 'apple-watch-ultra-3', name: 'Apple Watch Ultra 3', slug: 'apple-watch-ultra-3', brand: 'Apple', brandSlug: 'apple', category: 'Smartwatches', categorySlug: 'smartwatches', image: '/images/awultra3.png', storage: ['64GB'], maxOffer: 520, releaseYear: 2025, popular: true },
  { id: 'apple-watch-ultra-2', name: 'Apple Watch Ultra 2', slug: 'apple-watch-ultra-2', brand: 'Apple', brandSlug: 'apple', category: 'Smartwatches', categorySlug: 'smartwatches', image: '/images/awultra2.png', storage: ['64GB'], maxOffer: 480, releaseYear: 2023, popular: true },
  { id: 'apple-watch-series-11', name: 'Apple Watch Series 11', slug: 'apple-watch-series-11', brand: 'Apple', brandSlug: 'apple', category: 'Smartwatches', categorySlug: 'smartwatches', image: '/images/aws11.png', storage: ['64GB'], maxOffer: 280, releaseYear: 2025 },
  { id: 'apple-watch-series-10', name: 'Apple Watch Series 10', slug: 'apple-watch-series-10', brand: 'Apple', brandSlug: 'apple', category: 'Smartwatches', categorySlug: 'smartwatches', image: '/images/aws10.png', storage: ['64GB'], maxOffer: 240, releaseYear: 2024 },
  { id: 'apple-watch-series-9', name: 'Apple Watch Series 9', slug: 'apple-watch-series-9', brand: 'Apple', brandSlug: 'apple', category: 'Smartwatches', categorySlug: 'smartwatches', image: '/images/aws9.png', storage: ['64GB'], maxOffer: 190, releaseYear: 2023 },
  { id: 'apple-watch-se-2', name: 'Apple Watch SE 2nd Gen', slug: 'apple-watch-se-2', brand: 'Apple', brandSlug: 'apple', category: 'Smartwatches', categorySlug: 'smartwatches', image: '/images/awse2.png', storage: ['32GB'], maxOffer: 110, releaseYear: 2022 },
  // ── Samsung Galaxy Watch ──────────────────────────────────
  { id: 'galaxy-watch-7', name: 'Samsung Galaxy Watch 7', slug: 'galaxy-watch-7', brand: 'Samsung', brandSlug: 'samsung', category: 'Smartwatches', categorySlug: 'smartwatches', image: '/images/gw7.png', storage: ['16GB'], maxOffer: 165, releaseYear: 2024 },
  { id: 'galaxy-watch-6', name: 'Samsung Galaxy Watch 6', slug: 'galaxy-watch-6', brand: 'Samsung', brandSlug: 'samsung', category: 'Smartwatches', categorySlug: 'smartwatches', image: '/images/gw6.png', storage: ['16GB'], maxOffer: 120, releaseYear: 2023 },
  // ── MacBook ───────────────────────────────────────────────
  { id: 'macbook-air-13-m4', name: 'MacBook Air 13" M4', slug: 'macbook-air-13-m4', brand: 'Apple', brandSlug: 'apple', category: 'Laptops', categorySlug: 'laptops', image: '/images/mba13m4.png', storage: ['256GB', '512GB', '1TB', '2TB'], maxOffer: 720, releaseYear: 2025, popular: true },
  { id: 'macbook-pro-16-m4-pro', name: 'MacBook Pro 16" M4 Pro', slug: 'macbook-pro-16-m4-pro', brand: 'Apple', brandSlug: 'apple', category: 'Laptops', categorySlug: 'laptops', image: '/images/mbp16m4.png', storage: ['512GB', '1TB', '2TB', '4TB'], maxOffer: 1380, releaseYear: 2024 },
  { id: 'macbook-pro-16-m4', name: 'MacBook Pro 16" M4', slug: 'macbook-pro-16-m4', brand: 'Apple', brandSlug: 'apple', category: 'Laptops', categorySlug: 'laptops', image: '/images/mbp16.png', storage: ['512GB', '1TB', '2TB'], maxOffer: 1240, releaseYear: 2024, popular: true },
  { id: 'macbook-pro-14-m4-pro', name: 'MacBook Pro 14" M4 Pro', slug: 'macbook-pro-14-m4-pro', brand: 'Apple', brandSlug: 'apple', category: 'Laptops', categorySlug: 'laptops', image: '/images/mbp14m4.png', storage: ['512GB', '1TB', '2TB'], maxOffer: 1050, releaseYear: 2024 },
  { id: 'macbook-pro-14-m4', name: 'MacBook Pro 14" M4', slug: 'macbook-pro-14-m4', brand: 'Apple', brandSlug: 'apple', category: 'Laptops', categorySlug: 'laptops', image: '/images/mbp14.png', storage: ['512GB', '1TB', '2TB'], maxOffer: 980, releaseYear: 2024 },
  { id: 'macbook-air-15-m3', name: 'MacBook Air 15" M3', slug: 'macbook-air-15-m3', brand: 'Apple', brandSlug: 'apple', category: 'Laptops', categorySlug: 'laptops', image: '/images/mba15.png', storage: ['256GB', '512GB', '1TB', '2TB'], maxOffer: 780, releaseYear: 2024 },
  { id: 'macbook-air-13-m3', name: 'MacBook Air 13" M3', slug: 'macbook-air-13-m3', brand: 'Apple', brandSlug: 'apple', category: 'Laptops', categorySlug: 'laptops', image: '/images/mba13.png', storage: ['256GB', '512GB', '1TB', '2TB'], maxOffer: 640, releaseYear: 2024, popular: true },
  // ── Surface ───────────────────────────────────────────────
  { id: 'surface-laptop-7', name: 'Surface Laptop 7', slug: 'surface-laptop-7', brand: 'Microsoft', brandSlug: 'microsoft', category: 'Laptops', categorySlug: 'laptops', image: '/images/surfacelaptop7.png', storage: ['256GB', '512GB', '1TB'], maxOffer: 680, releaseYear: 2024 },
  { id: 'surface-laptop-6', name: 'Surface Laptop 6', slug: 'surface-laptop-6', brand: 'Microsoft', brandSlug: 'microsoft', category: 'Laptops', categorySlug: 'laptops', image: '/images/surfacelaptop6.png', storage: ['256GB', '512GB', '1TB'], maxOffer: 540, releaseYear: 2024 },
  // ── PlayStation ───────────────────────────────────────────
  { id: 'playstation-5', name: 'PlayStation 5', slug: 'playstation-5', brand: 'Sony', brandSlug: 'sony', category: 'Consoles', categorySlug: 'consoles', image: '/images/ps5.png', storage: ['825GB'], maxOffer: 290, releaseYear: 2020, popular: true },
  { id: 'playstation-5-slim', name: 'PlayStation 5 Slim', slug: 'playstation-5-slim', brand: 'Sony', brandSlug: 'sony', category: 'Consoles', categorySlug: 'consoles', image: '/images/ps5slim.png', storage: ['1TB'], maxOffer: 260, releaseYear: 2023 },
  // ── Xbox ──────────────────────────────────────────────────
  { id: 'xbox-series-x', name: 'Xbox Series X', slug: 'xbox-series-x', brand: 'Microsoft', brandSlug: 'microsoft', category: 'Consoles', categorySlug: 'consoles', image: '/images/xboxx.png', storage: ['1TB'], maxOffer: 240, releaseYear: 2020, popular: true },
  { id: 'xbox-series-s', name: 'Xbox Series S', slug: 'xbox-series-s', brand: 'Microsoft', brandSlug: 'microsoft', category: 'Consoles', categorySlug: 'consoles', image: '/images/xboxs.png', storage: ['512GB'], maxOffer: 130, releaseYear: 2020 },
  // ── Nintendo Switch ───────────────────────────────────────
  { id: 'nintendo-switch-2', name: 'Nintendo Switch 2', slug: 'nintendo-switch-2', brand: 'Nintendo', brandSlug: 'nintendo', category: 'Consoles', categorySlug: 'consoles', image: '/images/switch2.png', storage: ['256GB'], maxOffer: 310, releaseYear: 2025, popular: true },
  { id: 'nintendo-switch-oled', name: 'Nintendo Switch (OLED)', slug: 'nintendo-switch-oled', brand: 'Nintendo', brandSlug: 'nintendo', category: 'Consoles', categorySlug: 'consoles', image: '/images/switcholed.png', storage: ['64GB'], maxOffer: 185, releaseYear: 2021 },
  { id: 'nintendo-switch', name: 'Nintendo Switch', slug: 'nintendo-switch', brand: 'Nintendo', brandSlug: 'nintendo', category: 'Consoles', categorySlug: 'consoles', image: '/images/switch.png', storage: ['32GB'], maxOffer: 95, releaseYear: 2017 },
  // ── Meta Quest ────────────────────────────────────────────
  { id: 'meta-quest-3', name: 'Meta Quest 3', slug: 'meta-quest-3', brand: 'Meta', brandSlug: 'meta', category: 'Consoles', categorySlug: 'consoles', image: '/images/quest3.png', storage: ['128GB', '512GB'], maxOffer: 220, releaseYear: 2023, popular: true },
  { id: 'meta-quest-3s', name: 'Meta Quest 3S', slug: 'meta-quest-3s', brand: 'Meta', brandSlug: 'meta', category: 'Consoles', categorySlug: 'consoles', image: '/images/quest3s.png', storage: ['128GB', '256GB'], maxOffer: 160, releaseYear: 2024 },
  // ── Steam Deck ────────────────────────────────────────────
  { id: 'steam-deck-oled', name: 'Steam Deck OLED', slug: 'steam-deck-oled', brand: 'Valve', brandSlug: 'valve', category: 'Consoles', categorySlug: 'consoles', image: '/images/steamdeckoled.png', storage: ['512GB', '1TB'], maxOffer: 310, releaseYear: 2023 },
  // ── Headphones ────────────────────────────────────────────
  { id: 'airpods-pro-2', name: 'AirPods Pro 2nd Gen', slug: 'airpods-pro-2', brand: 'Apple', brandSlug: 'apple', category: 'Headphones', categorySlug: 'headphones', image: '/images/airpodspro2.png', storage: ['N/A'], maxOffer: 95, releaseYear: 2022 },
  { id: 'sony-wh-1000xm6', name: 'Sony WH-1000XM6', slug: 'sony-wh-1000xm6', brand: 'Sony', brandSlug: 'sony', category: 'Headphones', categorySlug: 'headphones', image: '/images/sonyxm6.png', storage: ['N/A'], maxOffer: 180, releaseYear: 2025 },
  { id: 'sony-wh-1000xm5', name: 'Sony WH-1000XM5', slug: 'sony-wh-1000xm5', brand: 'Sony', brandSlug: 'sony', category: 'Headphones', categorySlug: 'headphones', image: '/images/xm5.png', storage: ['N/A'], maxOffer: 140, releaseYear: 2022 },
  { id: 'sony-wh-1000xm4', name: 'Sony WH-1000XM4', slug: 'sony-wh-1000xm4', brand: 'Sony', brandSlug: 'sony', category: 'Headphones', categorySlug: 'headphones', image: '/images/xm4.png', storage: ['N/A'], maxOffer: 95, releaseYear: 2020 },
  { id: 'bose-quietcomfort-ultra', name: 'Bose QuietComfort Ultra', slug: 'bose-quietcomfort-ultra', brand: 'Bose', brandSlug: 'bose', category: 'Headphones', categorySlug: 'headphones', image: '/images/boseqcultra.png', storage: ['N/A'], maxOffer: 155, releaseYear: 2023 },
  { id: 'bose-quietcomfort-45', name: 'Bose QuietComfort 45', slug: 'bose-quietcomfort-45', brand: 'Bose', brandSlug: 'bose', category: 'Headphones', categorySlug: 'headphones', image: '/images/boseqc45.png', storage: ['N/A'], maxOffer: 90, releaseYear: 2021 },
]

// ─── MOCK OFFERS GENERATOR ─────────────────────────────────
export function getOffersForDevice(deviceId: string, conditionSlug: string): BuyerOffer[] {
  const device = devices.find(d => d.id === deviceId || d.slug === deviceId)
  if (!device) return []

  const condition = conditions.find(c => c.slug === conditionSlug)
  if (!condition) return []

  const basePrice = device.maxOffer
  const multiplier = condition.priceMultiplier

  // Generate realistic spread of offers
  const offerData = [
    { buyer: buyers[0], pct: 1.00 },    // BuyBackTree — best
    { buyer: buyers[2], pct: 0.97 },    // GadgetGone
    { buyer: buyers[1], pct: 0.93 },    // Gazelle
    { buyer: buyers[4], pct: 0.90 },    // Swappa
    { buyer: buyers[3], pct: 0.85 },    // ItsWorthMore
  ].filter(o => o.buyer.acceptedConditions.includes(conditionSlug))

  return offerData.map((o, i) => ({
    buyer: o.buyer,
    offerPrice: Math.round(basePrice * multiplier * o.pct),
    offerCents: Math.round(basePrice * multiplier * o.pct * 100),
    isBestOffer: i === 0,
    shippingFree: true,
    lockDays: 30,
    deviceId: '', // Legacy mock data - not used
    conditionId: '', // Legacy mock data - not used
  }))
}

// ─── POPULAR DEVICES ───────────────────────────────────────
export const popularDevices = devices.filter(d => d.popular)

// ─── SEARCH ────────────────────────────────────────────────
export function searchDevices(query: string): Device[] {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase()
  return devices
    .filter(d => 
      d.name.toLowerCase().includes(q) ||
      d.brand.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q)
    )
    .slice(0, 8)
}

// ─── CO2 SAVINGS ──────────────────────────────────────────
export const co2ByCategory: Record<string, number> = {
  phones: 57,
  tablets: 35,
  smartwatches: 20,
  laptops: 80,
  consoles: 45,
  headphones: 15,
}

export function getCO2Savings(categorySlug: string): number {
  return co2ByCategory[categorySlug] ?? 40
}

// Stats
export const platformStats = {
  totalSellers: 127400,
  totalBuyers: 23,
  totalDevices: 627,
  co2SavedTons: 7248,
}
