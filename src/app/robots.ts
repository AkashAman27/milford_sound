import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/api',
        '/auth/callback',
        '/checkout',
        '/_next',
        '/dev-output.log',
      ],
    },
    sitemap: 'https://milford-sound.com/sitemap.xml',
  }
}