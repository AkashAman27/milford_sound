import { Metadata } from 'next'
import { MapPin, Users, Award, Clock, Mail, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | Milford Sound',
  description: 'Learn more about Milford Sound Tours and our commitment to providing unforgettable experiences in New Zealand.'
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Milford Sound
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl">
            We're passionate about sharing the natural beauty and wonder of New Zealand through unforgettable experiences and tours.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                Founded with a deep love for New Zealand's pristine wilderness, Milford Sound Tours has been creating 
                extraordinary experiences for travelers from around the world. Our journey began with a simple mission: 
                to showcase the breathtaking beauty of Fiordland and the wider South Island in a way that respects and 
                preserves the natural environment.
              </p>
              <p className="text-gray-700 mb-6">
                From humble beginnings, we've grown to become one of New Zealand's most trusted tour operators, 
                offering everything from scenic boat cruises through the iconic Milford Sound to thrilling helicopter 
                flights over snow-capped peaks. Every experience we offer is designed to create lasting memories while 
                supporting local communities and conservation efforts.
              </p>
              <p className="text-gray-700">
                Today, we continue to innovate and expand our offerings, always with sustainability and authentic 
                experiences at the heart of what we do. When you travel with us, you're not just a tourist – 
                you're an explorer discovering the very best of Aotearoa New Zealand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">10,000+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">15+</h3>
              <p className="text-gray-600">Years Experience</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">50+</h3>
              <p className="text-gray-600">Unique Tours</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">24/7</h3>
              <p className="text-gray-600">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Sustainability</h3>
                <p className="text-gray-700">
                  We're committed to protecting New Zealand's natural environment for future generations through 
                  responsible tourism practices and supporting conservation initiatives.
                </p>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Authenticity</h3>
                <p className="text-gray-700">
                  Every experience we offer showcases the genuine beauty and culture of New Zealand, 
                  guided by local experts who are passionate about sharing their knowledge.
                </p>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Excellence</h3>
                <p className="text-gray-700">
                  We strive for excellence in every aspect of our service, from the moment you book 
                  until long after your adventure ends, ensuring unforgettable experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
            <p className="text-lg text-gray-700 mb-8">
              Have questions about our tours or need help planning your New Zealand adventure? 
              We're here to help make your journey unforgettable.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex items-center justify-center space-x-3">
                <Mail className="h-6 w-6 text-primary" />
                <span className="text-gray-900">info@milfordsound.com</span>
              </div>
              
              <div className="flex items-center justify-center space-x-3">
                <Phone className="h-6 w-6 text-primary" />
                <span className="text-gray-900">+64 3 123 4567</span>
              </div>
            </div>
            
            <a
              href="mailto:milfordsound@gmail.com"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-700 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}