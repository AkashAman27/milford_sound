import { notFound } from 'next/navigation'
import { CategoryWithSubcategories } from '@/components/category/CategoryWithSubcategories'
import { createClient } from '@/lib/supabase/server'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  experience_count: number
}

interface Subcategory {
  id: string
  name: string
  slug: string
  experience_count: number
  sort_order: number
}

async function getCategoryWithSubcategories(slug: string): Promise<Category & { subcategories: Subcategory[] } | null> {
  const supabase = await createClient()
  
  const { data: category } = await supabase
    .from('categories')
    .select(`
      *,
      subcategories (
        id,
        name,
        slug,
        experience_count,
        sort_order
      )
    `)
    .eq('slug', slug)
    .single()

  return category || null
}

async function getExperiencesByCategory(categorySlug: string, subcategorySlug?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('experiences')
    .select(`
      *,
      subcategories!inner (
        id,
        name,
        slug,
        categories!inner (
          slug
        )
      )
    `)
    .eq('subcategories.categories.slug', categorySlug)
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (subcategorySlug) {
    query = query.eq('subcategories.slug', subcategorySlug)
  }

  const { data } = await query
  return data || []
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategoryWithSubcategories(slug)
  
  if (!category) {
    notFound()
  }

  const experiences = await getExperiencesByCategory(slug)

  return <CategoryWithSubcategories category={category} experiences={experiences} />
}