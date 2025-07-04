'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase'

interface FAQ {
  id: string
  question: string
  answer: string
  sort_order: number
  enabled: boolean
}

export function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [sectionSettings, setSectionSettings] = useState({
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about our experiences and services',
    enabled: true
  })

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      const supabase = createClient()
      
      // Fetch section settings
      const { data: settingsData } = await supabase
        .from('homepage_settings')
        .select('*')
        .eq('section_name', 'faq_section')
        .single()

      if (settingsData) {
        setSectionSettings({
          title: settingsData.title || 'Frequently Asked Questions',
          description: settingsData.description || 'Find answers to common questions about our experiences and services',
          enabled: settingsData.enabled !== false
        })
      }

      // Fetch FAQs
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('enabled', true)
        .order('sort_order')

      if (error) {
        console.error('Error fetching FAQs:', error)
      } else {
        setFaqs(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading FAQs...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!sectionSettings.enabled) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionSettings.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {sectionSettings.description}
          </p>
        </div>

        {faqs.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleExpanded(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    {expandedItems.has(faq.id) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedItems.has(faq.id) && (
                    <div className="px-6 pb-4">
                      <div className="pt-2 text-gray-700 leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No FAQs available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}