'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function InternalLinksManagement() {
  const params = useParams()
  const experienceId = params.experienceId as string

  return (
    <div>
      <div className="flex items-center mb-8">
        <Link href="/admin/internal-links">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Internal Links
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Internal Links Management</h1>
          <p className="text-gray-600 mt-2">Manage internal links for experience {experienceId}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Internal Links</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Internal links management is currently being developed. This will allow you to manage
            internal linking between your content pages.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}