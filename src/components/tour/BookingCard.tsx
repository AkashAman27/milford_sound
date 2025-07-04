'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface BookingCardProps {
  price: number
  availabilityUrl?: string
}

export function BookingCard({ price, availabilityUrl }: BookingCardProps) {
  const handleCheckAvailability = () => {
    if (availabilityUrl) {
      window.open(availabilityUrl, '_blank')
    } else {
      alert('Availability booking is currently unavailable')
    }
  }

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">
            ${price.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">per person</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleCheckAvailability}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          Check Availability
        </Button>

        <div className="text-center text-sm text-gray-600">
          Free cancellation available
        </div>

        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
          <p className="font-medium mb-1">What's included:</p>
          <ul className="space-y-1">
            <li>• Entry tickets</li>
            <li>• Professional guide</li>
            <li>• Audio guide (multiple languages)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}