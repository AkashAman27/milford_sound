export interface Experience {
  id: string
  title: string
  description: string
  price: number
  currency: string
  rating: number
  review_count: number
  duration: string
  location: string
  image_url: string
  slug: string
  category?: string
}

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  author: string
  published_date: string
  updated_date?: string
  featured_image?: string
  category?: string
}

export function generateExperienceStructuredData(experience: Experience, siteUrl: string = 'https://milford-sound.com') {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": experience.title,
    "description": experience.description,
    "image": experience.image_url,
    "url": `${siteUrl}/experience/${experience.slug}`,
    "sku": experience.id,
    "category": experience.category || "Tours & Activities",
    "offers": {
      "@type": "Offer",
      "price": experience.price,
      "priceCurrency": experience.currency,
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString(),
      "url": `${siteUrl}/experience/${experience.slug}`
    },
    "aggregateRating": experience.review_count > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": experience.rating,
      "reviewCount": experience.review_count,
      "bestRating": 5,
      "worstRating": 1
    } : undefined,
    "provider": {
      "@type": "Organization",
      "name": "Milford Sound",
      "url": siteUrl
    },
    "location": {
      "@type": "Place",
      "name": experience.location
    },
    "duration": experience.duration
  }
}

export function generateBlogPostStructuredData(post: BlogPost, siteUrl: string = 'https://milford-sound.com') {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featured_image,
    "url": `${siteUrl}/blog/${post.slug}`,
    "datePublished": post.published_date,
    "dateModified": post.updated_date || post.published_date,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Milford Sound",
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`
    },
    "articleSection": post.category
  }
}

export function generateOrganizationStructuredData(siteUrl: string = 'https://milford-sound.com') {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Milford Sound",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": "Discover unforgettable tours, activities and experiences around the world with Milford Sound",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": `${siteUrl}/help`
    },
    "sameAs": [
      "https://facebook.com/milfordsound",
      "https://twitter.com/milfordsound",
      "https://instagram.com/milfordsound"
    ]
  }
}

export function generateWebsiteStructuredData(siteUrl: string = 'https://milford-sound.com') {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Milford Sound",
    "url": siteUrl,
    "description": "Book the best tours, activities and experiences around the world",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  }
}