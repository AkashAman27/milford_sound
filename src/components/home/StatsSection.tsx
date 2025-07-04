'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

interface HomepageStat {
  id: string
  label: string
  value: number
}

export function StatsSection() {
  const [stats, setStats] = useState<HomepageStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()
      
      // Fetch homepage stats
      const { data: statsData } = await supabase
        .from('homepage_stats')
        .select('*')
        .limit(4)

      if (statsData) setStats(statsData)
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading stats...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="relative container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Milford Sound Tours?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of adventurers who've discovered the magic of New Zealand's most spectacular destination
          </p>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const icons = ['🌟', '🏔️', '😊', '🗺️']
            const gradients = [
              'from-yellow-400 to-orange-500',
              'from-blue-500 to-cyan-500', 
              'from-pink-500 to-purple-500',
              'from-green-500 to-emerald-500'
            ]
            
            return (
              <div 
                key={stat.id} 
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${gradients[index % 4]} flex items-center justify-center text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <span className="filter drop-shadow-sm">{icons[index % 4]}</span>
                  </div>
                  
                  {/* Stat value */}
                  <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${gradients[index % 4]} bg-clip-text text-transparent mb-3 text-center`}>
                    {stat.label === 'Average Rating' ? `${stat.value}/5` : 
                     stat.value >= 1000000 ? `${(stat.value / 1000000).toFixed(0)}M+` :
                     stat.value >= 1000 ? `${(stat.value / 1000).toFixed(0)}K+` :
                     stat.value.toString()}
                  </div>
                  
                  {/* Stat label */}
                  <div className="text-lg font-semibold text-gray-800 mb-2 text-center">
                    {stat.label}
                  </div>
                  
                  {/* Stat description */}
                  <div className="text-sm text-gray-500 text-center leading-relaxed">
                    {getStatDescription(stat.label)}
                  </div>
                  
                  {/* Decorative element */}
                  <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${gradients[index % 4]} rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional trust elements */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-8 bg-white rounded-full px-8 py-4 shadow-lg border">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏆</span>
              <span className="text-sm font-medium">Award Winning</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🛡️</span>
              <span className="text-sm font-medium">Fully Insured</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💚</span>
              <span className="text-sm font-medium">Eco Certified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )

  function getStatDescription(label: string): string {
    switch (label.toLowerCase()) {
      case 'experiences':
        return 'Unique tours and adventures across Fiordland'
      case 'cities':
        return 'Locations throughout New Zealand\'s South Island'
      case 'happy travelers':
        return 'Satisfied customers who\'ve experienced the magic'
      case 'cities covered':
        return 'Destinations from Queenstown to Te Anau'
      default:
        return 'Excellence in every adventure we offer'
    }
  }
}