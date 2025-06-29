'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase'

interface City {
  id: string
  name: string
  country: string
  slug: string
  featured: boolean
}

export function HeroSection() {
  const router = useRouter()
  const [cities, setCities] = useState<City[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredCities, setFilteredCities] = useState<City[]>([])

  useEffect(() => {
    fetchCities()
  }, [])

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = cities.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCities(filtered.slice(0, 8)) // Limit to 8 suggestions
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [searchTerm, cities])

  async function fetchCities() {
    const supabase = createClient()
    const { data } = await supabase
      .from('cities')
      .select('*')
      .order('featured', { ascending: false })
      .order('name')

    if (data) setCities(data)
  }

  function handleSearch() {
    if (selectedCity) {
      router.push(`/destinations/${selectedCity.slug}`)
    } else if (searchTerm) {
      // Try to find a matching city
      const matchingCity = cities.find(city => 
        city.name.toLowerCase() === searchTerm.toLowerCase()
      )
      if (matchingCity) {
        router.push(`/destinations/${matchingCity.slug}`)
      } else {
        // Fallback to search results page
        router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
      }
    }
  }

  function handleCitySelect(city: City) {
    setSelectedCity(city)
    setSearchTerm(city.name)
    setShowSuggestions(false)
  }

  function handlePopularCityClick(cityName: string) {
    const city = cities.find(c => c.name === cityName)
    if (city) {
      router.push(`/destinations/${city.slug}`)
    }
  }
  return (
    <section className="relative bg-gradient-to-br from-purple-600 via-primary to-pink-600 text-white">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Unforgettable experiences.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Unbeatable deals.
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-100">
            Book tours, attractions, and experiences across the globe
          </p>

          {/* Search Form */}
          <div className="bg-white rounded-lg p-6 shadow-2xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Destination */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Where to go?
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter destination"
                    className="pl-10 text-gray-900"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  
                  {/* Autocomplete Dropdown */}
                  {showSuggestions && filteredCities.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1">
                      <div className="max-h-60 overflow-y-auto">
                        {filteredCities.map((city) => (
                          <button
                            key={city.id}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-50"
                            onClick={() => handleCitySelect(city)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">{city.name}</div>
                                <div className="text-sm text-gray-500">{city.country}</div>
                              </div>
                              {city.featured && (
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                  Popular
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  When?
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="date"
                    className="pl-10 text-gray-900"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleSearch}
                  disabled={!searchTerm.trim()}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Experiences
                </Button>
              </div>
            </div>
          </div>

          {/* Popular Destinations */}
          <div className="mt-12">
            <p className="text-lg mb-4">Popular destinations:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {cities
                .filter(city => city.featured)
                .slice(0, 6)
                .map((city) => (
                  <Button
                    key={city.id}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => handlePopularCityClick(city.name)}
                  >
                    {city.name}
                  </Button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}