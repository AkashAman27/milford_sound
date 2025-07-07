'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface TravelGuidePost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured: boolean | null
  published: boolean | null
  view_count: number | null
  read_time_minutes: number | null
  published_at: string | null
  created_at: string | null
}

export default function TravelGuideManagement() {
  const [posts, setPosts] = useState<TravelGuidePost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setPosts(data)
    if (error) console.error('Error fetching posts:', error)
    setLoading(false)
  }

  async function deletePost(id: string) {
    if (!confirm('Are you sure you want to delete this travel guide post?')) return

    const supabase = createClient()
    
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting post')
      console.error(error)
    } else {
      fetchPosts() // Refresh the list
    }
  }

  async function togglePublished(id: string, currentStatus: boolean) {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('blog_posts')
      .update({ published: !currentStatus })
      .eq('id', id)

    if (error) {
      alert('Error updating post')
      console.error(error)
    } else {
      fetchPosts() // Refresh the list
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading travel guide posts...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Travel Guide Management</h1>
          <p className="text-gray-600 mt-2">Manage your travel guide posts and articles</p>
        </div>
        <Link href="/admin/travel-guide/new">
          <Button className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Guide
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">No travel guide posts found</p>
              <Link href="/admin/travel-guide/new">
                <Button>Create Your First Guide</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                    <p className="text-gray-600 mb-4">{post.excerpt || 'No excerpt available'}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        post.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                      
                      {post.featured && (
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                      
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {post.view_count || 0} views
                      </span>
                      
                      <span>{post.read_time_minutes || 5} min read</span>
                      
                      <span>
                        {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'No date'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublished(post.id, post.published || false)}
                    >
                      {post.published ? 'Unpublish' : 'Publish'}
                    </Button>
                    
                    <Link href={`/admin/travel-guide/edit/${post.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePost(post.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}