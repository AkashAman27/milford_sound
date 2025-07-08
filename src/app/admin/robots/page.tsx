'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Save, Plus, Trash2, Eye, AlertCircle, Database } from 'lucide-react'

interface RobotsConfig {
  id: number
  user_agent: string
  allow_paths: string[]
  disallow_paths: string[]
  sitemap_url: string
  additional_rules: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function RobotsManagement() {
  const [config, setConfig] = useState<RobotsConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [needsSetup, setNeedsSetup] = useState(false)
  
  const [formData, setFormData] = useState({
    user_agent: '*',
    allow_paths: ['/'],
    disallow_paths: ['/admin', '/api', '/auth/callback', '/checkout', '/_next', '/dev-output.log'],
    sitemap_url: 'https://tps-site.com/sitemap.xml',
    additional_rules: '',
    is_active: true
  })

  const [newAllowPath, setNewAllowPath] = useState('')
  const [newDisallowPath, setNewDisallowPath] = useState('')

  useEffect(() => {
    fetchConfig()
  }, [])

  useEffect(() => {
    generatePreview()
  }, [formData])

  async function fetchConfig() {
    const supabase = createClient()
    
    try {
      const { data, error } = await supabase
        .from('robots_config')
        .select('*')
        .eq('is_active', true)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setConfig(data)
        setFormData({
          user_agent: data.user_agent,
          allow_paths: data.allow_paths || ['/'],
          disallow_paths: data.disallow_paths || [],
          sitemap_url: data.sitemap_url,
          additional_rules: data.additional_rules || '',
          is_active: data.is_active
        })
        setNeedsSetup(false)
      } else {
        setNeedsSetup(true)
      }
    } catch (error) {
      console.error('Error fetching robots config:', error)
      // Check if it's a table doesn't exist error
      if (error.message && error.message.includes('relation "public.robots_config" does not exist')) {
        setNeedsSetup(true)
      }
    } finally {
      setLoading(false)
    }
  }

  async function saveConfig() {
    setSaving(true)
    const supabase = createClient()

    try {
      const configData = {
        user_agent: formData.user_agent,
        allow_paths: formData.allow_paths,
        disallow_paths: formData.disallow_paths,
        sitemap_url: formData.sitemap_url,
        additional_rules: formData.additional_rules,
        is_active: formData.is_active
      }

      if (config) {
        // Update existing config
        const { error } = await supabase
          .from('robots_config')
          .update(configData)
          .eq('id', config.id)

        if (error) throw error
      } else {
        // Create new config
        const { error } = await supabase
          .from('robots_config')
          .insert([configData])

        if (error) throw error
      }

      await fetchConfig()
      alert('Robots.txt configuration saved successfully!')
    } catch (error) {
      console.error('Error saving robots config:', error)
      alert('Error saving configuration. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function generatePreview() {
    let robotsContent = `User-Agent: ${formData.user_agent}\n`
    
    // Add allow rules
    formData.allow_paths.forEach(path => {
      robotsContent += `Allow: ${path}\n`
    })
    
    // Add disallow rules
    formData.disallow_paths.forEach(path => {
      robotsContent += `Disallow: ${path}\n`
    })
    
    // Add additional rules
    if (formData.additional_rules.trim()) {
      robotsContent += `\n${formData.additional_rules.trim()}\n`
    }
    
    // Add sitemap
    if (formData.sitemap_url.trim()) {
      robotsContent += `\nSitemap: ${formData.sitemap_url}`
    }
    
    setPreview(robotsContent)
  }

  function addAllowPath() {
    if (newAllowPath.trim() && !formData.allow_paths.includes(newAllowPath.trim())) {
      setFormData(prev => ({
        ...prev,
        allow_paths: [...prev.allow_paths, newAllowPath.trim()]
      }))
      setNewAllowPath('')
    }
  }

  function addDisallowPath() {
    if (newDisallowPath.trim() && !formData.disallow_paths.includes(newDisallowPath.trim())) {
      setFormData(prev => ({
        ...prev,
        disallow_paths: [...prev.disallow_paths, newDisallowPath.trim()]
      }))
      setNewDisallowPath('')
    }
  }

  function removeAllowPath(index: number) {
    setFormData(prev => ({
      ...prev,
      allow_paths: prev.allow_paths.filter((_, i) => i !== index)
    }))
  }

  function removeDisallowPath(index: number) {
    setFormData(prev => ({
      ...prev,
      disallow_paths: prev.disallow_paths.filter((_, i) => i !== index)
    }))
  }

  if (loading) {
    return <div className="text-center py-8">Loading robots.txt configuration...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Robots.txt Management</h1>
          <p className="text-gray-600 mt-2">Configure your site's robots.txt file</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button onClick={saveConfig} disabled={saving || needsSetup}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : needsSetup ? 'Setup Required' : 'Save Configuration'}
          </Button>
        </div>
      </div>

      {needsSetup && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-800">
              <Database className="h-5 w-5 mr-2" />
              Database Setup Required
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700">
            <p className="mb-4">
              The robots.txt management system needs a database table to store configurations. 
              Your robots.txt is currently working with default settings.
            </p>
            <div className="bg-amber-100 p-4 rounded-lg">
              <p className="font-semibold mb-2">Quick Setup:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Go to your <strong>Supabase Dashboard</strong> → <strong>SQL Editor</strong></li>
                <li>Run the SQL migration from the <code>robots_config_migration.sql</code> file</li>
                <li>Refresh this page to start managing your robots.txt</li>
              </ol>
            </div>
            <p className="mt-3 text-sm">
              <AlertCircle className="h-4 w-4 inline mr-1" />
              Don't worry - your site's robots.txt will continue working normally until setup is complete.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="user-agent">User Agent</Label>
                <Input
                  id="user-agent"
                  value={formData.user_agent}
                  onChange={(e) => setFormData(prev => ({ ...prev, user_agent: e.target.value }))}
                  placeholder="*"
                />
              </div>

              <div>
                <Label htmlFor="sitemap-url">Sitemap URL</Label>
                <Input
                  id="sitemap-url"
                  value={formData.sitemap_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, sitemap_url: e.target.value }))}
                  placeholder="https://yoursite.com/sitemap.xml"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  checked={formData.is_active} 
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label>Active Configuration</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Allow Paths</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newAllowPath}
                  onChange={(e) => setNewAllowPath(e.target.value)}
                  placeholder="/path-to-allow"
                  onKeyPress={(e) => e.key === 'Enter' && addAllowPath()}
                />
                <Button onClick={addAllowPath}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.allow_paths.map((path, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {path}
                    <button
                      onClick={() => removeAllowPath(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disallow Paths</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newDisallowPath}
                  onChange={(e) => setNewDisallowPath(e.target.value)}
                  placeholder="/path-to-disallow"
                  onKeyPress={(e) => e.key === 'Enter' && addDisallowPath()}
                />
                <Button onClick={addDisallowPath}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.disallow_paths.map((path, index) => (
                  <Badge key={index} variant="destructive" className="flex items-center gap-1">
                    {path}
                    <button
                      onClick={() => removeDisallowPath(index)}
                      className="ml-1 hover:text-red-300"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.additional_rules}
                onChange={(e) => setFormData(prev => ({ ...prev, additional_rules: e.target.value }))}
                placeholder="Add any additional robots.txt rules here..."
                rows={4}
              />
              <p className="text-sm text-gray-500 mt-2">
                Add custom rules like crawl delays, host directives, etc.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        {showPreview && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Robots.txt Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap">
                  {preview}
                </pre>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This preview shows how your robots.txt file will appear. 
                    Changes take effect immediately after saving.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}