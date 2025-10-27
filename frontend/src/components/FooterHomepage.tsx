import Link from 'next/link'
import Image from 'next/image'

export default function FooterHomepage() {
  return (
    <footer className='bg-(--color-darker) '>
      <div className='max-w-7xl mx-auto p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'>
        <div className='mt-2'>
          <Link href='/' className='block mb-3'>
            <Image
              src='/logo_texto_horizontal_blanco.png'
              alt='FlowCare logo'
              width={140}
              height={72}
              className='max-h-18 object-contain '
              loading='lazy'
            />
          </Link>
          <p className='text-sm leading-relaxed text-(--color-text-light)/70'>
            Haciendo la atención médica accesible, en cualquier lugar.
          </p>
        </div>

        <div>
          <h3 className='text-sm font-medium! mb-3 text-(--color-text-light)!'>
            Pacientes
          </h3>
          <ul className='space-y-2 text-sm'>
            <li>
              <Link
                href='#'
                className='text-(--color-text-light)/70! hover:text-(--color-primary)! transition'
              >
                Encontrar profesional
              </Link>
            </li>
            <li>
              <Link
                href='#'
                className='text-(--color-text-light)/70! hover:text-(--color-primary)! transition'
              >
                Especialidades
              </Link>
            </li>
            <li>
              <Link
                href='#'
                className='text-(--color-text-light)/70! hover:text-(--color-primary)! transition'
              >
                Registro de historial
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className='text-sm font-medium! mb-3 text-(--color-text-light)!'>
            Profesionales
          </h3>
          <ul className='space-y-2 text-sm'>
            <li>
              <Link
                href='#'
                className='text-(--color-text-light)/70! hover:text-(--color-primary)! transition'
              >
                Portal médico
              </Link>
            </li>
            <li>
              <Link
                href='#'
                className='text-(--color-text-light)/70! hover:text-(--color-primary)! transition'
              >
                Red de clínicas
              </Link>
            </li>
            <li>
              <Link
                href='#'
                className='text-(--color-text-light)/70! hover:text-(--color-primary)! transition'
              >
                Soporte
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className='text-sm font-medium! mb-3 text-(--color-text-light)!'>
            FlowCare
          </h3>
          <ul className='space-y-2 text-sm '>
            <li>
              <Link
                href='#'
                className='text-(--color-text-light)/70! hover:text-(--color-primary)! transition'
              >
                Precios
              </Link>
            </li>
            <li>
              <Link
                href='#'
                className='text-(--color-text-light)/70! hover:text-(--color-primary)! transition'
              >
                Contáctanos
              </Link>
            </li>
            <li>
              <Link
                href='#'
                className='text-(--color-text-light)/70! hover:text-(--color-primary)! transition'
              >
                Privacidad
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className='border-t border-(--color-text-light)/10 max-w-7xl mx-10' />

      <div className='text-sm text-center text-(--color-text-light)/70 py-10 mx-4'>
        © 2025 FlowCare. Todos los derechos reservados.
      </div>
    </footer>
  )
}
