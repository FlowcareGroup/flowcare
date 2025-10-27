'use client'

import Link from 'next/link'
import { X } from 'lucide-react'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const links = [
    { href: '/centros', label: 'Características' },
    { href: '#partnersSection', label: 'Precios' },
    { href: '#newsSection', label: 'FAQ' },
    { href: '/auth/login', label: 'Login' }
  ]

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      ></div>

      <aside
        className={`fixed top-0 left-0 h-full w-3/4 max-w-sm bg-white/90 backdrop-blur-md shadow-[inset_-2px_0_10px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex justify-between items-center p-4 border-b border-gray-200'>
          <h2 className='text-lg font-semibold text-gray-700'>Menú</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 transition'
            aria-label='Cerrar menú'
          >
            <X size={24} />
          </button>
        </div>

        <ul className='flex flex-col items-start p-6 space-y-5 font-medium text-gray-700'>
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className='hover:text-blue-800 transition-colors duration-300'
              >
                {link.label}
              </Link>
            </li>
          ))}

          <li className='pt-4 w-full'>
            <Link href='/auth/signUp' onClick={onClose}>
              <button className='btn-primary h-8 p-1! px-16! transition'>
                Prueba FlowCare
              </button>
            </Link>
          </li>
        </ul>
      </aside>
    </>
  )
}
