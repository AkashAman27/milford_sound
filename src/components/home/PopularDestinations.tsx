import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const destinations = [
  {
    name: 'New York',
    slug: 'new-york',
    country: 'United States',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop',
    experiences: 250,
    featured: true
  },
  {
    name: 'Paris',
    slug: 'paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=600&h=400&fit=crop',
    experiences: 180,
    featured: true
  },
  {
    name: 'London',
    slug: 'london',
    country: 'United Kingdom',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop',
    experiences: 220,
    featured: true
  },
  {
    name: 'Tokyo',
    slug: 'tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop',
    experiences: 150,
    featured: true
  },
  {
    name: 'Barcelona',
    slug: 'barcelona',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=400&fit=crop',
    experiences: 120,
    featured: true
  },
  {
    name: 'Rome',
    slug: 'rome',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop',
    experiences: 140,
    featured: true
  }
]

export function PopularDestinations() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Destinations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover unforgettable experiences in the world's most amazing cities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination, index) => (
            <Link key={destination.slug} href={`/destinations/${destination.slug}`}>
              <Card className={`group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 ${
                index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}>
                <CardContent className="p-0">
                  <div className={`relative overflow-hidden ${
                    index === 0 ? 'h-64 sm:h-80 lg:h-64' : 'h-64'
                  }`}>
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    {destination.featured && (
                      <Badge className="absolute top-4 left-4 bg-primary">
                        Popular
                      </Badge>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {destination.name}
                      </h3>
                      <p className="text-gray-200 mb-2">
                        {destination.country}
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
  )
}