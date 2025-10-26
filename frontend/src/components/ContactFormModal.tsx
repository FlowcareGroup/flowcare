'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'

type FormData = {
  name: string
  email: string
  message: string
}

export default function ContactFormModal({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>()
  const [showConfirmation, setShowConfirmation] = useState(false)

  if (!isOpen) return null

  const onSubmit = (data: FormData) => {
    setShowConfirmation(true)
    reset()
  }

  return (
    <>
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
        <div className='bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative mx-5'>
          <button
            onClick={() => {
              reset()
              onClose()
            }}
            className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'
          >
            <X size={22} />
          </button>

          <h2 className='text-2xl font-semibold mb-6 text-center text-(--color-text-primary)'>
            Solicita contacto
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className='space-y-4'
          >
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Nombre
              </label>
              <input
                type='text'
                placeholder='Tu nombre'
                {...register('name', { required: 'El nombre es obligatorio' })}
                className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 placeholder-italic placeholder-(--color-text-secondary) ${
                  errors.name
                    ? 'border-(--color-error) focus:ring-(--color-error)'
                    : 'border-(--color-darker) focus:ring-(--color-primary)'
                }`}
              />
              {errors.name && (
                <p className='text-(--color-error) text-sm mt-1'>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email
              </label>
              <input
                type='email'
                placeholder='ejemplo@correo.com'
                {...register('email', {
                  required: 'El email es obligatorio',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Formato de email inválido'
                  }
                })}
                className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 placeholder-italic placeholder-(--color-text-secondary) ${
                  errors.email
                    ? 'border-(--color-error) focus:ring-(--color-error)'
                    : 'border-(--color-darker) focus:ring-(--color-primary)'
                }`}
              />
              {errors.email && (
                <p className='text-(--color-error) text-sm mt-1'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Mensaje
              </label>
              <textarea
                rows={4}
                placeholder='Escribe tu mensaje aquí'
                {...register('message', {
                  required: 'El mensaje no puede estar vacío'
                })}
                className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 placeholder-italic placeholder-(--color-text-secondary) ${
                  errors.message
                    ? 'border-(--color-error) focus:ring-(--color-error)'
                    : 'border-(--color-darker) focus:ring-(--color-primary)'
                }`}
              />
              {errors.message && (
                <p className='text-(--color-error) text-sm mt-1'>
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type='submit'
              className='btn-primary h-8 p-1! px-16! text-nowrap transition'
            >
              Enviar solicitud
            </button>
          </form>
        </div>
      </div>

      {showConfirmation && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
          <div className='bg-(--color-bg-primary) rounded-xl shadow-lg p-6 max-w-sm text-center mx-3'>
            <h3 className='text-lg font-semibold mb-2'>¡Mensaje enviado!</h3>
            <p className='mb-4 text-(--color-text-secondary)'>
              Gracias por contactarnos, te responderemos lo más pronto posible
            </p>
            <button
              onClick={() => {
                setShowConfirmation(false)
                onClose()
              }}
              className='btn-primary h-8 p-1! px-16!'
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// 'use client'

// import { useState } from 'react'
// import { X } from 'lucide-react'

// export default function ContactFormModal({
//   isOpen,
//   onClose
// }: {
//   isOpen: boolean
//   onClose: () => void
// }) {
//   if (!isOpen) return null

//   return (
//     <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
//       <div className='bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative mx-5'>
//         {/* Botón cerrar */}
//         <button
//           onClick={onClose}
//           className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'
//         >
//           <X size={22} />
//         </button>

//         {/* Título */}
//         <h2 className='text-2xl font-semibold mb-6 text-center text-(--color-text-primary)'>
//           Solicita contacto
//         </h2>

//         {/* Formulario */}
//         <form
//           onSubmit={(e) => {
//             e.preventDefault()
//             alert('Formulario enviado ✅')
//             onClose()
//           }}
//           className='space-y-4'
//         >
//           <div>
//             <label className='block text-sm font-medium text-gray-700 mb-1'>
//               Nombre
//             </label>
//             <input
//               type='text'
//               required
//               className='w-full border border-(--color-darker) rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-(--color-primary)'
//             />
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700 mb-1'>
//               Email
//             </label>
//             <input
//               type='email'
//               required
//               className='w-full border border-(--color-darker) rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-(--color-primary)'
//             />
//           </div>

//           <div>
//             <label className='block text-sm font-medium text-gray-700 mb-1'>
//               Mensaje
//             </label>
//             <textarea
//               rows={4}
//               required
//               className='w-full border border-(--color-darker) rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-(--color-primary)'
//             ></textarea>
//           </div>

//           <button
//             type='submit'
//             className='btn-primary h-8 p-1! px-16! text-nowrap transition'
//           >
//             Enviar solicitud
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }
