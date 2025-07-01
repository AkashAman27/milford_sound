'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Clock, MapPin, Users, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase'

interface Experience {
  id: string
  title: string
  slug: string
  description: string
  location: string
  duration: string
  price: number
  rating: number
  review_count: number
  category: string
  image_url: string
  featured: boolean
  max_participants: number
}

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    async function fetchExperiences() {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('featured', { ascending: false })
        .order('rating', { ascending: false })

      if (data) {
        setExperiences(data)
      }
      setLoading(false)
    }

    fetchExperiences()
  }, [])

  const categories = [
    { value: 'all', label: 'All Experiences' },
    { value: 'tours', label: 'Tours' },
    { value: 'attractions', label: 'Attractions' },
    { value: 'activities', label: 'Activities' },
    { value: 'food', label: 'Food & Drink' },
    { value: 'entertainment', label: 'Entertainment' }
  ]

  const filteredExperiences = experiences.filter(experience => {
    const matchesSearch = experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         experience.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || experience.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Unforgettable Experiences
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto mb-8">
            Discover amazing tours, attractions, and activities around the world
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search experiences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-4 pr-4 text-gray-900 bg-white border-0 rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="text-sm"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {filteredExperiences.length} Experiences Found
            </h2>
            <p className="text-gray-600">
              Showing {selectedCategory === 'all' ? 'all' : selectedCategory} experiences
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>

          {filteredExperiences.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-xl mb-4">No experiences found</p>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredExperiences.map((experience) => (
                <Link key={experience.id} href={`/experience/${experience.slug}`}>
                  <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                    <CardContent className="p-0">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={experience.image_url}
                          alt={experience.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
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
                          <span className="text-sm text-gray-600">{experience.location}</span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {experience.title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {experience.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{experience.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>Up to {experience.max_participants}</span>
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
                          <Badge variant="outline" className="text-xs">
                            {experience.category}
                          </Badge>
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