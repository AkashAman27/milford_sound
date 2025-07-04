'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Edit, Trash2, Eye, Link as LinkIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Experience {
  id: string
  title: string
  slug: string
  status: string
  sections_count: number
  links_count: number
}

export default function InternalLinksManagement() {
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
        id,
        title,
        slug,
        status,
        internal_links_sections(
          id,
          internal_links(id)
        )
      `)
      .order('title')

    if (data) {
      const transformedData: Experience[] = data.map(exp => ({
        id: exp.id,
        title: exp.title,
        slug: exp.slug,
        status: exp.status,
        sections_count: exp.internal_links_sections?.length || 0,
        links_count: exp.internal_links_sections?.reduce((acc, section) => 
          acc + (section.internal_links?.length || 0), 0) || 0
      }))
      setExperiences(transformedData)
    }
    
    if (error) console.error('Error fetching experiences:', error)
    setLoading(false)
  }

  if (loading) {
    return <div className="text-center py-8">Loading experiences...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Internal Links Management</h1>
          <p className="text-gray-600 mt-2">Manage internal linking sections and links for experiences</p>
        </div>
      </div>

      <div className="grid gap-6">
        {experiences.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">No experiences found</p>
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
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            experience.status === 'active'
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {experience.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                          
                          <span className="flex items-center">
                            <LinkIcon className="h-4 w-4 mr-1" />
                            {experience.sections_count} section(s), {experience.links_count} link(s)
                          </span>
                        </div>

                        <div className="text-xs text-gray-500">
                          URL: /tour/{experience.slug}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link href={`/tour/${experience.slug}`} target="_blank">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    
                    <Link href={`/admin/internal-links/${experience.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Manage Links
                      </Button>
                    </Link>
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