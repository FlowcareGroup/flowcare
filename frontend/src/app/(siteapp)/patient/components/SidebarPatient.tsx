'use client'

import Link from 'next/link'

export default function SidebarPatient() {
  return (
    <aside className='w-64 bg-white border-r p-4 flex flex-col gap-4'>
      <h2 className='text-lg font-semibold'>Paciente</h2>
      <nav className='flex flex-col gap-2'>
        <Link href='/siteapp/patient' className='hover:text-emerald-600'>
          Dashboard
        </Link>
        <Link
          href='/siteapp/patient/appointments'
          className='hover:text-emerald-600'
        >
          Citas
        </Link>
        <Link
          href='/siteapp/patient/history'
          className='hover:text-emerald-600'
        >
          Historial
        </Link>
        <Link
          href='/siteapp/patient/teleconsult'
          className='hover:text-emerald-600'
        >
          Teleconsultas
        </Link>
        <Link
          href='/siteapp/patient/settings'
          className='hover:text-emerald-600'
        >
          Ajustes
        </Link>
      </nav>
    </aside>
  )
}
