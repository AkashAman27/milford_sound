'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, ExternalLink, History, ArrowRight } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase'

interface SlugManagerProps {
  currentSlug: string
  previousSlug?: string
  contentType: 'blog_posts' | 'experiences' | 'categories'
  contentId: string
  onSlugChange: (slug: string) => void
  baseUrl?: string
}

interface RedirectHistory {
  old_slug: string
  new_slug: string
  created_at: string
  permanent: boolean
}

export function SlugManager({ 
  currentSlug, 
  previousSlug, 
  contentType, 
  contentId, 
  onSlugChange, 
  baseUrl = ''
}: SlugManagerProps) {
  const [newSlug, setNewSlug] = useState(currentSlug)
  const [redirectHistory, setRedirectHistory] = useState<RedirectHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const hasChanges = newSlug !== currentSlug
  const willBreakLinks = currentSlug && hasChanges

  useEffect(() => {
    if (showHistory) {
      fetchRedirectHistory()
    }
  }, [showHistory, contentId])

  const fetchRedirectHistory = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('slug_redirects')
        .select('old_slug, new_slug, created_at, permanent')
        .eq('content_id', contentId)
        .order('created_at', { ascending: false })
      
      setRedirectHistory(data || [])
    } catch (error) {
      console.error('Error fetching redirect history:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSlugChange = (value: string) => {
    const slug = generateSlug(value)
    setNewSlug(slug)
    onSlugChange(slug)
  }

  const getContentPath = () => {
    switch (contentType) {
      case 'blog_posts': return '/blog'
      case 'experiences': return '/experience'
      case 'categories': return '/category'
      default: return ''
    }
  }

  const currentUrl = `${baseUrl}${getContentPath()}/${currentSlug}`
  const newUrl = `${baseUrl}${getContentPath()}/${newSlug}`

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="slug">URL Slug</Label>
        <Input
          id="slug"
          value={newSlug}
          onChange={(e) => handleSlugChange(e.target.value)}
          placeholder="url-friendly-slug"
        />
        
        {/* URL Preview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Current URL:</span>
            <span className="font-mono text-blue-600">{currentUrl}</span>
            <ExternalLink className="h-3 w-3" />
          </div>
          
          {hasChanges && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">New URL:</span>
              <span className="font-mono text-green-600">{newUrl}</span>
              <Badge variant="outline" className="text-xs">New</Badge>
            </div>
          )}
        </div>
      </div>

      {/* Warning for URL changes */}
      {willBreakLinks && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>URL Change Warning:</strong> Changing the slug will break existing links to this content. 
            A redirect will be automatically created from the old URL to the new one to maintain SEO.
          </AlertDescription>
        </Alert>
      )}

      {/* Previous slug info */}
      {previousSlug && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <History className="h-4 w-4" />
          <span>Previous slug: <code className="bg-gray-100 px-1 rounded">{previousSlug}</code></span>
        </div>
      )}

      {/* Redirect History */}
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowHistory(!showHistory)}
        >
          <History className="h-4 w-4 mr-2" />
          {showHistory ? 'Hide' : 'Show'} Redirect History
        </Button>

        {showHistory && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">URL Redirect History</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : redirectHistory.length > 0 ? (
                <div className="space-y-2">
                  {redirectHistory.map((redirect, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2 text-sm">
                        <code className="bg-white px-2 py-1 rounded">{redirect.old_slug}</code>
                        <ArrowRight className="h-3 w-3" />
                        <code className="bg-white px-2 py-1 rounded">{redirect.new_slug}</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={redirect.permanent ? 'default' : 'secondary'}>
                          {redirect.permanent ? '301' : '302'}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(redirect.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No redirects found. This content hasn't had its URL changed.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* SEO Tips */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• URL slugs should be descriptive and include relevant keywords</p>
        <p>• Use hyphens (-) to separate words, not underscores</p>
        <p>• Keep slugs under 60 characters for better SEO</p>
        <p>• Avoid changing URLs frequently as it can hurt search rankings</p>
      </div>
    </div>
  )
}