'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

interface InternalLink {
  id: string
  title: string
  url: string
  display_order: number
  enabled: boolean
}

interface InternalLinksSection {
  id: string
  section_title: string
  section_type: string
  sort_order: number
  enabled: boolean
  links: InternalLink[]
}

interface InternalLinksSectionProps {
  experienceId: string
  className?: string
}

export function InternalLinksSection({ experienceId, className = '' }: InternalLinksSectionProps) {
  const [sections, setSections] = useState<InternalLinksSection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInternalLinks()
  }, [experienceId])

  const fetchInternalLinks = async () => {
    try {
      const supabase = createClient()
      
      // Fetch sections with their links
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('internal_links_sections')
        .select(`
          *,
          internal_links(*)
        `)
        .eq('experience_id', experienceId)
        .eq('enabled', true)
        .order('sort_order')

      if (sectionsError) {
        console.error('Error fetching internal links sections:', sectionsError)
        return
      }

      // Transform the data to match our interface
      const transformedSections: InternalLinksSection[] = sectionsData?.map(section => ({
        ...section,
        links: section.internal_links
          .filter((link: any) => link.enabled)
          .sort((a: any, b: any) => a.display_order - b.display_order)
      })) || []

      setSections(transformedSections)
    } catch (error) {
      console.error('Error fetching internal links:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!sections.length) {
    return null
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {sections.map((section) => (
        <div key={section.id}>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {section.section_title}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {section.links.map((link, index) => (
              <Link
                key={link.id}
                href={link.url}
                className="group relative bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-center text-sm font-medium"
              >
                <div className="absolute top-2 left-3 text-xs font-bold text-gray-300">
                  {index + 1}
                </div>
                <div className="pt-2">
                  {link.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}