'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Calendar, Clock, Star } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
}

interface SearchBoxProps {
  placeholder?: string
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SearchBox({ 
  placeholder = "Search tours & experiences", 
  showIcon = true, 
  size = 'md',
  className = '' 
}: SearchBoxProps) {
  const [open, setOpen] = useState(false)
  const [dropdownRef, setDropdownRef] = useState<HTMLDivElement | null>(null)
  const [value, setValue] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [popularSuggestions, setPopularSuggestions] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Fetch popular suggestions only when dropdown opens
  const fetchPopularSuggestions = useCallback(async () => {
    if (popularSuggestions.length > 0) return // Don't fetch if already loaded
    
    try {
      const supabase = createClient()
      const suggestions: SearchResult[] = []

      // Get featured/popular experiences
      const { data: experiences } = await supabase
        .from('experiences')
        .select('id, title, slug, short_description, price, rating, main_image_url, cities(name), categories(name)')
        .eq('status', 'active')
        .eq('featured', true)
        .limit(4)

      if (experiences) {
        experiences.forEach(exp => {
          suggestions.push({
            id: exp.id,
            type: 'experience',
            title: exp.title,
            subtitle: exp.cities?.name || exp.categories?.name || 'Milford Sound',
            slug: exp.slug,
            image: exp.main_image_url,
            rating: exp.rating || undefined,
            price: exp.price || undefined
          })
        })
      }

      // Get popular categories
      const { data: categories } = await supabase
        .from('categories')
        .select('id, name, slug, experience_count')
        .order('experience_count', { ascending: false })
        .limit(3)

      if (categories) {
        categories.forEach(cat => {
          suggestions.push({
            id: cat.id,
            type: 'category',
            title: cat.name,
            subtitle: `${cat.experience_count || 0} tours`,
            slug: cat.slug
          })
        })
      }

      setPopularSuggestions(suggestions)
    } catch (error) {
      console.error('Error fetching popular suggestions:', error)
    }
  }, [popularSuggestions.length])

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, dropdownRef])

  const searchItems = useCallback(
    async (query: string) => {
      if (!query.trim() || query.length < 2) {
        setSearchResults([])
        return
      }

      setLoading(true)
      
      try {
        const supabase = createClient()
        const results: SearchResult[] = []

        // Search experiences/tours with minimal fields for performance
        const { data: experiences, error: experiencesError } = await supabase
          .from('experiences')
          .select('id, title, slug, price, rating, cities(name), categories(name)')
          .eq('status', 'active')
          .ilike('title', `%${query}%`)
          .limit(5) // Reduced limit for performance

        if (experiencesError) {
          console.error('Error searching experiences:', experiencesError)
        } else if (experiences) {
          experiences.forEach(exp => {
            results.push({
              id: exp.id,
              type: 'experience',
              title: exp.title,
              subtitle: exp.cities?.name || exp.categories?.name || 'Milford Sound',
              slug: exp.slug,
              rating: exp.rating || undefined,
              price: exp.price || undefined
            })
          })
        }

        // Search categories with smaller limit
        const { data: categories, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name, slug, experience_count')
          .ilike('name', `%${query}%`)
          .limit(3) // Reduced limit for performance

        if (categoriesError) {
          console.error('Error searching categories:', categoriesError)
        } else if (categories) {
          categories.forEach(cat => {
            results.push({
              id: cat.id,
              type: 'category',
              title: cat.name,
              subtitle: `${cat.experience_count || 0} tours`,
              slug: cat.slug
            })
          })
        }

        // Sort results: experiences first, then categories
        results.sort((a, b) => {
          if (a.type === 'experience' && b.type === 'category') return -1
          if (a.type === 'category' && b.type === 'experience') return 1
          return 0
        })

        setSearchResults(results.slice(0, 6)) // Reduced total results
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (value.trim() && value.length >= 2) {
        searchItems(value.trim())
      } else {
        setSearchResults([])
      }
    }, 400) // Increased debounce to 400ms

    return () => clearTimeout(debounceTimer)
  }, [value, searchItems])

  const handleSelect = (result: SearchResult) => {
    setValue('')
    setOpen(false)
    
    console.log('Navigating to:', result.type, result.slug)
    
    switch (result.type) {
      case 'category':
        router.push(`/category/${result.slug}`)
        break
      case 'experience':
        // Navigate to tour page (main route for experiences)
        router.push(`/tour/${result.slug}`)
        break
    }
  }

  const handleSearch = () => {
    if (value.trim()) {
      setOpen(false)
      router.push(`/search?q=${encodeURIComponent(value)}`)
    }
  }

  const getResultIcon = useCallback((type: string) => {
    switch (type) {
      case 'category':
        return <Calendar className="h-4 w-4 text-green-500" />
      case 'experience':
        return <Clock className="h-4 w-4 text-purple-500" />
      default:
        return <Search className="h-4 w-4 text-gray-500" />
    }
  }, [])

  const inputSizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10',
    lg: 'h-12 text-lg'
  }

  return (
    <div className={`relative ${className}`} ref={setDropdownRef}>
      {showIcon && (
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => {
          setOpen(true)
          fetchPopularSuggestions()
        }}
        onClick={() => {
          setOpen(true)
          fetchPopularSuggestions()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch()
          }
          if (e.key === 'Escape') {
            setOpen(false)
          }
        }}
        className={`w-full ${showIcon ? 'pl-10' : 'pl-4'} pr-4 ${inputSizeClasses[size]} bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
      />
      
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
          <div>
              {loading && (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
              
              {!loading && value && searchResults.length === 0 && (
                <div className="text-center py-8 px-4">
                  <Search className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 mb-3">No results found for "{value}"</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSearch}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    Search all tours
                  </Button>
                </div>
              )}

              {!loading && !value && popularSuggestions.length > 0 && (
                <>
                  {['experience', 'category'].map(type => {
                    const typeResults = popularSuggestions.filter(r => r.type === type)
                    if (typeResults.length === 0) return null
                    
                    const typeLabel = type === 'experience' ? 'Popular Tours' : 'Popular Categories'
                    
                    return (
                      <div key={type} className="mb-2">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                          {typeLabel}
                        </div>
                        {typeResults.map((result) => (
                          <div
                            key={result.id}
                            onClick={() => handleSelect(result)}
                            className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            {getResultIcon(result.type)}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-gray-900">{result.title}</div>
                              {result.subtitle && (
                                <div className="text-xs text-gray-600">{result.subtitle}</div>
                              )}
                            </div>
                            {result.rating && result.price && (
                              <div className="text-right">
                                <div className="flex items-center space-x-1 text-xs text-gray-700">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">{result.rating}</span>
                                </div>
                                <div className="text-xs font-semibold text-green-600">${result.price}</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </>
              )}

              {!loading && searchResults.length > 0 && (
                <>
                  {['experience', 'category'].map(type => {
                    const typeResults = searchResults.filter(r => r.type === type)
                    if (typeResults.length === 0) return null
                    
                    const typeLabel = type === 'experience' ? 'Tours' : 'Categories'
                    
                    return (
                      <div key={type} className="mb-2">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                          {typeLabel}
                        </div>
                        {typeResults.map((result) => (
                          <div
                            key={result.id}
                            onClick={() => handleSelect(result)}
                            className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            {getResultIcon(result.type)}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-gray-900">{result.title}</div>
                              {result.subtitle && (
                                <div className="text-xs text-gray-600">{result.subtitle}</div>
                              )}
                            </div>
                            {result.rating && result.price && (
                              <div className="text-right">
                                <div className="flex items-center space-x-1 text-xs text-gray-700">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">{result.rating}</span>
                                </div>
                                <div className="text-xs font-semibold text-green-600">${result.price}</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  })}
                  
                  <div className="border-t border-gray-200">
                    <div 
                      onClick={handleSearch}
                      className="flex items-center p-3 cursor-pointer hover:bg-blue-50"
                    >
                      <Search className="h-4 w-4 mr-3 text-blue-600" />
                      <span className="font-medium text-blue-600">
                        Search for "{value}"
                      </span>
                    </div>
                  </div>
                </>
              )}
          </div>
        </div>
      )}
    </div>
  )
}