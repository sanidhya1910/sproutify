import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

// Static, public-facing marketing pages only — authenticated admin/volunteer
// routes and the API are excluded (see public/robots.txt).
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/about', '/events', '/resources', '/contact', '/login', '/register']

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }))
}
