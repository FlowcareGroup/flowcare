// DoctorPage.tsx (Server Component, e.g., app/dashboard/doctor/page.tsx)

// Corregir la ruta de importación: DEBE apuntar al archivo donde se inicializó NextAuth.
import {
  getAllAppointmentsByDoctorByDay,
  searchPatients,
  getDoctorStatistics,
} from "@/services/api/doctorService";
import { auth } from "../../../../auth";
import AppointmentCalendar from "./components/AppointmentCalendar";
import DoctorDashboard from "./components/DoctorDashboard";
import PatientSearch from "./components/PatientSearch";

export default async function DoctorPage() {
  // <-- Debe ser asíncrono!

  // 1. Llama a auth() para obtener la sesión.
  const session = await auth();

  if (!session || !session.user?.id || session.user?.role !== "doctor") {
    // Redirige o muestra un error si no está autorizado o no es doctor
    // En Next.js 14, se recomienda usar 'redirect' de 'next/navigation'
    // throw new Error("Acceso no autorizado.");
    return <div>Acceso no autorizado o ID de Doctor no encontrado.</div>;
  }

  // Ahora tienes el ID del doctor disponible
  const doctorId = session.user.id; // Keep as string for API
  const doctorIdNum = parseInt(session.user.id); // Convert to number for components if needed
  const doctorName = session.user.name;

  console.log(`Doctor ID: ${doctorId}, Role: ${session.user.role}`);
  const accessToken: string = (session as any).accessToken;

  // **AQUÍ REALIZAS LA LLAMADA A LA API CON EL doctorId**
  const initialDate = new Date().toISOString().split("T")[0];

  // Fetch appointments - getAllAppointmentsByDoctorByDay handles errors internally
  const appointmentsData = await getAllAppointmentsByDoctorByDay(
    doctorId,
    initialDate,
    accessToken,
    1, // página inicial
    4 // 4 items por página por defecto
  );

  // Fetch doctor statistics
  const statisticsData = await getDoctorStatistics(doctorId, accessToken).catch(() => ({
    statistics: {
      today: { total: 0, completed: 0, pending: 0, cancelled: 0 },
      lastMonth: { total: 0, uniquePatients: 0 },
    },
  }));

  return (
    <>
      <div className='p-4 max-w-6xl mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>
          Bienvenido Dr. {doctorName} a tu Panel de atención medica
        </h1>
        <p className='text-lg mb-8'>
          Gestiona tu agenda, las consultas y los historiales médicos de pacientes.
        </p>

        {/* Statistics Dashboard */}
        <DoctorDashboard
          doctorId={doctorId}
          accessToken={accessToken}
          initialStatistics={statisticsData.statistics}
        />

        {/* Patient Search */}
        <PatientSearch
          doctorId={doctorId}
          accessToken={accessToken}
        />
      </div>

      <AppointmentCalendar
        doctorId={doctorId}
        accessToken={accessToken}
        initialData={appointmentsData}
        initialDate={initialDate}
      />
    </>
  );
}

// Nota: Si estás importando 'auth' directamente en el archivo de configuración,
// asegúrate de que esa importación esté definida correctamente:
// import { auth } from "@/app/api/auth/[...nextauth]/route";
// ^^^ Utiliza alias de ruta (@/) si los tienes configurados para evitar los '....'
