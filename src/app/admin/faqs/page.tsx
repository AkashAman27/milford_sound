'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function FAQsManagement() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FAQs Management</h1>
          <p className="text-gray-600 mt-2">Manage frequently asked questions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>FAQs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            FAQ management is currently being developed. This will allow you to create and manage
            frequently asked questions for your website.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}