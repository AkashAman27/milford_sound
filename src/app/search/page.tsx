import { Suspense } from 'react'
import { SearchResults } from '@/components/search/SearchResults'

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<SearchPageSkeleton />}>
        <SearchResults />
      </Suspense>
    </div>
  )
}

function SearchPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="h-48 bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}