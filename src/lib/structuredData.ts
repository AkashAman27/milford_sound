import { WithContext, Thing } from 'schema-dts'

// Types for structured data
export type StructuredDataType = 
  | 'TouristAttraction'
  | 'LocalBusiness' 
  | 'Product'
  | 'Event'
  | 'Article'
  | 'BlogPosting'
  | 'Organization'
  | 'WebSite'
  | 'BreadcrumbList'
  | 'FAQPage'
  | 'Review'
  | 'Offer'
  | 'Service'

export interface BaseStructuredData {
  '@context': 'https://schema.org'
  '@type': string
  [key: string]: any
}

export interface StructuredDataConfig {
  type: StructuredDataType
  data: Record<string, any>
  override?: string // JSON-LD override from admin
}

// Main function to generate structured data
export function generateStructuredData(config: StructuredDataConfig): BaseStructuredData[] {
  // If admin provided custom JSON-LD, parse and return it
  if (config.override) {
    try {
      const parsed = JSON.parse(config.override)
      // Ensure it's an array for consistency
      return Array.isArray(parsed) ? parsed : [parsed]
    } catch (error) {
      console.error('Invalid JSON-LD override:', error)
      // Fall back to automatic generation if override is invalid
    }
  }

  // Generate automatic structured data based on type
  switch (config.type) {
    case 'TouristAttraction':
      return [generateTouristAttraction(config.data)]
    case 'LocalBusiness':
      return [generateLocalBusiness(config.data)]
    case 'Product':
      return [generateProduct(config.data)]
    case 'Event':
      return [generateEvent(config.data)]
    case 'Article':
      return [generateArticle(config.data)]
    case 'BlogPosting':
      return [generateBlogPosting(config.data)]
    case 'Organization':
      return [generateOrganization(config.data)]
    case 'WebSite':
      return [generateWebSite(config.data)]
    case 'BreadcrumbList':
      return [generateBreadcrumbList(config.data)]
    case 'FAQPage':
      return [generateFAQPage(config.data)]
    case 'Review':
      return [generateReview(config.data)]
    case 'Offer':
      return [generateOffer(config.data)]
    case 'Service':
      return [generateService(config.data)]
    default:
      return []
  }
}

// Travel-specific: Tourist Attraction (for tours/experiences)
function generateTouristAttraction(data: any): BaseStructuredData {
  const base: BaseStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: data.title || data.name,
    description: data.description,
    url: data.url,
    image: data.image_url || data.main_image_url,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: data.latitude || -44.6189,
      longitude: data.longitude || 167.9224
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: data.location || 'Milford Sound',
      addressRegion: 'Southland',
      addressCountry: 'NZ'
    }
  }

  // Add rating if available
  if (data.rating) {
    base.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.rating,
      reviewCount: data.review_count || 0,
      bestRating: 5,
      worstRating: 1
    }
  }

  // Add offers for tours
  if (data.price) {
    base.offers = {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.currency || 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
      url: data.booking_url || data.url
    }
  }

  // Add tour operator information
  if (data.operator || data.provider) {
    base.touristType = 'https://schema.org/Traveler'
    base.provider = {
      '@type': 'LocalBusiness',
      name: data.operator || data.provider || 'Milford Sound Tours',
      url: data.operator_url || data.provider_url
    }
  }

  return base
}

// Local Business (for the tour company)
function generateLocalBusiness(data: any): BaseStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': data.url + '#organization',
    name: data.name || 'Milford Sound Tours',
    description: data.description,
    url: data.url,
    logo: data.logo,
    image: data.image,
    telephone: data.telephone,
    email: data.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.street_address,
      addressLocality: data.city || 'Milford Sound',
      addressRegion: data.region || 'Southland',
      postalCode: data.postal_code,
      addressCountry: data.country || 'NZ'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: data.latitude || -44.6189,
      longitude: data.longitude || 167.9224
    },
    openingHours: data.opening_hours || [
      'Mo-Su 08:00-18:00'
    ],
    priceRange: data.price_range || '$$',
    servesCuisine: data.cuisine,
    acceptsReservations: true,
    sameAs: data.social_links || []
  }
}

// Product schema (for tour packages)
function generateProduct(data: any): BaseStructuredData {
  const base: BaseStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.title || data.name,
    description: data.description,
    image: data.image_url || data.main_image_url,
    brand: {
      '@type': 'Brand',
      name: data.brand || 'Milford Sound Tours'
    },
    category: data.category,
    sku: data.id || data.sku
  }

  // Add offers
  if (data.price) {
    base.offers = {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.currency || 'USD',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: data.seller || 'Milford Sound Tours'
      }
    }
  }

  // Add rating
  if (data.rating) {
    base.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.rating,
      reviewCount: data.review_count || 0,
      bestRating: 5,
      worstRating: 1
    }
  }

  return base
}

// Event schema (for scheduled tours)
function generateEvent(data: any): BaseStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: data.title || data.name,
    description: data.description,
    image: data.image_url,
    startDate: data.start_date,
    endDate: data.end_date,
    location: {
      '@type': 'Place',
      name: data.location_name || 'Milford Sound',
      address: {
        '@type': 'PostalAddress',
        addressLocality: data.city || 'Milford Sound',
        addressRegion: data.region || 'Southland',
        addressCountry: data.country || 'NZ'
      }
    },
    organizer: {
      '@type': 'Organization',
      name: data.organizer || 'Milford Sound Tours',
      url: data.organizer_url
    },
    offers: data.price ? {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.currency || 'USD',
      availability: 'https://schema.org/InStock'
    } : undefined
  }
}

// Article schema (for blog posts)
function generateArticle(data: any): BaseStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.excerpt || data.description,
    image: data.featured_image || data.image,
    author: {
      '@type': 'Person',
      name: data.author || 'Milford Sound Team'
    },
    publisher: {
      '@type': 'Organization',
      name: data.publisher || 'Milford Sound',
      logo: {
        '@type': 'ImageObject',
        url: data.publisher_logo
      }
    },
    datePublished: data.published_at || data.created_at,
    dateModified: data.updated_at || data.published_at || data.created_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url
    },
    articleSection: data.category || 'Travel',
    wordCount: data.word_count,
    keywords: data.keywords
  }
}

// Blog Posting schema
function generateBlogPosting(data: any): BaseStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: data.excerpt || data.description,
    image: data.featured_image || data.image,
    author: {
      '@type': 'Person',
      name: data.author || 'Milford Sound Team'
    },
    publisher: {
      '@type': 'Organization',
      name: data.publisher || 'Milford Sound',
      logo: {
        '@type': 'ImageObject',
        url: data.publisher_logo
      }
    },
    datePublished: data.published_at || data.created_at,
    dateModified: data.updated_at || data.published_at || data.created_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url
    },
    blogSection: data.category || 'Travel Blog',
    wordCount: data.word_count,
    keywords: data.keywords
  }
}

// Organization schema
function generateOrganization(data: any): BaseStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': data.url + '#organization',
    name: data.name || 'Milford Sound Tours',
    url: data.url,
    logo: data.logo,
    description: data.description,
    telephone: data.telephone,
    email: data.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: data.city || 'Milford Sound',
      addressRegion: data.region || 'Southland',
      addressCountry: data.country || 'NZ'
    },
    sameAs: data.social_links || []
  }
}

// Website schema
function generateWebSite(data: any): BaseStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': data.url + '#website',
    name: data.name || 'Milford Sound Tours',
    url: data.url,
    description: data.description,
    publisher: {
      '@type': 'Organization',
      '@id': data.url + '#organization'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: data.url + '/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

// Breadcrumb schema
function generateBreadcrumbList(data: any): BaseStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: data.breadcrumbs?.map((crumb: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    })) || []
  }
}

// FAQ schema
function generateFAQPage(data: any): BaseStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs?.map((faq: any) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    })) || []
  }
}

// Review schema
function generateReview(data: any): BaseStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    reviewRating: {
      '@type': 'Rating',
      ratingValue: data.rating,
      bestRating: data.best_rating || 5,
      worstRating: data.worst_rating || 1
    },
    reviewBody: data.review_text,
    author: {
      '@type': 'Person',
      name: data.author_name
    },
    itemReviewed: {
      '@type': data.item_type || 'Product',
      name: data.item_name
    },
    datePublished: data.published_at
  }
}

// Offer schema
function generateOffer(data: any): BaseStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    price: data.price,
    priceCurrency: data.currency || 'USD',
    availability: data.availability || 'https://schema.org/InStock',
    validFrom: data.valid_from,
    validThrough: data.valid_through,
    seller: {
      '@type': 'Organization',
      name: data.seller || 'Milford Sound Tours'
    }
  }
}

// Service schema
function generateService(data: any): BaseStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.name,
    description: data.description,
    provider: {
      '@type': 'Organization',
      name: data.provider || 'Milford Sound Tours'
    },
    areaServed: {
      '@type': 'Place',
      name: data.area_served || 'Milford Sound, New Zealand'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: data.catalog_name || 'Tour Services',
      itemListElement: data.services?.map((service: any) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.description
        }
      })) || []
    }
  }
}

// Utility function to combine multiple structured data types
export function combineStructuredData(...schemas: BaseStructuredData[]): BaseStructuredData[] {
  return schemas.filter(schema => schema && Object.keys(schema).length > 0)
}

// Validation function for JSON-LD
export function validateJSONLD(jsonString: string): { isValid: boolean; error?: string; parsed?: any } {
  try {
    const parsed = JSON.parse(jsonString)
    
    // Basic validation - must have @context and @type
    if (typeof parsed === 'object') {
      if (Array.isArray(parsed)) {
        // Array of schemas
        for (const item of parsed) {
          if (!item['@context'] || !item['@type']) {
            return { isValid: false, error: 'Each schema must have @context and @type' }
          }
        }
      } else {
        // Single schema
        if (!parsed['@context'] || !parsed['@type']) {
          return { isValid: false, error: 'Schema must have @context and @type' }
        }
      }
      
      return { isValid: true, parsed }
    } else {
      return { isValid: false, error: 'JSON-LD must be an object or array' }
    }
  } catch (error) {
    return { isValid: false, error: 'Invalid JSON syntax' }
  }
}