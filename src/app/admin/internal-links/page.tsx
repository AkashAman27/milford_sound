'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Save, X, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface InternalLinksSection {
  id: string
  experience_id?: string
  section_title: string
  section_type: string
  sort_order: number
  enabled: boolean
  context_type?: string
  context_id?: string
  created_at: string
  updated_at: string
  experiences?: { title: string; slug: string }
  internal_links?: InternalLink[]
}

interface InternalLink {
  id: string
  section_id: string
  title: string
  url: string
  display_order: number
  enabled: boolean
  created_at: string
  updated_at: string
}

interface Experience {
  id: string
  title: string
  slug: string
}

export default function InternalLinksPage() {
  const [sections, setSections] = useState<InternalLinksSection[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingSection, setEditingSection] = useState<InternalLinksSection | null>(null)
  const [newSection, setNewSection] = useState({
    experience_id: '',
    section_title: '',
    section_type: 'related_tours',
    sort_order: 1,
    enabled: true
  })
  const [showNewForm, setShowNewForm] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabase = createClient()

    try {
      // Fetch internal link sections with related data
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('internal_links_sections')
        .select(`
          *,
          experiences(title, slug),
          internal_links(*)
        `)
        .order('sort_order', { ascending: true })

      if (sectionsError) throw sectionsError
      setSections(sectionsData || [])

      // Fetch experiences for dropdown
      const { data: experiencesData, error: experiencesError } = await supabase
        .from('experiences')
        .select('id, title, slug')
        .eq('status', 'active')
        .order('title')

      if (experiencesError) throw experiencesError
      setExperiences(experiencesData || [])

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSection = async () => {
    if (!newSection.section_title.trim()) return

    const supabase = createClient()
    
    try {
      const { error } = await supabase
        .from('internal_links_sections')
        .insert([{
          experience_id: newSection.experience_id || null,
          section_title: newSection.section_title.trim(),
          section_type: newSection.section_type,
          sort_order: newSection.sort_order,
          enabled: newSection.enabled
        }])

      if (error) throw error

      setNewSection({
        experience_id: '',
        section_title: '',
        section_type: 'related_tours',
        sort_order: 1,
        enabled: true
      })
      setShowNewForm(false)
      fetchData()
    } catch (error) {
      console.error('Error creating section:', error)
    }
  }

  const handleUpdateSection = async (id: string, updates: Partial<InternalLinksSection>) => {
    const supabase = createClient()
    
    try {
      const { error } = await supabase
        .from('internal_links_sections')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      
      setEditingId(null)
      setEditingSection(null)
      fetchData()
    } catch (error) {
      console.error('Error updating section:', error)
    }
  }

  const handleDeleteSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section and all its links?')) return

    const supabase = createClient()
    
    try {
      // First delete all links in this section
      await supabase
        .from('internal_links')
        .delete()
        .eq('section_id', id)

      // Then delete the section
      const { error } = await supabase
        .from('internal_links_sections')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting section:', error)
    }
  }

  const toggleSectionEnabled = async (id: string, enabled: boolean) => {
    await handleUpdateSection(id, { enabled })
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading internal links...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Internal Links</h1>
          <p className="text-gray-600 mt-2">Manage internal link sections for your tours</p>
        </div>
        <Button onClick={() => setShowNewForm(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      {/* New Section Form */}
      {showNewForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Internal Links Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="new-experience">Tour (Optional)</Label>
              <select
                id="new-experience"
                value={newSection.experience_id}
                onChange={(e) => setNewSection(prev => ({ ...prev, experience_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Global Section (All Tours)</option>
                {experiences.map((experience) => (
                  <option key={experience.id} value={experience.id}>
                    {experience.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="new-title">Section Title</Label>
              <Input
                id="new-title"
                value={newSection.section_title}
                onChange={(e) => setNewSection(prev => ({ ...prev, section_title: e.target.value }))}
                placeholder="e.g., Related Tours, You Might Also Like"
              />
            </div>

            <div>
              <Label htmlFor="new-type">Section Type</Label>
              <select
                id="new-type"
                value={newSection.section_type}
                onChange={(e) => setNewSection(prev => ({ ...prev, section_type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="related_tours">Related Tours</option>
                <option value="recommended">Recommended</option>
                <option value="popular">Popular Tours</option>
                <option value="blog_posts">Travel Guide Posts</option>
                <option value="custom">Custom Links</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <Label htmlFor="new-sort-order">Sort Order</Label>
                <Input
                  id="new-sort-order"
                  type="number"
                  value={newSection.sort_order}
                  onChange={(e) => setNewSection(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 1 }))}
                  className="w-20"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="new-enabled"
                  checked={newSection.enabled}
                  onChange={(e) => setNewSection(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="mr-2"
                />
                <Label htmlFor="new-enabled">Enabled</Label>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleCreateSection}>
                <Save className="h-4 w-4 mr-2" />
                Save Section
              </Button>
              <Button variant="outline" onClick={() => setShowNewForm(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Section Form */}
      {editingId && editingSection && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Edit Internal Links Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="edit-experience">Tour (Optional)</Label>
              <select
                id="edit-experience"
                value={editingSection.experience_id || ''}
                onChange={(e) => setEditingSection(prev => prev ? ({ ...prev, experience_id: e.target.value || undefined }) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Global Section (All Tours)</option>
                {experiences.map((experience) => (
                  <option key={experience.id} value={experience.id}>
                    {experience.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="edit-title">Section Title</Label>
              <Input
                id="edit-title"
                value={editingSection.section_title}
                onChange={(e) => setEditingSection(prev => prev ? ({ ...prev, section_title: e.target.value }) : null)}
                placeholder="e.g., Related Tours, You Might Also Like"
              />
            </div>

            <div>
              <Label htmlFor="edit-type">Section Type</Label>
              <select
                id="edit-type"
                value={editingSection.section_type}
                onChange={(e) => setEditingSection(prev => prev ? ({ ...prev, section_type: e.target.value }) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="related_tours">Related Tours</option>
                <option value="recommended">Recommended</option>
                <option value="popular">Popular Tours</option>
                <option value="blog_posts">Travel Guide Posts</option>
                <option value="custom">Custom Links</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <Label htmlFor="edit-sort-order">Sort Order</Label>
                <Input
                  id="edit-sort-order"
                  type="number"
                  value={editingSection.sort_order}
                  onChange={(e) => setEditingSection(prev => prev ? ({ ...prev, sort_order: parseInt(e.target.value) || 1 }) : null)}
                  className="w-20"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="edit-enabled"
                  checked={editingSection.enabled}
                  onChange={(e) => setEditingSection(prev => prev ? ({ ...prev, enabled: e.target.checked }) : null)}
                  className="mr-2"
                />
                <Label htmlFor="edit-enabled">Enabled</Label>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={() => {
                if (editingSection) {
                  handleUpdateSection(editingId, {
                    experience_id: editingSection.experience_id || null,
                    section_title: editingSection.section_title,
                    section_type: editingSection.section_type,
                    sort_order: editingSection.sort_order,
                    enabled: editingSection.enabled
                  })
                }
              }}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => {
                setEditingId(null)
                setEditingSection(null)
              }}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sections List */}
      <div className="space-y-4">
        {sections.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">No internal link sections found. Create your first section to get started.</p>
            </CardContent>
          </Card>
        ) : (
          sections.map((section) => (
            <Card key={section.id} className={`${!section.enabled ? 'opacity-60' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{section.section_title}</h3>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                        {section.section_type}
                      </span>
                      {!section.enabled && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">Disabled</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {section.experience_id && section.experiences ? 
                        `Tour: ${section.experiences.title}` : 
                        'Global Section (All Tours)'
                      } • Sort: {section.sort_order}
                    </div>
                    <div className="text-sm text-gray-500">
                      Links: {section.internal_links?.length || 0}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Link href={`/admin/internal-links/${section.id}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Manage Links
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSectionEnabled(section.id, !section.enabled)}
                    >
                      {section.enabled ? 'Disable' : 'Enable'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(section.id)
                        setEditingSection({ ...section })
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSection(section.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}