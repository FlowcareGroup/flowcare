'use client'
import Link from 'next/link'
import { Video, Calendar, FileText } from 'lucide-react'

export default function PatientMiniCards({ patientId }: { patientId: number }) {
  const cards = [
    {
      title: 'Teleconsulta',
      desc: 'Accede a tu próxima cita virtual con tu médico.',
      icon: <Video className='w-6 h-6 text-blue-600' />,
<<<<<<< HEAD
      href: `/dashboard/patient/teleconsultation/${patientId}`
=======
      href: `/dashboard/patient/teleconsult/${patientId}`
>>>>>>> 348cb5b994368f3caeb83b6031aeb5e0dcac5dbf
    },
    {
      title: 'Historial de citas',
      desc: 'Consulta tus citas pasadas y resultados.',
      icon: <Calendar className='w-6 h-6 text-emerald-600' />,
      href: `/dashboard/patient/history`
    },
    {
      title: 'Ficha médica',
      desc: 'Revisa tus datos personales y observaciones clínicas.',
      icon: <FileText className='w-6 h-6 text-indigo-600' />,
      href: `/dashboard/patient/profile/${patientId}`
<<<<<<< HEAD
=======

      // onClick: () => setShowModal(true), //! Si se quiere que alguna de las cards abra un MODAL entonces utilizar un onClick y crear un component en patient/components tipo:
      // {/* Modal */}
      // {showModal && (
      //   <div className='fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4'>
      //     <div className='bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative'>
      //       {/* Botón de cierre */}
      //       <button
      //         onClick={() => setShowModal(false)}
      //         className='absolute top-3 right-3 text-gray-400 hover:text-gray-600'
      //         aria-label='Cerrar'
      //       >
      //         <X className='w-5 h-5' />
      //       </button>

      //       <h2 className='text-xl font-bold mb-4'>Ficha médica</h2>
      //       <p className='text-gray-600 text-sm mb-2'>
      //         Aquí podrías mostrar la información médica del paciente:
      //       </p>

      //       <ul className='text-sm text-gray-700 space-y-1'>
      //         <li>🧍 Nombre: Juan Pérez</li>
      //         <li>🎂 Edad: 45 años</li>
      //         <li>💉 Tipo de sangre: O+</li>
      //         <li>⚕️ Alergias: Ninguna registrada</li>
      //         <li>📋 Observaciones: Control anual pendiente</li>
      //       </ul>

      //       <div className='mt-6 text-right'>
      //         <button
      //           onClick={() => setShowModal(false)}
      //           className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
      //         >
      //           Cerrar
      //         </button>
      //       </div>
      //     </div>
      //   </div>
      // )}
>>>>>>> 348cb5b994368f3caeb83b6031aeb5e0dcac5dbf
    }
  ]

  return (
    <div className='grid sm:grid-cols-3 gap-6 mt-8'>
      {cards.map((card) => (
        <Link
          href={card.href}
          key={card.title}
<<<<<<< HEAD
          className='bg-white shadow rounded-xl p-6 hover:shadow-lg transition flex flex-col justify-between'
=======
          className='bg-white shadow rounded-xl p-6 hover:shadow-lg transition flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
>>>>>>> 348cb5b994368f3caeb83b6031aeb5e0dcac5dbf
        >
          <div className='flex items-center gap-3 mb-3'>
            {card.icon}
            <h3 className='font-semibold text-gray-800'>{card.title}</h3>
          </div>
          <p className='text-sm text-gray-500 mb-4'>{card.desc}</p>
          <span className='text-blue-600 text-sm font-medium mt-auto'>
            Ver más →
          </span>
        </Link>
      ))}
    </div>
  )
}

// 'use client'
// import Link from 'next/link'
// import { Video, Calendar, FileText } from 'lucide-react'

// export default function PatientMiniCards({ patientId }: { patientId: number }) {
//   const cards = [
//     {
//       title: 'Teleconsulta',
//       description: 'Accede a tu videollamada con el doctor.',
//       icon: <Video className='w-6 h-6 text-blue-600' />,
//       href: `/dashboard/patient/teleconsultation/${patientId}`,
//       button: 'Entrar a consulta'
//     },
//     {
//       title: 'Historial de citas',
//       description: 'Consulta tus citas anteriores y resultados.',
//       icon: <Calendar className='w-6 h-6 text-emerald-600' />,
//       href: `/dashboard/patient/history`,
//       button: 'Ver historial'
//     },
//     {
//       title: 'Ficha médica',
//       description: 'Visualiza tus datos personales y observaciones médicas.',
//       icon: <FileText className='w-6 h-6 text-indigo-600' />,
//       href: `/dashboard/patient/profile/${patientId}`,
//       button: 'Ver ficha'
//     }
//   ]

//   return (
//     <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
//       {cards.map((card) => (
//         <div
//           key={card.title}
//           className='bg-white shadow rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition'
//         >
//           <div className='flex items-center gap-3 mb-3'>
//             {card.icon}
//             <h3 className='font-semibold text-gray-800'>{card.title}</h3>
//           </div>
//           <p className='text-sm text-gray-500 mb-4'>{card.description}</p>
//           <Link
//             href={card.href}
//             className='text-center bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition'
//           >
//             {card.button}
//           </Link>
//         </div>
//       ))}
//     </div>
//   )
// }
