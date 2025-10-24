import Link from 'next/link'
import Image from 'next/image'

export default function NavBar() {
  return (
    <nav className='fixed top-0 left-0 w-full max-h-16 flex items-center justify-between p-4 bg-gray-50  z-50'>
      <div className='text-2xl font-bold text-blue-700'>
        <Link href='/' className='flex items-center'>
          <Image
            src='/logo_transparent.png'
            alt='Gym rack'
            width={100}
            height={10}
            className='m-6 mx-auto rounded-3xl mask-x-from-92% mask-x-to-99% mask-y-from-92% mask-y-to-99%'
            loading='lazy'
          />
        </Link>
      </div>

      <div className='flex items-center space-x-8'>
        <ul className='flex space-x-6 font-medium text-(--color-text-secondary)'>
          {[
            { href: '/centros', label: 'Características' },
            { href: '#partnersSection', label: 'Precios' },
            { href: '#newsSection', label: 'FAQ' },
            { href: '/auth/login', label: 'Login' }
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className='hover:text-blue-800 transition-colors duration-300'
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href='/auth/signUp'>
          <button className='btn-primary h-8 p-1! px-16!'>
            Prueba FlowCare
          </button>
        </Link>
      </div>
    </nav>
  )
}

// {role === "admin" && <Link href="/admin">Panel Admin</Link>}
// {role === "doctor" && <Link href="/medico">Mis Citas</Link>}
// {role === "paciente" && <Link href="/paciente">Mis Reservas</Link>}
