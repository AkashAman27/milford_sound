/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'evkmwnjywmydfeamvctl.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avknwnjywmyydfemnvcl.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
    loader: 'default',
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
  },
  serverExternalPackages: ['@supabase/supabase-js'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dropdown-menu', '@radix-ui/react-dialog', '@radix-ui/react-select'],
    optimizeCss: true,
    scrollRestoration: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async redirects() {
    // Static redirects
    const staticRedirects = [
      {
        source: '/blog',
        destination: '/travel-guide',
        permanent: true,
      },
      {
        source: '/blog/:slug*',
        destination: '/travel-guide/:slug*',
        permanent: true,
      },
    ]

    // Dynamic redirects from database
    let dynamicRedirects = []
    try {
      const { createClient } = require('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )

      const { data: redirects } = await supabase
        .from('slug_redirects')
        .select('old_slug, new_slug, content_type, permanent')

      if (redirects) {
        dynamicRedirects = redirects.map(redirect => {
          const getBasePath = (contentType) => {
            switch (contentType) {
              case 'blog_posts': return '/travel-guide'
              case 'experiences': return '/tour'
              case 'categories': return '/category'
              default: return ''
            }
          }

          const basePath = getBasePath(redirect.content_type)
          
          return {
            source: `${basePath}/${redirect.old_slug}`,
            destination: `${basePath}/${redirect.new_slug}`,
            permanent: redirect.permanent || true,
          }
        })
      }
    } catch (error) {
      console.warn('Failed to fetch dynamic redirects:', error.message)
    }

    return [...staticRedirects, ...dynamicRedirects]
  },
}

module.exports = nextConfig