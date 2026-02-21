import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Script from 'next/script'
import { devices, buyers, categories } from '@/lib/data'
import DevicePageClient from '@/components/device/DevicePageClient'

const BASE = 'https://revend-lokis-projects-b31d1aab.vercel.app'
const BUYER_COUNT = buyers.length

interface Props {
  params: Promise<{ category: string; brand: string; model: string }>
  searchParams: Promise<{ condition?: string }>
}

// ─── METADATA ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, brand, model } = await params

  const device = devices.find(
    d => d.slug === model && d.brandSlug === brand && d.categorySlug === category
  )
  if (!device) return {}

  const catData = categories.find(c => c.slug === category)
  const categoryLabel = catData?.name ?? category

  const title = `Sell ${device.name} — Compare Best Prices | Revend`
  const description = `Get up to $${device.maxOffer} for your ${device.name}. Compare offers from ${BUYER_COUNT}+ verified buyers instantly. Free shipping, fast payment.`
  const canonicalUrl = `${BASE}/sell/${category}/${brand}/${model}`

  return {
    title,
    description,
    keywords: [
      `sell ${device.name}`,
      `${device.name} trade in`,
      `${device.name} buyback`,
      `how much is my ${device.name} worth`,
      `best place to sell ${device.name}`,
      `sell used ${device.name}`,
      `${device.brand} trade in`,
      `${categoryLabel} buyback comparison`,
    ],
    openGraph: {
      title: `Sell ${device.name} for up to $${device.maxOffer} | Revend`,
      description: `Compare ${BUYER_COUNT}+ buyback offers instantly. Free shipping. Get paid fast.`,
      url: canonicalUrl,
      images: [
        {
          url: `/og/${model}.png`,
          width: 1200,
          height: 630,
          alt: `Sell your ${device.name} — compare buyback prices on Revend`,
        },
        // fallback to brand OG image
        {
          url: `/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Revend — Compare device buyback prices',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Sell ${device.name} for up to $${device.maxOffer}`,
      description: `Compare ${BUYER_COUNT}+ buyback offers on Revend. Free shipping, fast payment.`,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

// ─── STATIC PARAMS ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return devices.map(d => ({
    category: d.categorySlug,
    brand: d.brandSlug,
    model: d.slug,
  }))
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default async function DevicePage({ params, searchParams }: Props) {
  const { category, brand, model } = await params
  const { condition = '' } = await searchParams

  const device = devices.find(
    d => d.slug === model && d.brandSlug === brand && d.categorySlug === category
  )
  if (!device) notFound()

  const catData = categories.find(c => c.slug === category)
  const categoryLabel = catData?.name ?? category

  // Prices for schema — lowPrice = "broken" multiplier (~28%), highPrice = maxOffer
  const lowPrice = Math.round(device.maxOffer * 0.28)
  const highPrice = device.maxOffer
  const canonicalUrl = `${BASE}/sell/${category}/${brand}/${model}`

  // ── JSON-LD: Product + AggregateOffer ──────────────────────────────────────
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: device.name,
    brand: {
      '@type': 'Brand',
      name: device.brand,
    },
    description: `Sell your ${device.name} and compare offers from ${BUYER_COUNT}+ verified buyback buyers on Revend. Get up to $${highPrice} instantly.`,
    image: `${BASE}${device.image}`,
    url: canonicalUrl,
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: String(lowPrice),
      highPrice: String(highPrice),
      priceCurrency: 'USD',
      offerCount: String(BUYER_COUNT),
      availability: 'https://schema.org/InStock',
    },
  }

  // ── JSON-LD: BreadcrumbList ────────────────────────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryLabel,
        item: `${BASE}/sell/${category}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: device.brand,
        item: `${BASE}/sell/${category}/${brand}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: device.name,
        item: canonicalUrl,
      },
    ],
  }

  return (
    <>
      {/* Structured Data */}
      <Script
        id="ld-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Script
        id="ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Client Component handles all interactive UI */}
      <DevicePageClient
        device={device}
        categorySlug={category}
        brandSlug={brand}
        modelSlug={model}
        initialCondition={condition}
      />
    </>
  )
}
