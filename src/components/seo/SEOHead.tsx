'use client'

import { useEffect } from 'react'

export interface SEOProps {
  title: string
  description: string
  canonical?: string
  robots?: {
    index?: boolean
    follow?: boolean
    nosnippet?: boolean
    maxImagePreview?: 'none' | 'standard' | 'large'
    maxSnippet?: number
  }
  openGraph?: {
    title?: string
    description?: string
    image?: string
    imageAlt?: string
    type?: 'website' | 'article' | 'product'
    url?: string
    siteName?: string
  }
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player'
    title?: string
    description?: string
    image?: string
    imageAlt?: string
  }
  structuredData?: object
  lastModified?: string
  additionalMeta?: Array<{
    name?: string
    property?: string
    content: string
  }>
}

export function SEOHead({
  title,
  description,
  canonical,
  robots = { index: true, follow: true },
  openGraph,
  twitter,
  structuredData,
  lastModified,
  additionalMeta = []
}: SEOProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tps-site.com'
  const siteName = 'TPS Site'
  
  useEffect(() => {
    // Update document title
    document.title = title
    
    // Build robots content
    const robotsContent = [
      robots.index ? 'index' : 'noindex',
      robots.follow ? 'follow' : 'nofollow',
      robots.nosnippet ? 'nosnippet' : '',
      robots.maxImagePreview ? `max-image-preview:${robots.maxImagePreview}` : '',
      robots.maxSnippet ? `max-snippet:${robots.maxSnippet}` : ''
    ].filter(Boolean).join(', ')

    // Function to update or create meta tag
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let meta = document.querySelector(selector) as HTMLMetaElement
      
      if (!meta) {
        meta = document.createElement('meta')
        if (isProperty) {
          meta.setAttribute('property', name)
        } else {
          meta.setAttribute('name', name)
        }
        document.head.appendChild(meta)
      }
      meta.content = content
    }
    
    // Function to update or create link tag
    const updateLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement
      
      if (!link) {
        link = document.createElement('link')
        link.rel = rel
        document.head.appendChild(link)
      }
      link.href = href
    }
    
    // Update basic meta tags
    updateMetaTag('description', description)
    updateMetaTag('robots', robotsContent)
    
    // Update canonical URL
    if (canonical) {
      updateLinkTag('canonical', canonical)
    }
    
    // Update last modified
    if (lastModified) {
      updateMetaTag('last-modified', lastModified)
    }
    
    // Update Open Graph tags
    updateMetaTag('og:title', openGraph?.title || title, true)
    updateMetaTag('og:description', openGraph?.description || description, true)
    updateMetaTag('og:type', openGraph?.type || 'website', true)
    updateMetaTag('og:url', openGraph?.url || canonical || siteUrl, true)
    updateMetaTag('og:site_name', openGraph?.siteName || siteName, true)
    
    if (openGraph?.image) {
      updateMetaTag('og:image', openGraph.image, true)
      if (openGraph.imageAlt) {
        updateMetaTag('og:image:alt', openGraph.imageAlt, true)
      }
    }
    
    // Update Twitter Card tags
    updateMetaTag('twitter:card', twitter?.card || 'summary_large_image')
    updateMetaTag('twitter:title', twitter?.title || openGraph?.title || title)
    updateMetaTag('twitter:description', twitter?.description || openGraph?.description || description)
    
    if (twitter?.image || openGraph?.image) {
      updateMetaTag('twitter:image', twitter?.image || openGraph?.image || '')
      if (twitter?.imageAlt || openGraph?.imageAlt) {
        updateMetaTag('twitter:image:alt', twitter?.imageAlt || openGraph?.imageAlt || '')
      }
    }
    
    // Update additional meta tags
    additionalMeta.forEach((meta) => {
      if (meta.name) {
        updateMetaTag(meta.name, meta.content)
      } else if (meta.property) {
        updateMetaTag(meta.property, meta.content, true)
      }
    })
    
    // Update structured data
    if (structuredData) {
      let jsonLd = document.querySelector('script[type="application/ld+json"]')
      
      if (!jsonLd) {
        jsonLd = document.createElement('script')
        jsonLd.setAttribute('type', 'application/ld+json')
        document.head.appendChild(jsonLd)
      }
      
      jsonLd.textContent = JSON.stringify(structuredData)
    }
    
  }, [title, description, canonical, robots, openGraph, twitter, structuredData, lastModified, additionalMeta])

  // This component doesn't render anything visible
  return null
}