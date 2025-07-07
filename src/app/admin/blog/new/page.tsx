'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, ArrowLeft, Eye } from 'lucide-react'
import Link from 'next/link'
import { FormField, TextInput, TextArea, Select, Checkbox } from '@/components/admin/forms/FormField'
import { CodeEditor } from '@/components/admin/forms/CodeEditor'
import { SEOFormFields, SEOFormData } from '@/components/seo/SEOFormFields'
import { sanitizeUuidFields, COMMON_UUID_FIELDS } from '@/lib/utils/form-helpers'

interface TravelGuideCategory {
  id: string
  name: string
  slug: string
}

export default function NewTravelGuidePost() {
  const router = useRouter()
  const [categories, setCategories] = useState<TravelGuideCategory[]>([])
  const [saving, setSaving] = useState(false)
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
    code_snippets: [] as Array<{language: string, code: string, title?: string}>
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    const supabase = createClient()
    const { data } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name')
    
    if (data) setCategories(data)
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
    
    // Complete blog data including all SEO fields
    const baseBlogData = {
      ...formData,
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Sanitize UUID fields to prevent PostgreSQL errors
    const blogData = sanitizeUuidFields(baseBlogData, COMMON_UUID_FIELDS.blog_posts)
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([blogData])
      .select()

    if (error) {
      alert(`Error creating travel guide post: ${error.message}`)
      console.error('Insert failed:', error)
      console.log('Insert data:', blogData) // Debug log
    } else {
      console.log('Travel guide post created successfully with SEO data')
      router.push('/admin/travel-guide')
    }
    
    setSaving(false)
  }

  return (
    <div>
      <div className="flex items-center mb-8">
        <Link href="/admin/travel-guide">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Travel Guide
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Travel Guide</h1>
          <p className="text-gray-600 mt-2">Write and publish a new travel guide article</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Travel Guide Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter travel guide title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="post-url-slug"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    required
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Brief description of the post"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.featured_image}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Write your travel guide content here..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO Section */}
            <SEOFormFields
              data={seoData}
              onChange={handleSEOChange}
              baseUrl={process.env.NEXT_PUBLIC_SITE_URL || 'https://tps-site.com'}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Read Time (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.read_time_minutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, read_time_minutes: parseInt(e.target.value) || 5 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Featured Post
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="published" className="text-sm font-medium text-gray-700">
                    Publish immediately
                  </label>
                </div>
              </CardContent>
            </Card>

            <div className="sticky top-6">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Guide'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}