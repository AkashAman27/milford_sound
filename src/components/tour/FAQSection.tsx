'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface FAQ {
  id: string
  question: string
  answer: string
  sort_order: number
  enabled: boolean
}

interface FAQSectionProps {
  experienceId: string
  className?: string
}

export function FAQSection({ experienceId, className = '' }: FAQSectionProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const supabase = createClient()
        
        // First check if FAQs are enabled for this experience
        const { data: experienceData } = await supabase
          .from('experiences')
          .select('show_faqs')
          .eq('id', experienceId)
          .single()

        if (!experienceData?.show_faqs) {
          setLoading(false)
          return
        }

        // Fetch FAQs that should be shown on tour pages
        // Include both experience-specific FAQs and general FAQs marked to show on tour pages
        const { data: faqsData, error } = await supabase
          .from('faqs')
          .select('*')
          .eq('enabled', true)
          .or(`experience_id.eq.${experienceId},and(show_on_tour_page.eq.true,experience_id.is.null)`)
          .order('sort_order', { ascending: true })

        if (error) {
          console.error('Error fetching FAQs:', error)
        } else if (faqsData) {
          setFaqs(faqsData)
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFAQs()
  }, [experienceId])

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  if (loading || faqs.length === 0) {
    return null
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>
        
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg">
              <button
                className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                onClick={() => toggleItem(faq.id)}
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                {openItems.has(faq.id) ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openItems.has(faq.id) && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}