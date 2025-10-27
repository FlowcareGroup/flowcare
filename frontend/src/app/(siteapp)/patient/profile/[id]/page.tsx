import { auth } from "../../../../../../auth";
import { getPatientProfile } from "@/services/api/patientService";

export default async function PatientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  if (!session || session.user?.role !== "patient") {
    return <div>Acceso no autorizado.</div>;
  }

  const patientId = Number(id);
  const accessToken: string = (session as any).accessToken;

  const profile = await getPatientProfile(patientId, accessToken);
  const personal = profile.personalData;
  const observations = profile.observations || [];

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>Tu ficha médica</h1>
      <p className='text-gray-600 mb-8'>Consulta tus datos personales y observaciones médicas.</p>

      {/* Datos personales */}
      <section className='bg-white shadow rounded-xl p-6 mb-8'>
        <h2 className='text-lg font-semibold mb-4'>Datos personales</h2>
        <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm'>
          <Info
            label='Nombre'
            value={`${personal.name_given} ${personal.name_family || ""}`}
          />
          <Info
            label='Email'
            value={personal.email}
          />
          <Info
            label='Género'
            value={personal.gender || "—"}
          />
          <Info
            label='Fecha de nacimiento'
            value={personal.birth_date || "—"}
          />
          <Info
            label='Dirección'
            value={personal.address || "—"}
          />
          <Info
            label='Estado civil'
            value={personal.marital_status || "—"}
          />
          <Info
            label='Identificador'
            value={personal.identifier || "—"}
          />
        </div>
      </section>

      {/* Observaciones */}
      <section className='bg-white shadow rounded-xl p-6'>
        <h2 className='text-lg font-semibold mb-4'>Observaciones médicas</h2>
        {observations.length === 0 ? (
          <p className='text-gray-500'>No hay observaciones registradas.</p>
        ) : (
          <table className='min-w-full text-sm border border-gray-200 rounded-lg'>
            <thead className='bg-gray-50 text-gray-700 text-left'>
              <tr>
                <th className='px-4 py-2 border-b'>Fecha</th>
                <th className='px-4 py-2 border-b'>Categoría</th>
                <th className='px-4 py-2 border-b'>Código</th>
                <th className='px-4 py-2 border-b'>Valor</th>
                <th className='px-4 py-2 border-b'>Unidad</th>
                <th className='px-4 py-2 border-b'>Médico</th>
              </tr>
            </thead>
            <tbody>
              {observations.map((obs) => (
                <tr
                  key={obs.id}
                  className='border-b hover:bg-gray-50'
                >
                  <td className='px-4 py-2'>{obs.date}</td>
                  <td className='px-4 py-2'>{obs.category}</td>
                  <td className='px-4 py-2'>{obs.code}</td>
                  <td className='px-4 py-2'>{obs.value}</td>
                  <td className='px-4 py-2'>{obs.unit || "—"}</td>
                  <td className='px-4 py-2'>{obs.doctor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className='text-gray-500 text-xs uppercase tracking-wider'>{label}</p>
      <p className='text-gray-900 font-medium'>{value}</p>
    </div>
  );
}

// // app/dashboard/patient/page.tsx
// import { auth } from '../../../../auth'
// import { getPatientProfile } from '@/services/api/patientService'
// import PatientAppointments from './components/PatientAppointments'
// import PatientMiniCards from './components/PatientMiniCards'

// export default async function PatientPage() {
//   // 1️⃣ Autenticación
//   const session = await auth()

//   if (!session || !session.user?.id || session.user?.role !== 'patient') {
//     return <div>Acceso no autorizado o ID de paciente no encontrado.</div>
//   }

//   // 2️⃣ Variables del usuario autenticado
//   const patientId = Number(session.user.id)
//   const patientName = session.user.name
//   const accessToken: string = (session as any).accessToken

//   console.log(`Patient ID: ${patientId}, Role: ${session.user.role}`)

//   // 3️⃣ Llamada al backend (perfil completo del paciente)
//   let patientData
//   try {
//     patientData = await getPatientProfile(patientId, accessToken)
//   } catch (err) {
//     console.error('Error al obtener perfil del paciente:', err)
//     return <div>Error al cargar datos del paciente.</div>
//   }

//   // 4️⃣ Render del Dashboard (estructura espejo del DoctorPage)
//   return (
//     <>
//       <div className='p-8'>
//         <h1 className='text-2xl font-bold mb-4'>
//           Bienvenido/a {patientName} a tu panel de salud
//         </h1>
//         <p className='text-lg mb-8'>
//           Gestiona tus citas médicas, revisa tu historial y accede a tus
//           consultas en línea.
//         </p>

//         {/* 📅 Próximas citas */}
//         <PatientAppointments appointments={patientData.appointments} />

//         {/* 🔗 Accesos rápidos */}
//         <PatientMiniCards patientId={patientId} />
//       </div>
//     </>
//   )
// }
