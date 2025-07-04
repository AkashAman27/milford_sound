'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Calendar,
  Users,
  MapPin,
  Clock,
  ArrowLeft,
  CreditCard,
  Shield,
  Check,
  AlertCircle,
  Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

interface BookingDetails {
  experience_id: string
  experience_title: string
  experience_slug: string
  selected_date: string
  tickets: number
  price: number
  total_price: number
  discount: number
  currency: string
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  })
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: ''
  })

  useEffect(() => {
    // Parse booking details from URL params
    const bookingData: BookingDetails = {
      experience_id: searchParams.get('experience_id') || '',
      experience_title: searchParams.get('experience_title') || '',
      experience_slug: searchParams.get('experience_slug') || '',
      selected_date: searchParams.get('selected_date') || '',
      tickets: parseInt(searchParams.get('tickets') || '1'),
      price: parseFloat(searchParams.get('price') || '0'),
      total_price: parseFloat(searchParams.get('total_price') || '0'),
      discount: parseFloat(searchParams.get('discount') || '0'),
      currency: searchParams.get('currency') || 'USD'
    }

    if (!bookingData.experience_id || !bookingData.selected_date) {
      router.push('/tours')
      return
    }

    setBooking(bookingData)
  }, [searchParams, router])

  const handleCustomerChange = (field: string, value: string) => {
    setCustomerDetails(prev => ({ ...prev, [field]: value }))
  }

  const handlePaymentChange = (field: string, value: string) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!booking) return

    setLoading(true)

    try {
      // Here you would integrate with your payment processor (Stripe, etc.)
      // For demo purposes, we'll simulate a successful booking
      
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      
      // Create a booking record in your database here
      
      // Redirect to success page with booking details
      alert(`Booking confirmed! 
      
Experience: ${booking.experience_title}
Date: ${formatDate(booking.selected_date)}
Travelers: ${booking.tickets}
Total: $${booking.total_price.toFixed(2)}

A confirmation email will be sent to ${customerDetails.email}`)
      
      // You could redirect to a success page instead
      router.push(`/tour/${booking.experience_slug}`)
      
    } catch (error) {
      alert('Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const isFormValid = 
    customerDetails.firstName &&
    customerDetails.lastName &&
    customerDetails.email &&
    customerDetails.phone &&
    paymentDetails.cardNumber &&
    paymentDetails.expiryDate &&
    paymentDetails.cvv &&
    paymentDetails.nameOnCard &&
    paymentDetails.billingAddress &&
    paymentDetails.city &&
    paymentDetails.zipCode &&
    paymentDetails.country

  const taxes = booking.total_price * 0.08 // 8% tax
  const finalTotal = booking.total_price + taxes

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded"></div>
              <span className="text-xl font-bold">Milford Sound</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href={`/tour/${booking.experience_slug}`}
            className="inline-flex items-center text-purple-600 hover:text-purple-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tour
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Customer Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={customerDetails.firstName}
                        onChange={(e) => handleCustomerChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={customerDetails.lastName}
                        onChange={(e) => handleCustomerChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerDetails.email}
                      onChange={(e) => handleCustomerChange('email', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerDetails.phone}
                      onChange={(e) => handleCustomerChange('phone', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                    <textarea
                      id="specialRequests"
                      value={customerDetails.specialRequests}
                      onChange={(e) => handleCustomerChange('specialRequests', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Any special requirements or accessibility needs..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="nameOnCard">Name on Card *</Label>
                    <Input
                      id="nameOnCard"
                      value={paymentDetails.nameOnCard}
                      onChange={(e) => handlePaymentChange('nameOnCard', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={paymentDetails.expiryDate}
                        onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentDetails.cvv}
                        onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="billingAddress">Address *</Label>
                    <Input
                      id="billingAddress"
                      value={paymentDetails.billingAddress}
                      onChange={(e) => handlePaymentChange('billingAddress', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={paymentDetails.city}
                        onChange={(e) => handlePaymentChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={paymentDetails.zipCode}
                        onChange={(e) => handlePaymentChange('zipCode', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        value={paymentDetails.country}
                        onChange={(e) => handlePaymentChange('country', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-900">Secure Payment</p>
                        <p className="text-blue-700">Your payment information is encrypted and secure</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Terms and Conditions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Free Cancellation</p>
                        <p className="text-gray-600">Cancel up to 24 hours before the experience starts for a full refund</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Instant Confirmation</p>
                        <p className="text-gray-600">Receive your booking confirmation immediately via email</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Mobile Ticket</p>
                        <p className="text-gray-600">Use your phone to show your ticket at the experience</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={!isFormValid || loading}
                className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg"
              >
                {loading ? 'Processing...' : `Complete Booking - $${finalTotal.toFixed(2)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{booking.experience_title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(booking.selected_date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{booking.tickets} {booking.tickets === 1 ? 'person' : 'people'}</span>
                  </div>
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{booking.tickets} × ${booking.price}</span>
                    <span>${(booking.price * booking.tickets).toFixed(2)}</span>
                  </div>
                  {booking.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Group discount</span>
                      <span>-${booking.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${booking.total_price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Taxes & fees (8%)</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)} {booking.currency}</span>
                  </div>
                </div>

                {booking.discount > 0 && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-green-800">
                      <p className="font-medium">You're saving ${booking.discount.toFixed(2)}!</p>
                      <p>Group discount applied</p>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                  <p className="font-medium mb-1">What's included:</p>
                  <ul className="space-y-1">
                    <li>• Entry tickets</li>
                    <li>• Professional guide</li>
                    <li>• Audio guide (multiple languages)</li>
                  </ul>
                </div>

                <div className="text-center text-sm text-gray-600">
                  <p>Free cancellation up to 24 hours before</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}