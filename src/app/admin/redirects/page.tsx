'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, Edit, Save, X } from 'lucide-react'
import { sanitizeUuidFields } from '@/lib/utils/form-helpers'

interface SlugRedirect {
  id: string
  old_slug: string
  new_slug: string
  content_type: string
  content_id: string
  created_at: string
  permanent: boolean
}

interface ContentItem {
  id: string
  title: string
  slug: string
}

const COMMON_UUID_FIELDS = {
  redirects: ['content_id'] as const
}

export default function RedirectsManagement() {
  const [redirects, setRedirects] = useState<SlugRedirect[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  
  const [newRedirect, setNewRedirect] = useState({
    old_slug: '',
    new_slug: '',
    content_type: 'experiences',
    content_id: '',
    permanent: true
  })

  const [editForm, setEditForm] = useState({
    old_slug: '',
    new_slug: '',
    content_type: '',
    permanent: true
  })

  const [contentOptions, setContentOptions] = useState<{
    experiences: ContentItem[]
    blog_posts: ContentItem[]
  }>({
    experiences: [],
    blog_posts: []
  })

  useEffect(() => {
    fetchRedirects()
    fetchContentOptions()
  }, [])

  async function fetchRedirects() {
    const supabase = createClient()
    
    try {
      const { data, error } = await supabase
        .from('slug_redirects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setRedirects(data || [])
    } catch (error) {
      console.error('Error fetching redirects:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchContentOptions() {
    const supabase = createClient()
    
    try {
      // Fetch experiences
      const { data: experiences } = await supabase
        .from('experiences')
        .select('id, title, slug')
        .eq('status', 'active')
        .order('title')

      // Fetch blog posts
      const { data: blogPosts } = await supabase
        .from('blog_posts')
        .select('id, title, slug')
        .eq('published', true)
        .order('title')

      setContentOptions({
        experiences: experiences || [],
        blog_posts: blogPosts || []
      })
    } catch (error) {
      console.error('Error fetching content options:', error)
    }
  }

  async function saveRedirect() {
    setSaving(true)
    const supabase = createClient()

    try {
      const redirectData = sanitizeUuidFields(newRedirect, COMMON_UUID_FIELDS.redirects)
      
      const { error } = await supabase
        .from('slug_redirects')
        .insert([redirectData])

      if (error) throw error

      setNewRedirect({
        old_slug: '',
        new_slug: '',
        content_type: 'experiences',
        content_id: '',
        permanent: true
      })
      setShowAddForm(false)
      await fetchRedirects()
    } catch (error) {
      console.error('Error saving redirect:', error)
    } finally {
      setSaving(false)
    }
  }

  async function updateRedirect(id: string) {
    setSaving(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('slug_redirects')
        .update({
          old_slug: editForm.old_slug,
          new_slug: editForm.new_slug,
          permanent: editForm.permanent
        })
        .eq('id', id)

      if (error) throw error

      setEditingId(null)
      await fetchRedirects()
    } catch (error) {
      console.error('Error updating redirect:', error)
    } finally {
      setSaving(false)
    }
  }

  async function deleteRedirect(id: string) {
    if (!confirm('Are you sure you want to delete this redirect?')) return

    const supabase = createClient()
    
    try {
      const { error } = await supabase
        .from('slug_redirects')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchRedirects()
    } catch (error) {
      console.error('Error deleting redirect:', error)
    }
  }

  function startEditing(redirect: SlugRedirect) {
    setEditingId(redirect.id)
    setEditForm({
      old_slug: redirect.old_slug,
      new_slug: redirect.new_slug,
      content_type: redirect.content_type,
      permanent: redirect.permanent
    })
  }

  function getContentTitle(contentId: string, contentType: string) {
    const items = contentOptions[contentType as keyof typeof contentOptions] || []
    const item = items.find(i => i.id === contentId)
    return item?.title || 'Unknown Content'
  }

  if (loading) {
    return <div className="text-center py-8">Loading redirects...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">URL Redirects</h1>
          <p className="text-gray-600 mt-2">Manage URL redirects and slug changes</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Redirect
        </Button>
      </div>

      {/* Add New Redirect Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Redirect</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="old-slug">Old Slug *</Label>
                <Input
                  id="old-slug"
                  value={newRedirect.old_slug}
                  onChange={(e) => setNewRedirect(prev => ({ ...prev, old_slug: e.target.value }))}
                  placeholder="e.g., old-tour-name"
                />
              </div>
              <div>
                <Label htmlFor="new-slug">New Slug *</Label>
                <Input
                  id="new-slug"
                  value={newRedirect.new_slug}
                  onChange={(e) => setNewRedirect(prev => ({ ...prev, new_slug: e.target.value }))}
                  placeholder="e.g., new-tour-name"
                />
              </div>
              <div>
                <Label htmlFor="content-type">Content Type *</Label>
                <Select value={newRedirect.content_type} onValueChange={(value) => setNewRedirect(prev => ({ ...prev, content_type: value, content_id: '' }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="experiences">Tours/Experiences</SelectItem>
                    <SelectItem value="blog_posts">Blog Posts/Travel Guides</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="content-item">Content Item *</Label>
                <Select value={newRedirect.content_id} onValueChange={(value) => setNewRedirect(prev => ({ ...prev, content_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content item" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentOptions[newRedirect.content_type as keyof typeof contentOptions]?.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.title} ({item.slug})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
              <Switch 
                checked={newRedirect.permanent} 
                onCheckedChange={(checked) => setNewRedirect(prev => ({ ...prev, permanent: checked }))}
              />
              <Label>Permanent Redirect (301)</Label>
            </div>

            <div className="flex space-x-2 mt-6">
              <Button onClick={saveRedirect} disabled={saving || !newRedirect.old_slug || !newRedirect.new_slug || !newRedirect.content_id}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Redirect'}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Redirects List */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Redirects ({redirects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {redirects.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No redirects found. Create your first redirect above.</p>
          ) : (
            <div className="space-y-4">
              {redirects.map((redirect) => (
                <div key={redirect.id} className="border rounded-lg p-4">
                  {editingId === redirect.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`edit-old-slug-${redirect.id}`}>Old Slug</Label>
                          <Input
                            id={`edit-old-slug-${redirect.id}`}
                            value={editForm.old_slug}
                            onChange={(e) => setEditForm(prev => ({ ...prev, old_slug: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-new-slug-${redirect.id}`}>New Slug</Label>
                          <Input
                            id={`edit-new-slug-${redirect.id}`}
                            value={editForm.new_slug}
                            onChange={(e) => setEditForm(prev => ({ ...prev, new_slug: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={editForm.permanent} 
                          onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, permanent: checked }))}
                        />
                        <Label>Permanent Redirect (301)</Label>
                      </div>

                      <div className="flex space-x-2">
                        <Button onClick={() => updateRedirect(redirect.id)} disabled={saving}>
                          <Save className="h-4 w-4 mr-2" />
                          {saving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button variant="outline" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            /{redirect.old_slug}
                          </span>
                          <span className="text-gray-500">→</span>
                          <span className="font-mono text-sm bg-green-100 px-2 py-1 rounded">
                            /{redirect.new_slug}
                          </span>
                          <Badge variant={redirect.permanent ? "default" : "secondary"}>
                            {redirect.permanent ? '301' : '302'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="capitalize">{redirect.content_type.replace('_', ' ')}</span>: {getContentTitle(redirect.content_id, redirect.content_type)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Created: {new Date(redirect.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => startEditing(redirect)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteRedirect(redirect.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}