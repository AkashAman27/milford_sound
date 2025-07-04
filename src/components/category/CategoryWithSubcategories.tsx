'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Filter, Grid, List, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Subcategory {
  id: string
  name: string
  slug: string
  experience_count: number
  sort_order: number
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  experience_count: number
  subcategories: Subcategory[]
}

interface Experience {
  id: string
  title: string
  slug: string
  image_url: string
  short_description: string
  price: number
  featured: boolean
  published: boolean
}

interface CategoryWithSubcategoriesProps {
  category: Category
  experiences: Experience[]
}

export function CategoryWithSubcategories({ category, experiences }: CategoryWithSubcategoriesProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredExperiences = selectedSubcategory === 'all' 
    ? experiences 
    : experiences.filter(exp => 
        exp.subcategories?.slug === selectedSubcategory
      )

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-80 lg:h-96">
        {category.image_url ? (
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">{category.name}</h1>
            <p className="text-lg lg:text-xl max-w-2xl mb-4">{category.description}</p>
            <p className="text-lg">{category.experience_count} experiences available</p>
          </div>
        </div>
      </section>

      {/* Subcategory Filter Pills */}
      <section className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedSubcategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSubcategory('all')}
              className="rounded-full"
            >
              All {category.name}
              <Badge variant="secondary" className="ml-2">
                {category.experience_count}
              </Badge>
            </Button>
            
            {category.subcategories
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((subcategory) => (
                <Button
                  key={subcategory.id}
                  variant={selectedSubcategory === subcategory.slug ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSubcategory(subcategory.slug)}
                  className="rounded-full"
                >
                  {subcategory.name}
                  <Badge variant="secondary" className="ml-2">
                    {subcategory.experience_count}
                  </Badge>
                </Button>
              ))
            }
          </div>
        </div>
      </section>

      {/* Filters and Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                className="md:hidden"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>

              <div className="hidden md:flex items-center space-x-4">
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-50">$0 - $50</SelectItem>
                    <SelectItem value="50-100">$50 - $100</SelectItem>
                    <SelectItem value="100-200">$100 - $200</SelectItem>
                    <SelectItem value="200+">$200+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 md:mr-4">
                Showing {filteredExperiences.length} of {category.experience_count} experiences
              </p>
              
              <div className="flex border rounded-md">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                  size="sm" 
                  className="border-r rounded-r-none"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'ghost'} 
                  size="sm" 
                  className="rounded-l-none"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="md:hidden bg-gray-50 p-4 rounded-lg mb-6">
              <div className="space-y-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-50">$0 - $50</SelectItem>
                    <SelectItem value="50-100">$50 - $100</SelectItem>
                    <SelectItem value="100-200">$100 - $200</SelectItem>
                    <SelectItem value="200+">$200+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Experiences Grid/List */}
          {filteredExperiences.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No experiences found</h3>
              <p className="text-gray-600">
                {selectedSubcategory === 'all' 
                  ? `No experiences available in ${category.name} yet.`
                  : `No experiences found in the selected subcategory. Try selecting a different filter.`
                }
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
            }>
              {filteredExperiences.map((experience) => (
                <ExperienceCard 
                  key={experience.id} 
                  experience={experience} 
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}

          {/* Load More */}
          {filteredExperiences.length > 0 && (
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

interface ExperienceCardProps {
  experience: Experience
  viewMode: 'grid' | 'list'
}

function ExperienceCard({ experience, viewMode }: ExperienceCardProps) {
  if (viewMode === 'list') {
    return (
      <Link href={`/tour/${experience.slug}`}>
        <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
          <CardContent className="p-0">
            <div className="flex">
              <div className="relative w-48 h-32 flex-shrink-0">
                {experience.image_url ? (
                  <Image
                    src={experience.image_url}
                    alt={experience.title}
                    fill
                    className="object-cover rounded-l-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-l-lg flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No image</span>
                  </div>
                )}
                {experience.featured && (
                  <Badge className="absolute top-2 left-2 bg-primary">
                    Featured
                  </Badge>
                )}
              </div>
              <div className="flex-1 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {experience.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {experience.short_description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    ${experience.price}
                  </span>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/tour/${experience.slug}`}>
      <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        <CardContent className="p-0">
          <div className="relative h-48 overflow-hidden">
            {experience.image_url ? (
              <Image
                src={experience.image_url}
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
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-yellow-300 transition-colors">
                {experience.title}
              </h3>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {experience.short_description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">
                ${experience.price}
              </span>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}