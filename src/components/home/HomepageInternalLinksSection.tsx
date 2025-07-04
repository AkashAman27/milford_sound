'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

export function HomepageInternalLinksSection() {
  const [sections, setSections] = useState<InternalLinksSection[]>([])
  const [loading, setLoading] = useState(true)
  const [sectionSettings, setSectionSettings] = useState({
    title: 'Explore More',
    description: 'Discover everything we have to offer',
    enabled: true
  })

  useEffect(() => {
    fetchInternalLinks()
  }, [])

  const fetchInternalLinks = async () => {
    try {
      const supabase = createClient()
      
      // Fetch section settings
      const { data: settingsData } = await supabase
        .from('homepage_settings')
        .select('*')
        .eq('section_name', 'internal_links_section')
        .single()

      if (settingsData) {
        setSectionSettings({
          title: settingsData.title || 'Explore More',
          description: settingsData.description || 'Discover everything we have to offer',
          enabled: settingsData.enabled !== false
        })
      }

      // Fetch internal links sections for homepage
      const { data: sectionsData, error } = await supabase
        .from('internal_links_sections')
        .select(`
          *,
          internal_links (
            id,
            title,
            url,
            display_order,
            enabled
          )
        `)
        .eq('context_type', 'homepage')
        .eq('enabled', true)
        .order('sort_order')

      if (error) {
        console.error('Error fetching internal links:', error)
      } else {
        // Process and sort the data
        const processedSections = (sectionsData || []).map(section => ({
          ...section,
          links: (section.internal_links || [])
            .filter((link: InternalLink) => link.enabled)
            .sort((a: InternalLink, b: InternalLink) => a.display_order - b.display_order)
        }))
        setSections(processedSections)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading links...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!sectionSettings.enabled || sections.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionSettings.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {sectionSettings.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section) => (
            <Card key={section.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {section.section_title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.links.map((link, index) => (
                    <Link
                      key={link.id}
                      href={link.url}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="text-gray-900 group-hover:text-primary transition-colors">
                          {link.title}
                        </span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}