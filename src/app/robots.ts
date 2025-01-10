import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/trips',
        ],
        disallow: [
          '/api/',
          '/_next/',
          '/static/'
        ]
      }
    ],
    sitemap: 'https://tiki.tours/sitemap.xml',
    host: 'https://tiki.tours'
  }
}
