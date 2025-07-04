'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RedirectsManagement() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">URL Redirects</h1>
          <p className="text-gray-600 mt-2">Manage URL redirects and slug changes</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>URL Redirects Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            URL redirects management is currently being developed. This will allow you to create
            and manage redirects for old URLs to prevent broken links.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}