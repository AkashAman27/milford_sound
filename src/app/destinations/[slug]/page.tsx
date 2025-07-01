'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Filter, Grid, List, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProductCard } from '@/components/products/ProductCard'
import { createClient } from '@/lib/supabase'

interface CityPageProps {
  params: {
    slug: string
  }
}

interface City {
  id: string
  name: string
  country: string
  slug: string
  description: string
  image_url: string
  featured: boolean
}

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

export default function CityPage({ params }: CityPageProps) {
  const [city, setCity] = useState<City | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [experienceCount, setExperienceCount] = useState(0)

  useEffect(() => {
    fetchCityData()
  }, [params.slug])

  async function fetchCityData() {
    const supabase = createClient()
    
    try {
      // Fetch city data
      const { data: cityData, error: cityError } = await supabase
        .from('cities')
        .select('*')
        .eq('slug', params.slug)
        .single()

      if (cityError || !cityData) {
        notFound()
        return
      }

      setCity(cityData)

      // Fetch products for this city
      const { data: productsData, error: productsError } = await supabase
        .from('experiences')
        .select('*')
        .eq('city_id', cityData.id)
        .eq('status', 'active')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (productsData) {
        // Map Supabase data to component format
        const mappedProducts = productsData.map((product: any) => ({
          id: product.id,
          title: product.title,
          slug: product.slug,
          image: product.main_image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
          price: product.price || 0,
          rating: product.rating || 0,
          reviewCount: product.review_count || 0,
          duration: product.duration || 'N/A',
          maxGroupSize: product.max_group_size || 0,
          city: cityData.name,
          featured: product.featured,
          shortDescription: product.short_description || product.description || 'Experience description'
        }))
        setProducts(mappedProducts)
        setExperienceCount(mappedProducts.length)
      }

      if (productsError) {
        console.error('Error fetching products:', productsError)
      }

    } catch (error) {
      console.error('Error fetching city data:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading city information...</p>
        </div>
      </div>
    )
  }

  if (!city) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-80 lg:h-96">
        <Image
          src={city.image_url || 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&h=400&fit=crop'}
          alt={city.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{city.country}</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">{city.name}</h1>
            <p className="text-lg lg:text-xl max-w-2xl mb-4">
              {city.description || `Discover amazing experiences in ${city.name}, ${city.country}`}
            </p>
            <p className="text-lg">{experienceCount} experiences available</p>
          </div>
        </div>
      </section>

      {/* Filters and Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="attractions">Attractions</SelectItem>
                  <SelectItem value="museums">Museums</SelectItem>
                  <SelectItem value="food">Food & Drinks</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-25">$0 - $25</SelectItem>
                  <SelectItem value="25-50">$25 - $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100+">$100+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button variant="ghost" size="sm" className="border-r rounded-r-none">
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-l-none">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {products.length} experiences in {city.name}
            </p>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No experiences available in {city.name} at the moment.</p>
              <p className="text-sm text-gray-500">Check back soon for new experiences!</p>
            </div>
          )}

          {/* Load More - Only show if there are products and potentially more to load */}
          {products.length > 0 && products.length >= 9 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Experiences
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}