'use client'

import { Button } from '@/components/ui/button'

interface CodeSnippet {
  language: string
  code: string
  title?: string
}

interface CodeSnippetDisplayProps {
  snippet: CodeSnippet
}

export function CodeSnippetDisplay({ snippet }: CodeSnippetDisplayProps) {
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-900 text-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-400 uppercase">
            {snippet.language}
          </span>
          {snippet.title && (
            <span className="text-sm text-gray-300">
              {snippet.title}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(snippet.code)}
          className="text-gray-400 hover:text-white"
        >
          <span className="text-xs">Copy</span>
        </Button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto">
        <code className="text-sm">{snippet.code}</code>
      </pre>
    </div>
  )
}