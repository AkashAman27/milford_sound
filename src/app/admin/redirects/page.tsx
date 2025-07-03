'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Plus, ExternalLink, ArrowRight, Search } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Redirect {
  id: string
  old_slug: string
  new_slug: string
  content_type: string
  content_id: string
  created_at: string
  permanent: boolean
}

export default function RedirectsPage() {
  const [redirects, setRedirects] = useState<Redirect[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRedirect, setNewRedirect] = useState({
    old_slug: '',
    new_slug: '',
    content_type: 'blog_posts',
    permanent: true
  })

  useEffect(() => {
    fetchRedirects()
  }, [])

  const fetchRedirects = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('slug_redirects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching redirects:', error)
        return
      }

      setRedirects(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addRedirect = async () => {
    if (!newRedirect.old_slug || !newRedirect.new_slug) {
      alert('Please fill in both old and new slugs')
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('slug_redirects')
        .insert([{
          old_slug: newRedirect.old_slug,
          new_slug: newRedirect.new_slug,
          content_type: newRedirect.content_type,
          content_id: '00000000-0000-0000-0000-000000000000', // Placeholder for manual redirects
          permanent: newRedirect.permanent
        }])

      if (error) {
        console.error('Error adding redirect:', error)
        alert('Error adding redirect')
        return
      }

      setNewRedirect({
        old_slug: '',
        new_slug: '',
        content_type: 'blog_posts',
        permanent: true
      })
      setShowAddForm(false)
      fetchRedirects()
    } catch (error) {
      console.error('Error:', error)
      alert('Error adding redirect')
    }
  }

  const deleteRedirect = async (id: string) => {
    if (!confirm('Are you sure you want to delete this redirect?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('slug_redirects')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting redirect:', error)
        alert('Error deleting redirect')
        return
      }

      fetchRedirects()
    } catch (error) {
      console.error('Error:', error)
      alert('Error deleting redirect')
    }
  }

  const filteredRedirects = redirects.filter(redirect => {
    const matchesSearch = redirect.old_slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         redirect.new_slug.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || redirect.content_type === filterType
    return matchesSearch && matchesFilter
  })

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'blog_posts': return 'Blog'
      case 'experiences': return 'Experience'
      case 'categories': return 'Category'
      default: return type
    }
  }

  const getContentPath = (type: string) => {
    switch (type) {
      case 'blog_posts': return '/blog'
      case 'experiences': return '/experience'
      case 'categories': return '/category'
      default: return ''
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading redirects...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">URL Redirects</h1>
          <p className="text-gray-600 mt-2">Manage URL redirects to prevent broken links</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Redirect
        </Button>
      </div>

      {/* Add Redirect Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Redirect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="old_slug">Old Slug</Label>
                <Input
                  id="old_slug"
                  value={newRedirect.old_slug}
                  onChange={(e) => setNewRedirect(prev => ({ ...prev, old_slug: e.target.value }))}
                  placeholder="old-url-slug"
                />
              </div>
              <div>
                <Label htmlFor="new_slug">New Slug</Label>
                <Input
                  id="new_slug"
                  value={newRedirect.new_slug}
                  onChange={(e) => setNewRedirect(prev => ({ ...prev, new_slug: e.target.value }))}
                  placeholder="new-url-slug"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="content_type">Content Type</Label>
                <Select value={newRedirect.content_type} onValueChange={(value) => setNewRedirect(prev => ({ ...prev, content_type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog_posts">Blog Posts</SelectItem>
                    <SelectItem value="experiences">Experiences</SelectItem>
                    <SelectItem value="categories">Categories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="permanent">Redirect Type</Label>
                <Select value={newRedirect.permanent ? 'permanent' : 'temporary'} onValueChange={(value) => setNewRedirect(prev => ({ ...prev, permanent: value === 'permanent' }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permanent">301 Permanent</SelectItem>
                    <SelectItem value="temporary">302 Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={addRedirect}>Add Redirect</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search redirects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="blog_posts">Blog Posts</SelectItem>
            <SelectItem value="experiences">Experiences</SelectItem>
            <SelectItem value="categories">Categories</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Redirects List */}
      <div className="space-y-4">
        {filteredRedirects.length === 0 ? (
          <Alert>
            <AlertDescription>
              No redirects found. {searchTerm || filterType !== 'all' ? 'Try adjusting your search or filter.' : 'Create your first redirect to get started.'}
            </AlertDescription>
          </Alert>
        ) : (
          filteredRedirects.map((redirect) => (
            <Card key={redirect.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {getContentTypeLabel(redirect.content_type)}
                      </Badge>
                      <Badge variant={redirect.permanent ? 'default' : 'secondary'}>
                        {redirect.permanent ? '301' : '302'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {getContentPath(redirect.content_type)}/{redirect.old_slug}
                        </code>
                      </div>
                      
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {getContentPath(redirect.content_type)}/{redirect.new_slug}
                        </code>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      {new Date(redirect.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteRedirect(redirect.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}