export default function NewsSection() {
  return (
    <section
      id='newsSection'
      className='py-16 bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
    >
      <div className='container mx-auto text-center'>
        <h3 className='text-2xl font-semibold mb-8'>Noticias y novedades</h3>
        <p className='max-w-2xl mx-auto border-2 border-white p-4 rounded-lg bg-blue-700/30 shadow-xl/30'>
          Próximamente encontrarás aquí las últimas noticias sobre salud y
          actualizaciones de FlowCare.
        </p>
      </div>
    </section>
  )
}
