import Image from 'next/image'
import Link from 'next/link'
import { Star, Clock, Users, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ProductCardProps {
  id: string
  title: string
  slug: string
  image: string
  price: number
  currency?: string
  rating?: number
  reviewCount: number
  duration?: string
  maxGroupSize?: number
  city: string
  featured?: boolean
  shortDescription?: string
}

export function ProductCard({
  id,
  title,
  slug,
  image,
  price,
  currency = 'USD',
  rating,
  reviewCount,
  duration,
  maxGroupSize,
  city,
  featured,
  shortDescription
}: ProductCardProps) {
  return (
    <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        <div className="relative">
          <Link href={`/experience/${slug}`}>
            <div className="relative h-48 overflow-hidden">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {featured && (
                <Badge className="absolute top-3 left-3 bg-orange-500">
                  Bestseller
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-3 right-3 bg-white/80 hover:bg-white/90"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </Link>
        </div>

        <div className="p-4">
          {/* City and Rating */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{city}</span>
            {rating && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{rating}</span>
                <span className="text-sm text-gray-500">({reviewCount})</span>
              </div>
            )}
          </div>

          {/* Title */}
          <Link href={`/experience/${slug}`}>
            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>

          {/* Short Description */}
          {shortDescription && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {shortDescription}
            </p>
          )}

          {/* Details */}
          <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
            {duration && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{duration}</span>
              </div>
            )}
            {maxGroupSize && (
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Up to {maxGroupSize}</span>
              </div>
            )}
          </div>

          {/* Price and Book Now */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-gray-900">
                {currency === 'USD' ? '$' : currency}{price}
              </span>
              <span className="text-sm text-gray-600 ml-1">per person</span>
            </div>
            <Link href={`/experience/${slug}`}>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}