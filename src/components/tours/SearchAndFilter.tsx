'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SearchAndFilterProps {
  onSearchChange: (search: string) => void
  onCategoryChange: (category: string) => void
  searchTerm: string
  selectedCategory: string
}

const categories = [
  { value: 'all', label: 'All Tours' },
  { value: 'boat-cruises', label: 'Boat Cruises' },
  { value: 'scenic-flights', label: 'Scenic Flights' },
  { value: 'sightseeing', label: 'Sightseeing' },
  { value: 'walking-hiking', label: 'Walking & Hiking' },
  { value: 'water-sports', label: 'Water Sports' },
  { value: 'food-drink-experiences', label: 'Food & Drink' }
]

export function SearchAndFilter({ onSearchChange, onCategoryChange, searchTerm, selectedCategory }: SearchAndFilterProps) {
  return (
    <>
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search tours..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-12 pl-4 pr-4 text-gray-900 bg-white border-0 rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(category.value)}
                className="text-sm"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}