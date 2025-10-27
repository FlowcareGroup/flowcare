'use client'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const HeaderSiteApp = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
          {/* Logo de FlowCare */}
          <Link href="/">
            <Image src="/logo_horizontal.svg" alt="FlowCare Logo" width={150} height={50} className="m-4"/>
          </Link>
      {/* Botón de cerrar sesión */}
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={() => {signOut()}}>
              Cerrar Sesión
            </button>
        </div>
    </header>
  )
}
