import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section
      id='hero'
      className='relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-24'
    >
      <div className='w-full mx-auto text-center'>
        <h2 className='text-4xl font-bold mb-4 text-balance md:text-balance'>
          La salud conectada al alcance de todos
        </h2>
        <div className='relative w-full mask-x-from-80% mask-x-to-90% mask-y-from-90% mask-y-to-95% bg-[url(/hero_bg.avif)] bg-contain bg-no-repeat bg-center py-12'>
          <Image
            src='/hero_img_without_logo.png'
            alt='Corporative photo with slogan, doctors taking care of a patient in a hospital'
            width={400}
            height={200}
            className='m-6 mx-auto rounded-3xl mask-x-from-90% mask-x-to-99% mask-y-from-90% mask-y-to-99%'
            loading='lazy'
          />
          <Image
            src='/flowcare_complete_logo.png'
            alt='FlowCare Logo'
            width={250}
            height={200}
            className='absolute bottom-4 left-28 z-50'
            loading='lazy'
          />
        </div>
        <p className='text-lg md:text-xl mb-8 max-w-2xl mx-auto p-4'>
          FlowCare conecta pacientes, médicos y centros en una única plataforma
          segura y eficiente.
        </p>
        <Link
          href='/register'
          className='bg-white text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-200 transition'
        >
          Accede ahora
        </Link>
      </div>
    </section>
  )
}
