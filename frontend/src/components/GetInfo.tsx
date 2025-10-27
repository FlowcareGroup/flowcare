'use client'

import { useState } from 'react'
import ContactFormModal from './ContactFormModal'

export default function GetInfo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section
      id='getInfo'
      className='flex justify-center items-center bg-(--color-primary) relative w-full overflow-hidden h-[582px] m-auto py-24'
    >
      <div className='flex flex-col gap-10 text-center'>
        <h2 className='sm:text-7xl! text-5xl! font-bold text-light mx-auto mb-0!'>
          Comienza hoy mismo
        </h2>
        <p className='sm:text-2xl! text-pretty sm:w-3xl w-5/6 font-normal md:text-xl  max-w-2xl mx-auto text-light'>
          Únete a la revolución de la atención médica online
        </p>

        <button
          onClick={() => setIsOpen(true)}
          className='btn-secondary h-8 p-1! px-16! mx-auto border-[1.6px] border-(--color-dark)!'
        >
          Quiero más información
        </button>
        <ContactFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </section>
  )
}
