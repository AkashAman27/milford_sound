'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Edit, Trash2, Eye, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  title: string
  slug: string
  description: string
  price: number
  rating: number
  review_count: number
  featured: boolean
  status: string
  created_at: string
  cities: { name: string }
  categories: { name: string }
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('experiences')
      .select(`
        *,
        cities(name),
        categories(name)
      `)
      .order('created_at', { ascending: false })

    if (data) setProducts(data)
    if (error) console.error('Error fetching products:', error)
    setLoading(false)
  }

  async function deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this experience?')) return

    const supabase = createClient()
    
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting experience')
      console.error(error)
    } else {
      fetchProducts()
    }
  }

  async function toggleActive(id: string, currentStatus: string) {
    const supabase = createClient()
    
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    
    const { error } = await supabase
      .from('experiences')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      alert('Error updating experience')
      console.error(error)
    } else {
      fetchProducts()
    }
  }

  async function toggleFeatured(id: string, currentStatus: boolean) {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('experiences')
      .update({ featured: !currentStatus })
      .eq('id', id)

    if (error) {
      alert('Error updating experience')
      console.error(error)
    } else {
      fetchProducts()
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading experiences...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Experience Management</h1>
          <p className="text-gray-600 mt-2">Manage tours, experiences, and attractions</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Experience
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {products.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">No experiences found</p>
              <Link href="/admin/products/new">
                <Button>Create Your First Experience</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                          <span className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                            {product.rating} ({product.review_count} reviews)
                          </span>
                          
                          <span className="font-semibold text-primary">
                            ${product.price}
                          </span>
                          
                          <span>{product.cities?.name}</span>
                          <span>{product.categories?.name}</span>
                          
                          <span>
                            {new Date(product.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.status === 'active'
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                          
                          {product.featured && (
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive(product.id, product.status)}
                    >
                      {product.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFeatured(product.id, product.featured)}
                    >
                      {product.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                    
                    <Link href={`/admin/products/edit/${product.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteProduct(product.id)}
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
  )
}