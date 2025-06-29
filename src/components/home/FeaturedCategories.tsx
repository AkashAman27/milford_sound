'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase'

interface Category {
  id: string
  name: string
  slug: string
  image_url: string
  experience_count: number
}

export function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient()
      
      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('featured', true)
        .order('sort_order')

      if (data) setCategories(data)
      setLoading(false)
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading categories...</div>
        </div>
      </section>
    )
  }
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing experiences tailored to your interests
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`}>
              <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-200">
                        {category.experience_count}+ experiences
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}