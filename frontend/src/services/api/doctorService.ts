const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000/api";

// Interfaces para paginación
interface PaginatedAppointments {
  data: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// 1. La función debe aceptar el accessToken como argumento.
const getDoctorById = async (id: string, accessToken: string) => {
  // 2. Definir las opciones de la solicitud, incluyendo el header.
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // 3. ¡El paso clave! Enviar el token como Bearer Token.
      Authorization: `Bearer ${accessToken}`,
    },
    // 4. (Opcional pero recomendado) Deshabilitar caché para llamadas con token en Next.js
    cache: "no-store",
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

const getAllAppointmentsByDoctorByDay = async (
  doctorId: string,
  date: string,
  accessToken: string,
  page: number = 1,
  limit: number = 4
): Promise<PaginatedAppointments> => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  };

  const url = `${BACKEND_URL}/doctors/${doctorId}/appointments?date=${date}&page=${page}&limit=${limit}`;
  console.log("Fetching appointments from:", url);

  const response = await fetch(url, requestOptions);

  try {
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Backend returned status ${response.status}: ${errorBody}`);
      throw new Error(`Failed to fetch appointments: HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched appointments data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

const updateAppointmentTime = async (
  appointmentId: number,
  startTime: string,
  endTime: string,
  accessToken: string
): Promise<any> => {
  const requestOptions: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      start_time: startTime,
      end_time: endTime,
    }),
  };

  const url = `${BACKEND_URL}/doctors/appointments/${appointmentId}`;
  console.log("Updating appointment:", url);

  const response = await fetch(url, requestOptions);

  try {
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Backend returned status ${response.status}: ${errorBody}`);
      throw new Error(`Failed to update appointment: HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("Updated appointment:", data);
    return data;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

export { getDoctorById, getAllAppointmentsByDoctorByDay, updateAppointmentTime };
