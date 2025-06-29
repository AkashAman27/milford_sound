'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/products/ProductCard'
import { createClient } from '@/lib/supabase'

interface Product {
  id: string
  title: string
  slug: string
  image: string
  price: number
  rating: number
  reviewCount: number
  duration: string
  maxGroupSize: number
  city: string
  featured: boolean
  shortDescription: string
}

export function FeaturedExperiences() {
  const [featuredExperiences, setFeaturedExperiences] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedExperiences() {
      const supabase = createClient()
      
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6)

      if (data) {
        // Map Supabase data to component format
        const mappedData = data.map((product: any) => ({
          id: product.id,
          title: product.title,
          slug: product.slug,
          image: product.main_image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
          price: product.price || 0,
          rating: product.rating || 0,
          reviewCount: product.review_count || 0,
          duration: product.duration || 'N/A',
          maxGroupSize: product.max_group_size || 0,
          city: product.city || 'Unknown',
          featured: product.featured,
          shortDescription: product.short_description || product.description || 'Experience description'
        }))
        setFeaturedExperiences(mappedData)
      }
      setLoading(false)
    }

    fetchFeaturedExperiences()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading experiences...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Top Experiences
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the most popular tours and activities loved by travelers worldwide
          </p>
        </div>

        {featuredExperiences.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredExperiences.map((experience) => (
              <ProductCard key={experience.id} {...experience} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No featured experiences available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}