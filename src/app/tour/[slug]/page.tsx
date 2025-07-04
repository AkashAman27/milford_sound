'use client'

import { useState, useEffect } from 'react'
import { notFound, useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Star, 
  Clock, 
  Users, 
  MapPin, 
  Calendar,
  Check,
  X,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase'
import { SEOHead } from '@/components/seo/SEOHead'
import { generateExperienceStructuredData } from '@/components/seo/structuredData'
import { InternalLinksSection } from '@/components/experience/InternalLinksSection'

interface Product {
  id: string
  title: string
  slug: string
  description: string
  short_description: string
  price: number
  original_price: number
  currency: string
  duration: string
  duration_hours: number
  max_group_size: number
  min_age: number
  meeting_point: string
  cancellation_policy: string
  languages: string[]
  main_image_url: string
  featured: boolean
  bestseller: boolean
  status: string
  rating: number
  review_count: number
  booking_count: number
  sort_order: number
  created_at: string
  updated_at: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  canonical_url?: string
  robots_index?: boolean
  robots_follow?: boolean
  robots_nosnippet?: boolean
  og_title?: string
  og_description?: string
  og_image?: string
  og_image_alt?: string
  twitter_title?: string
  twitter_description?: string
  twitter_image?: string
  twitter_image_alt?: string
  structured_data_type?: string
  focus_keyword?: string
  highlights?: string[]
  availability_url?: string
  cities?: { name: string }
  categories?: { name: string }
}


export default function TourPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetchProduct()
    }
  }, [slug])

  const fetchProduct = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('experiences')
        .select(`
          *,
          cities:city_id(name),
          categories:category_id(name)
        `)
        .eq('slug', slug)
        .eq('status', 'active')
        .single()

      if (error || !data) {
        notFound()
        return
      }

      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  const handleCheckAvailability = () => {
    if (product?.availability_url) {
      window.open(product.availability_url, '_blank')
    } else {
      alert('Availability booking is currently unavailable')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    notFound()
    return null
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://milford-sound.com'
  const currentUrl = `${siteUrl}/tour/${product.slug}`
  const seoTitle = product.seo_title || `${product.title} - Milford Sound`
  const seoDescription = product.seo_description || product.short_description || product.description.substring(0, 160)

  const structuredData = generateExperienceStructuredData({
    id: product.id,
    title: product.title,
    description: product.description,
    slug: product.slug,
    price: product.price,
    currency: product.currency,
    rating: product.rating,
    review_count: product.review_count,
    duration: product.duration,
    category: product.categories?.name || 'Experience',
    location: product.cities?.name || 'Unknown',
    image_url: product.main_image_url || ''
  }, siteUrl)

  // Get highlights from product data or fallback to default
  const getHighlights = () => {
    if (product?.highlights && Array.isArray(product.highlights) && product.highlights.length > 0) {
      return product.highlights
    }
    return [
      'Professional guided experience',
      'Skip-the-line access where available',
      'Audio guide in multiple languages',
      'Small group experience',
      'Expert local knowledge',
      'Memorable photo opportunities'
    ]
  }

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonical={product.canonical_url || currentUrl}
        robots={{
          index: product.robots_index ?? true,
          follow: product.robots_follow ?? true,
          nosnippet: product.robots_nosnippet ?? false
        }}
        openGraph={{
          title: product.og_title || seoTitle,
          description: product.og_description || seoDescription,
          image: product.og_image || product.main_image_url,
          imageAlt: product.og_image_alt || `${product.title} image`,
          type: 'product',
          url: currentUrl
        }}
        twitter={{
          card: 'summary_large_image',
          title: product.twitter_title || product.og_title || seoTitle,
          description: product.twitter_description || product.og_description || seoDescription,
          image: product.twitter_image || product.og_image || product.main_image_url,
          imageAlt: product.twitter_image_alt || product.og_image_alt || `${product.title} image`
        }}
        structuredData={structuredData}
        lastModified={product.updated_at}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded"></div>
                <span className="text-xl font-bold">Milford Sound</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/destinations" className="text-gray-600 hover:text-gray-900">Destinations</Link>
                <Link href="/tours" className="text-gray-600 hover:text-gray-900">Tours</Link>
                <Link href="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link>
                <Link href="/help" className="text-gray-600 hover:text-gray-900">Help</Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <Link href="/tours" className="hover:text-gray-900">Tours</Link>
            <span>/</span>
            <span className="text-gray-900">{product.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Hero Image */}
              <div className="relative h-96 rounded-lg overflow-hidden mb-6">
                <Image
                  src={product.main_image_url}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                {product.featured && (
                  <Badge className="absolute top-4 left-4 bg-purple-600">Featured</Badge>
                )}
                {product.bestseller && (
                  <Badge className="absolute top-4 right-4 bg-orange-500">Bestseller</Badge>
                )}
              </div>

              {/* Title and Basic Info */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    {product.categories?.name || 'Tours & Attractions'}
                  </Badge>
                  <Badge variant="outline">{product.cities?.name}</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">Featured</Badge>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="font-medium">{product.rating}</span>
                    <span className="ml-1">({product.review_count} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{product.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Up to {product.max_group_size} people</span>
                  </div>
                </div>

                <p className="text-gray-600 text-lg mb-6">{product.short_description}</p>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="mb-8">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="includes">Includes</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">About this tour</h3>
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Highlights</h3>
                    <ul className="space-y-2">
                      {getHighlights().map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Meeting point</h3>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{product.meeting_point}</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="includes" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">What's included</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Entry tickets</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Professional guide</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Audio guide (multiple languages)</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">What's not included</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Transportation to meeting point</span>
                      </li>
                      <li className="flex items-start">
                        <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Food and drinks</span>
                      </li>
                      <li className="flex items-start">
                        <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Gratuities</span>
                      </li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="reviews">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Reviews</h3>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 mr-1" />
                        <span className="font-medium">{product.rating}</span>
                        <span className="text-gray-600 ml-1">({product.review_count} reviews)</span>
                      </div>
                    </div>
                    <p className="text-gray-600">Reviews will be displayed here...</p>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Internal Links Section */}
              <InternalLinksSection 
                experienceId={product.id} 
                className="mt-8"
              />
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">per person</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={handleCheckAvailability}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Check Availability
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    Free cancellation available
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                    <p className="font-medium mb-1">What's included:</p>
                    <ul className="space-y-1">
                      <li>• Entry tickets</li>
                      <li>• Professional guide</li>
                      <li>• Audio guide (multiple languages)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}