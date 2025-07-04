import { generateStructuredData, combineStructuredData, StructuredDataType, BaseStructuredData } from '@/lib/structuredData'

interface StructuredDataProps {
  type: StructuredDataType
  data: Record<string, any>
  customJsonLd?: string | null
  globalSchemas?: BaseStructuredData[]
  priority?: number
}

export function StructuredData({ 
  type, 
  data, 
  customJsonLd, 
  globalSchemas = [],
  priority = 0 
}: StructuredDataProps) {
  // Generate structured data using our comprehensive system
  const schemas = generateStructuredData({
    type,
    data,
    override: customJsonLd || undefined
  })

  // Combine with global schemas if provided
  const allSchemas = combineStructuredData(...globalSchemas, ...schemas)

  // Don't render if no schemas
  if (allSchemas.length === 0) {
    return null
  }

  return (
    <>
      {allSchemas.map((schema, index) => (
        <script
          key={`structured-data-${type}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0)
          }}
        />
      ))}
    </>
  )
}

// Component for global website schemas
export function GlobalStructuredData({ siteData }: { siteData: Record<string, any> }) {
  const websiteSchema = generateStructuredData({
    type: 'WebSite',
    data: {
      name: siteData.name || 'Milford Sound Tours',
      url: siteData.url || 'https://milford-sound.com',
      description: siteData.description || 'Premier tour operator offering unforgettable experiences in Milford Sound, New Zealand',
      ...siteData
    }
  })

  const organizationSchema = generateStructuredData({
    type: 'Organization',
    data: {
      name: siteData.organizationName || 'Milford Sound Tours',
      url: siteData.url || 'https://milford-sound.com',
      logo: siteData.logo,
      description: siteData.organizationDescription || 'Leading tour operator in Milford Sound',
      telephone: siteData.telephone,
      email: siteData.email,
      social_links: siteData.socialLinks || [],
      ...siteData
    }
  })

  const localBusinessSchema = generateStructuredData({
    type: 'LocalBusiness',
    data: {
      name: siteData.businessName || 'Milford Sound Tours',
      url: siteData.url || 'https://milford-sound.com',
      description: siteData.businessDescription || 'Tour operator specializing in Milford Sound experiences',
      telephone: siteData.telephone,
      email: siteData.email,
      street_address: siteData.streetAddress,
      city: siteData.city || 'Milford Sound',
      region: siteData.region || 'Southland',
      postal_code: siteData.postalCode,
      country: siteData.country || 'NZ',
      latitude: siteData.latitude || -44.6189,
      longitude: siteData.longitude || 167.9224,
      opening_hours: siteData.openingHours || ['Mo-Su 08:00-18:00'],
      price_range: siteData.priceRange || '$$',
      social_links: siteData.socialLinks || [],
      ...siteData
    }
  })

  const allSchemas = combineStructuredData(...websiteSchema, ...organizationSchema, ...localBusinessSchema)

  return (
    <>
      {allSchemas.map((schema, index) => (
        <script
          key={`global-structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0)
          }}
        />
      ))}
    </>
  )
}

// Breadcrumb structured data component
export function BreadcrumbStructuredData({ breadcrumbs }: { breadcrumbs: Array<{ name: string; url: string }> }) {
  const schema = generateStructuredData({
    type: 'BreadcrumbList',
    data: { breadcrumbs }
  })

  if (schema.length === 0) {
    return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema[0], null, 0)
      }}
    />
  )
}

// FAQ structured data component
export function FAQStructuredData({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const schema = generateStructuredData({
    type: 'FAQPage',
    data: { faqs }
  })

  if (schema.length === 0) {
    return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema[0], null, 0)
      }}
    />
  )
}