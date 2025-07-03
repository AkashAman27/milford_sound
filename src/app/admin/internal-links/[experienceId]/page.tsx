'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, ArrowLeft, Save, X, GripVertical } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'

interface InternalLink {
  id: string
  title: string
  url: string
  display_order: number
  enabled: boolean
}

interface InternalLinksSection {
  id: string
  section_title: string
  section_type: string
  sort_order: number
  enabled: boolean
  links: InternalLink[]
}

interface Experience {
  id: string
  title: string
  slug: string
}

export default function ExperienceInternalLinksManagement() {
  const params = useParams()
  const router = useRouter()
  const experienceId = params.experienceId as string
  
  const [experience, setExperience] = useState<Experience | null>(null)
  const [sections, setSections] = useState<InternalLinksSection[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editingLink, setEditingLink] = useState<string | null>(null)
  const [newSection, setNewSection] = useState({
    section_title: '',
    section_type: 'attractions',
    sort_order: 0
  })
  const [newLink, setNewLink] = useState({
    section_id: '',
    title: '',
    url: '',
    display_order: 1
  })
  const [showNewSectionForm, setShowNewSectionForm] = useState(false)
  const [showNewLinkForm, setShowNewLinkForm] = useState(false)

  useEffect(() => {
    fetchData()
  }, [experienceId])

  async function fetchData() {
    const supabase = createClient()
    
    // Fetch experience
    const { data: expData, error: expError } = await supabase
      .from('experiences')
      .select('id, title, slug')
      .eq('id', experienceId)
      .single()

    if (expData) setExperience(expData)
    if (expError) console.error('Error fetching experience:', expError)

    // Fetch sections with links
    const { data: sectionsData, error: sectionsError } = await supabase
      .from('internal_links_sections')
      .select(`
        *,
        internal_links(*)
      `)
      .eq('experience_id', experienceId)
      .order('sort_order')

    if (sectionsData) {
      const transformedSections: InternalLinksSection[] = sectionsData.map(section => ({
        ...section,
        links: section.internal_links
          .sort((a: any, b: any) => a.display_order - b.display_order)
      }))
      setSections(transformedSections)
    }
    
    if (sectionsError) console.error('Error fetching sections:', sectionsError)
    setLoading(false)
  }

  async function handleCreateSection() {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('internal_links_sections')
      .insert([{
        experience_id: experienceId,
        ...newSection
      }])

    if (error) {
      alert(`Error creating section: ${error.message}`)
    } else {
      setNewSection({ section_title: '', section_type: 'attractions', sort_order: 0 })
      setShowNewSectionForm(false)
      fetchData()
    }
  }

  async function handleCreateLink() {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('internal_links')
      .insert([newLink])

    if (error) {
      alert(`Error creating link: ${error.message}`)
    } else {
      setNewLink({ section_id: '', title: '', url: '', display_order: 1 })
      setShowNewLinkForm(false)
      fetchData()
    }
  }

  async function handleDeleteSection(sectionId: string) {
    if (!confirm('Are you sure you want to delete this section and all its links?')) return

    const supabase = createClient()
    
    const { error } = await supabase
      .from('internal_links_sections')
      .delete()
      .eq('id', sectionId)

    if (error) {
      alert('Error deleting section')
    } else {
      fetchData()
    }
  }

  async function handleDeleteLink(linkId: string) {
    if (!confirm('Are you sure you want to delete this link?')) return

    const supabase = createClient()
    
    const { error } = await supabase
      .from('internal_links')
      .delete()
      .eq('id', linkId)

    if (error) {
      alert('Error deleting link')
    } else {
      fetchData()
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!experience) {
    return <div className="text-center py-8">Experience not found</div>
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Internal Links for: {experience.title}</h1>
          <p className="text-gray-600 mt-2">Manage sections and links for this experience</p>
        </div>
      </div>

      {/* New Section Form */}
      {showNewSectionForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="section_title">Section Title</Label>
                <Input
                  id="section_title"
                  value={newSection.section_title}
                  onChange={(e) => setNewSection(prev => ({ ...prev, section_title: e.target.value }))}
                  placeholder="e.g., Top Attractions in Tokyo"
                />
              </div>
              <div>
                <Label htmlFor="section_type">Section Type</Label>
                <Select 
                  value={newSection.section_type} 
                  onValueChange={(value) => setNewSection(prev => ({ ...prev, section_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="attractions">Attractions</SelectItem>
                    <SelectItem value="experiences">Experiences</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={newSection.sort_order}
                  onChange={(e) => setNewSection(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleCreateSection}>
                <Save className="h-4 w-4 mr-2" />
                Create Section
              </Button>
              <Button variant="outline" onClick={() => setShowNewSectionForm(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Link Form */}
      {showNewLinkForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="link_section">Section</Label>
                <Select 
                  value={newLink.section_id} 
                  onValueChange={(value) => setNewLink(prev => ({ ...prev, section_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map(section => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.section_title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="link_title">Link Title</Label>
                <Input
                  id="link_title"
                  value={newLink.title}
                  onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Senso-ji Temple"
                />
              </div>
              <div>
                <Label htmlFor="link_url">URL</Label>
                <Input
                  id="link_url"
                  value={newLink.url}
                  onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="e.g., /attractions/senso-ji-temple"
                />
              </div>
              <div>
                <Label htmlFor="link_order">Display Order</Label>
                <Input
                  id="link_order"
                  type="number"
                  value={newLink.display_order}
                  onChange={(e) => setNewLink(prev => ({ ...prev, display_order: parseInt(e.target.value) || 1 }))}
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleCreateLink}>
                <Save className="h-4 w-4 mr-2" />
                Create Link
              </Button>
              <Button variant="outline" onClick={() => setShowNewLinkForm(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2 mb-6">
        <Button onClick={() => setShowNewSectionForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
        <Button variant="outline" onClick={() => setShowNewLinkForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {sections.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">No sections found</p>
              <Button onClick={() => setShowNewSectionForm(true)}>
                Create Your First Section
              </Button>
            </CardContent>
          </Card>
        ) : (
          sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <GripVertical className="h-5 w-5 mr-2 text-gray-400" />
                    {section.section_title}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({section.section_type})
                    </span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteSection(section.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {section.links.map((link) => (
                    <div key={link.id} className="relative group bg-gray-800 text-white px-4 py-3 rounded-lg">
                      <div className="absolute top-2 left-3 text-xs font-bold text-gray-300">
                        {link.display_order}
                      </div>
                      <div className="pt-2 text-sm">
                        {link.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 truncate">
                        {link.url}
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteLink(link.id)}
                          className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {section.links.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No links in this section yet
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}