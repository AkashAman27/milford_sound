import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Clock, MapPin, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
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
  cities?: { name: string }
  categories?: { name: string }
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  experience_count: number
}

// Server-side function to fetch category
async function getCategory(slug: string): Promise<Category | null> {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

// Server-side function to fetch experiences by category
async function getExperiencesByCategory(categoryId: string): Promise<Experience[]> {
  const supabase = await createClient()
  
  try {
    const { data } = await supabase
      .from('experiences')
      .select(`
        *,
        cities:city_id(name),
        categories:category_id(name)
      `)
      .eq('category_id', categoryId)
      .eq('status', 'active')
      .order('featured', { ascending: false })
      .order('rating', { ascending: false })

    return data || []
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    }
  }

  return {
    title: `${category.name} Tours - Milford Sound`,
    description: category.description || `Discover the best ${category.name.toLowerCase()} tours and experiences in Milford Sound, New Zealand.`,
    keywords: `${category.name.toLowerCase()}, tours, experiences, Milford Sound, New Zealand`,
    openGraph: {
      title: `${category.name} Tours - Milford Sound`,
      description: category.description || `Discover the best ${category.name.toLowerCase()} tours and experiences in Milford Sound.`,
      type: 'website',
      siteName: 'Milford Sound'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} Tours - Milford Sound`,
      description: category.description || `Discover the best ${category.name.toLowerCase()} tours and experiences in Milford Sound.`
    }
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await getCategory(slug)
  
  if (!category) {
    notFound()
  }

  const experiences = await getExperiencesByCategory(category.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            {category.name} Tours
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto mb-8">
            {category.description || `Discover amazing ${category.name.toLowerCase()} experiences in Milford Sound`}
          </p>
          <div className="text-lg">
            {experiences.length} tour{experiences.length !== 1 ? 's' : ''} available
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/tours" className="hover:text-gray-900">Tours</Link>
          <span>/</span>
          <span className="text-gray-900">{category.name}</span>
        </div>
      </div>

      {/* Experiences Grid */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          {experiences.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-xl mb-4">No tours found in this category</p>
              <p className="text-gray-400 mb-6">Check back later for new tours or explore other categories</p>
              <Link 
                href="/tours" 
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Browse All Tours
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {experiences.map((experience) => (
                <Link key={experience.id} href={`/tour/${experience.slug}`}>
                  <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                    <CardContent className="p-0">
                      <div className="relative h-48 overflow-hidden">
                        {experience.main_image_url ? (
                          <Image
                            src={experience.main_image_url}
                            alt={experience.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">No image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        {experience.featured && (
                          <Badge className="absolute top-3 left-3 bg-primary">
                            Featured
                          </Badge>
                        )}
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="bg-white/90 text-gray-900">
                            ${experience.price}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-sm text-gray-600">{experience.cities?.name || 'Milford Sound'}</span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {experience.title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {experience.short_description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{experience.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>Up to {experience.max_group_size}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                              <span className="text-sm font-medium">{experience.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500 ml-1">
                              ({experience.review_count} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}