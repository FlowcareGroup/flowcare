import Image from 'next/image'
import Hero from '@/components/Hero'
import PartnersSection from '@/components/PartnersSection'
import NewsSection from '@/components/NewsSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <PartnersSection />
      <NewsSection />
    </>
  )
}
