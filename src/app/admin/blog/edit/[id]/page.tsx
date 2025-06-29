'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { FormField, TextInput, TextArea, Select, Checkbox } from '@/components/admin/forms/FormField'
import { CodeEditor } from '@/components/admin/forms/CodeEditor'

interface BlogCategory {
  id: string
  name: string
  slug: string
}

interface CodeSnippet {
  language: string
  code: string
  title?: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  category_id: string
  featured: boolean
  published: boolean
  read_time_minutes: number
  seo_title: string
  seo_description: string
  code_snippets: CodeSnippet[]
}

export default function EditBlogPost() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category_id: '',
    featured: false,
    published: false,
    read_time_minutes: 5,
    seo_title: '',
    seo_description: '',
    code_snippets: [] as CodeSnippet[]
  })

  useEffect(() => {
    fetchCategories()
    fetchPost()
  }, [postId])

  async function fetchCategories() {
    const supabase = createClient()
    const { data } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name')
    
    if (data) setCategories(data)
  }

  async function fetchPost() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', postId)
      .single()

    if (data) {
      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        featured_image: data.featured_image || '',
        category_id: data.category_id || '',
        featured: data.featured || false,
        published: data.published || false,
        read_time_minutes: data.read_time_minutes || 5,
        seo_title: data.seo_title || '',
        seo_description: data.seo_description || '',
        code_snippets: data.code_snippets || []
      })
    }
    
    if (error) {
      console.error('Error fetching post:', error)
      alert('Error loading blog post')
    }
    
    setLoading(false)
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  function handleTitleChange(title: string) {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      seo_title: title
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const supabase = createClient()
    
    const { error } = await supabase
      .from('blog_posts')
      .update({
        ...formData,
        published_at: formData.published ? new Date().toISOString() : null
      })
      .eq('id', postId)

    if (error) {
      alert('Error updating blog post')
      console.error(error)
    } else {
      router.push('/admin/blog')
    }
    
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading blog post...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center mb-8">
        <Link href="/admin/blog">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
          <p className="text-gray-600 mt-2">Update your article content and settings</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Title" required>
                  <TextInput
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Enter blog post title"
                    required
                  />
                </FormField>

                <FormField label="Slug" description="Auto-generated from title, but you can customize it">
                  <TextInput
                    value={formData.slug}
                    onChange={(value) => setFormData(prev => ({ ...prev, slug: value }))}
                    placeholder="post-url-slug"
                  />
                </FormField>

                <FormField label="Excerpt" required>
                  <TextArea
                    value={formData.excerpt}
                    onChange={(value) => setFormData(prev => ({ ...prev, excerpt: value }))}
                    placeholder="Brief description of the post"
                    required
                    rows={3}
                  />
                </FormField>

                <FormField label="Featured Image URL">
                  <TextInput
                    value={formData.featured_image}
                    onChange={(value) => setFormData(prev => ({ ...prev, featured_image: value }))}
                    placeholder="https://example.com/image.jpg"
                    type="url"
                  />
                </FormField>

                <FormField label="Content" required>
                  <TextArea
                    value={formData.content}
                    onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                    placeholder="Write your blog post content here..."
                    required
                    rows={15}
                  />
                </FormField>
              </CardContent>
            </Card>

            {/* Code Snippets Section */}
            <Card>
              <CardHeader>
                <CardTitle>Code Snippets</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeEditor
                  snippets={formData.code_snippets}
                  onChange={(snippets) => setFormData(prev => ({ ...prev, code_snippets: snippets }))}
                />
              </CardContent>
            </Card>

            {/* SEO Section */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="SEO Title">
                  <TextInput
                    value={formData.seo_title}
                    onChange={(value) => setFormData(prev => ({ ...prev, seo_title: value }))}
                    placeholder="SEO optimized title"
                  />
                </FormField>

                <FormField label="SEO Description">
                  <TextArea
                    value={formData.seo_description}
                    onChange={(value) => setFormData(prev => ({ ...prev, seo_description: value }))}
                    placeholder="Meta description for search engines"
                    rows={3}
                  />
                </FormField>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Category">
                  <Select
                    value={formData.category_id}
                    onChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                    options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                    placeholder="Select category"
                  />
                </FormField>

                <FormField label="Read Time (minutes)">
                  <TextInput
                    type="number"
                    min={1}
                    value={formData.read_time_minutes.toString()}
                    onChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      read_time_minutes: parseInt(value) || 5 
                    }))}
                  />
                </FormField>

                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  label="Featured Post"
                />

                <Checkbox
                  id="published"
                  checked={formData.published}
                  onChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                  label="Published"
                />
              </CardContent>
            </Card>

            <div className="sticky top-6">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Update Post'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}