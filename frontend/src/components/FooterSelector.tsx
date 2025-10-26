'use client'

import { usePathname } from 'next/navigation'
import { FooterGenerico } from '@/components/FooterGenerico'
import FooterHomepage from '@/components/FooterHomepage'

export default function FooterSelector() {
  const pathname = usePathname()

  if (pathname === '/') {
    return <FooterHomepage />
  }

  return <FooterGenerico />
}
