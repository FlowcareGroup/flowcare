import Link from 'next/link'
import Image from 'next/image'

export default function NavBar() {
  return (
    <nav className='fixed top-0 left-0 w-full max-h-16 flex items-center justify-between p-4 bg-gray-50 shadow-md z-50'>
      <div className='text-2xl font-bold text-blue-700'>
        <Link href='/'>
          <Image
            src='/logo2.png'
            alt='Gym rack'
            width={100}
            height={10}
            className='m-6 mx-auto rounded-3xl mask-x-from-92% mask-x-to-99% mask-y-from-92% mask-y-to-99%'
            loading='lazy'
          />
        </Link>
      </div>

      <ul className='flex space-x-6 text-blue-400 font-medium'>
        {[
          { href: '#hero', label: 'Inicio' },
          { href: '/centros', label: 'Centros' },
          { href: '#partnersSection', label: 'Partners' },
          { href: '#newsSection', label: 'Noticias' },
          { href: '/login', label: 'Login' },
          { href: '/register', label: 'Register' }
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
    </nav>
  )
}

// {role === "admin" && <Link href="/admin">Panel Admin</Link>}
// {role === "doctor" && <Link href="/medico">Mis Citas</Link>}
// {role === "paciente" && <Link href="/paciente">Mis Reservas</Link>}
