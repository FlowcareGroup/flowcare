'use client'

import { useEffect, useState } from 'react'
import { getAllClinics } from '@/services/api/clinicsServices'
import {
  getAvailableSlots,
  createAppointment,
  getDoctorById
} from '@/services/api/doctorService'
import CalendarPicker from './CalendarPicker'
import { useSession } from 'next-auth/react'

interface Clinic {
  id: number
  name: string
  specialties: string[]
  doctors: { id: number; name: string; specialty: string }[]
}

interface Props {
  patientId: number
  accessToken: string
  onAppointmentCreated: () => void
}

export default function AppointmentForm({
  patientId,
  accessToken,
  onAppointmentCreated
}: Props) {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [specialties, setSpecialties] = useState<string[]>([])
  const [selectedClinic, setSelectedClinic] = useState<number | null>(null)
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    null
  )
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [availableSlots, setAvailableSlots] = useState<
    { time: string; available: boolean }[]
  >([])
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const { data: session } = useSession()

  const backendToken = accessToken || (session as any)?.accessToken || ''

  // 🔹 1. Cargar clínicas con sus doctores
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        // Verificar que el token existe antes de proceder
        if (!backendToken || backendToken.trim() === '') {
          console.error('Token no disponible para getAllClinics')
          setMessage('Error: Debe estar autenticado para ver las clínicas')
          return
        }

        // 👇 Forzamos el tipo de "data" para que TypeScript entienda la estructura
        const data = (await getAllClinics(backendToken)) as Clinic[]

        // Verificar que la respuesta es un array (no un error)
        if (!Array.isArray(data)) {
          console.error('Respuesta inválida de getAllClinics:', data)
          setMessage('Error al cargar las clínicas')
          return
        }

        setClinics(data)
        console.log('getAllClinics result:', data)

        const uniqueSpecialties: string[] = Array.from(
          new Set(
            data.flatMap((clinic: Clinic) => {
              if (!Array.isArray(clinic.doctors)) return []
              return clinic.doctors.map((d) => d.specialty)
            })
          )
        )

        setSpecialties(uniqueSpecialties)
      } catch (err) {
        console.error('Error fetching clinics:', err)
        setMessage('Error al cargar las clínicas. Intenta más tarde.')
      }
    }
    fetchClinics()
  }, [backendToken])

  // 🔹 2. Lógica de interconexión entre selects
  const filteredDoctors = clinics
    .flatMap((c) => c.doctors)
    .filter((d) => {
      if (
        selectedClinic &&
        !clinics
          .find((c) => c.id === selectedClinic)
          ?.doctors.some((doc) => doc.id === d.id)
      )
        return false
      if (selectedSpecialty && d.specialty !== selectedSpecialty) return false
      return true
    })

  // 🔹 3. Autocompletar clínica y especialidad al seleccionar doctor
  useEffect(() => {
    if (selectedDoctor) {
      const foundClinic = clinics.find((c) =>
        c.doctors.some((d) => d.id === selectedDoctor)
      )
      const foundDoctor = foundClinic?.doctors.find(
        (d) => d.id === selectedDoctor
      )
      if (foundClinic) setSelectedClinic(foundClinic.id)
      if (foundDoctor) setSelectedSpecialty(foundDoctor.specialty)
    }
  }, [selectedDoctor])

  // 🔹 4. Obtener días disponibles del doctor (ejemplo: L-V)
  useEffect(() => {
    const fetchDoctorAvailability = async () => {
      if (!selectedDoctor || !backendToken) {
        console.warn('⏳ Esperando backendToken o selectedDoctor...')
        return
      }

      try {
        const doctor = await getDoctorById(String(selectedDoctor), backendToken)
        console.log('Doctor info:', doctor)

        // Aquí seguirías obteniendo availableDates del doctor
      } catch (error) {
        console.error('Error al cargar disponibilidad del doctor:', error)
      }
    }

    fetchDoctorAvailability()
  }, [selectedDoctor, backendToken])

  // 🔹 5. Cargar horarios disponibles al seleccionar fecha y doctor
  useEffect(() => {
    const loadSlots = async () => {
      if (!selectedDoctor || !selectedDate || !backendToken) return
      setLoadingSlots(true)
      setMessage(null)
      try {
        const res = await getAvailableSlots(
          String(selectedDoctor),
          selectedDate,
          backendToken
        )
        setAvailableSlots(res.slots || [])
      } catch (e: any) {
        console.error('Error cargando horarios:', e)
        setMessage('Error cargando horarios disponibles.')
      } finally {
        setLoadingSlots(false)
      }
    }
    loadSlots()
  }, [selectedDoctor, selectedDate, backendToken])

  // 🔹 6. Crear cita
  const handleCreateAppointment = async () => {
    if (!selectedDoctor || !selectedTime || !selectedDate || !backendToken) {
      setMessage('⚠️ Por favor, completa todos los campos.')
      return
    }

    const startIso = new Date(
      `${selectedDate}T${selectedTime}:00Z`
    ).toISOString()
    const endIso = new Date(
      new Date(`${selectedDate}T${selectedTime}:00Z`).getTime() + 15 * 60 * 1000
    ).toISOString()

    const payload = {
      patient_id: patientId,
      start_time: startIso,
      end_time: endIso,
      service_type: selectedSpecialty || 'general',
      description: 'Reserva desde panel de paciente'
    }

    try {
      await createAppointment(selectedDoctor, payload, backendToken)
      setMessage('✅ Cita creada correctamente')
      setSelectedClinic(null)
      setSelectedDoctor(null)
      setSelectedSpecialty(null)
      setSelectedDate('')
      setAvailableSlots([])
      setSelectedTime(null)
      onAppointmentCreated()
    } catch (err: any) {
      console.error('Error creando cita:', err)
      setMessage(err.message || 'Error creando cita.')
    }
  }

  return (
    <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mt-8'>
      <h2 className='text-lg font-semibold text-emerald-700'>
        Nueva cita médica
      </h2>

      {message && (
        <div className='text-sm bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded'>
          {message}
        </div>
      )}

      {/* Selects de filtro */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Especialidad */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Especialidad
          </label>
          <select
            className='w-full border rounded-md px-3 py-2'
            value={selectedSpecialty || ''}
            onChange={(e) => setSelectedSpecialty(e.target.value || null)}
          >
            <option value=''>Seleccione</option>
            {specialties.map((sp, idx) => (
              <option key={`specialty-${sp}-${idx}`} value={sp}>
                {sp}
              </option>
            ))}
          </select>
        </div>

        {/* Doctor */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Doctor
          </label>
          <select
            className='w-full border rounded-md px-3 py-2'
            value={selectedDoctor || ''}
            onChange={(e) => setSelectedDoctor(Number(e.target.value) || null)}
          >
            <option value=''>Seleccione</option>
            {filteredDoctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} ({doc.specialty})
              </option>
            ))}
          </select>
        </div>

        {/* Clínica */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Clínica
          </label>
          <select
            className='w-full border rounded-md px-3 py-2'
            value={selectedClinic || ''}
            onChange={(e) => setSelectedClinic(Number(e.target.value) || null)}
          >
            <option value=''>Seleccione</option>
            {clinics.map((cl) => (
              <option key={cl.id} value={cl.id}>
                {cl.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendario */}
      {selectedDoctor && (
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            Selecciona una fecha
          </label>
          <div className='border border-gray-200 rounded-xl p-4 bg-white'>
            <CalendarPicker
              selectedDate={selectedDate || null}
              onSelectDate={(date) => setSelectedDate(date)}
              availableDates={availableDates}
            />
          </div>
        </div>
      )}

      {/* Horarios disponibles */}
      {loadingSlots && (
        <p className='text-sm text-gray-500'>Cargando horarios...</p>
      )}

      {!loadingSlots && availableSlots.length > 0 && (
        <div className='grid grid-cols-4 md:grid-cols-6 gap-2'>
          {availableSlots.map(({ time, available }) => (
            <button
              key={time}
              className={`px-3 py-2 text-sm rounded ${
                available
                  ? selectedTime === time
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-100 hover:bg-emerald-200'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!available}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </button>
          ))}
        </div>
      )}

      {/* Confirmar cita */}
      <div className='flex justify-end'>
        <button
          onClick={handleCreateAppointment}
          className='px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 text-sm'
        >
          Confirmar cita
        </button>
      </div>
    </div>
  )
}

// 'use client'

// import { useEffect, useState } from 'react'
// import { getAllClinics } from '@/services/api/clinicsServices'
// import { getDoctorById } from '@/services/api/doctorService'
// import {
//   getAvailableSlots,
//   createAppointment
// } from '@/services/api/doctorService'
// import CalendarPicker from './CalendarPicker'
// import { useSession } from 'next-auth/react'

// interface Clinic {
//   id: number
//   name: string
//   specialty: string[]
//   doctors: { id: number; name: string; specialty: string }[]
// }

// interface Props {
//   patientId: number
//   accessToken: string
//   onAppointmentCreated: () => void
// }

// export default function AppointmentForm({
//   patientId,
//   accessToken,
//   onAppointmentCreated
// }: Props) {
//   const [clinics, setClinics] = useState<Clinic[]>([])
//   const [specialties, setSpecialties] = useState<string[]>([])
//   const [selectedClinic, setSelectedClinic] = useState<number | null>(null)
//   const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
//     null
//   )
//   const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null)
//   const [selectedDate, setSelectedDate] = useState<string>('')
//   const [availableDates, setAvailableDates] = useState<string[]>([])
//   const [availableSlots, setAvailableSlots] = useState<
//     { time: string; available: boolean }[]
//   >([])
//   const [selectedTime, setSelectedTime] = useState<string | null>(null)
//   const [loadingSlots, setLoadingSlots] = useState(false)
//   const [message, setMessage] = useState<string | null>(null)
//   const { data: session } = useSession()

//   const backendToken = accessToken || (session as any)?.accessToken || ''

//   // 🔹 1. Cargar clínicas con sus doctores
//   useEffect(() => {
//     const fetchClinics = async () => {
//       if (!backendToken) {
//         console.warn('⚠️ No backend token available yet.')
//         return
//       }

//       try {
//         // Verificar que el token existe antes de proceder
//         if (!backendToken || backendToken.trim() === '') {
//           console.error('Token no disponible para getAllClinics')
//           setMessage('Error: Debe estar autenticado para ver las clínicas')
//           return
//         }

//         // 👇 Forzamos el tipo de "data" para que TypeScript entienda la estructura
//         const data = (await getAllClinics(backendToken)) as Clinic[]

//         // Verificar que la respuesta es un array (no un error)
//         if (!Array.isArray(data)) {
//           console.error('Respuesta inválida de getAllClinics:', data)
//           setMessage('Error al cargar las clínicas')
//           return
//         }

//         setClinics(data)
//         console.log('getAllClinics result:', data)

//         // Crear lista de especialidades únicas
//         const uniqueSpecialties: string[] = Array.from(
//           new Set(
//             data.flatMap((clinic: Clinic) => {
//               if (!Array.isArray(clinic.doctors)) return []
//               return clinic.doctors.map((d) => d.specialty)
//             })
//           )
//         )

//         setSpecialties(uniqueSpecialties)
//       } catch (err) {
//         console.error('❌ Error al cargar clínicas:', err)
//       }
//     }

//     fetchClinics()
//   }, [backendToken])

//   // 🔹 2. Lógica de interconexión entre selects
//   const filteredDoctors = clinics
//     .flatMap((c) => c.doctors)
//     .filter((d) => {
//       if (
//         selectedClinic &&
//         !clinics
//           .find((c) => c.id === selectedClinic)
//           ?.doctors.some((doc) => doc.id === d.id)
//       )
//         return false
//       if (selectedSpecialty && d.specialty !== selectedSpecialty) return false
//       return true
//     })

//   // Si seleccionas doctor, autocompletar clínica y especialidad
//   useEffect(() => {
//     if (selectedDoctor) {
//       const foundClinic = clinics.find((c) =>
//         c.doctors.some((d) => d.id === selectedDoctor)
//       )
//       const foundDoctor = foundClinic?.doctors.find(
//         (d) => d.id === selectedDoctor
//       )
//       if (foundClinic) setSelectedClinic(foundClinic.id)
//       if (foundDoctor) setSelectedSpecialty(foundDoctor.specialty)
//     }
//   }, [selectedDoctor])

//   // 🔹 3. Cargar slots disponibles al seleccionar fecha y doctor
//   useEffect(() => {
//     const fetchDoctorAvailability = async () => {
//       if (!selectedDoctor || !accessToken) return

//       try {
//         const doctor = await getDoctorById(selectedDoctor, accessToken)
//         console.log('Doctor info:', doctor)

//         // Supongamos que el campo doctor.hours = "Mon-Fri 08:00-14:00"
//         // Podrías convertirlo a una lista de días hábiles
//         const workingDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

//         // Generamos las próximas 30 fechas hábiles
//         const dates: string[] = []
//         const today = new Date()
//         for (let i = 0; i < 30; i++) {
//           const d = new Date()
//           d.setDate(today.getDate() + i)
//           const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
//           if (workingDays.includes(dayName)) {
//             dates.push(d.toLocaleDateString('en-CA'))
//           }
//         }
//         setAvailableDates(dates)
//       } catch (e) {
//         console.error('Error fetching doctor info', e)
//       }
//     }

//     fetchDoctorAvailability()
//   }, [selectedDoctor])

//   // useEffect(() => {
//   //   const loadSlots = async () => {
//   //     if (!selectedDoctor || !selectedDate || !accessToken) return
//   //     setLoadingSlots(true)
//   //     setMessage(null)
//   //     try {
//   //       const res = await getAvailableSlots(
//   //         String(selectedDoctor),
//   //         selectedDate,
//   //         accessToken
//   //       )
//   //       setAvailableSlots(res.slots)
//   //     } catch (e: any) {
//   //       setMessage('Error cargando horarios disponibles.')
//   //     } finally {
//   //       setLoadingSlots(false)
//   //     }
//   //   }
//   //   loadSlots()
//   // }, [selectedDoctor, selectedDate])

//   // TODO: Reemplazar accessToken con backendToken cuando se integre NextAuth:
//   // useEffect(() => {
//   //   const loadSlots = async () => {
//   //     if (!selectedDoctor || !selectedDate || !backendToken) {
//   //       setAvailableSlots([]);
//   //       return;
//   //     }
//   //
//   //     setLoadingSlots(true);
//   //     setMessage(null);
//   //     try {
//   //       const res = await getAvailableSlots(String(selectedDoctor), selectedDate, backendToken);
//   //       if (res && res.slots && Array.isArray(res.slots)) {
//   //         setAvailableSlots(res.slots);
//   //         console.log("Slots loaded:", res.slots);
//   //       } else {
//   //         console.warn("Invalid slots response:", res);
//   //         setAvailableSlots([]);
//   //       }
//   //     } catch (e: any) {
//   //       console.error("Error loading slots:", e);
//   //       setMessage("Error cargando horarios disponibles.");
//   //       setAvailableSlots([]);
//   //     } finally {
//   //       setLoadingSlots(false);
//   //     }
//   //   };
//   //   loadSlots();
//   // }, [selectedDoctor, selectedDate, backendToken]);

//   // 🔹 4. Crear nueva cita
//   const handleCreateAppointment = async () => {
//     if (!selectedDoctor || !selectedTime || !selectedDate || !accessToken) {
//       setMessage('Por favor, completa todos los campos.')
//       return
//     }

//     const startIso = new Date(
//       `${selectedDate}T${selectedTime}:00Z`
//     ).toISOString()
//     const endIso = new Date(
//       new Date(`${selectedDate}T${selectedTime}:00Z`).getTime() + 15 * 60 * 1000
//     ).toISOString()

//     const payload = {
//       patient_id: patientId,
//       start_time: startIso,
//       end_time: endIso,
//       service_type: selectedSpecialty || 'general',
//       description: 'Reserva desde panel de paciente'
//     }

//     try {
//       await createAppointment(selectedDoctor, payload, accessToken)
//       setMessage('✅ Cita creada correctamente')
//       setSelectedClinic(null)
//       setSelectedDoctor(null)
//       setSelectedSpecialty(null)
//       setSelectedDate('')
//       setAvailableSlots([])
//       setSelectedTime(null)
//       onAppointmentCreated()
//     } catch (err: any) {
//       setMessage(err.message || 'Error creando cita.')
//     }
//   }

//   // TODO: Versión mejorada con validaciones adicionales (implementar después):
//   // const handleCreateAppointment = async () => {
//   //   if (!selectedDoctor || !selectedTime || !selectedDate || !backendToken) {
//   //     setMessage("⚠️ Por favor, completa todos los campos (Clínica, Doctor, Fecha y Hora).");
//   //     return;
//   //   }
//   //
//   //   try {
//   //     // Parse the time and create ISO strings
//   //     const [hours, minutes] = selectedTime.split(":").map(Number);
//   //     const appointmentDate = new Date(selectedDate);
//   //     appointmentDate.setHours(hours, minutes, 0, 0);
//   //
//   //     const startIso = appointmentDate.toISOString();
//   //     const endTime = new Date(appointmentDate.getTime() + 15 * 60 * 1000);
//   //     const endIso = endTime.toISOString();
//   //
//   //     console.log("Creating appointment:", {
//   //       doctor_id: selectedDoctor,
//   //       patient_id: patientId,
//   //       start_time: startIso,
//   //       end_time: endIso,
//   //       specialty: selectedSpecialty,
//   //     });
//   //
//   //     const payload = {
//   //       patient_id: patientId,
//   //       start_time: startIso,
//   //       end_time: endIso,
//   //       service_type: selectedSpecialty || "general",
//   //       description: "Reserva desde panel de paciente",
//   //     };
//   //
//   //     await createAppointment(selectedDoctor, payload, backendToken);
//   //
//   //     setMessage("✅ ¡Cita creada correctamente!");
//   //
//   //     // Reset form
//   //     setTimeout(() => {
//   //       setSelectedClinic(null);
//   //       setSelectedDoctor(null);
//   //       setSelectedSpecialty(null);
//   //       setSelectedDate("");
//   //       setAvailableSlots([]);
//   //       setSelectedTime(null);
//   //       setMessage(null);
//   //       onAppointmentCreated();
//   //     }, 1500);
//   //   } catch (err: any) {
//   //     console.error("Error creating appointment:", err);
//   //     setMessage(`❌ ${err.message || "Error creando cita. Intenta de nuevo."}`);
//   //   }
//   // };

//   return (
//     <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mt-8'>
//       <h2 className='text-lg font-semibold text-emerald-700'>
//         Nueva cita médica
//       </h2>

//       {message && (
//         <div className='text-sm bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded'>
//           {message}
//         </div>
//       )}

//       {/* Filtros */}
//       <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
//         {/* Especialidad */}
//         <div>
//           <label className='block text-sm font-medium text-gray-700 mb-1'>
//             Especialidad
//           </label>
//           <select
//             className='w-full border rounded-md px-3 py-2'
//             value={selectedSpecialty || ''}
//             onChange={(e) => setSelectedSpecialty(e.target.value || null)}
//           >
//             <option value=''>Seleccione</option>

//             {specialties.map((sp) => (
//               <option key={sp} value={sp}>
//                 {sp}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Doctor */}
//         <div>
//           <label className='block text-sm font-medium text-gray-700 mb-1'>
//             Doctor
//           </label>
//           <select
//             className='w-full border rounded-md px-3 py-2'
//             value={selectedDoctor || ''}
//             onChange={(e) => setSelectedDoctor(Number(e.target.value) || null)}
//           >
//             <option value=''>Seleccione</option>
//             {filteredDoctors.map((doc) => (
//               <option key={doc.id} value={doc.id}>
//                 {doc.name} ({doc.specialty})
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Clínica */}
//         <div>
//           <label className='block text-sm font-medium text-gray-700 mb-1'>
//             Clínica
//           </label>
//           <select
//             className='w-full border rounded-md px-3 py-2'
//             value={selectedClinic || ''}
//             onChange={(e) => setSelectedClinic(Number(e.target.value) || null)}
//           >
//             <option value=''>Seleccione</option>
//             {clinics.map((cl) => (
//               <option key={cl.id} value={cl.id}>
//                 {cl.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Fecha y calendario */}
//       {selectedDoctor && (
//         <div className='space-y-2'>
//           <label className='text-sm font-medium text-gray-700'>
//             Selecciona una fecha
//           </label>
//           <div className='border border-gray-200 rounded-xl p-4 bg-white'>
//             <h3 className='text-emerald-700 font-semibold mb-2'>
//               Selecciona una fecha
//             </h3>
//             <CalendarPicker
//               selectedDate={selectedDate || null}
//               onSelectDate={(date) => setSelectedDate(date)}
//               availableDates={[]} // permitir todas las fechas futuras
//             />
//           </div>
//         </div>
//       )}

//       {/* TODO: Versión futura - Permitir seleccionar cualquier fecha futura:
//       {selectedDoctor && (
//         <div className='space-y-2'>
//           <label className='text-sm font-medium text-gray-700'>Selecciona una fecha</label>

//           <div className='border border-gray-200 rounded-xl p-4 bg-white'>
//             <h3 className='text-emerald-700 font-semibold mb-2'>Selecciona una fecha</h3>
//             <CalendarPicker
//               selectedDate={selectedDate || null}
//               onSelectDate={(date) => setSelectedDate(date)}
//               availableDates={[]}
//               // Permitir seleccionar cualquier fecha futura
//               // Los slots específicos se mostrarán después de seleccionar la fecha
//             />
//           </div>
//         </div>
//       )}
//       */}

//       {/* Horarios disponibles */}
//       {loadingSlots && (
//         <p className='text-sm text-gray-500'>Cargando horarios...</p>
//       )}

//       {!loadingSlots && availableSlots.length > 0 && (
//         <div className='grid grid-cols-4 md:grid-cols-6 gap-2'>
//           {availableSlots.map(({ time, available }) => (
//             <button
//               key={time}
//               className={`px-3 py-2 text-sm rounded ${
//                 available
//                   ? selectedTime === time
//                     ? 'bg-emerald-600 text-white'
//                     : 'bg-emerald-100 hover:bg-emerald-200'
//                   : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//               }`}
//               disabled={!available}
//               onClick={() => setSelectedTime(time)}
//             >
//               {time}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Botón de confirmación */}
//       <div className='flex justify-end'>
//         <button
//           onClick={handleCreateAppointment}
//           className='px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 text-sm'
//         >
//           Confirmar cita
//         </button>
//       </div>
//     </div>
//   )
// }
