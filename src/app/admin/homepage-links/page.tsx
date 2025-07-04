'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Edit, Trash2, Save, X, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
  context_type: string
  context_id: string | null
  links: InternalLink[]
}

export default function HomepageLinksManagement() {
  const [sections, setSections] = useState<InternalLinksSection[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editingLink, setEditingLink] = useState<string | null>(null)
  
  const [sectionFormData, setSectionFormData] = useState({
    section_title: '',
    section_type: 'general',
    sort_order: 0,
    enabled: true
  })

  const [linkFormData, setLinkFormData] = useState({
    title: '',
    url: '',
    display_order: 0,
    enabled: true,
    section_id: ''
  })

  useEffect(() => {
    fetchHomepageLinks()
  }, [])

  async function fetchHomepageLinks() {
    const supabase = createClient()
    
    const { data, error } = await supabase
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
      .order('sort_order')

    if (data) {
      const processedSections = data.map(section => ({
        ...section,
        links: (section.internal_links || []).sort((a: InternalLink, b: InternalLink) => a.display_order - b.display_order)
      }))
      setSections(processedSections)
    }
    if (error) console.error('Error fetching homepage links:', error)
    setLoading(false)
  }

  async function saveSection(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()

    if (editingSection) {
      // Update existing section
      const { error } = await supabase
        .from('internal_links_sections')
        .update({
          section_title: sectionFormData.section_title,
          section_type: sectionFormData.section_type,
          sort_order: sectionFormData.sort_order,
          enabled: sectionFormData.enabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingSection)

      if (error) {
        alert('Error updating section')
        console.error(error)
      } else {
        setEditingSection(null)
        resetSectionForm()
        fetchHomepageLinks()
      }
    } else {
      // Create new section
      const { error } = await supabase
        .from('internal_links_sections')
        .insert([{
          section_title: sectionFormData.section_title,
          section_type: sectionFormData.section_type,
          sort_order: sectionFormData.sort_order,
          enabled: sectionFormData.enabled,
          context_type: 'homepage',
          context_id: null
        }])

      if (error) {
        alert('Error creating section')
        console.error(error)
      } else {
        resetSectionForm()
        fetchHomepageLinks()
      }
    }
  }

  async function saveLink(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()

    if (editingLink) {
      // Update existing link
      const { error } = await supabase
        .from('internal_links')
        .update({
          title: linkFormData.title,
          url: linkFormData.url,
          display_order: linkFormData.display_order,
          enabled: linkFormData.enabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingLink)

      if (error) {
        alert('Error updating link')
        console.error(error)
      } else {
        setEditingLink(null)
        resetLinkForm()
        fetchHomepageLinks()
      }
    } else {
      // Create new link
      const { error } = await supabase
        .from('internal_links')
        .insert([{
          title: linkFormData.title,
          url: linkFormData.url,
          display_order: linkFormData.display_order,
          enabled: linkFormData.enabled,
          section_id: linkFormData.section_id
        }])

      if (error) {
        alert('Error creating link')
        console.error(error)
      } else {
        resetLinkForm()
        fetchHomepageLinks()
      }
    }
  }

  async function deleteSection(id: string) {
    if (!confirm('Are you sure you want to delete this section? This will also delete all links in it.')) return

    const supabase = createClient()
    
    const { error } = await supabase
      .from('internal_links_sections')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting section')
      console.error(error)
    } else {
      fetchHomepageLinks()
    }
  }

  async function deleteLink(id: string) {
    if (!confirm('Are you sure you want to delete this link?')) return

    const supabase = createClient()
    
    const { error } = await supabase
      .from('internal_links')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting link')
      console.error(error)
    } else {
      fetchHomepageLinks()
    }
  }

  function editSection(section: InternalLinksSection) {
    setEditingSection(section.id)
    setSectionFormData({
      section_title: section.section_title,
      section_type: section.section_type,
      sort_order: section.sort_order,
      enabled: section.enabled
    })
  }

  function editLink(link: InternalLink, sectionId: string) {
    setEditingLink(link.id)
    setLinkFormData({
      title: link.title,
      url: link.url,
      display_order: link.display_order,
      enabled: link.enabled,
      section_id: sectionId
    })
  }

  function resetSectionForm() {
    setSectionFormData({
      section_title: '',
      section_type: 'general',
      sort_order: 0,
      enabled: true
    })
  }

  function resetLinkForm() {
    setLinkFormData({
      title: '',
      url: '',
      display_order: 0,
      enabled: true,
      section_id: ''
    })
  }

  if (loading) {
    return <div className="text-center py-8">Loading homepage links...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Homepage Links Management</h1>
        <p className="text-gray-600 mt-2">Manage internal links sections on your homepage</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Forms */}
        <div className="lg:col-span-1 space-y-6">
          {/* Section Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {editingSection ? 'Edit Section' : 'Add New Section'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveSection} className="space-y-4">
                <div>
                  <Label htmlFor="section-title">Section Title *</Label>
                  <Input
                    id="section-title"
                    required
                    value={sectionFormData.section_title}
                    onChange={(e) => setSectionFormData(prev => ({ ...prev, section_title: e.target.value }))}
                    placeholder="e.g., Popular Destinations"
                  />
                </div>

                <div>
                  <Label htmlFor="section-type">Section Type</Label>
                  <Select value={sectionFormData.section_type} onValueChange={(value) => setSectionFormData(prev => ({ ...prev, section_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="experiences">Tours</SelectItem>
                      <SelectItem value="information">Information</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="section-sort-order">Sort Order</Label>
                  <Input
                    id="section-sort-order"
                    type="number"
                    value={sectionFormData.sort_order}
                    onChange={(e) => setSectionFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="section-enabled"
                    checked={sectionFormData.enabled}
                    onCheckedChange={(checked) => setSectionFormData(prev => ({ ...prev, enabled: checked }))}
                  />
                  <Label htmlFor="section-enabled">Enabled</Label>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {editingSection ? 'Update' : 'Create'} Section
                  </Button>
                  {editingSection && (
                    <Button type="button" variant="outline" onClick={() => {
                      setEditingSection(null)
                      resetSectionForm()
                    }}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Link Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {editingLink ? 'Edit Link' : 'Add New Link'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveLink} className="space-y-4">
                <div>
                  <Label htmlFor="link-section">Section *</Label>
                  <Select value={linkFormData.section_id} onValueChange={(value) => setLinkFormData(prev => ({ ...prev, section_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map(section => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.section_title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="link-title">Link Title *</Label>
                  <Input
                    id="link-title"
                    required
                    value={linkFormData.title}
                    onChange={(e) => setLinkFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Milford Sound Cruise"
                  />
                </div>

                <div>
                  <Label htmlFor="link-url">URL *</Label>
                  <Input
                    id="link-url"
                    required
                    value={linkFormData.url}
                    onChange={(e) => setLinkFormData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="/tour/milford-sound-cruise"
                  />
                </div>

                <div>
                  <Label htmlFor="link-display-order">Display Order</Label>
                  <Input
                    id="link-display-order"
                    type="number"
                    value={linkFormData.display_order}
                    onChange={(e) => setLinkFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="link-enabled"
                    checked={linkFormData.enabled}
                    onCheckedChange={(checked) => setLinkFormData(prev => ({ ...prev, enabled: checked }))}
                  />
                  <Label htmlFor="link-enabled">Enabled</Label>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1" disabled={!linkFormData.section_id}>
                    <Save className="h-4 w-4 mr-2" />
                    {editingLink ? 'Update' : 'Create'} Link
                  </Button>
                  {editingLink && (
                    <Button type="button" variant="outline" onClick={() => {
                      setEditingLink(null)
                      resetLinkForm()
                    }}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sections List */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {sections.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">No sections found. Create your first section to get started.</p>
                </CardContent>
              </Card>
            ) : (
              sections.map((section) => (
                <Card key={section.id} className={editingSection === section.id ? 'ring-2 ring-primary' : ''}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{section.section_title}</span>
                          {!section.enabled && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                              Disabled
                            </span>
                          )}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          Type: {section.section_type} • Sort Order: {section.sort_order}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editSection(section)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteSection(section.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {section.links.length === 0 ? (
                        <p className="text-gray-500 text-sm">No links in this section</p>
                      ) : (
                        section.links.map((link) => (
                          <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm">
                                {link.display_order}
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{link.title}</span>
                                  {!link.enabled && (
                                    <span className="px-1 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                                      Disabled
                                    </span>
                                  )}
                                </div>
                                <span className="text-sm text-gray-500">{link.url}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => editLink(link, section.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteLink(link.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}