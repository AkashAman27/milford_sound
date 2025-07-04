'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Edit, Trash2, Eye, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

interface Experience {
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

export default function TourManagement() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExperiences()
  }, [])

  async function fetchExperiences() {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('experiences')
      .select(`
        *,
        cities(name),
        categories(name)
      `)
      .order('created_at', { ascending: false })

    if (data) setExperiences(data)
    if (error) console.error('Error fetching experiences:', error)
    setLoading(false)
  }

  async function deleteExperience(id: string) {
    if (!confirm('Are you sure you want to delete this tour?')) return

    const supabase = createClient()
    
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting tour')
      console.error(error)
    } else {
      fetchExperiences()
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
      alert('Error updating tour')
      console.error(error)
    } else {
      fetchExperiences()
    }
  }

  async function toggleFeatured(id: string, currentStatus: boolean) {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('experiences')
      .update({ featured: !currentStatus })
      .eq('id', id)

    if (error) {
      alert('Error updating tour')
      console.error(error)
    } else {
      fetchExperiences()
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading tours...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tour Management</h1>
          <p className="text-gray-600 mt-2">Manage tours, experiences, and attractions</p>
        </div>
        <Link href="/admin/experiences/new">
          <Button className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Tour
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {experiences.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">No tours found</p>
              <Link href="/admin/experiences/new">
                <Button>Create Your First Tour</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          experiences.map((experience) => (
            <Card key={experience.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{experience.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{experience.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                          <span className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                            {experience.rating} ({experience.review_count} reviews)
                          </span>
                          
                          <span className="font-semibold text-primary">
                            ${experience.price}
                          </span>
                          
                          <span>{experience.cities?.name}</span>
                          <span>{experience.categories?.name}</span>
                          
                          <span>
                            {new Date(experience.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            experience.status === 'active'
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {experience.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                          
                          {experience.featured && (
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
                      onClick={() => toggleActive(experience.id, experience.status)}
                    >
                      {experience.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFeatured(experience.id, experience.featured)}
                    >
                      {experience.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                    
                    <Link href={`/admin/experiences/edit/${experience.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteExperience(experience.id)}
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