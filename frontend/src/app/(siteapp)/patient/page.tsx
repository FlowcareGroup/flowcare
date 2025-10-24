// app/dashboard/patient/page.tsx
import { auth } from '../../../../auth'
import { getPatientProfile } from '@/services/api/patientService'
import PatientAppointments from './components/PatientAppointments'
import PatientMiniCards from './components/PatientMiniCards'

export default async function PatientPage() {
  // 1️⃣ Autenticación
  const session = await auth()

  if (!session || !session.user?.id || session.user?.role !== 'patient') {
    return <div>Acceso no autorizado o ID de paciente no encontrado.</div>
  }

  // 2️⃣ Variables del usuario autenticado
  const patientId = Number(session.user.id)
  const patientName = session.user.name
  const accessToken: string = (session as any).accessToken

  console.log(`Patient ID: ${patientId}, Role: ${session.user.role}`)

  // 3️⃣ Llamada al backend (perfil completo del paciente)
  let patientData
  try {
    patientData = await getPatientProfile(patientId, accessToken)
  } catch (err) {
    console.error('Error al obtener perfil del paciente:', err)
    return <div>Error al cargar datos del paciente.</div>
  }

  // 4️⃣ Render del Dashboard (estructura espejo del DoctorPage)
  return (
    <>
      <div className='p-8'>
        <h1 className='text-2xl font-bold mb-4'>
          Bienvenido/a {patientName} a tu panel de salud
        </h1>
        <p className='text-lg mb-8'>
          Gestiona tus citas médicas, revisa tu historial y accede a tus
          consultas en línea.
        </p>

        <PatientAppointments appointments={patientData.appointments} />
        <PatientMiniCards patientId={patientId} />
      </div>
    </>
  )
}

// // app/dashboard/patient/page.tsx
// import { auth } from '../../../../auth'
// import { getPatientProfile } from '@/services/api/patientService'
// import PatientAppointments from './components/PatientAppointments'
// import PatientMiniCards from './components/PatientMiniCards'

// export default async function PatientPage() {
//   const session = await auth()

//   // 1️⃣ Validar sesión y rol
//   if (!session || !session.user?.id || session.user?.role !== 'patient') {
//     return <div>Acceso no autorizado o sesión inválida.</div>
//   }

//   const patientId = Number(session.user.id)
//   const accessToken: string = (session as any).accessToken

//   // 2️⃣ Obtener datos del paciente desde tu API
//   let patientData
//   try {
//     patientData = await getPatientProfile(patientId, accessToken)
//   } catch (error: any) {
//     console.error('Error al obtener el perfil del paciente:', error)
//     return <div>Error al cargar los datos del paciente.</div>
//   }

//   const patientName = patientData.personalData?.name_given || session.user.name

//   // 3️⃣ Render del dashboard
//   return (
//     <div className='p-8 space-y-8'>
//       {/* Encabezado */}
//       <div>
//         <h1 className='text-2xl font-bold'>
//           Hola {patientName}, te damos la bienvenida a tu espacio de salud
//         </h1>
//         <p className='text-gray-600 mt-2'>
//           Gestiona tus próximas citas, accede a tus consultas virtuales y revisa
//           tu historial médico.
//         </p>
//       </div>

//       {/* Citas pendientes */}
//       <PatientAppointments appointments={patientData.appointments} />

//       {/* 3 Secciones inferiores */}
//       <PatientMiniCards patientId={patientId} />
//     </div>
//   )
// }
