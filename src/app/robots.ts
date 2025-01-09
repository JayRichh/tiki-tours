import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/examples/'],
    },
    sitemap: 'https://tiki.tours/sitemap.xml',
    host: 'https://tiki.tours',
  }
}
