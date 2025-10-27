import Image from 'next/image'

export default function CardsSection() {
  const cards = [
    {
      title: 'Videoconsultas HD',
      description:
        'Vídeo y audio de alta calidad para consultas efectivas desde cualquier lugar.',
      icon: '/homepage_cards_icon_1.png',
      image: '/homepage_cards_image_1.jpg',
      hasGradient: false
    },
    {
      title: 'Reserva instantánea',
      description:
        'Encuentra y agenda citas con especialistas en minutos, a cualquier hora y cualquier día.',
      icon: '/homepage_cards_icon_2.png',
      image: '/homepage_cards_image_2.jpg',
      hasGradient: false
    },
    {
      title: '100% segura',
      description:
        'Protección total de datos con cifrado de nivel hospitalario.',
      icon: '/homepage_cards_icon_3.png',
      image: '/homepage_cards_image_3.png',
      hasGradient: true
    }
  ]

  return (
    <section
      id='cardsSection'
      className='py-16 bg-linear-to-r max-w-5xl mx-auto'
    >
      <div className='container mx-auto text-center sm:pt-30 pt-20'>
        <div className='flex flex-col mb-12'>
          <h3 className='text-5xl! font-bold mb-8 mx-5'>
            Por qué elegir FlowCare
          </h3>
          <p className='text-2xl font-normal mx-5'>
            Todo lo que necesitas para gestionar la salud en una sola plataforma
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 justify-items-center mx-5'>
          {cards.map((card, index) => (
            <article
              key={index}
              className=' rounded-xl shadow-sm border border-(--color-border-blue)/15 overflow-hidden mx-5 max-w-[300px] min-w-[230px]'
            >
              {card.hasGradient ? (
                <div className='h-48 w-full flex items-center justify-center bg-linear-to-br from-(--color-bg-primary-gradient-light)  via-(--color-bg-secondary-gradient-light)  to-(--color-bg-primary-gradient-light) '>
                  <Image
                    src={card.icon}
                    alt={`${card.title} background icon`}
                    width={100}
                    height={100}
                    className='opacity-60'
                  />
                </div>
              ) : (
                <div className='h-48 w-full relative'>
                  <Image
                    src={card.image!}
                    alt={card.title}
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 33vw'
                    priority={index === 0}
                  />
                </div>
              )}

              <div className='p-6 flex flex-col items-start text-left'>
                <div className='flex items-center justify-center bg-(--color-bg-card-icon)/50 rounded-[14px] p-3 mb-2'>
                  <Image
                    src={card.icon}
                    alt={`${card.title} icon`}
                    width={28}
                    height={28}
                  />
                </div>
                <h4 className='text-lg font-semibold mb-2'>{card.title}</h4>
                <p className='text-(--color-text-secondary) text-sm text-balance'>
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
