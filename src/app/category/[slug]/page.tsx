import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Filter, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProductCard } from '@/components/products/ProductCard'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

// Mock data - replace with actual data fetching
const categoryData = {
  'tours-attractions': {
    name: 'Tours & Attractions',
    description: 'Discover the best tours and attractions in your destination. From iconic landmarks to hidden gems.',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=400&fit=crop',
    experienceCount: 500
  },
  'museums-galleries': {
    name: 'Museums & Galleries',
    description: 'Explore world-class museums and art galleries. Immerse yourself in culture and history.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop',
    experienceCount: 200
  },
  'food-drinks': {
    name: 'Food & Drinks',
    description: 'Taste local cuisine and experience culinary tours. Discover flavors that define each destination.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=400&fit=crop',
    experienceCount: 150
  }
}

const products = [
  {
    id: '1',
    title: 'Statue of Liberty & Ellis Island Tour',
    slug: 'statue-of-liberty-ellis-island-tour',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    price: 45,
    rating: 4.5,
    reviewCount: 1250,
    duration: '4 hours',
    maxGroupSize: 25,
    city: 'New York',
    featured: true,
    shortDescription: 'Visit the Statue of Liberty and Ellis Island with skip-the-line access'
  },
  {
    id: '2',
    title: 'Louvre Museum Priority Access',
    slug: 'louvre-museum-priority-access',
    image: 'https://images.unsplash.com/photo-1566139992169-9a8b0c9e0b58?w=600&h=400&fit=crop',
    price: 25,
    rating: 4.3,
    reviewCount: 2100,
    duration: '3 hours',
    maxGroupSize: 20,
    city: 'Paris',
    featured: true,
    shortDescription: 'Skip-the-line access to the Louvre Museum'
  },
  {
    id: '3',
    title: 'Tower of London & Crown Jewels',
    slug: 'tower-of-london-crown-jewels',
    image: 'https://images.unsplash.com/photo-1587133603991-8e845d4b2fb0?w=600&h=400&fit=crop',
    price: 32,
    rating: 4.7,
    reviewCount: 1800,
    duration: '2.5 hours',
    maxGroupSize: 15,
    city: 'London',
    featured: true,
    shortDescription: 'Explore the Tower of London and see the Crown Jewels'
  }
]

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categoryData[params.slug as keyof typeof categoryData]
  
  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-80 lg:h-96">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">{category.name}</h1>
            <p className="text-lg lg:text-xl max-w-2xl mb-4">{category.description}</p>
            <p className="text-lg">{category.experienceCount} experiences available</p>
          </div>
        </div>
      </section>

      {/* Filters and Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Destinations</SelectItem>
                  <SelectItem value="new-york">New York</SelectItem>
                  <SelectItem value="paris">Paris</SelectItem>
                  <SelectItem value="london">London</SelectItem>
                </SelectContent>
              </Select>
              <Select>
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
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
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
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {products.length} of {category.experienceCount} {category.name.toLowerCase()}
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Experiences
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}