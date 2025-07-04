'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Edit, Trash2, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface Testimonial {
  id: string
  customer_name: string
  customer_location: string | null
  customer_avatar: string | null
  rating: number | null
  review_text: string | null
  experience_name: string | null
  featured: boolean | null
  sort_order: number | null
  created_at: string | null
  experience_id: string | null
  updated_at: string | null
}

export default function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_location: '',
    customer_avatar: '',
    rating: 5,
    review_text: '',
    experience_name: '',
    featured: false,
    sort_order: 1
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  async function fetchTestimonials() {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('sort_order')

    if (data) setTestimonials(data)
    if (error) console.error('Error fetching testimonials:', error)
    setLoading(false)
  }

  async function saveTestimonial(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()

    if (editingId) {
      // Update existing testimonial
      const { error } = await supabase
        .from('testimonials')
        .update(formData)
        .eq('id', editingId)

      if (error) {
        alert('Error updating testimonial')
        console.error(error)
      } else {
        setEditingId(null)
        resetForm()
        fetchTestimonials()
      }
    } else {
      // Create new testimonial
      const { error } = await supabase
        .from('testimonials')
        .insert([formData])

      if (error) {
        alert('Error creating testimonial')
        console.error(error)
      } else {
        resetForm()
        fetchTestimonials()
      }
    }
  }

  async function deleteTestimonial(id: string) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    const supabase = createClient()
    
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting testimonial')
      console.error(error)
    } else {
      fetchTestimonials()
    }
  }

  async function toggleFeatured(id: string, currentStatus: boolean) {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('testimonials')
      .update({ featured: !currentStatus })
      .eq('id', id)

    if (error) {
      alert('Error updating testimonial')
      console.error(error)
    } else {
      fetchTestimonials()
    }
  }

  function editTestimonial(testimonial: Testimonial) {
    setEditingId(testimonial.id)
    setFormData({
      customer_name: testimonial.customer_name,
      customer_location: testimonial.customer_location || '',
      customer_avatar: testimonial.customer_avatar || '',
      rating: testimonial.rating || 5,
      review_text: testimonial.review_text || '',
      experience_name: testimonial.experience_name || '',
      featured: testimonial.featured || false,
      sort_order: testimonial.sort_order || 0
    })
  }

  function resetForm() {
    setFormData({
      customer_name: '',
      customer_location: '',
      customer_avatar: '',
      rating: 5,
      review_text: '',
      experience_name: '',
      featured: false,
      sort_order: 1
    })
  }

  function cancelEdit() {
    setEditingId(null)
    resetForm()
  }

  if (loading) {
    return <div className="text-center py-8">Loading testimonials...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
        <p className="text-gray-600 mt-2">Manage customer testimonials and reviews</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveTestimonial} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customer_location}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={formData.customer_avatar}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_avatar: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.experience_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <select
                    required
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Text *
                  </label>
                  <textarea
                    required
                    value={formData.review_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, review_text: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.sort_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Featured</span>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    {editingId ? 'Update' : 'Create'} Testimonial
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials List */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {testimonials.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">No testimonials found</p>
                </CardContent>
              </Card>
            ) : (
              testimonials.map((testimonial) => (
                <Card key={testimonial.id} className={editingId === testimonial.id ? 'ring-2 ring-primary' : ''}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex space-x-4 flex-1">
                        {testimonial.customer_avatar && (
                          <Image
                            src={testimonial.customer_avatar}
                            alt={testimonial.customer_name}
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{testimonial.customer_name}</h3>
                            <span className="text-sm text-gray-500">{testimonial.customer_location}</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= (testimonial.rating || 0)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-2">"{testimonial.review_text || 'No review text'}"</p>
                          <p className="text-sm text-primary font-medium">{testimonial.experience_name || 'No experience'}</p>
                          
                          <div className="flex items-center space-x-2 mt-2">
                            {testimonial.featured && (
                              <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                Featured
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              Order: {testimonial.sort_order || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleFeatured(testimonial.id, testimonial.featured || false)}
                        >
                          {testimonial.featured ? 'Unfeature' : 'Feature'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editTestimonial(testimonial)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteTestimonial(testimonial.id)}
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
      </div>
    </div>
  )
}