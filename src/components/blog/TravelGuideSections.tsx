'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, X, ShoppingBag, MapPin, AlertTriangle, Lightbulb, Camera, Clock, Utensils } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface GuideItem {
  id: string
  title: string
  description: string
  icon: string
  importance: 'essential' | 'recommended' | 'optional'
  category: string
}

interface GuideSection {
  id: string
  section_title: string
  section_type: 'what_to_do' | 'what_not_to_do' | 'what_to_carry' | 'custom'
  content: string
  enabled: boolean
  sort_order: number
  items: GuideItem[]
}

interface TravelGuideSectionsProps {
  blogPostId: string
}

export function TravelGuideSections({ blogPostId }: TravelGuideSectionsProps) {
  const [sections, setSections] = useState<GuideSection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGuideSections()
  }, [blogPostId])

  async function fetchGuideSections() {
    const supabase = createClient()
    
    try {
      const { data: sectionsData } = await supabase
        .from('blog_guide_sections')
        .select(`
          *,
          blog_guide_items(*)
        `)
        .eq('blog_post_id', blogPostId)
        .eq('enabled', true)
        .order('sort_order')

      if (sectionsData) {
        const processedSections = sectionsData.map(section => ({
          ...section,
          items: (section.blog_guide_items || []).sort((a: GuideItem, b: GuideItem) => a.importance === 'essential' ? -1 : 1)
        }))
        setSections(processedSections)
      }
    } catch (error) {
      console.error('Error fetching guide sections:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'what_to_do':
        return <Check className="h-6 w-6 text-green-600" />
      case 'what_not_to_do':
        return <X className="h-6 w-6 text-red-600" />
      case 'what_to_carry':
        return <ShoppingBag className="h-6 w-6 text-blue-600" />
      default:
        return <Lightbulb className="h-6 w-6 text-yellow-600" />
    }
  }

  const getItemIcon = (iconName: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      'camera': <Camera className="h-5 w-5" />,
      'clock': <Clock className="h-5 w-5" />,
      'map': <MapPin className="h-5 w-5" />,
      'warning': <AlertTriangle className="h-5 w-5" />,
      'food': <Utensils className="h-5 w-5" />,
      'bag': <ShoppingBag className="h-5 w-5" />
    }
    return iconMap[iconName] || <Check className="h-5 w-5" />
  }

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'essential':
        return <Badge className="bg-red-100 text-red-800 text-xs">Essential</Badge>
      case 'recommended':
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Recommended</Badge>
      case 'optional':
        return <Badge className="bg-gray-100 text-gray-800 text-xs">Optional</Badge>
      default:
        return null
    }
  }

  const getSectionColorClasses = (type: string) => {
    switch (type) {
      case 'what_to_do':
        return 'bg-green-50/50'
      case 'what_not_to_do':
        return 'bg-red-50/50'
      case 'what_to_carry':
        return 'bg-blue-50/50'
      default:
        return 'bg-yellow-50/50'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (sections.length === 0) {
    return null
  }

  return (
    <div className="mt-16 space-y-12">
      {sections.map((section) => (
        <div key={section.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Section Header */}
          <div className="px-8 py-8 border-b border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{section.section_title}</h3>
            {section.content && (
              <div className="prose prose-lg max-w-none">
                {section.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4 text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Information Cards */}
          {section.items && section.items.length > 0 && (
            <div className="p-8 space-y-6">
              {section.items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-start space-x-6 p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <div className="text-primary">
                        {getItemIcon(item.icon)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-xl font-bold text-gray-900 leading-tight">
                        {item.title}
                      </h4>
                      {item.category && (
                        <span className="ml-4 inline-block px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-600 border">
                          {item.category}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {item.description}
                    </p>
                    
                    {item.importance && (
                      <div className="mt-4">
                        {getImportanceBadge(item.importance)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Additional Content Block */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 border border-blue-200">
        <div className="flex items-start space-x-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Planning Your Perfect Experience
            </h3>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                Every traveler is unique, and the best experiences are those tailored to your personal interests and travel style. Use this guide as your foundation, but don't hesitate to adapt it based on your preferences, budget, and the time you have available.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Remember to stay flexible during your trip - sometimes the most memorable moments come from unexpected discoveries and spontaneous decisions. Have a plan, but leave room for adventure!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}