"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Appointment {
  id: number;
  date: string;
  time: string;
  endTime: string;
  status: string;
  doctor: string;
  service_type: string;
  description: string;
}

export default function PatientAppointments() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.accessToken) {
      setLoading(false);
      return;
    }

    const loadAppointments = async () => {
      try {
        const res = await fetch("/api/patients/me/appointments", {
          headers: { Authorization: `Bearer ${(session as any).accessToken}` },
        });
        if (!res.ok) throw new Error("Error loading appointments");
        const data = await res.json();
        setAppointments(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error loading appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [session]);

  const upcoming = appointments.filter((a) => a.status === "pending" || a.status === "scheduled");

  if (loading) {
    return (
      <div className='bg-white shadow rounded-xl p-6'>
        <p className='text-gray-500'>Cargando citas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-white shadow rounded-xl p-6'>
        <p className='text-red-500'>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className='bg-white shadow rounded-xl p-6'>
      <h2 className='text-lg font-semibold mb-4'>Tus próximas citas</h2>

      {upcoming.length === 0 ? (
        <p className='text-gray-500'>No tienes citas pendientes.</p>
      ) : (
        <ul className='divide-y divide-gray-100'>
          {upcoming.map((apt) => (
            <li
              key={apt.id}
              className='py-3 flex justify-between items-center'
            >
              <div>
                <p className='font-medium text-gray-900'>{apt.doctor}</p>
                <p className='text-sm text-gray-600'>{apt.service_type}</p>
                <p className='text-sm text-gray-500'>
                  {apt.date} — {apt.time}
                </p>
              </div>
              <button className='px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition'>
                Ver detalles
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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
//   const pendingAppointments = appointments.filter(
//     (a) => a.status === 'pending' || a.status === 'scheduled'
//   )

//   return (
//     <div className='bg-white shadow rounded-xl p-6'>
//       <h2 className='text-lg font-semibold mb-4'>Tus próximas citas</h2>

//       {pendingAppointments.length === 0 ? (
//         <p className='text-gray-500'>No tienes citas próximas.</p>
//       ) : (
//         <ul className='divide-y divide-gray-100'>
//           {pendingAppointments.map((apt) => (
//             <li key={apt.id} className='flex items-center justify-between py-3'>
//               <div>
//                 <p className='font-medium text-gray-900'>{apt.doctor}</p>
//                 <p className='text-sm text-gray-600'>{apt.service_type}</p>
//                 <p className='text-sm text-gray-500'>
//                   {apt.date} — {apt.time}h
//                 </p>
//               </div>
//               <button className='px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition'>
//                 Modificar cita
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   )
// }
