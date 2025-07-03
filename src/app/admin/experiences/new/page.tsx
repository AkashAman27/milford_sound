'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
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

interface ExperienceFormData {
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
  sort_order: number
}

export default function NewExperience() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [cities, setCities] = useState<Array<{id: string, name: string}>>([])
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([])
  
  const [formData, setFormData] = useState<ExperienceFormData>({
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
    max_group_size: 10,
    min_age: 0,
    meeting_point: '',
    cancellation_policy: 'Free cancellation up to 24 hours before the experience starts',
    languages: ['English'],
    main_image_url: '',
    featured: false,
    bestseller: false,
    status: 'active',
    rating: 0,
    review_count: 0,
    booking_count: 0,
    sort_order: 0
  })

  const [seoData, setSeoData] = useState<SEOFormData>({
    robots_index: true,
    robots_follow: true,
    robots_nosnippet: false
  })

  const handleInputChange = (field: keyof ExperienceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-generate slug from title
    if (field === 'title' && typeof value === 'string') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
      
      // Auto-generate SEO title if not set
      if (!seoData.seo_title) {
        setSeoData(prev => ({ ...prev, seo_title: value }))
      }
    }
  }

  const handleSEOChange = (field: keyof SEOFormData, value: any) => {
    setSeoData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      
      // Complete experience data including all SEO fields
      const experienceData = {
        ...formData,
        languages: JSON.stringify(formData.languages),
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

      const { data, error } = await supabase
        .from('experiences')
        .insert([experienceData])
        .select()
        .single()

      if (error) {
        console.error('Insert failed:', error)
        console.log('Insert data:', experienceData) // Debug log
        throw error
      }
      
      console.log('Experience created successfully with SEO data')
      router.push('/admin/experiences')
    } catch (error: any) {
      alert(`Error creating experience: ${error.message}`)
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://milford-sound.com'

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/experiences">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Experience</h1>
            <p className="text-gray-600 mt-1">Add a new tour, activity, or attraction</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {formData.slug && (
            <Link href={`/experience/${formData.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </Link>
          )}
          <Button type="submit" disabled={loading} className="flex items-center">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Creating...' : 'Create Experience'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Experience Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Amazing City Tour Experience"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="amazing-city-tour-experience"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  placeholder="Brief description for cards and previews..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the experience..."
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="main_image_url">Main Image URL</Label>
                <Input
                  id="main_image_url"
                  value={formData.main_image_url}
                  onChange={(e) => handleInputChange('main_image_url', e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Details */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    placeholder="99.99"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="original_price">Original Price</Label>
                  <Input
                    id="original_price"
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => handleInputChange('original_price', parseFloat(e.target.value) || 0)}
                    placeholder="129.99"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="2 hours"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max_group_size">Max Group Size</Label>
                  <Input
                    id="max_group_size"
                    type="number"
                    value={formData.max_group_size}
                    onChange={(e) => handleInputChange('max_group_size', parseInt(e.target.value) || 0)}
                    placeholder="10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="min_age">Minimum Age</Label>
                  <Input
                    id="min_age"
                    type="number"
                    value={formData.min_age}
                    onChange={(e) => handleInputChange('min_age', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meeting_point">Meeting Point</Label>
                <Input
                  id="meeting_point"
                  value={formData.meeting_point}
                  onChange={(e) => handleInputChange('meeting_point', e.target.value)}
                  placeholder="Central Park, Main Entrance"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellation_policy">Cancellation Policy</Label>
                <Textarea
                  id="cancellation_policy"
                  value={formData.cancellation_policy}
                  onChange={(e) => handleInputChange('cancellation_policy', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO Section */}
          <SEOFormFields
            data={seoData}
            onChange={handleSEOChange}
            baseUrl={baseUrl}
            slug={formData.slug}
            contentType="experience"
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publish Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleInputChange('featured', checked)}
                />
                <Label htmlFor="featured">Featured Experience</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="bestseller"
                  checked={formData.bestseller}
                  onCheckedChange={(checked) => handleInputChange('bestseller', checked)}
                />
                <Label htmlFor="bestseller">Bestseller</Label>
              </div>
            </CardContent>
          </Card>

          {/* Quick Preview */}
          {formData.title && (
            <Card>
              <CardHeader>
                <CardTitle>SEO Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-blue-600 text-lg font-medium">
                    {seoData.seo_title || formData.title}
                  </div>
                  <div className="text-green-700 text-sm">
                    {baseUrl}/experience/{formData.slug}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {seoData.seo_description || formData.short_description || formData.description.substring(0, 160)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </form>
  )
}