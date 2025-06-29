'use client'

import { useState } from 'react'
import { FormField, TextArea, Select } from './FormField'
import { Code, Eye, EyeOff, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CodeSnippet {
  language: string
  code: string
  title?: string
}

interface CodeEditorProps {
  snippets: CodeSnippet[]
  onChange: (snippets: CodeSnippet[]) => void
}

const PROGRAMMING_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'yaml', label: 'YAML' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'dart', label: 'Dart' },
  { value: 'plaintext', label: 'Plain Text' }
]

export function CodeEditor({ snippets, onChange }: CodeEditorProps) {
  const [showPreview, setShowPreview] = useState<{ [key: number]: boolean }>({})

  const addSnippet = () => {
    onChange([...snippets, { language: 'javascript', code: '', title: '' }])
  }

  const updateSnippet = (index: number, field: keyof CodeSnippet, value: string) => {
    const updated = snippets.map((snippet, i) => 
      i === index ? { ...snippet, [field]: value } : snippet
    )
    onChange(updated)
  }

  const removeSnippet = (index: number) => {
    onChange(snippets.filter((_, i) => i !== index))
  }

  const togglePreview = (index: number) => {
    setShowPreview(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Code className="h-5 w-5 mr-2" />
          Code Snippets
        </h3>
        <Button
          type="button"
          onClick={addSnippet}
          variant="outline"
          size="sm"
        >
          Add Code Snippet
        </Button>
      </div>

      {snippets.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Code className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 mb-4">No code snippets added</p>
          <Button
            type="button"
            onClick={addSnippet}
            variant="outline"
          >
            Add Your First Code Snippet
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {snippets.map((snippet, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Code Snippet {index + 1}</h4>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    onClick={() => togglePreview(index)}
                    variant="outline"
                    size="sm"
                  >
                    {showPreview[index] ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-1" />
                        Hide Preview
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1" />
                        Show Preview
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => removeSnippet(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField label="Title (Optional)">
                  <input
                    type="text"
                    value={snippet.title || ''}
                    onChange={(e) => updateSnippet(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., User Authentication Function"
                  />
                </FormField>

                <FormField label="Language">
                  <Select
                    value={snippet.language}
                    onChange={(value) => updateSnippet(index, 'language', value)}
                    options={PROGRAMMING_LANGUAGES}
                  />
                </FormField>
              </div>

              <FormField label="Code">
                <div className="relative">
                  <textarea
                    value={snippet.code}
                    onChange={(e) => updateSnippet(index, 'code', e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                    placeholder="Enter your code here..."
                  />
                  {snippet.code && (
                    <Button
                      type="button"
                      onClick={() => copyToClipboard(snippet.code)}
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </FormField>

              {showPreview[index] && snippet.code && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Preview:</h5>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 uppercase">
                        {snippet.language}
                      </span>
                      {snippet.title && (
                        <span className="text-xs text-gray-400">
                          {snippet.title}
                        </span>
                      )}
                    </div>
                    <pre className="text-sm">
                      <code>{snippet.code}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {snippets.length > 0 && (
        <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-md">
          <strong>Tip:</strong> Code snippets will be displayed in your blog post with syntax highlighting and copy functionality for readers.
        </div>
      )}
    </div>
  )
}