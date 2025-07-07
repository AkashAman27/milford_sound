'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Edit2, Trash2, Save, X, CheckCircle, AlertTriangle, Info, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

interface TravelGuidePost {
  id: string
  title: string
  slug: string
}

interface GuideSection {
  id: string
  blog_post_id: string
  section_title: string
  section_type: 'what_to_do' | 'what_not_to_do' | 'what_to_carry' | 'custom'
  content: string
  enabled: boolean
  sort_order: number
  created_at: string
  updated_at: string
  blog_posts?: TravelGuidePost
}

interface GuideItem {
  id: string
  section_id: string
  title: string
  description: string
  icon: string
  importance: 'essential' | 'recommended' | 'optional'
  category: string
  sort_order: number
  created_at: string
  updated_at: string
}

const SECTION_TYPES = [
  { value: 'what_to_do', label: 'What to Do', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  { value: 'what_not_to_do', label: 'What Not to Do', icon: AlertTriangle, color: 'bg-red-100 text-red-800' },
  { value: 'what_to_carry', label: 'What to Carry', icon: Info, color: 'bg-blue-100 text-blue-800' },
  { value: 'custom', label: 'Custom Section', icon: Info, color: 'bg-gray-100 text-gray-800' }
]

const IMPORTANCE_LEVELS = [
  { value: 'essential', label: 'Essential', color: 'bg-red-100 text-red-800' },
  { value: 'recommended', label: 'Recommended', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'optional', label: 'Optional', color: 'bg-gray-100 text-gray-800' }
]

export default function TravelGuideSectionsManagement() {
  const [sections, setSections] = useState<GuideSection[]>([])
  const [items, setItems] = useState<GuideItem[]>([])
  const [blogPosts, setBlogPosts] = useState<TravelGuidePost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('content')
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [newSection, setNewSection] = useState({
    blog_post_id: '',
    section_title: '',
    section_type: 'what_to_do' as const,
    content: '',
    enabled: true,
    sort_order: 0
  })
  const [newItem, setNewItem] = useState({
    section_id: '',
    title: '',
    description: '',
    icon: 'check',
    importance: 'recommended' as const,
    category: '',
    sort_order: 0
  })
  const [showAddSection, setShowAddSection] = useState(false)
  const [showAddItem, setShowAddItem] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const supabase = createClient()
      
      // Fetch travel guide posts
      const { data: postsData } = await supabase
        .from('blog_posts')
        .select('id, title, slug')
        .eq('published', true)
        .order('created_at', { ascending: false })

      setBlogPosts(postsData || [])

      // Fetch guide sections
      const { data: sectionsData } = await supabase
        .from('blog_guide_sections')
        .select(`
          *,
          blog_posts(id, title, slug)
        `)
        .order('sort_order')

      setSections(sectionsData || [])

      // Fetch guide items
      const { data: itemsData } = await supabase
        .from('blog_guide_items')
        .select('*')
        .order('sort_order')

      setItems(itemsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      setMessage({ type: 'error', text: 'Failed to load data' })
    } finally {
      setLoading(false)
    }
  }

  const handleAddSection = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('blog_guide_sections')
        .insert([newSection])

      if (error) throw error

      setMessage({ type: 'success', text: 'Section added successfully' })
      setShowAddSection(false)
      setNewSection({
        blog_post_id: '',
        section_title: '',
        section_type: 'what_to_do',
        content: '',
        enabled: true,
        sort_order: 0
      })
      fetchData()
    } catch (error) {
      console.error('Error adding section:', error)
      setMessage({ type: 'error', text: 'Failed to add section' })
    }
  }

  const handleAddItem = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('blog_guide_items')
        .insert([newItem])

      if (error) throw error

      setMessage({ type: 'success', text: 'Item added successfully' })
      setShowAddItem(false)
      setNewItem({
        section_id: '',
        title: '',
        description: '',
        icon: 'check',
        importance: 'recommended',
        category: '',
        sort_order: 0
      })
      fetchData()
    } catch (error) {
      console.error('Error adding item:', error)
      setMessage({ type: 'error', text: 'Failed to add item' })
    }
  }

  const handleDeleteSection = async (id: string) => {
    if (!confirm('Are you sure? This will also delete all items in this section.')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('blog_guide_sections')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Section deleted successfully' })
      fetchData()
    } catch (error) {
      console.error('Error deleting section:', error)
      setMessage({ type: 'error', text: 'Failed to delete section' })
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('blog_guide_items')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Item deleted successfully' })
      fetchData()
    } catch (error) {
      console.error('Error deleting item:', error)
      setMessage({ type: 'error', text: 'Failed to delete item' })
    }
  }

  const getSectionTypeInfo = (type: string) => {
    return SECTION_TYPES.find(t => t.value === type) || SECTION_TYPES[0]
  }

  const getImportanceInfo = (importance: string) => {
    return IMPORTANCE_LEVELS.find(i => i.value === importance) || IMPORTANCE_LEVELS[1]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Travel Guide Management</h1>
          <p className="text-gray-600 mt-2">Manage travel guide content, sections, and items</p>
        </div>
      </div>

      {message && (
        <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
          <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="content">Travel Content ({blogPosts.length})</TabsTrigger>
          <TabsTrigger value="sections">Guide Sections ({sections.length})</TabsTrigger>
          <TabsTrigger value="items">Guide Items ({items.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Travel Guide Content</CardTitle>
                <Button onClick={() => {/* TODO: Add new travel guide */}}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Travel Guide
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>URL Slug</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Sections</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogPosts.map((post) => {
                    const postSections = sections.filter(section => section.blog_post_id === post.id)
                    
                    return (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{post.title}</div>
                            <div className="text-sm text-gray-500">Travel Guide Content</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-sm">{post.slug}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Travel Guide</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {postSections.length} sections
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            Published
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/admin/travel-guide/edit/${post.id}`}>
                                <Edit2 className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/blog/${post.slug}`} target="_blank">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {blogPosts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No travel guide content found. Create your first travel guide to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Travel Guide Sections</CardTitle>
                <Button onClick={() => setShowAddSection(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddSection && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="font-medium mb-4">Add New Section</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Travel Guide Post</label>
                      <Select value={newSection.blog_post_id} onValueChange={(value) => setNewSection({...newSection, blog_post_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blog post" />
                        </SelectTrigger>
                        <SelectContent>
                          {blogPosts.map(post => (
                            <SelectItem key={post.id} value={post.id}>{post.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Section Type</label>
                      <Select value={newSection.section_type} onValueChange={(value: any) => setNewSection({...newSection, section_type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SECTION_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Section Title</label>
                      <Input 
                        value={newSection.section_title}
                        onChange={(e) => setNewSection({...newSection, section_title: e.target.value})}
                        placeholder="Enter section title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Sort Order</label>
                      <Input 
                        type="number"
                        value={newSection.sort_order}
                        onChange={(e) => setNewSection({...newSection, sort_order: parseInt(e.target.value) || 0})}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <Textarea 
                      value={newSection.content}
                      onChange={(e) => setNewSection({...newSection, content: e.target.value})}
                      placeholder="Enter section content"
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddSection}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Section
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddSection(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Travel Guide Post</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sections.map((section) => {
                    const typeInfo = getSectionTypeInfo(section.section_type)
                    const sectionItems = items.filter(item => item.section_id === section.id)
                    
                    return (
                      <TableRow key={section.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{section.blog_posts?.title}</div>
                            <div className="text-sm text-gray-500">{section.blog_posts?.slug}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{section.section_title}</div>
                            <div className="text-sm text-gray-500 mt-1">{section.content.substring(0, 80)}...</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {sectionItems.length} items
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={section.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {section.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteSection(section.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {sections.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No travel guide sections found. Create your first section to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Guide Items</CardTitle>
                <Button onClick={() => setShowAddItem(true)} disabled={sections.length === 0}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {sections.length === 0 && (
                <Alert className="mb-6">
                  <AlertDescription>
                    You need to create at least one guide section before adding items.
                  </AlertDescription>
                </Alert>
              )}

              {showAddItem && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="font-medium mb-4">Add New Item</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Section</label>
                      <Select value={newItem.section_id} onValueChange={(value) => setNewItem({...newItem, section_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map(section => (
                            <SelectItem key={section.id} value={section.id}>
                              {section.section_title} ({section.blog_posts?.title})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Importance</label>
                      <Select value={newItem.importance} onValueChange={(value: any) => setNewItem({...newItem, importance: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {IMPORTANCE_LEVELS.map(level => (
                            <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <Input 
                        value={newItem.title}
                        onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                        placeholder="Enter item title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <Input 
                        value={newItem.category}
                        onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                        placeholder="Enter category (optional)"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea 
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      placeholder="Enter item description"
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddItem}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Item
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddItem(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Section</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Importance</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => {
                    const section = sections.find(s => s.id === item.section_id)
                    const importanceInfo = getImportanceInfo(item.importance)
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{section?.section_title}</div>
                            <div className="text-sm text-gray-500">{section?.blog_posts?.title}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">{item.description}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={importanceInfo.color}>
                            {importanceInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.category && (
                            <Badge variant="outline">{item.category}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {items.length === 0 && sections.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No guide items found. Create your first item to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}