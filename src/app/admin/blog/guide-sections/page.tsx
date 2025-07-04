'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function BlogGuideSectionsManagement() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Travel Guide Sections</h1>
          <p className="text-gray-600 mt-2">Manage travel guide content for blog posts</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Travel Guide Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This feature is currently being developed. Travel guide sections will allow you to create
            structured content for blog posts including "What to Do", "What Not to Do", and "What to Carry" sections.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}