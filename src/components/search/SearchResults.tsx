'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Filter, Grid, List, MapPin, Clock, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ProductCard } from '@/components/products/ProductCard'
import { SearchBox } from '@/components/search/SearchBox'
import { createClient } from '@/lib/supabase'

interface SearchResult {
  id: string
  type: 'experience' | 'category'
  title: string
  subtitle?: string
  slug: string
  image?: string
  rating?: number
  price?: number
  description?: string
  city?: string
  duration?: string
  maxGroupSize?: number
  featured?: boolean
  shortDescription?: string
}


export function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([])
  const [sortBy, setSortBy] = useState('relevance')
  const [filterBy, setFilterBy] = useState('all')
  const [priceRange, setPriceRange] = useState('all')

  useEffect(() => {
    const searchItems = async () => {
      if (!query.trim()) {
        setSearchResults([])
        setLoading(false)
        return
      }

      setLoading(true)
      
      try {
        const supabase = createClient()
        const results: SearchResult[] = []

        // Search experiences/tours with more detailed fields
        const { data: experiences, error: experiencesError } = await supabase
          .from('experiences')
          .select(`
            id, 
            title, 
            slug, 
            short_description, 
            description,
            price, 
            currency, 
            rating, 
            main_image_url, 
            duration,
            max_group_size,
            featured,
            cities(name),
            categories(name)
          `)
          .eq('status', 'active')
          .or(`title.ilike.%${query}%, short_description.ilike.%${query}%, description.ilike.%${query}%`)
          .limit(20)

        if (experiencesError) {
          console.error('Error searching experiences:', experiencesError)
        } else if (experiences) {
          experiences.forEach(exp => {
            results.push({
              id: exp.id,
              type: 'experience',
              title: exp.title,
              subtitle: exp.cities?.name || 'Milford Sound',
              slug: exp.slug,
              image: exp.main_image_url,
              rating: exp.rating || undefined,
              price: exp.price || undefined,
              city: exp.cities?.name || 'Milford Sound',
              duration: exp.duration || undefined,
              maxGroupSize: exp.max_group_size || undefined,
              featured: exp.featured || false,
              shortDescription: exp.short_description || exp.description?.substring(0, 100) + '...'
            })
          })
        }

        setSearchResults(results)
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setLoading(false)
      }
    }

    searchItems()
  }, [query])

  useEffect(() => {
    let results = [...searchResults]

    // Apply filters
    if (filterBy !== 'all') {
      results = results.filter(item => item.type === filterBy)
    }

    if (priceRange !== 'all') {
      switch (priceRange) {
        case '0-25':
          results = results.filter(item => item.price && item.price <= 25)
          break
        case '25-50':
          results = results.filter(item => item.price && item.price > 25 && item.price <= 50)
          break
        case '50-100':
          results = results.filter(item => item.price && item.price > 50 && item.price <= 100)
          break
        case '100+':
          results = results.filter(item => item.price && item.price > 100)
          break
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price-high':
        results.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case 'rating':
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'popular':
        results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
      default:
        // Keep original order for relevance
        break
    }

    setFilteredResults(results)
  }, [searchResults, sortBy, filterBy, priceRange])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="h-48 bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {query ? `Search results for "${query}"` : 'Search Results'}
        </h1>
        
        
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'} found
            {query && ` for "${query}"`}
          </p>
          
          {query && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <span>"{query}"</span>
                <button
                  onClick={() => window.history.pushState({}, '', '/search')}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Results</SelectItem>
              <SelectItem value="experience">Experiences</SelectItem>
              <SelectItem value="category">Categories</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priceRange} onValueChange={setPriceRange}>
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
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Most Relevant</SelectItem>
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
      {filteredResults.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button variant="outline" onClick={() => {
            setFilterBy('all')
            setPriceRange('all')
            setSortBy('relevance')
          }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map((result) => {
            if (result.type === 'experience') {
              return (
                <ProductCard
                  key={result.id}
                  id={result.id}
                  title={result.title}
                  slug={result.slug}
                  image={result.image || ''}
                  price={result.price || 0}
                  rating={result.rating}
                  reviewCount={Math.floor(Math.random() * 3000) + 100} // Mock review count
                  duration={result.duration}
                  maxGroupSize={result.maxGroupSize}
                  city={result.city || ''}
                  featured={result.featured}
                  shortDescription={result.shortDescription}
                />
              )
            }
            
            // For categories, show simplified cards
            return (
              <div key={result.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <Clock className="h-5 w-5 text-green-500 mr-2" />
                    <Badge variant="outline" className="text-xs">
                      Category
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{result.title}</h3>
                  {result.subtitle && (
                    <p className="text-gray-600 text-sm mb-3">{result.subtitle}</p>
                  )}
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      const url = `/category/${result.slug}`
                      window.location.href = url
                    }}
                  >
                    Explore
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Load More */}
      {filteredResults.length > 0 && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Results
          </Button>
        </div>
      )}
    </div>
  )
}