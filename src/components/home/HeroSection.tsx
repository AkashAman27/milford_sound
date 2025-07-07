'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase'

interface HeroContent {
  title: string
  subtitle: string
  description: string
  button_text: string
  button_link: string
  background_image?: string
  enabled: boolean
}

export function HeroSection() {
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: 'Unforgettable experiences.',
    subtitle: 'Unbeatable deals.',
    description: 'Book tours, attractions, and experiences across the globe',
    button_text: 'Discover More',
    button_link: '/tours',
    enabled: true
  })

  useEffect(() => {
    fetchHeroContent()
  }, [])

  const fetchHeroContent = async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('homepage_settings')
        .select('*')
        .eq('section_name', 'hero_section')
        .eq('enabled', true)
        .single()

      if (data) {
        setHeroContent({
          title: data.title || 'Unforgettable experiences.',
          subtitle: data.subtitle || 'Unbeatable deals.',
          description: data.description || 'Book tours, attractions, and experiences across the globe',
          button_text: data.button_text || 'Discover More',
          button_link: data.button_link || '/tours',
          background_image: data.background_image,
          enabled: data.enabled
        })
      }
    } catch (error) {
      console.error('Error fetching hero content:', error)
      // Keep default content if fetch fails
    }
  }

  if (!heroContent.enabled) {
    return null
  }

  return (
    <section 
      className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900 text-white overflow-hidden"
      style={heroContent.background_image ? {
        backgroundImage: `url(${heroContent.background_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      } : {}}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-800/80 to-indigo-900/90" />
      
      {/* Floating circles for visual appeal */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-yellow-400/20 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute bottom-20 left-20 w-16 h-16 bg-pink-400/20 rounded-full animate-pulse delay-500"></div>
      
      <div className="relative container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
            <span className="text-sm font-medium">🏔️ UNESCO World Heritage Site</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="block">{heroContent.title}</span>
            {heroContent.subtitle && (
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 animate-pulse">
                {heroContent.subtitle}
              </span>
            )}
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-100 mb-12 leading-relaxed max-w-4xl mx-auto">
            {heroContent.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={heroContent.button_link}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600 font-bold px-10 py-6 text-xl rounded-full shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105"
              >
                {heroContent.button_text}
                <span className="ml-2">→</span>
              </Button>
            </Link>
            
            <div className="flex items-center space-x-2 text-white/80">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 border-2 border-white"></div>
              </div>
              <span className="text-sm">Trusted by 50,000+ travelers</span>
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-lg font-semibold">4.9/5 Rating</div>
              <div className="text-sm text-gray-300">Based on 2,500+ reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🛡️</div>
              <div className="text-lg font-semibold">100% Safe</div>
              <div className="text-sm text-gray-300">COVID-19 protocols</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💚</div>
              <div className="text-lg font-semibold">Eco-Friendly</div>
              <div className="text-sm text-gray-300">Sustainable tourism</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full">
            <div className="w-1 h-3 bg-white/70 rounded-full mx-auto mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
}