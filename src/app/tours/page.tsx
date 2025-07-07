import { createClient } from '@/lib/supabase/server'
import { ToursGrid } from '@/components/tours/ToursGrid'
import type { Metadata } from 'next'

interface Experience {
  id: string
  title: string
  slug: string
  description: string
  short_description: string
  price: number
  rating: number
  review_count: number
  duration: string
  max_group_size: number
  main_image_url: string
  featured: boolean
  categories?: { name: string }
  cities?: { name: string }
}

// Server-side function to fetch tours
async function getTours(): Promise<Experience[]> {
  const supabase = await createClient()
  
  try {
    const { data } = await supabase
      .from('experiences')
      .select(`
        *,
        cities:city_id(name),
        categories:category_id(name)
      `)
      .eq('status', 'active')
      .order('featured', { ascending: false })
      .order('rating', { ascending: false })

    return data || []
  } catch (error) {
    console.error('Error fetching tours:', error)
    return []
  }
}

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Unforgettable Tours - TPS Site',
  description: 'Discover amazing tours and experiences in New Zealand. From boat cruises to scenic flights, find the perfect adventure in TPS Site.',
  keywords: 'tours, experiences, New Zealand, TPS Site, boat cruises, scenic flights, hiking, water sports',
  openGraph: {
    title: 'Unforgettable Tours - TPS Site',
    description: 'Discover amazing tours and experiences in New Zealand. From boat cruises to scenic flights, find the perfect adventure.',
    type: 'website',
    siteName: 'TPS Site',
    images: [{
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop',
      alt: 'TPS Site Tours'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unforgettable Tours - TPS Site',
    description: 'Discover amazing tours and experiences in New Zealand. From boat cruises to scenic flights, find the perfect adventure.',
    images: [{
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop',
      alt: 'TPS Site Tours'
    }]
  }
}

export default async function ToursPage() {
  const experiences = await getTours()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Unforgettable Tours
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto mb-8">
            Discover amazing tours and experiences in New Zealand
          </p>
        </div>
      </section>

      <ToursGrid experiences={experiences} />
    </div>
  )
}