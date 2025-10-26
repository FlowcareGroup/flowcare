import Hero from '@/components/Hero'
import InfoSection from '@/components/InfoSection'
import CardsSection from '@/components/CardsSection'
import NavBar from '@/components/Navbar'
import TestimonialsSection from '@/components/TestimonialsSection'
import GetInfo from '@/components/GetInfo'

export default function HomePage() {
  return (
    <>
      <NavBar />
      <Hero />
      <CardsSection />
      <InfoSection />
      <TestimonialsSection />
      <GetInfo />
    </>
  )
}
