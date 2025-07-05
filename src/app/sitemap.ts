import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = 'https://milford-sound.com'

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/tours`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/experiences`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
  ]

  try {
    // Get all tours
    const { data: tours } = await supabase
      .from('products')
      .select('slug, updated_at')
      .eq('status', 'active')
      .order('updated_at', { ascending: false })

    const tourPages = tours?.map(tour => ({
      url: `${baseUrl}/tour/${tour.slug}`,
      lastModified: new Date(tour.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })) || []

    // Get all categories
    const { data: categories } = await supabase
      .from('categories')
      .select('slug, updated_at')
      .order('updated_at', { ascending: false })

    const categoryPages = categories?.map(category => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date(category.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || []

    // Get all blog posts
    const { data: posts } = await supabase
      .from('posts')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false })

    const blogPages = posts?.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })) || []

    return [
      ...staticPages,
      ...tourPages,
      ...categoryPages,
      ...blogPages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}