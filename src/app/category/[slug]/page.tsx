'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CategoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Category Page</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Category pages are currently being developed. This will show tours filtered by categories and subcategories.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}