'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Calendar, Clock, Star } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

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

// Mock search data - replace with actual API calls
const mockSearchData: SearchResult[] = [
  
  // Categories
  { id: '7', type: 'category', title: 'Tours & Attractions', slug: 'tours-attractions' },
  { id: '8', type: 'category', title: 'Museums & Galleries', slug: 'museums-galleries' },
  { id: '9', type: 'category', title: 'Food & Drinks', slug: 'food-drinks' },
  { id: '10', type: 'category', title: 'Adventure & Outdoor', slug: 'adventure-outdoor' },
  
  // Experiences
  { id: '11', type: 'experience', title: 'Statue of Liberty & Ellis Island Tour', subtitle: 'New York', slug: 'statue-of-liberty-ellis-island-tour', rating: 4.5, price: 45 },
  { id: '12', type: 'experience', title: 'Louvre Museum Priority Access', subtitle: 'Paris', slug: 'louvre-museum-priority-access', rating: 4.3, price: 25 },
  { id: '13', type: 'experience', title: 'Tower of London & Crown Jewels', subtitle: 'London', slug: 'tower-of-london-crown-jewels', rating: 4.7, price: 32 },
  { id: '14', type: 'experience', title: 'Tokyo Food Tour in Shibuya', subtitle: 'Tokyo', slug: 'tokyo-food-tour-shibuya', rating: 4.8, price: 75 },
]

export function SearchBox({ 
  placeholder = "Search tours & experiences", 
  showIcon = true, 
  size = 'md',
  className = '' 
}: SearchBoxProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const searchItems = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([])
        return
      }

      setLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Filter mock data based on query
      const filtered = mockSearchData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8) // Limit to 8 results
      
      setSearchResults(filtered)
      setLoading(false)
    },
    []
  )

  useEffect(() => {
    if (value) {
      searchItems(value)
    } else {
      setSearchResults([])
    }
  }, [value, searchItems])

  const handleSelect = (result: SearchResult) => {
    setOpen(false)
    setValue('')
    
    switch (result.type) {
      case 'category':
        router.push(`/category/${result.slug}`)
        break
      case 'experience':
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

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'category':
        return <Calendar className="h-4 w-4 text-green-500" />
      case 'experience':
        return <Clock className="h-4 w-4 text-purple-500" />
      default:
        return <Search className="h-4 w-4 text-gray-500" />
    }
  }

  const inputSizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10',
    lg: 'h-12 text-lg'
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={`relative ${className}`}>
          {showIcon && (
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          )}
          <Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
            className={`w-full ${showIcon ? 'pl-10' : 'pl-4'} pr-4 ${inputSizeClasses[size]}`}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search..." 
            value={value}
            onValueChange={setValue}
            className="border-none focus:ring-0"
          />
          <CommandList>
            {loading && (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </div>
            )}
            
            {!loading && value && searchResults.length === 0 && (
              <CommandEmpty>
                <div className="text-center py-6">
                  <Search className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">No results found</p>
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={handleSearch}
                    className="mt-2"
                  >
                    Search for "{value}"
                  </Button>
                </div>
              </CommandEmpty>
            )}

            {!loading && searchResults.length > 0 && (
              <>
                {['experience', 'category'].map(type => {
                  const typeResults = searchResults.filter(r => r.type === type)
                  if (typeResults.length === 0) return null
                  
                  const typeLabel = type === 'experience' ? 'Tours' : 'Categories'
                  
                  return (
                    <CommandGroup key={type} heading={typeLabel}>
                      {typeResults.map((result) => (
                        <CommandItem
                          key={result.id}
                          onSelect={() => handleSelect(result)}
                          className="flex items-center space-x-3 p-3 cursor-pointer"
                        >
                          {getResultIcon(result.type)}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{result.title}</div>
                            {result.subtitle && (
                              <div className="text-xs text-gray-500">{result.subtitle}</div>
                            )}
                          </div>
                          {result.rating && result.price && (
                            <div className="text-right">
                              <div className="flex items-center space-x-1 text-xs">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{result.rating}</span>
                              </div>
                              <div className="text-xs font-medium">${result.price}</div>
                            </div>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )
                })}
                
                <CommandGroup>
                  <CommandItem onSelect={handleSearch} className="p-3 cursor-pointer">
                    <Search className="h-4 w-4 mr-3 text-primary" />
                    <span className="font-medium text-primary">
                      Search for "{value}"
                    </span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}