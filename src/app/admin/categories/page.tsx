'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  product_count: number
  created_at: string
}

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    product_count: 0
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (data) setCategories(data)
    if (error) console.error('Error fetching categories:', error)
    setLoading(false)
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  function handleNameChange(name: string) {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  async function saveCategory(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()

    if (editingId) {
      // Update existing category
      const { error } = await supabase
        .from('categories')
        .update({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          image_url: formData.image_url,
          product_count: formData.product_count
        })
        .eq('id', editingId)

      if (error) {
        alert('Error updating category')
        console.error(error)
      } else {
        setEditingId(null)
        resetForm()
        fetchCategories()
      }
    } else {
      // Create new category
      const { error } = await supabase
        .from('categories')
        .insert([formData])

      if (error) {
        alert('Error creating category')
        console.error(error)
      } else {
        resetForm()
        fetchCategories()
      }
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm('Are you sure you want to delete this category? This will affect all products in this category.')) return

    const supabase = createClient()
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting category')
      console.error(error)
    } else {
      fetchCategories()
    }
  }

  function editCategory(category: Category) {
    setEditingId(category.id)
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      image_url: category.image_url || '',
      product_count: category.product_count || 0
    })
  }

  function resetForm() {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      product_count: 0
    })
  }

  function cancelEdit() {
    setEditingId(null)
    resetForm()
  }

  if (loading) {
    return <div className="text-center py-8">Loading categories...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
        <p className="text-gray-600 mt-2">Manage product categories and their settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingId ? 'Edit Category' : 'Add New Category'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Museums & Galleries"
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
                    placeholder="museums-galleries"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-generated from name, but you can customize it
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Brief description of this category"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com/category-image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.product_count || 0}
                    onChange={(e) => setFormData(prev => ({ ...prev, product_count: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Approximate number of products in this category
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    {editingId ? 'Update' : 'Create'} Category
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

        {/* Categories List */}
        <div className="lg:col-span-2">
          <div className="grid gap-4">
            {categories.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">No categories found</p>
                </CardContent>
              </Card>
            ) : (
              categories.map((category) => (
                <Card key={category.id} className={editingId === category.id ? 'ring-2 ring-primary' : ''}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex space-x-4 flex-1">
                        {category.image_url && (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                            <Image
                              src={category.image_url}
                              alt={category.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Slug: <code className="bg-gray-100 px-1 rounded">{category.slug}</code>
                          </p>
                          {category.description && (
                            <p className="text-gray-700 mb-2">{category.description}</p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{category.product_count}+ products</span>
                            <span>Created: {new Date(category.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteCategory(category.id)}
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