import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedCategories } from '@/components/home/FeaturedCategories'
import { PopularDestinations } from '@/components/home/PopularDestinations'
import { FeaturedExperiences } from '@/components/home/FeaturedExperiences'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <TestimonialsSection />
      <FeaturedCategories />
      <PopularDestinations />
      <FeaturedExperiences />
    </>
  )
}