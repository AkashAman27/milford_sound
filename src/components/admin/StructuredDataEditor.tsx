'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Code, AlertTriangle, CheckCircle, Eye, Save, RotateCcw } from 'lucide-react'
import { validateJSONLD, StructuredDataType } from '@/lib/structuredData'

interface StructuredDataEditorProps {
  initialData?: {
    structured_data_type?: string
    custom_json_ld?: string
    structured_data_enabled?: boolean
    schema_override_priority?: number
  }
  contentData: Record<string, any>
  onSave: (data: any) => void
  readonly?: boolean
}

const SCHEMA_TYPES: { value: StructuredDataType; label: string; description: string }[] = [
  { value: 'TouristAttraction', label: 'Tourist Attraction', description: 'For tours and attractions' },
  { value: 'LocalBusiness', label: 'Local Business', description: 'For business/company information' },
  { value: 'Product', label: 'Product', description: 'For tour packages and products' },
  { value: 'Event', label: 'Event', description: 'For scheduled tours and events' },
  { value: 'Article', label: 'Article', description: 'For articles and guides' },
  { value: 'BlogPosting', label: 'Blog Post', description: 'For blog posts and stories' },
  { value: 'Organization', label: 'Organization', description: 'For company/organization data' },
  { value: 'WebSite', label: 'Website', description: 'For website-level schema' },
  { value: 'BreadcrumbList', label: 'Breadcrumbs', description: 'For navigation breadcrumbs' },
  { value: 'FAQPage', label: 'FAQ Page', description: 'For FAQ sections' },
  { value: 'Review', label: 'Review', description: 'For customer reviews' },
  { value: 'Offer', label: 'Offer', description: 'For pricing and offers' },
  { value: 'Service', label: 'Service', description: 'For service descriptions' }
]

export function StructuredDataEditor({ 
  initialData, 
  contentData, 
  onSave, 
  readonly = false 
}: StructuredDataEditorProps) {
  const [enabled, setEnabled] = useState(initialData?.structured_data_enabled ?? true)
  const [schemaType, setSchemaType] = useState<StructuredDataType>(
    (initialData?.structured_data_type as StructuredDataType) || 'TouristAttraction'
  )
  const [customJsonLd, setCustomJsonLd] = useState(initialData?.custom_json_ld || '')
  const [priority, setPriority] = useState(initialData?.schema_override_priority || 0)
  const [validation, setValidation] = useState<{ isValid: boolean; error?: string; parsed?: any }>({ isValid: true })
  const [previewData, setPreviewData] = useState<any>(null)

  // Validate JSON-LD when it changes
  useEffect(() => {
    if (customJsonLd.trim()) {
      const result = validateJSONLD(customJsonLd)
      setValidation(result)
    } else {
      setValidation({ isValid: true })
    }
  }, [customJsonLd])

  // Generate preview of automatic schema
  useEffect(() => {
    // This would call our structured data generation function
    // For now, showing a simplified preview
    const preview = {
      '@context': 'https://schema.org',
      '@type': schemaType,
      name: contentData.title || contentData.name,
      description: contentData.description || contentData.excerpt,
      url: contentData.url
    }
    setPreviewData(preview)
  }, [schemaType, contentData])

  const handleSave = () => {
    if (!validation.isValid && customJsonLd.trim()) {
      return
    }

    onSave({
      structured_data_enabled: enabled,
      structured_data_type: schemaType,
      custom_json_ld: customJsonLd.trim() || null,
      schema_override_priority: priority
    })
  }

  const handleReset = () => {
    setEnabled(initialData?.structured_data_enabled ?? true)
    setSchemaType((initialData?.structured_data_type as StructuredDataType) || 'TouristAttraction')
    setCustomJsonLd(initialData?.custom_json_ld || '')
    setPriority(initialData?.schema_override_priority || 0)
  }

  const generateSampleJsonLd = () => {
    const sample = {
      '@context': 'https://schema.org',
      '@type': schemaType,
      name: contentData.title || 'Sample Title',
      description: contentData.description || 'Sample description',
      url: contentData.url || 'https://example.com'
    }

    // Add type-specific fields
    switch (schemaType) {
      case 'TouristAttraction':
        Object.assign(sample, {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: -44.6189,
            longitude: 167.9224
          },
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'TPS Site',
            addressRegion: 'Southland',
            addressCountry: 'NZ'
          }
        })
        break
      case 'Product':
        Object.assign(sample, {
          offers: {
            '@type': 'Offer',
            price: '99.00',
            priceCurrency: 'USD'
          }
        })
        break
      case 'BlogPosting':
        Object.assign(sample, {
          author: {
            '@type': 'Person',
            name: 'Author Name'
          },
          datePublished: new Date().toISOString()
        })
        break
    }

    setCustomJsonLd(JSON.stringify(sample, null, 2))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Structured Data Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="structured-data-enabled">Enable Structured Data</Label>
            <p className="text-sm text-gray-600">Include schema.org markup for search engines</p>
          </div>
          <Switch
            id="structured-data-enabled"
            checked={enabled}
            onCheckedChange={setEnabled}
            disabled={readonly}
          />
        </div>

        {enabled && (
          <>
            {/* Schema Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="schema-type">Schema Type</Label>
              <Select
                value={schemaType}
                onValueChange={(value) => setSchemaType(value as StructuredDataType)}
                disabled={readonly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select schema type" />
                </SelectTrigger>
                <SelectContent>
                  {SCHEMA_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-500">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority Setting */}
            <div className="space-y-2">
              <Label htmlFor="priority">Schema Priority</Label>
              <Select
                value={priority.toString()}
                onValueChange={(value) => setPriority(parseInt(value))}
                disabled={readonly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Normal (0)</SelectItem>
                  <SelectItem value="1">High (1)</SelectItem>
                  <SelectItem value="2">Critical (2)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600">Higher priority schemas override automatic generation</p>
            </div>

            {/* Tabs for Auto vs Custom */}
            <Tabs defaultValue="auto" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="auto">Automatic Schema</TabsTrigger>
                <TabsTrigger value="custom">Custom JSON-LD</TabsTrigger>
              </TabsList>

              <TabsContent value="auto" className="space-y-4">
                <div>
                  <Label>Automatically Generated Schema Preview</Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <pre className="text-sm overflow-auto max-h-64">
                      {JSON.stringify(previewData, null, 2)}
                    </pre>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    This schema is automatically generated based on your content data and selected type.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="custom" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="custom-jsonld">Custom JSON-LD</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateSampleJsonLd}
                      disabled={readonly}
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Generate Sample
                    </Button>
                  </div>
                  
                  <Textarea
                    id="custom-jsonld"
                    placeholder="Enter custom JSON-LD schema..."
                    value={customJsonLd}
                    onChange={(e) => setCustomJsonLd(e.target.value)}
                    className="font-mono text-sm min-h-64"
                    disabled={readonly}
                  />

                  {/* Validation Status */}
                  {customJsonLd.trim() && (
                    <Alert className={validation.isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                      <div className="flex items-center gap-2">
                        {validation.isValid ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <AlertDescription className={validation.isValid ? "text-green-800" : "text-red-800"}>
                          {validation.isValid ? 'Valid JSON-LD schema' : validation.error}
                        </AlertDescription>
                      </div>
                    </Alert>
                  )}

                  <p className="text-sm text-gray-600">
                    Custom JSON-LD will override automatic generation. Leave empty to use automatic schema.
                  </p>
                </div>

                {/* JSON-LD Preview */}
                {validation.isValid && validation.parsed && (
                  <div className="space-y-2">
                    <Label>Parsed JSON-LD Preview</Label>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <pre className="text-sm overflow-auto max-h-64">
                        {JSON.stringify(validation.parsed, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            {!readonly && (
              <div className="flex items-center gap-2 pt-4 border-t">
                <Button
                  onClick={handleSave}
                  disabled={!validation.isValid && customJsonLd.trim() !== ''}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            )}

            {/* Schema Information */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">About {SCHEMA_TYPES.find(t => t.value === schemaType)?.label}</h4>
              <p className="text-sm text-blue-800">
                {SCHEMA_TYPES.find(t => t.value === schemaType)?.description}
              </p>
              <div className="mt-2 flex gap-2">
                <Badge variant="outline" className="text-blue-700 border-blue-300">
                  Schema.org Type: {schemaType}
                </Badge>
                {customJsonLd.trim() && (
                  <Badge variant="outline" className="text-orange-700 border-orange-300">
                    Custom Override Active
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}