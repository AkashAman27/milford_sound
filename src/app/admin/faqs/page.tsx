'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface FAQ {
  id: string
  question: string
  answer: string
  sort_order: number
  enabled: boolean
  created_at: string
  updated_at: string
}

export default function FAQsManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    sort_order: 0,
    enabled: true
  })

  useEffect(() => {
    fetchFAQs()
  }, [])

  async function fetchFAQs() {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('sort_order')

    if (data) setFaqs(data)
    if (error) console.error('Error fetching FAQs:', error)
    setLoading(false)
  }

  async function saveFAQ(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()

    if (editingId) {
      // Update existing FAQ
      const { error } = await supabase
        .from('faqs')
        .update({
          question: formData.question,
          answer: formData.answer,
          sort_order: formData.sort_order,
          enabled: formData.enabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingId)

      if (error) {
        alert('Error updating FAQ')
        console.error(error)
      } else {
        setEditingId(null)
        resetForm()
        fetchFAQs()
      }
    } else {
      // Create new FAQ
      const { error } = await supabase
        .from('faqs')
        .insert([{
          question: formData.question,
          answer: formData.answer,
          sort_order: formData.sort_order,
          enabled: formData.enabled
        }])

      if (error) {
        alert('Error creating FAQ')
        console.error(error)
      } else {
        resetForm()
        fetchFAQs()
      }
    }
  }

  async function deleteFAQ(id: string) {
    if (!confirm('Are you sure you want to delete this FAQ?')) return

    const supabase = createClient()
    
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting FAQ')
      console.error(error)
    } else {
      fetchFAQs()
    }
  }

  function editFAQ(faq: FAQ) {
    setEditingId(faq.id)
    setFormData({
      question: faq.question,
      answer: faq.answer,
      sort_order: faq.sort_order,
      enabled: faq.enabled
    })
  }

  function resetForm() {
    setFormData({
      question: '',
      answer: '',
      sort_order: 0,
      enabled: true
    })
  }

  function cancelEdit() {
    setEditingId(null)
    resetForm()
  }

  if (loading) {
    return <div className="text-center py-8">Loading FAQs...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">FAQs Management</h1>
        <p className="text-gray-600 mt-2">Manage frequently asked questions on your homepage</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingId ? 'Edit FAQ' : 'Add New FAQ'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveFAQ} className="space-y-4">
                <div>
                  <Label htmlFor="question">Question *</Label>
                  <Input
                    id="question"
                    required
                    value={formData.question}
                    onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="Enter your question..."
                  />
                </div>

                <div>
                  <Label htmlFor="answer">Answer *</Label>
                  <Textarea
                    id="answer"
                    required
                    value={formData.answer}
                    onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                    rows={4}
                    placeholder="Enter the answer..."
                  />
                </div>

                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="enabled"
                    checked={formData.enabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
                  />
                  <Label htmlFor="enabled">Enabled</Label>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {editingId ? 'Update' : 'Create'} FAQ
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* FAQs List */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {faqs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">No FAQs found</p>
                </CardContent>
              </Card>
            ) : (
              faqs.map((faq) => (
                <Card key={faq.id} className={editingId === faq.id ? 'ring-2 ring-primary' : ''}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                          {!faq.enabled && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                              Disabled
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-3">{faq.answer}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Sort Order: {faq.sort_order}</span>
                          <span>Created: {new Date(faq.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editFAQ(faq)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteFAQ(faq.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}