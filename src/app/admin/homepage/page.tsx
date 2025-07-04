'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Save, Eye, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface HomepageSettings {
  id: string
  section_name: string
  title: string
  subtitle: string
  description: string
  button_text: string
  button_link: string
  background_image?: string
  enabled: boolean
  sort_order: number
  settings_json?: any
}

export default function HomepageAdmin() {
  const [settings, setSettings] = useState<HomepageSettings[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('homepage_settings')
        .select('*')
        .order('sort_order')

      if (error) {
        console.error('Error fetching settings:', error)
        setMessage({ type: 'error', text: 'Failed to load homepage settings' })
      } else {
        setSettings(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', text: 'Failed to load homepage settings' })
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (sectionName: string, field: keyof HomepageSettings, value: any) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.section_name === sectionName 
          ? { ...setting, [field]: value }
          : setting
      )
    )
  }

  const saveSetting = async (setting: HomepageSettings) => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('homepage_settings')
        .update({
          title: setting.title,
          subtitle: setting.subtitle,
          description: setting.description,
          button_text: setting.button_text,
          button_link: setting.button_link,
          background_image: setting.background_image,
          enabled: setting.enabled,
          settings_json: setting.settings_json,
          updated_at: new Date().toISOString()
        })
        .eq('id', setting.id)

      if (error) {
        console.error('Error saving setting:', error)
        setMessage({ type: 'error', text: 'Failed to save settings' })
      } else {
        setMessage({ type: 'success', text: 'Settings saved successfully!' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', text: 'Failed to save settings' })
    } finally {
      setSaving(false)
    }
  }

  const saveAllSettings = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      
      for (const setting of settings) {
        const { error } = await supabase
          .from('homepage_settings')
          .update({
            title: setting.title,
            subtitle: setting.subtitle,
            description: setting.description,
            button_text: setting.button_text,
            button_link: setting.button_link,
            background_image: setting.background_image,
            enabled: setting.enabled,
            settings_json: setting.settings_json,
            updated_at: new Date().toISOString()
          })
          .eq('id', setting.id)

        if (error) {
          console.error('Error saving setting:', error)
          setMessage({ type: 'error', text: 'Failed to save some settings' })
          return
        }
      }

      setMessage({ type: 'success', text: 'All settings saved successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', text: 'Failed to save settings' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading homepage settings...</p>
      </div>
    )
  }

  const heroSetting = settings.find(s => s.section_name === 'hero_section')
  const featuredExperiencesSetting = settings.find(s => s.section_name === 'featured_experiences')
  const faqSetting = settings.find(s => s.section_name === 'faq_section')
  const internalLinksSetting = settings.find(s => s.section_name === 'internal_links_section')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Homepage Management</h1>
          <p className="text-gray-600 mt-2">Customize your homepage content and settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchSettings} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={saveAllSettings} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save All'}
          </Button>
        </div>
      </div>

      {message && (
        <Alert className={message.type === 'error' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}>
          <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Hero Section Settings */}
      {heroSetting && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Hero Section
              <div className="flex items-center space-x-2">
                <Label htmlFor="hero-enabled" className="text-sm">Enabled</Label>
                <Switch
                  id="hero-enabled"
                  checked={heroSetting.enabled}
                  onCheckedChange={(checked) => updateSetting('hero_section', 'enabled', checked)}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hero-title">Main Title</Label>
                  <Input
                    id="hero-title"
                    value={heroSetting.title}
                    onChange={(e) => updateSetting('hero_section', 'title', e.target.value)}
                    placeholder="Enter main title..."
                  />
                  <p className="text-xs text-gray-500 mt-1">The primary headline on your homepage</p>
                </div>

                <div>
                  <Label htmlFor="hero-subtitle">Subtitle</Label>
                  <Input
                    id="hero-subtitle"
                    value={heroSetting.subtitle}
                    onChange={(e) => updateSetting('hero_section', 'subtitle', e.target.value)}
                    placeholder="Enter subtitle..."
                  />
                  <p className="text-xs text-gray-500 mt-1">The colored subtitle (appears in gradient)</p>
                </div>

                <div>
                  <Label htmlFor="hero-description">Description</Label>
                  <Textarea
                    id="hero-description"
                    value={heroSetting.description}
                    onChange={(e) => updateSetting('hero_section', 'description', e.target.value)}
                    placeholder="Enter description..."
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">Brief description below the title</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="hero-button-text">Button Text</Label>
                  <Input
                    id="hero-button-text"
                    value={heroSetting.button_text}
                    onChange={(e) => updateSetting('hero_section', 'button_text', e.target.value)}
                    placeholder="Enter button text..."
                  />
                </div>

                <div>
                  <Label htmlFor="hero-button-link">Button Link</Label>
                  <Input
                    id="hero-button-link"
                    value={heroSetting.button_link}
                    onChange={(e) => updateSetting('hero_section', 'button_link', e.target.value)}
                    placeholder="/tours"
                  />
                  <p className="text-xs text-gray-500 mt-1">Where the button should link to</p>
                </div>

                <div>
                  <Label htmlFor="hero-background">Background Image (Optional)</Label>
                  <Input
                    id="hero-background"
                    value={heroSetting.background_image || ''}
                    onChange={(e) => updateSetting('hero_section', 'background_image', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">URL to background image (optional)</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <Button variant="outline" asChild>
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Homepage
                </a>
              </Button>
              
              <Button onClick={() => saveSetting(heroSetting)} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Hero Section'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Featured Experiences Section */}
      {featuredExperiencesSetting && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Featured Experiences Section
              <div className="flex items-center space-x-2">
                <Label htmlFor="featured-enabled" className="text-sm">Enabled</Label>
                <Switch
                  id="featured-enabled"
                  checked={featuredExperiencesSetting.enabled}
                  onCheckedChange={(checked) => updateSetting('featured_experiences', 'enabled', checked)}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="featured-title">Section Title</Label>
                  <Input
                    id="featured-title"
                    value={featuredExperiencesSetting.title}
                    onChange={(e) => updateSetting('featured_experiences', 'title', e.target.value)}
                    placeholder="Top Experiences"
                  />
                </div>

                <div>
                  <Label htmlFor="featured-description">Section Description</Label>
                  <Textarea
                    id="featured-description"
                    value={featuredExperiencesSetting.description}
                    onChange={(e) => updateSetting('featured_experiences', 'description', e.target.value)}
                    placeholder="Discover the most popular tours and activities..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="featured-count">Number of Experiences to Show</Label>
                  <Input
                    id="featured-count"
                    type="number"
                    min="1"
                    max="12"
                    value={featuredExperiencesSetting.settings_json?.featured_count || 6}
                    onChange={(e) => {
                      const count = parseInt(e.target.value) || 6
                      updateSetting('featured_experiences', 'settings_json', {
                        ...featuredExperiencesSetting.settings_json,
                        featured_count: count
                      })
                    }}
                    placeholder="6"
                  />
                  <p className="text-xs text-gray-500 mt-1">Choose between 1-12 experiences to display</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">How to Control Which Experiences Show:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Go to <strong>Admin → Experiences</strong></li>
                    <li>• Edit any experience</li>
                    <li>• Check the <strong>"Featured"</strong> checkbox</li>
                    <li>• Only featured experiences appear in this section</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <Button variant="outline" asChild>
                <a href="/admin/experiences" target="_blank" rel="noopener noreferrer">
                  <Eye className="h-4 w-4 mr-2" />
                  Manage Featured Experiences
                </a>
              </Button>
              
              <Button onClick={() => saveSetting(featuredExperiencesSetting)} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Featured Section'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ Section Settings */}
      {faqSetting && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              FAQ Section
              <div className="flex items-center space-x-2">
                <Label htmlFor="faq-enabled" className="text-sm">Enabled</Label>
                <Switch
                  id="faq-enabled"
                  checked={faqSetting.enabled}
                  onCheckedChange={(checked) => updateSetting('faq_section', 'enabled', checked)}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="faq-title">Section Title</Label>
                  <Input
                    id="faq-title"
                    value={faqSetting.title}
                    onChange={(e) => updateSetting('faq_section', 'title', e.target.value)}
                    placeholder="Frequently Asked Questions"
                  />
                </div>

                <div>
                  <Label htmlFor="faq-description">Section Description</Label>
                  <Textarea
                    id="faq-description"
                    value={faqSetting.description}
                    onChange={(e) => updateSetting('faq_section', 'description', e.target.value)}
                    placeholder="Find answers to common questions..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">How to Manage FAQs:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Go to <strong>Admin → FAQs</strong></li>
                  <li>• Add new questions and answers</li>
                  <li>• Set sort order to control display order</li>
                  <li>• Enable/disable individual FAQs</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <Button variant="outline" asChild>
                <a href="/admin/faqs" target="_blank" rel="noopener noreferrer">
                  <Eye className="h-4 w-4 mr-2" />
                  Manage FAQs
                </a>
              </Button>
              
              <Button onClick={() => saveSetting(faqSetting)} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save FAQ Section'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Internal Links Section Settings */}
      {internalLinksSetting && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Internal Links Section
              <div className="flex items-center space-x-2">
                <Label htmlFor="internal-links-enabled" className="text-sm">Enabled</Label>
                <Switch
                  id="internal-links-enabled"
                  checked={internalLinksSetting.enabled}
                  onCheckedChange={(checked) => updateSetting('internal_links_section', 'enabled', checked)}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="internal-links-title">Section Title</Label>
                  <Input
                    id="internal-links-title"
                    value={internalLinksSetting.title}
                    onChange={(e) => updateSetting('internal_links_section', 'title', e.target.value)}
                    placeholder="Explore More"
                  />
                </div>

                <div>
                  <Label htmlFor="internal-links-description">Section Description</Label>
                  <Textarea
                    id="internal-links-description"
                    value={internalLinksSetting.description}
                    onChange={(e) => updateSetting('internal_links_section', 'description', e.target.value)}
                    placeholder="Discover everything we have to offer"
                    rows={3}
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">How to Manage Internal Links:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Go to <strong>Admin → Homepage Links</strong></li>
                  <li>• Create sections (e.g., Popular Destinations)</li>
                  <li>• Add links to each section</li>
                  <li>• Set display order and enable/disable</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <Button variant="outline" asChild>
                <a href="/admin/homepage-links" target="_blank" rel="noopener noreferrer">
                  <Eye className="h-4 w-4 mr-2" />
                  Manage Homepage Links
                </a>
              </Button>
              
              <Button onClick={() => saveSetting(internalLinksSetting)} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Links Section'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}