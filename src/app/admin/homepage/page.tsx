'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Save, Plus, Edit, Trash2 } from 'lucide-react'

interface HomepageSection {
  id: string
  section_name: string
  title: string
  subtitle: string
  description: string
  button_text: string
  button_link: string
  background_image: string | null
  enabled: boolean
  sort_order: number
  settings_json: any
  created_at: string
  updated_at: string
}

interface HomepageStat {
  id: string
  label: string
  value: number
  created_at?: string
}

interface WhyChooseUs {
  id: string
  title: string
  description: string
  order: number
  created_at?: string
}

export default function HomepageManagement() {
  const [sections, setSections] = useState<HomepageSection[]>([])
  const [stats, setStats] = useState<HomepageStat[]>([])
  const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUs[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)

  const [editForm, setEditForm] = useState<Partial<HomepageSection>>({})

  const [newStat, setNewStat] = useState({
    label: '',
    value: 0
  })

  const [newWhyChooseUs, setNewWhyChooseUs] = useState({
    title: '',
    description: '',
    order: 1
  })

  useEffect(() => {
    fetchHomepageData()
  }, [])

  async function fetchHomepageData() {
    const supabase = createClient()
    
    try {
      // Fetch homepage sections
      const { data: sectionsData } = await supabase
        .from('homepage_settings')
        .select('*')
        .order('sort_order')
      
      if (sectionsData) setSections(sectionsData)

      // Fetch stats
      const { data: statsData } = await supabase
        .from('homepage_stats')
        .select('*')
        .order('id')
      
      if (statsData) setStats(statsData)

      // Fetch why choose us items
      const { data: whyChooseUsData } = await supabase
        .from('homepage_why_choose_us')
        .select('*')
        .order('order')
      
      if (whyChooseUsData) setWhyChooseUs(whyChooseUsData)

    } catch (error) {
      console.error('Error fetching homepage data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveSection(sectionId: string) {
    setSaving(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('homepage_settings')
        .update({
          ...editForm,
          updated_at: new Date().toISOString()
        })
        .eq('id', sectionId)

      if (error) throw error
      
      await fetchHomepageData()
      setEditingSection(null)
      setEditForm({})
    } catch (error) {
      console.error('Error saving section:', error)
    } finally {
      setSaving(false)
    }
  }

  async function toggleSection(sectionId: string, enabled: boolean) {
    const supabase = createClient()
    
    try {
      const { error } = await supabase
        .from('homepage_settings')
        .update({ 
          enabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', sectionId)

      if (error) throw error
      await fetchHomepageData()
    } catch (error) {
      console.error('Error toggling section:', error)
    }
  }

  async function saveStat() {
    const supabase = createClient()
    
    try {
      const { error } = await supabase
        .from('homepage_stats')
        .insert([newStat])

      if (error) throw error
      
      setNewStat({
        label: '',
        value: 0
      })
      await fetchHomepageData()
    } catch (error) {
      console.error('Error saving stat:', error)
    }
  }

  async function updateStat(id: string, label: string, value: number) {
    const supabase = createClient()
    
    try {
      const { error } = await supabase
        .from('homepage_stats')
        .update({ label, value })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating stat:', error)
    }
  }

  async function deleteStat(id: string) {
    if (!confirm('Are you sure you want to delete this statistic?')) return

    const supabase = createClient()
    
    try {
      const { error } = await supabase
        .from('homepage_stats')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchHomepageData()
    } catch (error) {
      console.error('Error deleting stat:', error)
    }
  }

  async function saveWhyChooseUs() {
    const supabase = createClient()
    
    try {
      const { error } = await supabase
        .from('homepage_why_choose_us')
        .insert([newWhyChooseUs])

      if (error) throw error
      
      setNewWhyChooseUs({
        title: '',
        description: '',
        order: whyChooseUs.length + 1
      })
      await fetchHomepageData()
    } catch (error) {
      console.error('Error saving why choose us item:', error)
    }
  }

  async function updateWhyChooseUs(id: string, title: string, description: string, order: number) {
    const supabase = createClient()
    
    try {
      const { error } = await supabase
        .from('homepage_why_choose_us')
        .update({ title, description, order })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating why choose us item:', error)
    }
  }

  async function deleteWhyChooseUs(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return

    const supabase = createClient()
    
    try {
      const { error } = await supabase
        .from('homepage_why_choose_us')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchHomepageData()
    } catch (error) {
      console.error('Error deleting why choose us item:', error)
    }
  }

  function startEditing(section: HomepageSection) {
    setEditingSection(section.id)
    setEditForm({
      title: section.title,
      subtitle: section.subtitle,
      description: section.description,
      button_text: section.button_text,
      button_link: section.button_link,
      background_image: section.background_image,
      enabled: section.enabled
    })
  }

  function getSectionDisplayName(sectionName: string) {
    const names: Record<string, string> = {
      'hero_section': 'Hero Section',
      'featured_experiences': 'Featured Experiences',
      'faq_section': 'FAQ Section',
      'internal_links_section': 'Internal Links Section'
    }
    return names[sectionName] || sectionName.replace('_', ' ')
  }

  if (loading) {
    return <div className="text-center py-8">Loading homepage data...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Homepage Management</h1>
        <p className="text-gray-600 mt-2">Manage homepage content and settings</p>
      </div>

      {/* Homepage Sections */}
      {sections.map((section) => (
        <Card key={section.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <CardTitle>{getSectionDisplayName(section.section_name)}</CardTitle>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={section.enabled}
                  onCheckedChange={(enabled) => toggleSection(section.id, enabled)}
                />
                <span className="text-sm text-gray-500">
                  {section.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editingSection === section.id ? setEditingSection(null) : startEditing(section)}
            >
              <Edit className="h-4 w-4 mr-2" />
              {editingSection === section.id ? 'Cancel' : 'Edit'}
            </Button>
          </CardHeader>
          <CardContent>
            {editingSection === section.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`title-${section.id}`}>Title</Label>
                    <Input
                      id={`title-${section.id}`}
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter section title"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`subtitle-${section.id}`}>Subtitle</Label>
                    <Input
                      id={`subtitle-${section.id}`}
                      value={editForm.subtitle || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="Enter section subtitle"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor={`description-${section.id}`}>Description</Label>
                  <Textarea
                    id={`description-${section.id}`}
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter section description"
                    rows={3}
                  />
                </div>

                {section.section_name === 'hero_section' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`button-text-${section.id}`}>Button Text</Label>
                      <Input
                        id={`button-text-${section.id}`}
                        value={editForm.button_text || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, button_text: e.target.value }))}
                        placeholder="e.g., Discover More"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`button-link-${section.id}`}>Button Link</Label>
                      <Input
                        id={`button-link-${section.id}`}
                        value={editForm.button_link || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, button_link: e.target.value }))}
                        placeholder="e.g., /tours"
                      />
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button onClick={() => saveSection(section.id)} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={() => setEditingSection(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                  {section.subtitle && (
                    <p className="text-base text-gray-700">{section.subtitle}</p>
                  )}
                  <p className="text-gray-600 mt-1">{section.description}</p>
                </div>
                
                {section.button_text && (
                  <div className="text-sm text-gray-500">
                    Button: "{section.button_text}" → {section.button_link}
                  </div>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Sort Order: {section.sort_order}</span>
                  <span className={`px-2 py-1 rounded text-xs ${section.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {section.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Statistics Section */}
      <Card>
        <CardHeader>
          <CardTitle>Homepage Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            {stats.map((stat, index) => (
              <div key={stat.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <Input
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...stats]
                      newStats[index].label = e.target.value
                      setStats(newStats)
                      updateStat(stat.id, e.target.value, stat.value)
                    }}
                    placeholder="Statistic label"
                    className="mb-2"
                  />
                  <Input
                    type="number"
                    value={stat.value}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 0
                      const newStats = [...stats]
                      newStats[index].value = newValue
                      setStats(newStats)
                      updateStat(stat.id, stat.label, newValue)
                    }}
                    placeholder="Value"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteStat(stat.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="border-t pt-6">
            <h4 className="font-medium mb-4">Add New Statistic</h4>
            <div className="flex space-x-4">
              <Input
                value={newStat.label}
                onChange={(e) => setNewStat(prev => ({ ...prev, label: e.target.value }))}
                placeholder="e.g., Happy Customers"
                className="flex-1"
              />
              <Input
                type="number"
                value={newStat.value}
                onChange={(e) => setNewStat(prev => ({ ...prev, value: parseInt(e.target.value) || 0 }))}
                placeholder="e.g., 50000"
                className="w-32"
              />
              <Button onClick={saveStat}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Why Choose Us Section */}
      <Card>
        <CardHeader>
          <CardTitle>Why Choose Us</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            {whyChooseUs.map((item, index) => (
              <div key={item.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 space-y-3">
                    <Input
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...whyChooseUs]
                        newItems[index].title = e.target.value
                        setWhyChooseUs(newItems)
                        updateWhyChooseUs(item.id, e.target.value, item.description, item.order)
                      }}
                      placeholder="Title"
                    />
                    <Textarea
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...whyChooseUs]
                        newItems[index].description = e.target.value
                        setWhyChooseUs(newItems)
                        updateWhyChooseUs(item.id, item.title, e.target.value, item.order)
                      }}
                      placeholder="Description"
                      rows={2}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteWhyChooseUs(item.id)}
                    className="text-red-600 ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-6">
            <h4 className="font-medium mb-4">Add New Item</h4>
            <div className="space-y-3">
              <Input
                value={newWhyChooseUs.title}
                onChange={(e) => setNewWhyChooseUs(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Expert Guides"
              />
              <Textarea
                value={newWhyChooseUs.description}
                onChange={(e) => setNewWhyChooseUs(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this benefit"
                rows={2}
              />
              <Button onClick={saveWhyChooseUs}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}