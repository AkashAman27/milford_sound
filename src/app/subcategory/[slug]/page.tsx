'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SubcategoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Subcategory Page</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Subcategory pages are currently being developed. This will show tours filtered by specific subcategories.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}