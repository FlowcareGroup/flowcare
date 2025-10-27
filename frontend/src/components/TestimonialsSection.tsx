import { Star } from 'lucide-react'
import Image from 'next/image'

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'María González',
      role: 'Paciente',
      comment: `"FlowCare ha cambiado completamente mi forma de acceder a la atención médica. Consultas rápidas, médicos profesionales y todo en casa."`,
      rating: 5,
      avatar: '/user_icon.png'
    },
    {
      name: 'Dr. Carlos Méndez',
      role: 'Cardiólogo',
      comment: `"Como médico, la plataforma me permite gestionar mis pacientes de manera eficiente. El sistema es intuitivo y muy completo."`,
      rating: 5,
      avatar: '/user_icon.png'
    },
    {
      name: 'Ana Rodríguez',
      role: 'Paciente',
      comment: `"Excelente servicio. Pude consultar con un especialista el mismo día y recibir mi tratamiento rápidamente. Totalmente recomendado."`,
      rating: 5,
      avatar: '/user_icon.png'
    }
  ]

  return (
    <section
      id='testimonialsSection'
      className='py-20 md:py-30 bg-linear-to-r max-w-5xl mx-auto'
    >
      <div className='container mx-auto text-center '>
        <div className='flex flex-col mb-12'>
          <h3 className='text-5xl! font-bold mb-8 mx-5'>
            Lo que dicen sobre FlowCare
          </h3>
          <p className='text-2xl font-normal mx-5'>
            Cientos de clínicas ya confían en la plataforma de gestión de salud
            online
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {testimonials.map((t, index) => (
            <article
              key={index}
              className='rounded-3xl shadow-xl/10 p-8 flex flex-col justify-between mx-5'
            >
              <div className='flex justify-start mb-4'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${
                      i < t.rating
                        ? 'fill-(--color-primary) text-(--color-primary)'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              <p className='text-(--color-text-secondary) text-start text-pretty mb-6'>
                {t.comment}
              </p>

              <div className='flex items-center justify-start gap-4 mt-auto'>
                <div className='w-12 h-12 aspect-square rounded-full overflow-hidden bg-(--color-primary)/10 flex items-center justify-center'>
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    className='size-full object-contain p-2 aspect-square'
                    width={48}
                    height={48}
                  />
                </div>
                <div className='text-left'>
                  <p className='font-semibold'>{t.name}</p>
                  <p className='text-sm text-(--color-text-secondary)'>
                    {t.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
