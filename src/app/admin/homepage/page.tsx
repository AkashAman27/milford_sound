'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface HomepageHero {
  id: string
  title: string
  subtitle: string
  background_image: string
  cta_text: string
  cta_url: string
}

interface HomepageStat {
  id: string
  label: string
  value: number
}

interface WhyChooseUs {
  id: string
  title: string
  description: string
  order: number
}

export default function HomepageManagement() {
  const [hero, setHero] = useState<HomepageHero | null>(null)
  const [stats, setStats] = useState<HomepageStat[]>([])
  const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUs[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchHomepageData()
  }, [])

  async function fetchHomepageData() {
    const supabase = createClient()
    
    try {
      const [heroData, statsData, whyChooseUsData] = await Promise.all([
        supabase.from('homepage_hero').select('*').single(),
        supabase.from('homepage_stats').select('*').order('id'),
        supabase.from('homepage_why_choose_us').select('*').order('order')
      ])

      if (heroData.data) setHero(heroData.data)
      if (statsData.data) setStats(statsData.data)
      if (whyChooseUsData.data) setWhyChooseUs(whyChooseUsData.data)
    } catch (error) {
      console.error('Error fetching homepage data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveHero() {
    if (!hero) return
    
    setSaving(true)
    const supabase = createClient()
    
    const { error } = await supabase
      .from('homepage_hero')
      .update({
        title: hero.title,
        subtitle: hero.subtitle,
        background_image: hero.background_image,
        cta_text: hero.cta_text,
        cta_url: hero.cta_url
      })
      .eq('id', hero.id)

    if (error) {
      alert('Error saving hero section')
      console.error(error)
    } else {
      alert('Hero section saved successfully!')
    }
    
    setSaving(false)
  }

  async function saveStats() {
    setSaving(true)
    const supabase = createClient()
    
    try {
      for (const stat of stats) {
        await supabase
          .from('homepage_stats')
          .update({
            label: stat.label,
            value: stat.value
          })
          .eq('id', stat.id)
      }
      alert('Stats saved successfully!')
    } catch (error) {
      alert('Error saving stats')
      console.error(error)
    }
    
    setSaving(false)
  }

  async function saveWhyChooseUs() {
    setSaving(true)
    const supabase = createClient()
    
    try {
      for (const item of whyChooseUs) {
        await supabase
          .from('homepage_why_choose_us')
          .update({
            title: item.title,
            description: item.description,
            order: item.order
          })
          .eq('id', item.id)
      }
      alert('Why Choose Us section saved successfully!')
    } catch (error) {
      alert('Error saving Why Choose Us section')
      console.error(error)
    }
    
    setSaving(false)
  }

  if (loading) {
    return <div className="text-center py-8">Loading homepage data...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Homepage Management</h1>
        <p className="text-gray-600 mt-2">Manage your homepage content and layout</p>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        {hero && (
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Title
                </label>
                <input
                  type="text"
                  value={hero.title}
                  onChange={(e) => setHero({ ...hero, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <textarea
                  value={hero.subtitle}
                  onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Image URL
                </label>
                <input
                  type="url"
                  value={hero.background_image}
                  onChange={(e) => setHero({ ...hero, background_image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={hero.cta_text}
                    onChange={(e) => setHero({ ...hero, cta_text: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CTA Button URL
                  </label>
                  <input
                    type="text"
                    value={hero.cta_url}
                    onChange={(e) => setHero({ ...hero, cta_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <Button onClick={saveHero} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                Save Hero Section
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Section */}
        <Card>
          <CardHeader>
            <CardTitle>Homepage Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={stat.id} className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {stat.label} - Label
                    </label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...stats]
                        newStats[index].label = e.target.value
                        setStats(newStats)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Value
                    </label>
                    <input
                      type="number"
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = [...stats]
                        newStats[index].value = parseInt(e.target.value) || 0
                        setStats(newStats)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={saveStats} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              Save Stats
            </Button>
          </CardContent>
        </Card>

        {/* Why Choose Us Section */}
        <Card>
          <CardHeader>
            <CardTitle>Why Choose Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {whyChooseUs.map((item, index) => (
              <div key={item.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...whyChooseUs]
                        newItems[index].title = e.target.value
                        setWhyChooseUs(newItems)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...whyChooseUs]
                        newItems[index].description = e.target.value
                        setWhyChooseUs(newItems)
                      }}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button onClick={saveWhyChooseUs} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              Save Why Choose Us
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}