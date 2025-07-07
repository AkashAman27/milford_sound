import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Share2, Bookmark, ArrowLeft, ChevronRight, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { StructuredData } from '@/components/seo/StructuredData'
import { TravelGuideSections } from '@/components/blog/TravelGuideSections'
import { CodeSnippetDisplay } from '@/components/blog/CodeSnippetDisplay'
import type { Metadata } from 'next'

interface CodeSnippet {
  language: string
  code: string
  title?: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image: string | null
  published_at: string | null
  read_time_minutes: number | null
  seo_title?: string | null
  seo_description?: string | null
  seo_keywords?: string | null
  canonical_url?: string | null
  robots_index?: boolean | null
  robots_follow?: boolean | null
  robots_nosnippet?: boolean | null
  og_title?: string | null
  og_description?: string | null
  og_image?: string | null
  og_image_alt?: string | null
  twitter_title?: string | null
  twitter_description?: string | null
  twitter_image?: string | null
  twitter_image_alt?: string | null
  structured_data_type?: string | null
  focus_keyword?: string | null
  updated_at?: string | null
  code_snippets: CodeSnippet[]
  blog_categories?: {
    name: string
  } | null
  custom_json_ld?: string
  structured_data_enabled?: boolean
}

// Server-side function to fetch blog post
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories(name)
      `)
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error || !data) {
      return null
    }

    return {
      ...data,
      code_snippets: (data.code_snippets as unknown as CodeSnippet[]) || []
    }
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

// Server-side function to fetch related posts
async function getRelatedPosts(currentPostId: string): Promise<BlogPost[]> {
  const supabase = await createClient()
  
  try {
    const { data } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories(name)
      `)
      .eq('published', true)
      .neq('id', currentPostId)
      .limit(3)

    if (!data) return []

    return data.map(post => ({
      ...post,
      code_snippets: (post.code_snippets as unknown as CodeSnippet[]) || []
    }))
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://milford-sound.com'
  const currentUrl = `${siteUrl}/blog/${post.slug}`
  const seoTitle = post.seo_title || `${post.title} - Milford Sound Blog`
  const seoDescription = post.seo_description || post.excerpt || post.content.substring(0, 160)

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: post.seo_keywords || undefined,
    robots: {
      index: post.robots_index !== false,
      follow: post.robots_follow !== false,
      nosnippet: post.robots_nosnippet || false
    },
    openGraph: {
      title: post.og_title || seoTitle,
      description: post.og_description || seoDescription,
      images: post.og_image || post.featured_image ? [{
        url: post.og_image || post.featured_image!,
        alt: post.og_image_alt || `${post.title} - Blog Post Image`
      }] : undefined,
      type: 'article',
      url: currentUrl,
      siteName: 'Milford Sound',
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined
    },
    twitter: {
      card: 'summary_large_image',
      title: post.twitter_title || post.og_title || seoTitle,
      description: post.twitter_description || post.og_description || seoDescription,
      images: post.twitter_image || post.og_image || post.featured_image ? [{
        url: post.twitter_image || post.og_image || post.featured_image!,
        alt: post.twitter_image_alt || post.og_image_alt || `${post.title} - Blog Post Image`
      }] : undefined
    },
    alternates: {
      canonical: post.canonical_url || currentUrl
    },
    other: {
      'article:author': 'Milford Sound Team',
      'article:section': post.blog_categories?.name || 'Blog',
      'article:published_time': post.published_at || '',
      'article:modified_time': post.updated_at || post.published_at || ''
    }
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  
  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.id)
  
  return (
    <>
      {/* Structured Data */}
      <StructuredData
        type={(post.structured_data_type as any) || 'Article'}
        data={{
          title: post.title,
          description: post.excerpt || post.content.substring(0, 160),
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://milford-sound.com'}/blog/${post.slug}`,
          image_url: post.featured_image,
          author: 'Milford Sound Team',
          published_date: post.published_at,
          updated_date: post.updated_at || post.published_at,
          category: post.blog_categories?.name,
          content: post.content,
          read_time: post.read_time_minutes
        }}
        customJsonLd={post.custom_json_ld}
      />
      
      <article className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-96 lg:h-[500px]">
          <Image
            src={post.featured_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop'}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Back Button */}
          <div className="absolute top-8 left-8 z-10">
            <Link href="/travel-guide">
              <Button variant="secondary" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Travel Guide
              </Button>
            </Link>
          </div>

          {/* Article Meta */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto">
              <Badge className="mb-4 bg-primary">
                {post.blog_categories?.name || 'General'}
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">{post.title}</h1>
              <p className="text-xl text-gray-200 mb-6">{post.excerpt}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                    A
                  </div>
                  <div>
                    <p className="font-medium">Admin</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'No date'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.read_time_minutes || 5} min read</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="secondary" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="prose prose-lg max-w-none">
                  {post.content.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('## ')) {
                      return (
                        <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
                          {paragraph.replace('## ', '')}
                        </h2>
                      )
                    }
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h3 key={index} className="text-xl font-semibold mt-6 mb-3">
                          {paragraph.replace('### ', '')}
                        </h3>
                      )
                    }
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return (
                        <p key={index} className="font-semibold text-lg mt-6 mb-3">
                          {paragraph.replace(/\*\*/g, '')}
                        </p>
                      )
                    }
                    if (paragraph.startsWith('- ')) {
                      const listItems = paragraph.split('\n').filter(item => item.startsWith('- '))
                      return (
                        <ul key={index} className="list-disc pl-6 mb-6">
                          {listItems.map((item, itemIndex) => (
                            <li key={itemIndex} className="mb-2">
                              {item.replace('- ', '')}
                            </li>
                          ))}
                        </ul>
                      )
                    }
                    return (
                      <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    )
                  })}
                </div>

                {/* Code Snippets */}
                {post.code_snippets && post.code_snippets.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-2xl font-bold mb-6 flex items-center">
                      <Code className="h-6 w-6 mr-2" />
                      Code Examples
                    </h3>
                    <div className="space-y-6">
                      {post.code_snippets.map((snippet, index) => (
                        <CodeSnippetDisplay key={index} snippet={snippet} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Travel Guide Sections */}
                <TravelGuideSections blogPostId={post.id} />

                {/* Author Bio */}
                <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-medium">
                      A
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">About Admin</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Travel enthusiast and content creator sharing the best travel experiences, guides, and tips from around the world.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-8">
                  {/* Newsletter Signup */}
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-4">Get travel tips</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Subscribe to our newsletter for the latest travel guides and insider tips.
                      </p>
                      <div className="space-y-3">
                        <input
                          type="email"
                          placeholder="Your email"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <Button size="sm" className="w-full">
                          Subscribe
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-bold">Related Stories</h3>
                  <Link href="/travel-guide">
                    <Button variant="outline">
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost) => (
                    <Card key={relatedPost.id} className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300">
                      <Link href={`/travel-guide/${relatedPost.slug}`}>
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={relatedPost.featured_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'}
                            alt={relatedPost.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardContent className="p-6">
                          <Badge variant="outline" className="mb-3">
                            {relatedPost.blog_categories?.name || 'General'}
                          </Badge>
                          <h4 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {relatedPost.excerpt}
                          </p>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {relatedPost.read_time_minutes} min read
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  )
}