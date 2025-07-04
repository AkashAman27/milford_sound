'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'

export default function ExperienceRedirect() {
  const params = useParams()
  const slug = params.slug as string

  useEffect(() => {
    if (slug) {
      window.location.replace(`/tour/${slug}`)
    }
  }, [slug])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">Redirecting to tour page...</p>
      </div>
    </div>
  )
}