import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const supabase = await createClient()
    const results = []

    // Search experiences/tours
    const { data: experiences, error: experiencesError } = await supabase
      .from('experiences')
      .select('id, title, slug, short_description, price, currency, rating, main_image_url, cities(name), categories(name)')
      .eq('status', 'active')
      .ilike('title', `%${query}%`)
      .limit(10)

    if (experiencesError) {
      console.error('Error searching experiences:', experiencesError)
    } else if (experiences) {
      experiences.forEach(exp => {
        results.push({
          id: exp.id,
          type: 'experience',
          title: exp.title,
          subtitle: exp.cities?.name || exp.categories?.name || 'TPS Site',
          slug: exp.slug,
          image: exp.main_image_url,
          rating: exp.rating || undefined,
          price: exp.price || undefined
        })
      })
    }

    // Search categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name, slug, experience_count')
      .ilike('name', `%${query}%`)
      .limit(5)

    if (categoriesError) {
      console.error('Error searching categories:', categoriesError)
    } else if (categories) {
      categories.forEach(cat => {
        results.push({
          id: cat.id,
          type: 'category',
          title: cat.name,
          subtitle: `${cat.experience_count || 0} tours`,
          slug: cat.slug
        })
      })
    }

    // Sort results: experiences first, then categories
    results.sort((a, b) => {
      if (a.type === 'experience' && b.type === 'category') return -1
      if (a.type === 'category' && b.type === 'experience') return 1
      return 0
    })

    return NextResponse.json({
      query,
      results: results.slice(0, 10),
      total: results.length
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}