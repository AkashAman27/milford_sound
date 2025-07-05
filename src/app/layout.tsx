import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ConditionalHeader } from '@/components/layout/ConditionalHeader'
import { ConditionalFooter } from '@/components/layout/ConditionalFooter'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { CartProvider } from '@/components/providers/CartProvider'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Milford Sound - Tours, Activities & Experiences',
  description: 'Book the best tours, activities and experiences around the world. Discover unforgettable adventures in New Zealand\'s most stunning destinations.',
  keywords: 'tours, activities, experiences, travel, New Zealand, Milford Sound, adventures, booking',
  authors: [{ name: 'Milford Sound' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Milford Sound - Tours, Activities & Experiences',
    description: 'Book the best tours, activities and experiences around the world',
    type: 'website',
    siteName: 'Milford Sound',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Milford Sound - Tours, Activities & Experiences',
    description: 'Book the best tours, activities and experiences around the world',
  },
  alternates: {
    canonical: '/',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Milford Sound',
    description: 'Book the best tours, activities and experiences around the world',
    url: 'https://milford-sound.com',
    sameAs: [
      'https://www.facebook.com/milfordsound',
      'https://www.instagram.com/milfordsound',
      'https://twitter.com/milfordsound'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+64-1-234-5678',
      contactType: 'Customer Service'
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NZ'
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'NZD',
      availability: 'https://schema.org/InStock'
    }
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <div className="min-h-screen flex flex-col">
                <ConditionalHeader />
                <main className="flex-1">
                  {children}
                </main>
                <ConditionalFooter />
              </div>
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}