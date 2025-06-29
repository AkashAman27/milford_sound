import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const destinations = [
  {
    name: 'New York',
    slug: 'new-york',
    country: 'United States',
    description: 'The city that never sleeps',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop',
    experiences: 250,
    featured: true
  },
  {
    name: 'Paris',
    slug: 'paris',
    country: 'France',
    description: 'The city of lights and romance',
    image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=600&h=400&fit=crop',
    experiences: 180,
    featured: true
  },
  {
    name: 'London',
    slug: 'london',
    country: 'United Kingdom',
    description: 'A blend of history and modernity',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop',
    experiences: 220,
    featured: true
  },
  {
    name: 'Tokyo',
    slug: 'tokyo',
    country: 'Japan',
    description: 'Where tradition meets innovation',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop',
    experiences: 150,
    featured: true
  },
  {
    name: 'Barcelona',
    slug: 'barcelona',
    country: 'Spain',
    description: 'Mediterranean charm and Gaudí architecture',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=400&fit=crop',
    experiences: 120,
    featured: true
  },
  {
    name: 'Rome',
    slug: 'rome',
    country: 'Italy',
    description: 'The eternal city of ancient wonders',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop',
    experiences: 140,
    featured: true
  },
  {
    name: 'Dubai',
    slug: 'dubai',
    country: 'UAE',
    description: 'Modern marvels and luxury experiences',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop',
    experiences: 90,
    featured: false
  },
  {
    name: 'Amsterdam',
    slug: 'amsterdam',
    country: 'Netherlands',
    description: 'Canals, culture, and creativity',
    image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&h=400&fit=crop',
    experiences: 80,
    featured: false
  }
]

export default function DestinationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Explore Amazing Destinations
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto">
            Discover unforgettable experiences in the world's most incredible cities
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <Link key={destination.slug} href={`/destinations/${destination.slug}`}>
                <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={destination.image}
                        alt={destination.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      {destination.featured && (
                        <Badge className="absolute top-3 left-3 bg-primary">
                          Popular
                        </Badge>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center mb-2">
                          <MapPin className="h-4 w-4 text-white mr-1" />
                          <span className="text-sm text-gray-200">{destination.country}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {destination.name}
                        </h3>
                        <p className="text-sm text-gray-200 mb-2">
                          {destination.description}
                        </p>
                        <p className="text-sm text-gray-300">
                          {destination.experiences} experiences
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}