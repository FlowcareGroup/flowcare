'use client'
import Link from 'next/link'
import { Video, Calendar, FileText } from 'lucide-react'

export default function PatientMiniCards({ patientId }: { patientId: number }) {
  const cards = [
    {
      title: 'Teleconsulta',
      desc: 'Accede a tu próxima cita virtual con tu médico.',
      icon: <Video className='w-6 h-6 text-blue-600' />,
      href: `/dashboard/patient/teleconsultation/${patientId}`
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
    }
  ]

  return (
    <div className='grid sm:grid-cols-3 gap-6 mt-8'>
      {cards.map((card) => (
        <Link
          href={card.href}
          key={card.title}
          className='bg-white shadow rounded-xl p-6 hover:shadow-lg transition flex flex-col justify-between'
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
