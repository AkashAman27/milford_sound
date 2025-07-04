'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomepageLinksManagement() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Homepage Links</h1>
          <p className="text-gray-600 mt-2">Manage internal links on the homepage</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Homepage Internal Links</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Homepage internal links management is currently being developed. This will allow you to manage
            the internal linking sections that appear on your homepage.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}