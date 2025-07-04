'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, ArrowLeft, Eye } from 'lucide-react'
import Link from 'next/link'
import { FormField, TextInput, TextArea, Select, Checkbox } from '@/components/admin/forms/FormField'
import { CodeEditor } from '@/components/admin/forms/CodeEditor'
import { SEOFormFields, SEOFormData } from '@/components/seo/SEOFormFields'
import { SlugManager } from '@/components/admin/SlugManager'

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
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  canonical_url?: string
  robots_index?: boolean
  robots_follow?: boolean
  robots_nosnippet?: boolean
  og_title?: string
  og_description?: string
  og_image?: string
  og_image_alt?: string
  twitter_title?: string
  twitter_description?: string
  twitter_image?: string
  twitter_image_alt?: string
  structured_data_type?: string
  focus_keyword?: string
  code_snippets: CodeSnippet[]
}

export default function EditBlogPost() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [seoData, setSeoData] = useState<SEOFormData>({
    robots_index: true,
    robots_follow: true,
    robots_nosnippet: false
  })
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
        code_snippets: (data.code_snippets as unknown as CodeSnippet[]) || []
      })
      
      // Set SEO data
      setSeoData({
        seo_title: data.seo_title || '',
        seo_description: data.seo_description || '',
        seo_keywords: data.seo_keywords || '',
        canonical_url: data.canonical_url || '',
        robots_index: data.robots_index !== false,
        robots_follow: data.robots_follow !== false,
        robots_nosnippet: data.robots_nosnippet || false,
        og_title: data.og_title || '',
        og_description: data.og_description || '',
        og_image: data.og_image || '',
        og_image_alt: data.og_image_alt || '',
        twitter_title: data.twitter_title || '',
        twitter_description: data.twitter_description || '',
        twitter_image: data.twitter_image || '',
        twitter_image_alt: data.twitter_image_alt || '',
        structured_data_type: data.structured_data_type || '',
        focus_keyword: data.focus_keyword || ''
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
      slug: generateSlug(title)
    }))
    
    // Auto-update SEO title if not manually set
    if (!seoData.seo_title) {
      setSeoData(prev => ({ ...prev, seo_title: title }))
    }
  }
  
  const handleSEOChange = (field: keyof SEOFormData, value: any) => {
    setSeoData(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const supabase = createClient()
    
    // Complete update data including all SEO fields
    const updateData = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      featured_image: formData.featured_image,
      category_id: formData.category_id,
      featured: formData.featured,
      published: formData.published,
      read_time_minutes: formData.read_time_minutes,
      published_at: formData.published ? new Date().toISOString() : null,
      // SEO fields
      seo_title: seoData.seo_title || null,
      seo_description: seoData.seo_description || null,
      seo_keywords: seoData.seo_keywords || null,
      canonical_url: seoData.canonical_url || null,
      robots_index: seoData.robots_index ?? true,
      robots_follow: seoData.robots_follow ?? true,
      robots_nosnippet: seoData.robots_nosnippet ?? false,
      og_title: seoData.og_title || null,
      og_description: seoData.og_description || null,
      og_image: seoData.og_image || null,
      og_image_alt: seoData.og_image_alt || null,
      twitter_title: seoData.twitter_title || null,
      twitter_description: seoData.twitter_description || null,
      twitter_image: seoData.twitter_image || null,
      twitter_image_alt: seoData.twitter_image_alt || null,
      structured_data_type: seoData.structured_data_type || null,
      focus_keyword: seoData.focus_keyword || null,
      updated_at: new Date().toISOString()
    }
    
    const { error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', postId)

    if (error) {
      alert(`Error updating blog post: ${error.message}`)
      console.error('Update failed:', error)
      console.log('Update data:', updateData) // Debug log
    } else {
      console.log('Blog post updated successfully with SEO data')
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

                <FormField label="URL Slug" description="This affects the post's URL - be careful when changing">
                  <SlugManager
                    currentSlug={formData.slug}
                    previousSlug=""
                    contentType="blog_posts"
                    contentId={postId}
                    onSlugChange={(slug) => setFormData(prev => ({ ...prev, slug }))}
                    baseUrl={process.env.NEXT_PUBLIC_SITE_URL || 'https://milford-sound.com'}
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
            <SEOFormFields
              data={seoData}
              onChange={handleSEOChange}
              baseUrl={process.env.NEXT_PUBLIC_SITE_URL || 'https://milford-sound.com'}
              slug={formData.slug}
              contentType="blog"
            />
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