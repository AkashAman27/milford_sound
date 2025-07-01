'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase'

interface Testimonial {
  id: string
  customer_name: string
  customer_location: string
  customer_avatar: string
  rating: number
  review_text: string
  experience_name: string
}

interface HomepageStat {
  id: string
  label: string
  value: number
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [stats, setStats] = useState<HomepageStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      
      // Fetch testimonials
      const { data: testimonialsData } = await supabase
        .from('testimonials')
        .select('*')
        .eq('featured', true)
        .order('sort_order')
        .limit(6)

      // Fetch homepage stats
      const { data: statsData } = await supabase
        .from('homepage_stats')
        .select('*')
        .limit(4)

      if (testimonialsData) setTestimonials(testimonialsData)
      if (statsData) setStats(statsData)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading testimonials...</div>
        </div>
      </section>
    )
  }
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Loved by travelers worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join millions of happy travelers who trust Milford Sound for their best experiences
          </p>
          <div className="flex items-center justify-center mt-6 space-x-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-5 w-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-lg font-semibold">4.8</span>
            <span className="text-gray-600">based on 50,000+ reviews</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className={`hover:shadow-lg transition-all duration-300 ${
                index === 2 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Quote className="h-8 w-8 text-primary opacity-50" />
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= testimonial.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.review_text}"
                </p>
                
                <div className="flex items-center space-x-3">
                  <Image
                    src={testimonial.customer_avatar}
                    alt={testimonial.customer_name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.customer_name}</p>
                    <p className="text-sm text-gray-600">{testimonial.customer_location}</p>
                    <p className="text-xs text-primary font-medium mt-1">
                      {testimonial.experience_name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {stat.label === 'Average Rating' ? `${stat.value}/5` : 
                 stat.value >= 1000000 ? `${(stat.value / 1000000).toFixed(0)}M+` :
                 stat.value >= 1000 ? `${(stat.value / 1000).toFixed(0)}K+` :
                 stat.value.toString()}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}