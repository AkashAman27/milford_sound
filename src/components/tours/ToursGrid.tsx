'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Clock, MapPin, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchAndFilter } from './SearchAndFilter'

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

interface ToursGridProps {
  experiences: Experience[]
}

export function ToursGrid({ experiences }: ToursGridProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredExperiences = experiences.filter(experience => {
    const matchesSearch = experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         experience.short_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (experience.cities?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    const matchesCategory = selectedCategory === 'all' || 
                           experience.categories?.name?.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '') === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <SearchAndFilter
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
      />

      {/* Experiences Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {filteredExperiences.length} Tours Found
            </h2>
            <p className="text-gray-600">
              Showing {selectedCategory === 'all' ? 'all' : selectedCategory} tours
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>

          {filteredExperiences.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-xl mb-4">No tours found</p>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredExperiences.map((experience) => (
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
                          <Badge variant="outline" className="text-xs">
                            {experience.categories?.name || 'Tour'}
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
    </>
  )
}