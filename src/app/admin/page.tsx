'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { 
  FileText, 
  Package, 
  Users, 
  MessageSquare,
  TrendingUp,
  Star
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalTestimonials: 0,
    totalBlogPosts: 0,
    totalReviews: 0,
    avgRating: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()
      
      try {
        // Get counts from each table
        const [
          { count: products },
          { count: categories },
          { count: testimonials },
          { count: blogPosts },
          { count: reviews }
        ] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('categories').select('*', { count: 'exact', head: true }),
          supabase.from('testimonials').select('*', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
          supabase.from('reviews').select('*', { count: 'exact', head: true })
        ])

        // Get average rating
        const { data: avgData } = await supabase
          .from('reviews')
          .select('rating')
        
        const avgRating = avgData?.length 
          ? avgData.reduce((sum, review) => sum + review.rating, 0) / avgData.length
          : 0

        setStats({
          totalProducts: products || 0,
          totalCategories: categories || 0,
          totalTestimonials: testimonials || 0,
          totalBlogPosts: blogPosts || 0,
          totalReviews: reviews || 0,
          avgRating: Math.round(avgRating * 10) / 10
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: FileText,
      color: 'text-green-600'
    },
    {
      title: 'Testimonials',
      value: stats.totalTestimonials,
      icon: MessageSquare,
      color: 'text-purple-600'
    },
    {
      title: 'Blog Posts',
      value: stats.totalBlogPosts,
      icon: FileText,
      color: 'text-orange-600'
    },
    {
      title: 'Total Reviews',
      value: stats.totalReviews,
      icon: Users,
      color: 'text-red-600'
    },
    {
      title: 'Avg Rating',
      value: `${stats.avgRating}/5`,
      icon: Star,
      color: 'text-yellow-600'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your Headout CMS dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a 
                href="/admin/blog" 
                className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-5 w-5 mr-3 text-blue-600" />
                <div>
                  <p className="font-medium">Create New Blog Post</p>
                  <p className="text-sm text-gray-600">Add a new article to your blog</p>
                </div>
              </a>
              
              <a 
                href="/admin/products" 
                className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <Package className="h-5 w-5 mr-3 text-green-600" />
                <div>
                  <p className="font-medium">Add New Product</p>
                  <p className="text-sm text-gray-600">Create a new tour or experience</p>
                </div>
              </a>
              
              <a 
                href="/admin/homepage" 
                className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-5 w-5 mr-3 text-purple-600" />
                <div>
                  <p className="font-medium">Update Homepage</p>
                  <p className="text-sm text-gray-600">Edit hero section and stats</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <p className="text-sm">Database initialized with sample data</p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <p className="text-sm">Admin panel created</p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                <p className="text-sm">Supabase integration active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}