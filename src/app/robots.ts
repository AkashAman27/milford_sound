import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Default fallback configuration
  const defaultConfig = {
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
    sitemap: 'https://tps-site.com/sitemap.xml',
  }

  try {
    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Fetch active robots configuration from database
    const { data: config, error } = await supabase
      .from('robots_config')
      .select('*')
      .eq('is_active', true)
      .single()

    if (error || !config) {
      console.warn('Failed to fetch robots config from database, using defaults:', error?.message)
      return defaultConfig
    }

    // Build robots configuration from database
    return {
      rules: {
        userAgent: config.user_agent || '*',
        allow: config.allow_paths || ['/'],
        disallow: config.disallow_paths || [],
      },
      sitemap: config.sitemap_url || 'https://tps-site.com/sitemap.xml',
    }
  } catch (error) {
    console.error('Error generating robots.txt:', error)
    return defaultConfig
  }
}