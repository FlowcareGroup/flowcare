import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section
      id='hero'
      className='relative w-full overflow-hidden rounded-[20px] h-[653px] mt-17 py-24'
    >
      <div className='absolute inset-0'>
        <Image
          src='/homepage_hero_image.jpg'
          alt='Corporative photo with slogan, doctor shaping a heart with her stethoscope'
          fill
          priority
          className='object-cover rounded-[20px]'
        />
        <div className='absolute inset-0 bg-white/70 rounded-[20px]' />
      </div>

<<<<<<< HEAD
      <div className='relative z-10 text-center px-6 pt-50'>
        <h2 className='text-6xl! font-bold mb-4 text-balance text-(--color-text-primary)! max-w-xl mx-auto leading-tight'>
          Tu espacio de salud online
        </h2>
        <p className='text-lg md:text-xl  max-w-2xl mx-auto  text-gray-800'>
          Haz que tus pacientes conecten con su salud sin salir de casa.
        </p>
        <p className='text-lg font-bold md:text-xl mb-8 max-w-2xl mx-auto text-gray-800'>
=======
      <div className='relative z-10 text-center px-6 sm:pt-40 pt-30'>
        <h2 className='sm:text-7xl! text-5xl! font-bold mb-4 text-balance text-(--color-text-primary)! max-w-xl mx-auto leading-tight'>
          Tu espacio de salud online
        </h2>
        <p className='sm:text-2xl! text-pretty sm:w-3xl w-5/6 font-normal md:text-xl  max-w-2xl mx-auto  text-(--color-text-primary)!'>
          Haz que tus pacientes conecten con su salud sin salir de casa.
        </p>
        <p className='sm:text-2xl! text-pretty sm:w-3xl w-5/6 font-bold md:text-xl mb-8 max-w-2xl mx-auto text-(--color-text-primary)!'>
>>>>>>> 348cb5b994368f3caeb83b6031aeb5e0dcac5dbf
          <span className='italic'>FlowCare</span> hace accesible la atención
          médica de calidad.
        </p>
        <Link href='/auth/signUp'>
          <button className='btn-primary h-8 p-1! px-16!'>
            Explora FlowCare
          </button>
        </Link>
      </div>
    </section>
  )
}
