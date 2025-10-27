export default function InfoSection() {
  const bars = [
    {
      title: 'Registro mediante clínica',
      description:
        'Cada paciente o profesional con credenciales puede entrar a su perfil',
      number: 1
    },
    {
      title: 'Listado de profesionales y agenda',
      description:
        'Conectamos pacientes y profesionales de la saluc, facilitando la agenda de citas',
      number: 2
    },
    {
      title: 'Sistema de videollamadas online integrado',
      description: 'Pacientes y profesionales conectados con un solo clic',
      number: 3
    }
  ]

  return (
    <section id='infoSection' className='py-16 bg-(--color-bg-blue-light)'>
      <div className='container mx-auto text-center px-6'>
        <div className='flex flex-col mb-12'>
          <h3 className='text-5xl! font-bold mb-8 mx-5'>
            Una plataforma fácil e intuituiva
          </h3>
          <p className='text-2xl font-normal mx-5'>
            En menos de 15 minutos, conecta pacientes y profesionales
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 grid-raws-3  gap-8 mt-10 justify-items-center mx-5'>
        {bars.map((bar, index) => (
          <article
            key={index}
            className=' bg-(--color-bg-primary) rounded-3xl shadow-xl/20 overflow-hidden mx-5 w-full max-w-4xl md:max-w-3/4! pl-6 py-4'
          >
            <div className='flex justify-start items-center '>
              <div className='flex items-center justify-center aspect-square size-20 rounded-full mb-2 bg-linear-to-bl from-(--color-bg-secondary-gradient-dark)  via-(--color-bg-primary-gradient-dark)/85 to-(--color-bg-secondary-gradient-dark) shadow-primary'>
                <p className='text-(--color-text-light) font-semibold text-3xl!'>
                  {bar.number}
                </p>
              </div>

              <div className='p-6 flex flex-col items-start text-left'>
                <h4 className='text-lg text-pretty font-semibold mb-2'>
                  {bar.title}
                </h4>
                <p className='text-(--color-text-secondary) text-sm text-balance'>
                  {bar.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
