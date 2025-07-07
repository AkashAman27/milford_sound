'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Plus, Edit, Trash2, Save, X, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

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

interface Section {
  id: string
  section_title: string
  section_type: string
  experience_id?: string
  experiences?: { title: string; slug: string }
}

export default function InternalLinksManagement() {
  const params = useParams()
  const sectionId = params.experienceId as string // Note: this is actually sectionId due to route naming
  
  const [section, setSection] = useState<Section | null>(null)
  const [links, setLinks] = useState<InternalLink[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingLink, setEditingLink] = useState<InternalLink | null>(null)
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    display_order: 1,
    enabled: true
  })
  const [showNewForm, setShowNewForm] = useState(false)

  useEffect(() => {
    fetchData()
  }, [sectionId])

  const fetchData = async () => {
    const supabase = createClient()

    try {
      // Fetch section details
      const { data: sectionData, error: sectionError } = await supabase
        .from('internal_links_sections')
        .select(`
          *,
          experiences(title, slug)
        `)
        .eq('id', sectionId)
        .single()

      if (sectionError) throw sectionError
      setSection(sectionData)

      // Fetch links for this section
      const { data: linksData, error: linksError } = await supabase
        .from('internal_links')
        .select('*')
        .eq('section_id', sectionId)
        .order('display_order', { ascending: true })

      if (linksError) throw linksError
      setLinks(linksData || [])

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLink = async () => {
    if (!newLink.title.trim() || !newLink.url.trim()) return

    const supabase = createClient()
    
    try {
      const { error } = await supabase
        .from('internal_links')
        .insert([{
          section_id: sectionId,
          title: newLink.title.trim(),
          url: newLink.url.trim(),
          display_order: newLink.display_order,
          enabled: newLink.enabled
        }])

      if (error) throw error

      setNewLink({
        title: '',
        url: '',
        display_order: 1,
        enabled: true
      })
      setShowNewForm(false)
      fetchData()
    } catch (error) {
      console.error('Error creating link:', error)
    }
  }

  const handleUpdateLink = async (id: string, updates: Partial<InternalLink>) => {
    const supabase = createClient()
    
    try {
      const { error } = await supabase
        .from('internal_links')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      
      setEditingId(null)
      setEditingLink(null)
      fetchData()
    } catch (error) {
      console.error('Error updating link:', error)
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return

    const supabase = createClient()
    
    try {
      const { error } = await supabase
        .from('internal_links')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting link:', error)
    }
  }

  const toggleLinkEnabled = async (id: string, enabled: boolean) => {
    await handleUpdateLink(id, { enabled })
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
      <div className="flex items-center mb-8">
        <Link href="/admin/internal-links">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Internal Links
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Links</h1>
          <p className="text-gray-600 mt-2">
            {section?.section_title} - {section?.experiences ? `Tour: ${section.experiences.title}` : 'Global Section'}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Internal Links</h2>
          <p className="text-gray-600">Manage the links displayed in this section</p>
        </div>
        <Button onClick={() => setShowNewForm(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </div>

      {/* New Link Form */}
      {showNewForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="new-title">Link Title</Label>
              <Input
                id="new-title"
                value={newLink.title}
                onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., TPS Site Cruise"
              />
            </div>

            <div>
              <Label htmlFor="new-url">URL</Label>
              <Input
                id="new-url"
                value={newLink.url}
                onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                placeholder="e.g., /tour/milford-sound-cruise or https://external-link.com"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <Label htmlFor="new-display-order">Display Order</Label>
                <Input
                  id="new-display-order"
                  type="number"
                  value={newLink.display_order}
                  onChange={(e) => setNewLink(prev => ({ ...prev, display_order: parseInt(e.target.value) || 1 }))}
                  className="w-20"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="new-enabled"
                  checked={newLink.enabled}
                  onChange={(e) => setNewLink(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="mr-2"
                />
                <Label htmlFor="new-enabled">Enabled</Label>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleCreateLink}>
                <Save className="h-4 w-4 mr-2" />
                Save Link
              </Button>
              <Button variant="outline" onClick={() => setShowNewForm(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Link Form */}
      {editingId && editingLink && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Edit Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Link Title</Label>
              <Input
                id="edit-title"
                value={editingLink.title}
                onChange={(e) => setEditingLink(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                placeholder="e.g., TPS Site Cruise"
              />
            </div>

            <div>
              <Label htmlFor="edit-url">URL</Label>
              <Input
                id="edit-url"
                value={editingLink.url}
                onChange={(e) => setEditingLink(prev => prev ? ({ ...prev, url: e.target.value }) : null)}
                placeholder="e.g., /tour/milford-sound-cruise or https://external-link.com"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <Label htmlFor="edit-display-order">Display Order</Label>
                <Input
                  id="edit-display-order"
                  type="number"
                  value={editingLink.display_order}
                  onChange={(e) => setEditingLink(prev => prev ? ({ ...prev, display_order: parseInt(e.target.value) || 1 }) : null)}
                  className="w-20"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="edit-enabled"
                  checked={editingLink.enabled}
                  onChange={(e) => setEditingLink(prev => prev ? ({ ...prev, enabled: e.target.checked }) : null)}
                  className="mr-2"
                />
                <Label htmlFor="edit-enabled">Enabled</Label>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={() => {
                if (editingLink) {
                  handleUpdateLink(editingId, {
                    title: editingLink.title,
                    url: editingLink.url,
                    display_order: editingLink.display_order,
                    enabled: editingLink.enabled
                  })
                }
              }}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => {
                setEditingId(null)
                setEditingLink(null)
              }}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Links List */}
      <div className="space-y-4">
        {links.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">No links found. Add your first link to get started.</p>
            </CardContent>
          </Card>
        ) : (
          links.map((link) => (
            <Card key={link.id} className={`${!link.enabled ? 'opacity-60' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{link.title}</h3>
                      {!link.enabled && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">Disabled</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      URL: {link.url}
                    </div>
                    <div className="text-sm text-gray-500">
                      Display Order: {link.display_order}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(link.url.startsWith('http') ? link.url : `${window.location.origin}${link.url}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleLinkEnabled(link.id, !link.enabled)}
                    >
                      {link.enabled ? 'Disable' : 'Enable'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(link.id)
                        setEditingLink({ ...link })
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteLink(link.id)}
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