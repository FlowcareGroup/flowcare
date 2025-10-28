"use client";

import { useEffect, useState } from "react";
import { getPatientProfile } from "@/services/api/patientService";
import AppointmentList from "./AppointmentsList";
import AppointmentForm from "./AppointmentForm";

export default function PatientAppointments() {
  // NOTA: Estos valores están hardcodeados temporalmente.
  // TODO: Obtener estos valores de la sesión de NextAuth en el futuro:
  // import { useSession } from 'next-auth/react'
  // const { data: session, status } = useSession()
  // const patientId = session?.user?.id ? Number(session.user.id) : null
  // const accessToken = (session as any)?.accessToken || null
  const patientId = 1; // mock o session.user.id
  const accessToken = "fake-token"; // mock o session.accessToken

  const [appointments, setAppointments] = useState<any[]>([]);

  const loadAppointments = async () => {
    try {
      const profile = await getPatientProfile(patientId, accessToken);
      setAppointments(profile.appointments);
    } catch {
      console.log("Error cargando citas");
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  return (
    <div className='space-y-8'>
      <AppointmentList
        appointments={appointments}
        accessToken={accessToken}
        onRefresh={loadAppointments}
      />

      <AppointmentForm
        patientId={patientId}
        accessToken={accessToken}
        onAppointmentCreated={loadAppointments}
      />
    </div>
  );
}

/* CÓDIGO FUTURO - Versión con NextAuth integrada:
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getPatientProfile } from '@/services/api/patientService'
import AppointmentList from './AppointmentsList'
import AppointmentForm from './AppointmentForm'

export default function PatientAppointments() {
  const { data: session, status } = useSession()
  const [appointments, setAppointments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Extract patient ID and token from session
  const patientId = session?.user?.id ? Number(session.user.id) : null
  const accessToken = (session as any)?.accessToken || null

  const loadAppointments = async () => {
    if (!patientId || !accessToken) {
      setError('No autenticado')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const profile = await getPatientProfile(patientId, accessToken)
      setAppointments(profile.appointments || [])
    } catch (err: any) {
      console.error('Error cargando citas:', err)
      setError(err.message || 'Error al cargar las citas')
      setAppointments([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && patientId && accessToken) {
      loadAppointments()
    } else if (status === 'unauthenticated') {
      setError('Debes estar autenticado')
      setIsLoading(false)
    }
  }, [status, patientId, accessToken])

  if (status === 'loading') {
    return <div className='text-center py-8 text-gray-500'>Cargando sesión...</div>
  }

  if (!patientId || !accessToken) {
    return <div className='text-center py-8 text-red-500'>No autenticado. Por favor inicia sesión.</div>
  }

  return (
    <div className='space-y-8'>
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded'>
          {error}
        </div>
      )}

      {isLoading ? (
        <div className='text-center py-8 text-gray-500'>Cargando citas...</div>
      ) : (
        <>
          <AppointmentList
            appointments={appointments}
            accessToken={accessToken}
            onRefresh={loadAppointments}
          />

          <AppointmentForm
            patientId={patientId}
            accessToken={accessToken}
            onAppointmentCreated={loadAppointments}
          />
        </>
      )}
    </div>
  )
}
*/

// 'use client'

// import { useEffect, useState } from 'react'
// import {
//   getAvailableSlots,
//   createAppointment
// } from '@/services/api/doctorService'
// import { useSession } from 'next-auth/react'

// export default function PatientAppointments() {
//   const { data: session } = useSession()
//   const accessToken = (session as any)?.accessToken as string | undefined
//   const patientId = Number((session as any)?.user?.id)

//   const [doctorId, setDoctorId] = useState(1)
//   const [date, setDate] = useState(new Date().toISOString().split('T')[0])
//   const [slots, setSlots] = useState<{ time: string; available: boolean }[]>([])
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState<string | null>(null)

//   useEffect(() => {
//     const loadSlots = async () => {
//       if (!accessToken) return
//       setLoading(true)
//       setMessage(null)
//       try {
//         const res = await getAvailableSlots(String(doctorId), date, accessToken)
//         setSlots(
//           res.slots.map((s) => ({ time: s.time, available: s.available }))
//         )
//       } catch (e: any) {
//         setMessage(e?.message || 'Error loading slots')
//       } finally {
//         setLoading(false)
//       }
//     }
//     loadSlots()
//   }, [doctorId, date, accessToken])

//   const handleBook = async (time: string) => {
//     if (!accessToken || !patientId) return setMessage('Missing credentials')

//     const startIso = new Date(`${date}T${time}:00Z`).toISOString()
//     const endIso = new Date(
//       new Date(`${date}T${time}:00Z`).getTime() + 15 * 60 * 1000
//     ).toISOString()

//     setLoading(true)
//     setMessage(null)
//     try {
//       const created = await createAppointment(
//         doctorId,
//         {
//           patient_id: patientId,
//           start_time: startIso,
//           end_time: endIso,
//           service_type: 'general',
//           description: 'Online booking'
//         },
//         accessToken
//       )
//       setMessage(`Cita creada #${created.id} a las ${time}`)
//       const res = await getAvailableSlots(String(doctorId), date, accessToken)
//       setSlots(res.slots.map((s) => ({ time: s.time, available: s.available })))
//     } catch (e: any) {
//       setMessage(e?.message || 'Error creating appointment')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className='space-y-4'>
//       <div className='flex items-center gap-3'>
//         <label className='text-sm'>Doctor ID</label>
//         <input
//           type='number'
//           className='border px-2 py-1 rounded w-24'
//           value={doctorId}
//           onChange={(e) => setDoctorId(Number(e.target.value))}
//         />
//         <label className='text-sm ml-4'>Fecha</label>
//         <input
//           type='date'
//           className='border px-2 py-1 rounded'
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//         />
//       </div>

//       {message && <div className='text-sm'>{message}</div>}
//       {loading && <div className='text-sm'>Cargando…</div>}

//       <div className='grid grid-cols-4 gap-2'>
//         {slots.map(({ time, available }) => (
//           <button
//             key={time}
//             className={`px-3 py-2 rounded text-sm ${
//               available
//                 ? 'bg-emerald-100 hover:bg-emerald-200'
//                 : 'bg-red-200 cursor-not-allowed'
//             }`}
//             disabled={!available || loading}
//             onClick={() => handleBook(time)}
//           >
//             {time}
//           </button>
//         ))}
//       </div>
//     </div>
//   )
// }

// 'use client'

// interface Appointment {
//   id: number
//   date: string
//   time: string
//   endTime: string
//   status: string
//   doctor: string
//   service_type: string
//   description: string
// }

// export default function PatientAppointments({
//   appointments
// }: {
//   appointments: Appointment[]
// }) {
//   const upcoming = appointments.filter(
//     (a) => a.status === 'pending' || a.status === 'scheduled'
//   )

//   return (
//     <div className='bg-white shadow rounded-xl p-6'>
//       <h2 className='text-lg font-semibold mb-4'>Tus próximas citas</h2>

//       {upcoming.length === 0 ? (
//         <p className='text-gray-500'>No tienes citas pendientes.</p>
//       ) : (
//         <ul className='divide-y divide-gray-100'>
//           {upcoming.map((apt) => (
//             <li key={apt.id} className='py-3 flex justify-between items-center'>
//               <div>
//                 <p className='font-medium text-gray-900'>{apt.doctor}</p>
//                 <p className='text-sm text-gray-600'>{apt.service_type}</p>
//                 <p className='text-sm text-gray-500'>
//                   {apt.date} — {apt.time}
//                 </p>
//               </div>
//               <button className='px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition'>
//                 Ver detalles
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   )
// }
