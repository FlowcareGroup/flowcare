export default function PartnersSection() {
  const logos = [
    '/shutter_island.png',
    '/reanimator.png',
    '/the_shinning.png',
    '/the_mummy.png'
  ]

  return (
    <section id='partnersSection' className='py-16 bg-gray-50'>
      <div className='container mx-auto text-center px-6'>
        <h3 className='text-2xl font-semibold mb-8 text-gray-800'>
          Centros y partners asociados
        </h3>
        <div className='flex flex-wrap justify-center items-center gap-8'>
          {logos.map((logo, i) => (
            <img
              key={i}
              src={logo}
              alt={`logo-${i}`}
              className='h-16 grayscale touch-auto hover:grayscale-0 hover:scale-300 hover:z-30 transition duration-400 drop-shadow-xl/25'
            />
          ))}
        </div>
      </div>
    </section>
  )
}
