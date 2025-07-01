'use client'

import { useState, useEffect } from 'react'
import { notFound, useParams } from 'next/navigation'
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
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase'

interface Product {
  id: string
  title: string
  slug: string
  description: string
  short_description: string
  price: number
  currency: string
  rating: number
  review_count: number
  duration: string
  max_group_size: number
  meeting_point: string
  cancellation_policy: string
  main_image_url: string
  featured: boolean
  bestseller: boolean
  status: string
  languages: string[]
  cities?: {
    name: string
  }
  categories?: {
    name: string
  }
}

export default function ExperiencePage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [travelers, setTravelers] = useState(2)
  const [selectedDate, setSelectedDate] = useState('')

  useEffect(() => {
    fetchProduct()
  }, [slug])

  async function fetchProduct() {
    const supabase = createClient()
    
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select(`
          *,
          cities(name),
          categories(name)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading experience...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  // Mock data for features not yet in database
  const mockImages = [
    product.main_image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=600&fit=crop'
  ]

  const mockHighlights = [
    'Professional guided experience',
    'Skip-the-line access where available',
    'Audio guide in multiple languages',
    'Small group experience',
    'Expert local knowledge',
    'Memorable photo opportunities'
  ]

  const mockIncludes = [
    'Professional tour guide',
    'Entry tickets (where applicable)',
    'Audio guide system',
    'Group coordination',
    'Safety briefing'
  ]

  const mockExcludes = [
    'Food and beverages',
    'Personal expenses',
    'Hotel pickup and drop-off',
    'Gratuities',
    'Travel insurance'
  ]

  const mockReviews = [
    {
      id: '1',
      name: 'Sarah Johnson',
      rating: 5,
      date: '2 days ago',
      comment: 'Amazing experience! Highly recommend this tour for anyone visiting the area.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Michael Chen',
      rating: 4,
      date: '1 week ago',
      comment: 'Great tour overall. The guide was very knowledgeable and friendly.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Emma Williams',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Perfect for first-time visitors. Well organized and informative.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Image Gallery */}
      <section className="h-96 lg:h-[500px] relative">
        <div className="grid grid-cols-4 gap-2 h-full">
          <div className="col-span-4 lg:col-span-2 relative">
            <Image
              src={mockImages[0]}
              alt={product.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="hidden lg:block col-span-1">
            <div className="grid grid-rows-2 gap-2 h-full">
              <div className="relative">
                <Image
                  src={mockImages[1]}
                  alt={product.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="relative">
                <Image
                  src={mockImages[2]}
                  alt={product.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
          <div className="hidden lg:block col-span-1">
            <div className="grid grid-rows-2 gap-2 h-full">
              <div className="relative">
                <Image
                  src={mockImages[3]}
                  alt={product.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="relative bg-black/50 rounded-lg flex items-center justify-center">
                <Button variant="secondary" size="sm">
                  View all photos
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button variant="secondary" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary">{product.categories?.name || 'Experience'}</Badge>
                <Badge variant="outline">{product.cities?.name || 'City'}</Badge>
                {product.featured && <Badge className="bg-blue-500">Featured</Badge>}
                {product.bestseller && <Badge className="bg-orange-500">Bestseller</Badge>}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.title}</h1>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating || 'New'}</span>
                  {product.review_count > 0 && <span>({product.review_count} reviews)</span>}
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{product.duration || 'Flexible duration'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Up to {product.max_group_size || 20} people</span>
                </div>
              </div>
              
              <p className="text-lg text-gray-700">{product.short_description}</p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="includes">Includes</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">About this experience</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Highlights</h3>
                    <ul className="space-y-2">
                      {mockHighlights.map((highlight, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {product.meeting_point && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Meeting point</h3>
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                        <span className="text-gray-700">{product.meeting_point}</span>
                      </div>
                    </div>
                  )}

                  {product.languages && product.languages.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Available Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.languages.map((language, index) => (
                          <Badge key={index} variant="outline">{language}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="includes" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-green-600">What's included</h3>
                    <ul className="space-y-2">
                      {mockIncludes.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-red-600">What's not included</h3>
                    <ul className="space-y-2">
                      {mockExcludes.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {product.cancellation_policy && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Cancellation Policy</h4>
                    <p className="text-blue-800 text-sm">{product.cancellation_policy}</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="text-3xl font-bold">{product.rating || 'New'}</div>
                    <div>
                      <div className="flex items-center space-x-1 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= (product.rating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        {product.review_count > 0 
                          ? `Based on ${product.review_count} reviews`
                          : 'No reviews yet'
                        }
                      </div>
                    </div>
                  </div>
                  
                  {product.review_count > 0 ? (
                    <div className="space-y-4">
                      {mockReviews.map((review) => (
                        <div key={review.id} className="border-b pb-4">
                          <div className="flex items-start space-x-3">
                            <Image
                              src={review.avatar}
                              alt={review.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium">{review.name}</span>
                                <div className="flex items-center space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= review.rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No reviews yet. Be the first to review this experience!</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">
                    {product.currency === 'USD' ? '$' : product.currency}{product.price}
                  </span>
                  <span className="text-gray-600">per person</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select date</label>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Choose date
                  </Button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Number of travelers</label>
                  <div className="flex items-center justify-between border rounded-md px-3 py-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      disabled={travelers <= 1}
                    >
                      -
                    </Button>
                    <span>{travelers} {travelers === 1 ? 'person' : 'people'}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setTravelers(Math.min(product.max_group_size || 20, travelers + 1))}
                      disabled={travelers >= (product.max_group_size || 20)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{travelers} × {product.currency === 'USD' ? '$' : product.currency}{product.price}</span>
                    <span>{product.currency === 'USD' ? '$' : product.currency}{product.price * travelers}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{product.currency === 'USD' ? '$' : product.currency}{product.price * travelers}</span>
                  </div>
                </div>
                
                <Link href={`/checkout?product=${product.id}&travelers=${travelers}${selectedDate ? `&date=${selectedDate}` : ''}`}>
                  <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                    Book Now
                  </Button>
                </Link>
                
                <div className="text-center text-sm text-gray-600">
                  {product.cancellation_policy || 'Free cancellation available'}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}