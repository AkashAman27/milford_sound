'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { SEOFormFields, SEOFormData } from '@/components/seo/SEOFormFields'
import { Save, ArrowLeft, Eye } from 'lucide-react'
import Link from 'next/link'

interface City {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
  subcategories?: Subcategory[]
}

interface Subcategory {
  id: string
  name: string
  slug: string
  category_id: string
}

interface Experience {
  id: string
  title: string
  slug: string
  description: string
  short_description: string
  price: number
  original_price: number
  currency: string
  city_id: string
  category_id: string
  duration: string
  duration_hours: number
  max_group_size: number
  min_age: number
  meeting_point: string
  cancellation_policy: string
  languages: string[]
  main_image_url: string
  featured: boolean
  bestseller: boolean
  status: string
  rating: number
  review_count: number
  booking_count: number
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
  sort_order: number
}

export default function EditTour() {
  const router = useRouter()
  const params = useParams()
  const experienceId = params.id as string

  const [cities, setCities] = useState<City[]>([])
  const [categories, setCategories] = useState<Category[]>([])
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
    description: '',
    short_description: '',
    price: 0,
    original_price: 0,
    currency: 'USD',
    city_id: '',
    category_id: '',
    duration: '',
    duration_hours: 0,
    max_group_size: 1,
    min_age: 0,
    meeting_point: '',
    cancellation_policy: '',
    languages: '',
    main_image_url: '',
    featured: false,
    bestseller: false,
    status: 'active',
    rating: 0,
    review_count: 0,
    booking_count: 0,
    seo_title: '',
    seo_description: '',
    sort_order: 0,
    highlights: '',
    availability_url: ''
  })

  useEffect(() => {
    fetchData()
  }, [experienceId])

  async function fetchData() {
    const supabase = createClient()
    
    // Fetch experience data
    const { data: experienceData, error: experienceError } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', experienceId)
      .single()

    if (experienceData) {
      setFormData({
        title: experienceData.title || '',
        slug: experienceData.slug || '',
        description: experienceData.description || '',
        short_description: experienceData.short_description || '',
        price: experienceData.price || 0,
        original_price: experienceData.original_price || 0,
        currency: experienceData.currency || 'USD',
        city_id: experienceData.city_id || '',
        category_id: experienceData.category_id || '',
        duration: experienceData.duration || '',
        duration_hours: experienceData.duration_hours || 0,
        max_group_size: experienceData.max_group_size || 1,
        min_age: experienceData.min_age || 0,
        meeting_point: experienceData.meeting_point || '',
        cancellation_policy: experienceData.cancellation_policy || '',
        languages: Array.isArray(experienceData.languages) ? experienceData.languages.join(', ') : '',
        main_image_url: experienceData.main_image_url || '',
        featured: experienceData.featured || false,
        bestseller: experienceData.bestseller || false,
        status: experienceData.status || 'active',
        rating: experienceData.rating || 0,
        review_count: experienceData.review_count || 0,
        booking_count: experienceData.booking_count || 0,
        seo_title: experienceData.seo_title || '',
        seo_description: experienceData.seo_description || '',
        sort_order: experienceData.sort_order || 0,
        highlights: Array.isArray(experienceData.highlights) ? experienceData.highlights.join('\n') : '',
        availability_url: experienceData.availability_url || ''
      })
      
      // Set SEO data
      setSeoData({
        seo_title: experienceData.seo_title || '',
        seo_description: experienceData.seo_description || '',
        seo_keywords: experienceData.seo_keywords || '',
        canonical_url: experienceData.canonical_url || '',
        robots_index: experienceData.robots_index !== false,
        robots_follow: experienceData.robots_follow !== false,
        robots_nosnippet: experienceData.robots_nosnippet || false,
        og_title: experienceData.og_title || '',
        og_description: experienceData.og_description || '',
        og_image: experienceData.og_image || '',
        og_image_alt: experienceData.og_image_alt || '',
        twitter_title: experienceData.twitter_title || '',
        twitter_description: experienceData.twitter_description || '',
        twitter_image: experienceData.twitter_image || '',
        twitter_image_alt: experienceData.twitter_image_alt || '',
        structured_data_type: experienceData.structured_data_type || '',
        focus_keyword: experienceData.focus_keyword || ''
      })
    }

    if (experienceError) {
      console.error('Error fetching experience:', experienceError)
      alert('Error loading experience')
    }

    // Fetch cities
    const { data: citiesData } = await supabase
      .from('cities')
      .select('*')
      .order('name')
    
    if (citiesData) setCities(citiesData)

    // Fetch categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (categoriesData) setCategories(categoriesData)

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
    
    // Convert languages string to array
    const languagesArray = formData.languages
      .split(',')
      .map(lang => lang.trim())
      .filter(lang => lang.length > 0)

    // Convert highlights string to array
    const highlightsArray = formData.highlights
      .split('\n')
      .map(highlight => highlight.trim())
      .filter(highlight => highlight.length > 0)


    // Complete update data including all SEO fields
    const updateData = {
      ...formData,
      languages: languagesArray,
      highlights: highlightsArray,
      availability_url: formData.availability_url || null,
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
      .from('experiences')
      .update(updateData)
      .eq('id', experienceId)

    if (error) {
      alert(`Error updating experience: ${error.message}`)
      console.error('Update failed:', error)
      console.log('Update data:', updateData) // Debug log
    } else {
      console.log('Experience updated successfully with SEO data')
      router.push('/admin/experiences')
    }
    
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading experience...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-8">
      <div className="flex items-center mb-8">
        <Link href="/admin/experiences">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tours
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Tour</h1>
          <p className="text-gray-600 mt-2">Update tour information and settings</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6 overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
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
                    placeholder="Enter experience title"
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
                    placeholder="experience-url-slug"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    required
                    value={formData.short_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Brief description for listings"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Detailed experience description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.main_image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, main_image_url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.original_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, original_price: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="JPY">JPY</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience Details */}
            <Card>
              <CardHeader>
                <CardTitle>Experience Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., 2 hours, Full day"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (Hours)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.duration_hours}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration_hours: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Group Size
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.max_group_size}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_group_size: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Age
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.min_age}
                      onChange={(e) => setFormData(prev => ({ ...prev, min_age: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Point
                  </label>
                  <input
                    type="text"
                    value={formData.meeting_point}
                    onChange={(e) => setFormData(prev => ({ ...prev, meeting_point: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Where participants should meet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.languages}
                    onChange={(e) => setFormData(prev => ({ ...prev, languages: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="English, Spanish, French"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cancellation Policy
                  </label>
                  <textarea
                    value={formData.cancellation_policy}
                    onChange={(e) => setFormData(prev => ({ ...prev, cancellation_policy: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Cancellation terms and conditions"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content Management */}
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Highlights (one per line)
                  </label>
                  <textarea
                    value={formData.highlights}
                    onChange={(e) => setFormData(prev => ({ ...prev, highlights: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Professional guided experience&#10;Skip-the-line access where available&#10;Audio guide in multiple languages&#10;Small group experience&#10;Expert local knowledge&#10;Memorable photo opportunities"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Enter each highlight on a new line. These will appear as bullet points in the experience details.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability/Booking URL
                  </label>
                  <input
                    type="url"
                    value={formData.availability_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, availability_url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://booking-provider.com/experience-123"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    URL to redirect users when they click "Check Availability". This should link to your booking provider.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <SEOFormFields
              data={seoData}
              onChange={handleSEOChange}
              baseUrl={process.env.NEXT_PUBLIC_SITE_URL || 'https://milford-sound.com'}
              slug={formData.slug}
              contentType="experience"
            />
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
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
              </CardContent>
            </Card>

            {/* Status & Features */}
            <Card>
              <CardHeader>
                <CardTitle>Status & Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
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
                    Featured Tour
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="bestseller"
                    checked={formData.bestseller}
                    onChange={(e) => setFormData(prev => ({ ...prev, bestseller: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="bestseller" className="text-sm font-medium text-gray-700">
                    Bestseller
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
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
                {saving ? 'Saving...' : 'Update Tour'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}