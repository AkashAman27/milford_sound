import { HeroSection } from '@/components/home/HeroSection'
import { StatsSection } from '@/components/home/StatsSection'
import { FeaturedCategories } from '@/components/home/FeaturedCategories'
import { FeaturedExperiences } from '@/components/home/FeaturedExperiences'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { FAQSection } from '@/components/home/FAQSection'
import { HomepageInternalLinksSection } from '@/components/home/HomepageInternalLinksSection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedCategories />
      <FeaturedExperiences />
      <TestimonialsSection />
      <FAQSection />
      <HomepageInternalLinksSection />
    </>
  )
}