import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/go/', '/admin/', '/api/'],
      },
    ],
    sitemap: 'https://revend.com/sitemap.xml',
  }
}
