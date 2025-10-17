// DoctorPage.tsx (Server Component, e.g., app/dashboard/doctor/page.tsx)

// Corregir la ruta de importación: DEBE apuntar al archivo donde se inicializó NextAuth.
import { getDoctorById } from "@/services/api/doctorService";
import { auth } from "../../../../auth"; 
import { SiGooglecalendar } from "react-icons/si";


export default async function DoctorPage() { // <-- Debe ser asíncrono!
    
    // 1. Llama a auth() para obtener la sesión.
    const session = await auth(); 
    
    if (!session || !session.user?.id || session.user?.role !== 'doctor') {
        // Redirige o muestra un error si no está autorizado o no es doctor
        // En Next.js 14, se recomienda usar 'redirect' de 'next/navigation'
        // throw new Error("Acceso no autorizado."); 
        return <div>Acceso no autorizado o ID de Doctor no encontrado.</div>;
    }
    
    // Ahora tienes el ID del doctor disponible
    const doctorId = session.user.id;
    const doctorName = session.user.name;

    console.log(`Doctor ID: ${doctorId}, Role: ${session.user.role}`);
    const accessToken: string = (session as any).accessToken;
    
    // **AQUÍ REALIZAS LA LLAMADA A LA API CON EL doctorId**
    const dashboardData = await getDoctorById(doctorId, accessToken);
    
    return (
        <>
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Bienvenido Dr. {doctorName} a tu Panel de atención medica</h1>
            <p className="text-lg">Gestiona tu agenda, las consultas y los historiales médicos de pacientes.</p>
        </div>
        <div className="p-8 w-full border border-gray-300 rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-4">Tus proximas consultas:</h2>
            <ul>
                {dashboardData?.appointments?.map((appointment: any) => (
                    <li key={appointment.id} className="border-b border-gray-200 py-2">
                        <p className="font-medium">{appointment.patientName}</p>
                        <p className="text-sm text-gray-600">{appointment.date}</p>
                    </li>
                ))}
            </ul>
            <div>
                <p className="flex gap-2 items-center text-sm"><SiGooglecalendar size={20} />Agenda sincronizada con Google Calendar
                    
                </p>
            </div>
        </div>
        </>
    );
}

// Nota: Si estás importando 'auth' directamente en el archivo de configuración,
// asegúrate de que esa importación esté definida correctamente:
// import { auth } from "@/app/api/auth/[...nextauth]/route"; 
// ^^^ Utiliza alias de ruta (@/) si los tienes configurados para evitar los '....'