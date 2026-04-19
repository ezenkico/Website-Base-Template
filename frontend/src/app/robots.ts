import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const host = process.env.HOST ?? "http://localhost:8080";
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/blog'],
      disallow: ['/admin'],
    },
    sitemap: `${host}/api/sitemap.xml`,
  }
}