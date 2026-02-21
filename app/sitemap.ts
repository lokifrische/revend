import { MetadataRoute } from 'next'
import { devices, categories, brands } from '@/lib/data'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://revend-lokis-projects-b31d1aab.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // ── Static pages ──────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                            lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/how-it-works`,          lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/buyers`,                lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/sustainability`,        lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/blog`,                  lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE}/price-check`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/sell-broken`,           lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/business`,              lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/careers`,               lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/contact`,               lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ]

  // ── Category pages: /sell/phones, /sell/tablets, etc. ─────────────────────
  const categoryPages: MetadataRoute.Sitemap = categories.map(cat => ({
    url: `${BASE}/sell/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // ── Brand pages: /sell/phones/apple, /sell/phones/samsung, etc. ────────────
  const brandPageSet = new Set<string>()
  const brandPages: MetadataRoute.Sitemap = []

  devices.forEach(d => {
    const key = `${d.categorySlug}/${d.brandSlug}`
    if (!brandPageSet.has(key)) {
      brandPageSet.add(key)
      brandPages.push({
        url: `${BASE}/sell/${d.categorySlug}/${d.brandSlug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      })
    }
  })

  // ── Device pages: /sell/phones/apple/iphone-16-pro ────────────────────────
  const devicePages: MetadataRoute.Sitemap = devices.map(device => ({
    url: `${BASE}/sell/${device.categorySlug}/${device.brandSlug}/${device.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: device.popular ? 1.0 : 0.95,
  }))

  return [...staticPages, ...categoryPages, ...brandPages, ...devicePages]
}
