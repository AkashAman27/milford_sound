import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/products/ProductCard'

interface PageProps {
  params: Promise<{ slug: string }>
}

interface Experience {
  id: string
  title: string
  slug: string
  main_image_url: string
  price: number
  rating: number
  review_count: number
  duration: string
  max_group_size: number
  short_description: string
  cities: {
    name: string
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: subcategory } = await supabase
    .from('subcategories')
    .select('name, description')
    .eq('slug', slug)
    .single()

  if (!subcategory) {
    return {
      title: 'Subcategory Not Found'
    }
  }

  return {
    title: `${subcategory.name} Tours | Milford Sound`,
    description: subcategory.description || `Discover amazing ${subcategory.name.toLowerCase()} experiences in New Zealand`
  }
}

export default async function SubcategoryPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch subcategory details
  const { data: subcategory } = await supabase
    .from('subcategories')
    .select(`
      *,
      categories (
        name,
        slug
      )
    `)
    .eq('slug', slug)
    .single()

  if (!subcategory) {
    notFound()
  }

  // Fetch experiences in this subcategory
  const { data: experiences } = await supabase
    .from('experiences')
    .select(`
      id,
      title,
      slug,
      main_image_url,
      price,
      rating,
      review_count,
      duration,
      max_group_size,
      short_description,
      cities (
        name
      )
    `)
    .eq('subcategory_id', subcategory.id)
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm">
              <li><a href="/" className="hover:underline">Home</a></li>
              <li>/</li>
              <li><a href="/tours" className="hover:underline">Tours</a></li>
              <li>/</li>
              <li><a href={`/category/${subcategory.categories?.slug}`} className="hover:underline">{subcategory.categories?.name}</a></li>
              <li>/</li>
              <li className="text-gray-200">{subcategory.name}</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {subcategory.name}
          </h1>
          
          {subcategory.description && (
            <p className="text-xl text-gray-100 max-w-3xl">
              {subcategory.description}
            </p>
          )}
          
          <div className="mt-6 flex items-center space-x-6 text-sm">
            <span>{subcategory.experience_count} experiences</span>
            <span>Category: {subcategory.categories?.name}</span>
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {experiences && experiences.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {experiences.length} Experience{experiences.length !== 1 ? 's' : ''} Found
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {experiences.map((experience) => (
                  <ProductCard
                    key={experience.id}
                    id={experience.id}
                    title={experience.title}
                    slug={experience.slug}
                    image={experience.main_image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop'}
                    price={experience.price || 0}
                    rating={experience.rating || 0}
                    reviewCount={experience.review_count || 0}
                    duration={experience.duration || 'N/A'}
                    maxGroupSize={experience.max_group_size || 0}
                    city={experience.cities?.name || 'New Zealand'}
                    shortDescription={experience.short_description}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No experiences found
              </h2>
              <p className="text-gray-600 mb-8">
                We don't have any experiences in this subcategory yet. Check back soon!
              </p>
              <a
                href="/tours"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-700"
              >
                Browse All Tours
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}