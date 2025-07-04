import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ConditionalHeader } from '@/components/layout/ConditionalHeader'
import { ConditionalFooter } from '@/components/layout/ConditionalFooter'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { CartProvider } from '@/components/providers/CartProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Milford Sound - Tours, Activities & Experiences',
  description: 'Book the best tours, activities and experiences around the world',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
      </body>
    </html>
  )
}