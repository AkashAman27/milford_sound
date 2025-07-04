'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function InternalLinksPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Internal Links</h1>
          <p className="text-gray-600 mt-2">Manage internal links between content</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Internal Links Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Internal links management is currently being developed. This will allow you to create
            and manage internal links between your tours, blog posts, and other content.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}