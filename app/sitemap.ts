import { MetadataRoute } from 'next'
import { getCategories, getFamiliesByCategory, getBrands } from '@/lib/db'

const BASE = 'https://revend.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/buyers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/sustainability`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ]

  try {
    const categories = await getCategories()

    const categoryPages: MetadataRoute.Sitemap = categories.map(cat => ({
      url: `${BASE}/sell/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    // Get device pages across all categories
    const familiesByCat = await Promise.all(
      categories.map(cat => getFamiliesByCategory(cat.slug))
    )

    const devicePages: MetadataRoute.Sitemap = familiesByCat.flat().map(family => ({
      url: `${BASE}/sell/${family.categorySlug}/${family.brandSlug}/${family.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.95,
    }))

    return [...staticPages, ...categoryPages, ...devicePages]
  } catch {
    return staticPages
  }
}
