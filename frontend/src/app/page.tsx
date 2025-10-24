import Hero from '@/components/Hero'
import PartnersSection from '@/components/PartnersSection'
import NewsSection from '@/components/NewsSection'
import NavBar from '@/components/Navbar'

export default function HomePage() {
  return (
    <>
      <NavBar />
      <Hero />
      <PartnersSection />
      <NewsSection />
    </>
  )
}
