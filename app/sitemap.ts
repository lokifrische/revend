import { MetadataRoute } from 'next'
import { devices, categories, brands } from '@/lib/data'

const BASE = 'https://revend.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/buyers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/sustainability`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ]

  const categoryPages: MetadataRoute.Sitemap = categories.map(cat => ({
    url: `${BASE}/sell/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const devicePages: MetadataRoute.Sitemap = devices.map(device => ({
    url: `${BASE}/sell/${device.categorySlug}/${device.brandSlug}/${device.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.95,
  }))

  return [...staticPages, ...categoryPages, ...devicePages]
}
