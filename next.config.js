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
  },
  serverExternalPackages: ['@supabase/supabase-js'],
}

module.exports = nextConfig