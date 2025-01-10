import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tiki.tours'

  // Core pages
  const coreRoutes = [
    '',
    '/about',
    '/trips',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Example pages
  const exampleRoutes = [
    '/examples',
    '/examples/ui',
    '/examples/data',
    '/examples/nextjs',
    '/examples/theme',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // 3D example pages
  const threeDRoutes = [
    '/examples/3d',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...coreRoutes, ...exampleRoutes, ...threeDRoutes]
}
