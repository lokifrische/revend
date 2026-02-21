/**
 * Adapters — convert raw DB rows into the types used by UI components.
 * Components still use the interfaces from lib/data.ts (Device, Buyer, BuyerOffer).
 */

import type { Device, Buyer, BuyerOffer } from './data'
import type { DbFamily, DbOffer, DbBuyer } from './db'
import { formatStorageGb } from './db'

// ─── Payment method normaliser ────────────────────────────────────────────────
const PAYMENT_LABEL: Record<string, string> = {
  paypal: 'PayPal',
  venmo: 'Venmo',
  zelle: 'Zelle',
  cashapp: 'Cash App',
  cash_app: 'Cash App',
  check: 'Check',
  bank_transfer: 'Bank Transfer',
  amazon_gc: 'Amazon Gift Card',
}

export function formatPaymentMethod(m: string): string {
  return PAYMENT_LABEL[m.toLowerCase()] ?? m
}

// ─── DbFamily → Device (for DeviceCard and other components) ─────────────────
export function dbFamilyToDevice(f: DbFamily): Device {
  const storages = f.variants
    .map(v => formatStorageGb(v.storage_gb))
    .filter(Boolean)

  // Deduplicate
  const uniqueStorages = [...new Set(storages)]

  return {
    id: f.id,
    name: f.name,
    slug: f.slug,
    brand: f.brand,
    brandSlug: f.brandSlug,
    category: f.category,
    categorySlug: f.categorySlug,
    image: f.image_url || '/images/placeholder.png',
    storage: uniqueStorages.length > 0 ? uniqueStorages : ['N/A'],
    maxOffer: Math.round(f.maxOfferCents / 100),
    releaseYear: f.released_year ?? new Date().getFullYear(),
    popular: f.is_popular,
  }
}

// ─── DbBuyer → Buyer (for BuyerCard and BuyersPage) ─────────────────────────
export function dbBuyerToBuyer(b: DbBuyer): Buyer {
  // Derive rating from trust_score (0–100 → 0–5, step 0.1)
  const rating = Math.round(Math.min(5, (b.trust_score / 100) * 5) * 10) / 10

  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    logo: b.name.replace(/\s+/g, '').slice(0, 3).toUpperCase(),
    rating,
    reviewCount: Math.floor(b.trust_score * 80 + 500),   // plausible proxy
    paymentMethods: (b.payment_methods || []).map(formatPaymentMethod),
    paymentSpeedDays: b.payment_speed_days,
    promoCode: undefined,
    verified: b.is_featured || b.trust_score >= 80,
    yearsActive: 5,   // not stored in DB — placeholder
    tagline: b.tagline || 'Trusted device buyback',
    acceptedConditions: ['like-new', 'good', 'fair', 'poor'],
  }
}

// ─── DbOffer (from getAllOffersForFamily) → BuyerOffer ───────────────────────
export function dbOfferToBuyerOffer(o: DbOffer, rank: number): BuyerOffer {
  const buyer: Buyer = {
    id: o.buyerId,
    name: o.buyerName,
    slug: o.buyerSlug,
    logo: o.buyerName.replace(/\s+/g, '').slice(0, 3).toUpperCase(),
    rating: Math.round(Math.min(5, (o.trustScore / 100) * 5) * 10) / 10,
    reviewCount: Math.floor(o.trustScore * 80 + 500),
    paymentMethods: (o.paymentMethods || []).map(formatPaymentMethod),
    paymentSpeedDays: o.paymentSpeedDays,
    promoCode: undefined,
    verified: o.isFeatured || o.trustScore >= 80,
    yearsActive: 5,
    tagline: o.tagline || 'Trusted device buyback',
    acceptedConditions: ['like-new', 'good', 'fair', 'poor'],
  }

  return {
    buyer,
    offerPrice: Math.round(o.offerCents / 100),
    isBestOffer: rank === 0,
    shippingFree: true,
    lockDays: 30,
  }
}

// ─── Filter & sort offers from a family's allOffers ──────────────────────────
/**
 * Given the full offers array from getAllOffersForFamily, filter to:
 * - a specific condition slug  - optionally a specific device variant ID
 * - deduplicate buyers (keep highest offer per buyer)
 * - sort by offerCents desc
 * Then convert to BuyerOffer[]
 */
export function filterAndAdaptOffers(
  allOffers: DbOffer[],
  conditionSlug: string,
  deviceId?: string,
): BuyerOffer[] {
  const filtered = allOffers.filter(o => {
    const condMatch = o.conditionSlug === conditionSlug
    const devMatch = deviceId ? o.deviceId === deviceId : true
    return condMatch && devMatch
  })

  // Deduplicate buyers — keep highest offer per buyer
  const bestByBuyer = new Map<string, DbOffer>()
  for (const o of filtered) {
    const existing = bestByBuyer.get(o.buyerId)
    if (!existing || o.offerCents > existing.offerCents) {
      bestByBuyer.set(o.buyerId, o)
    }
  }

  // Sort by offerCents desc
  const sorted = [...bestByBuyer.values()].sort((a, b) => b.offerCents - a.offerCents)

  return sorted.map((o, i) => dbOfferToBuyerOffer(o, i))
}
