'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import MobileMenu from './MobileMenu'

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const links = [
    { href: '#', label: 'Características' },
    { href: '#', label: 'Precios' },
    { href: '#', label: 'FAQ' },
    { href: '/auth/login', label: 'Login' }
  ]

  return (
    <nav className='fixed top-0 left-0 w-full bg-(--color-bg-primary) z-50 '>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between gap-2 items-center h-16'>
          <Link href='/' className='flex items-center'>
            <Image
              src='/logo_texto_horizontal.png'
              alt='FlowCare logo'
              width={180}
              height={112}
              className='sm:w-36 w-28 object-contain'
              priority
            />
          </Link>

          <div className='hidden md:flex items-center space-x-8'>
            <ul className='flex space-x-6 font-medium text-(--color-text-secondary)'>
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='hover:text-(--color-primary) transition-colors duration-300'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href='/auth/signUp'>
              <button className='btn-primary h-8 p-1! px-16! text-nowrap transition'>
                Prueba FlowCare
              </button>
            </Link>
          </div>

          <button
            onClick={toggleMenu}
            className='md:hidden p-2 text-(--color-primary) hover:text-(--color-primary-hover) drop-shadow-xl drop-shadow-cyan-500/50 transition'
            aria-label='Abrir menú'
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <MobileMenu isOpen={isOpen} onClose={closeMenu} />
    </nav>
  )
}
