'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Edit, Trash2, Save, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface GuideItem {
  id: string
  title: string
  description: string
  icon: string
  importance: 'essential' | 'recommended' | 'optional'
  category: string
  sort_order: number
}

interface GuideSection {
  id: string
  blog_post_id: string
  section_title: string
  section_type: 'what_to_do' | 'what_not_to_do' | 'what_to_carry' | 'custom'
  content: string
  enabled: boolean
  sort_order: number
  items: GuideItem[]
  blog_posts?: {
    title: string
  }
}

interface BlogPost {
  id: string
  title: string
  slug: string
}

export default function BlogGuideSectionsManagement() {
  const [sections, setSections] = useState<GuideSection[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  
  const [sectionFormData, setSectionFormData] = useState({
    blog_post_id: '',
    section_title: '',
    section_type: 'what_to_do' as const,
    content: '',
    enabled: true,
    sort_order: 0
  })

  const [itemFormData, setItemFormData] = useState({
    section_id: '',
    title: '',
    description: '',
    icon: 'check',
    importance: 'recommended' as const,
    category: '',
    sort_order: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const supabase = createClient()
    
    try {
      // Fetch blog posts
      const { data: postsData } = await supabase
        .from('blog_posts')
        .select('id, title, slug')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (postsData) setBlogPosts(postsData)

      // Fetch guide sections with items
      const { data: sectionsData } = await supabase
        .from('blog_guide_sections')
        .select(`
          *,
          blog_posts(title),
          blog_guide_items(*)
        `)
        .order('sort_order')

      if (sectionsData) {
        const processedSections = sectionsData.map(section => ({
          ...section,
          items: (section.blog_guide_items || []).sort((a: GuideItem, b: GuideItem) => a.sort_order - b.sort_order)
        }))
        setSections(processedSections)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveSection(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()

    if (editingSection) {
      const { error } = await supabase
        .from('blog_guide_sections')
        .update({
          blog_post_id: sectionFormData.blog_post_id,
          section_title: sectionFormData.section_title,
          section_type: sectionFormData.section_type,
          content: sectionFormData.content,
          enabled: sectionFormData.enabled,
          sort_order: sectionFormData.sort_order,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingSection)

      if (error) {
        alert('Error updating section')
        console.error(error)
      } else {
        setEditingSection(null)
        resetSectionForm()
        fetchData()
      }
    } else {
      const { error } = await supabase
        .from('blog_guide_sections')
        .insert([{
          blog_post_id: sectionFormData.blog_post_id,
          section_title: sectionFormData.section_title,
          section_type: sectionFormData.section_type,
          content: sectionFormData.content,
          enabled: sectionFormData.enabled,
          sort_order: sectionFormData.sort_order
        }])

      if (error) {
        alert('Error creating section')
        console.error(error)
      } else {
        resetSectionForm()
        fetchData()
      }
    }
  }

  async function saveItem(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()

    if (editingItem) {
      const { error } = await supabase
        .from('blog_guide_items')
        .update({
          title: itemFormData.title,
          description: itemFormData.description,
          icon: itemFormData.icon,
          importance: itemFormData.importance,
          category: itemFormData.category,
          sort_order: itemFormData.sort_order,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingItem)

      if (error) {
        alert('Error updating item')
        console.error(error)
      } else {
        setEditingItem(null)
        resetItemForm()
        fetchData()
      }
    } else {
      const { error } = await supabase
        .from('blog_guide_items')
        .insert([{
          section_id: itemFormData.section_id,
          title: itemFormData.title,
          description: itemFormData.description,
          icon: itemFormData.icon,
          importance: itemFormData.importance,
          category: itemFormData.category,
          sort_order: itemFormData.sort_order
        }])

      if (error) {
        alert('Error creating item')
        console.error(error)
      } else {
        resetItemForm()
        fetchData()
      }
    }
  }

  async function deleteSection(id: string) {
    if (!confirm('Are you sure? This will delete the section and all its items.')) return

    const supabase = createClient()
    const { error } = await supabase
      .from('blog_guide_sections')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting section')
      console.error(error)
    } else {
      fetchData()
    }
  }

  async function deleteItem(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return

    const supabase = createClient()
    const { error } = await supabase
      .from('blog_guide_items')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting item')
      console.error(error)
    } else {
      fetchData()
    }
  }

  function editSection(section: GuideSection) {
    setEditingSection(section.id)
    setSectionFormData({
      blog_post_id: section.blog_post_id,
      section_title: section.section_title,
      section_type: section.section_type,
      content: section.content,
      enabled: section.enabled,
      sort_order: section.sort_order
    })
  }

  function editItem(item: GuideItem, sectionId: string) {
    setEditingItem(item.id)
    setItemFormData({
      section_id: sectionId,
      title: item.title,
      description: item.description,
      icon: item.icon,
      importance: item.importance,
      category: item.category,
      sort_order: item.sort_order
    })
  }

  function resetSectionForm() {
    setSectionFormData({
      blog_post_id: '',
      section_title: '',
      section_type: 'what_to_do',
      content: '',
      enabled: true,
      sort_order: 0
    })
  }

  function resetItemForm() {
    setItemFormData({
      section_id: '',
      title: '',
      description: '',
      icon: 'check',
      importance: 'recommended',
      category: '',
      sort_order: 0
    })
  }

  function toggleSection(sectionId: string) {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const getSectionTypeLabel = (type: string) => {
    const labels = {
      'what_to_do': 'What to Do',
      'what_not_to_do': 'What Not to Do',
      'what_to_carry': 'What to Carry',
      'custom': 'Custom'
    }
    return labels[type as keyof typeof labels] || type
  }

  const getImportanceBadge = (importance: string) => {
    const variants = {
      'essential': 'bg-red-100 text-red-800',
      'recommended': 'bg-yellow-100 text-yellow-800',
      'optional': 'bg-gray-100 text-gray-800'
    }
    return variants[importance as keyof typeof variants] || variants.optional
  }

  if (loading) {
    return <div className="text-center py-8">Loading guide sections...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Blog Travel Guide Sections</h1>
        <p className="text-gray-600 mt-2">Manage travel guide sections and items for blog posts</p>
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
                  <Label htmlFor="blog-post">Blog Post *</Label>
                  <Select value={sectionFormData.blog_post_id} onValueChange={(value) => setSectionFormData(prev => ({ ...prev, blog_post_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blog post" />
                    </SelectTrigger>
                    <SelectContent>
                      {blogPosts.map(post => (
                        <SelectItem key={post.id} value={post.id}>
                          {post.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="section-title">Section Title *</Label>
                  <Input
                    id="section-title"
                    required
                    value={sectionFormData.section_title}
                    onChange={(e) => setSectionFormData(prev => ({ ...prev, section_title: e.target.value }))}
                    placeholder="e.g., Must-Do Experiences"
                  />
                </div>

                <div>
                  <Label htmlFor="section-type">Section Type</Label>
                  <Select value={sectionFormData.section_type} onValueChange={(value: any) => setSectionFormData(prev => ({ ...prev, section_type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="what_to_do">What to Do</SelectItem>
                      <SelectItem value="what_not_to_do">What Not to Do</SelectItem>
                      <SelectItem value="what_to_carry">What to Carry</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={sectionFormData.content}
                    onChange={(e) => setSectionFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="General description for this section..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="sort-order">Sort Order</Label>
                  <Input
                    id="sort-order"
                    type="number"
                    value={sectionFormData.sort_order}
                    onChange={(e) => setSectionFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="enabled"
                    checked={sectionFormData.enabled}
                    onCheckedChange={(checked) => setSectionFormData(prev => ({ ...prev, enabled: checked }))}
                  />
                  <Label htmlFor="enabled">Enabled</Label>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1" disabled={!sectionFormData.blog_post_id}>
                    <Save className="h-4 w-4 mr-2" />
                    {editingSection ? 'Update' : 'Create'} Section
                  </Button>
                  {editingSection && (
                    <Button type="button" variant="outline" onClick={() => {
                      setEditingSection(null)
                      resetSectionForm()
                    }}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Item Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveItem} className="space-y-4">
                <div>
                  <Label htmlFor="item-section">Section *</Label>
                  <Select value={itemFormData.section_id} onValueChange={(value) => setItemFormData(prev => ({ ...prev, section_id: value }))}>
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
                  <Label htmlFor="item-title">Title *</Label>
                  <Input
                    id="item-title"
                    required
                    value={itemFormData.title}
                    onChange={(e) => setItemFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Visit the Eiffel Tower"
                  />
                </div>

                <div>
                  <Label htmlFor="item-description">Description</Label>
                  <Textarea
                    id="item-description"
                    value={itemFormData.description}
                    onChange={(e) => setItemFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="icon">Icon</Label>
                    <Select value={itemFormData.icon} onValueChange={(value) => setItemFormData(prev => ({ ...prev, icon: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="camera">Camera</SelectItem>
                        <SelectItem value="clock">Clock</SelectItem>
                        <SelectItem value="map">Map</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="bag">Bag</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="importance">Importance</Label>
                    <Select value={itemFormData.importance} onValueChange={(value: any) => setItemFormData(prev => ({ ...prev, importance: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="essential">Essential</SelectItem>
                        <SelectItem value="recommended">Recommended</SelectItem>
                        <SelectItem value="optional">Optional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={itemFormData.category}
                    onChange={(e) => setItemFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Sightseeing, Food, Culture"
                  />
                </div>

                <div>
                  <Label htmlFor="item-sort-order">Sort Order</Label>
                  <Input
                    id="item-sort-order"
                    type="number"
                    value={itemFormData.sort_order}
                    onChange={(e) => setItemFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1" disabled={!itemFormData.section_id}>
                    <Save className="h-4 w-4 mr-2" />
                    {editingItem ? 'Update' : 'Create'} Item
                  </Button>
                  {editingItem && (
                    <Button type="button" variant="outline" onClick={() => {
                      setEditingItem(null)
                      resetItemForm()
                    }}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sections List */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {sections.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">No guide sections found. Create your first section to get started.</p>
                </CardContent>
              </Card>
            ) : (
              sections.map((section) => (
                <Card key={section.id} className={editingSection === section.id ? 'ring-2 ring-primary' : ''}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <CardTitle className="text-lg">{section.section_title}</CardTitle>
                          {!section.enabled && (
                            <Badge className="bg-red-100 text-red-800">Disabled</Badge>
                          )}
                          <Badge variant="outline">{getSectionTypeLabel(section.section_type)}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {section.blog_posts?.title} • Sort: {section.sort_order} • Items: {section.items?.length || 0}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleSection(section.id)}
                        >
                          {expandedSections.has(section.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
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
                  
                  {expandedSections.has(section.id) && (
                    <CardContent>
                      {section.content && (
                        <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
                          {section.content}
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        {section.items?.length === 0 ? (
                          <p className="text-gray-500 text-sm">No items in this section</p>
                        ) : (
                          section.items?.map((item) => (
                            <div key={item.id} className="flex items-start justify-between p-3 bg-gray-50 rounded">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-sm">{item.title}</span>
                                  <Badge className={getImportanceBadge(item.importance)}>
                                    {item.importance}
                                  </Badge>
                                  {item.category && (
                                    <Badge variant="outline" className="text-xs">
                                      {item.category}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600">{item.description}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Icon: {item.icon} • Sort: {item.sort_order}
                                </p>
                              </div>
                              <div className="flex items-center space-x-1 ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => editItem(item, section.id)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteItem(item.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}