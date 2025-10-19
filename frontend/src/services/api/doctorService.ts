const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000/api";

// 1. La función debe aceptar el accessToken como argumento.
const getDoctorById = async (id: string, accessToken: string) => { 
    
    // 2. Definir las opciones de la solicitud, incluyendo el header.
    const requestOptions: RequestInit = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            // 3. ¡El paso clave! Enviar el token como Bearer Token.
            "Authorization": `Bearer ${accessToken}`, 
        },
        // 4. (Opcional pero recomendado) Deshabilitar caché para llamadas con token en Next.js
        cache: 'no-store' 
    };

    // Usar la URL completa y las opciones.
    const response = await fetch(`${BACKEND_URL}/doctors/${id}`, requestOptions);
    
    try {
        if (!response.ok) {
            // Opcional: Intenta leer el mensaje de error del backend para un mejor diagnóstico.
            // const errorBody = await response.text();
            // console.error(`Backend returned status ${response.status}: ${errorBody}`);
            throw new Error(`Failed to fetch doctor: HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched doctor data:", data);
        return data;
        
    } catch (error) {
        console.error("Error fetching doctor:", error);
        throw error;
    }
};

const getAllAppointmentsByDoctorByDay = async (doctorId: string, date: string, accessToken: string) => {
    const requestOptions: RequestInit = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        cache: 'no-store'
    };

    const response = await fetch(`${BACKEND_URL}/doctors/${doctorId}/appointmentsbyday/${date}`, requestOptions);
    
    try {
        if (!response.ok) {
            throw new Error(`Failed to fetch appointments: HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched appointments data:", data);
        return data;
        
    } catch (error) {
        console.error("Error fetching appointments:", error);
        throw error;
    }
}

export { getDoctorById, getAllAppointmentsByDoctorByDay };