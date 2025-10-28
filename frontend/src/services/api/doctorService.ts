const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000/api";

import { DoctorEditSchema, DoctorSchema } from "@/app/lib/validations_schema";

const API_CLINICS_URL = process.env.NEXT_PUBLIC_BACKEND_URL
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctors`
  : "http://localhost:4000/api/doctors";

export const getAllDoctorsBYClinic = async (token: string) => {
  const response = await fetch(`${API_CLINICS_URL}/getAllDoctorsBYClinic`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    console.error(`Error: ${response.status} ${response.statusText}`);
    return [];
  }

  const data = await response.json();

  // Ensure we always return an array
  if (!Array.isArray(data)) {
    console.error("Expected array from getAllDoctorsBYClinic, got:", data);
    return [];
  }

  return data;
};

export const getDoctorByIdClinic = async (id: number, token: string) => {
  const response = await fetch(`${API_CLINICS_URL}/getDoctorByIdClinic/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },
  });
  return response.json();
};

export const createDoctor = async (doctor: DoctorSchema, token: string) => {
  const response = await fetch(`${API_CLINICS_URL}/createDoctor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },
    body: JSON.stringify(doctor),
  });
  return response.json();
};

export const editDoctor = async (id: number, doctor: DoctorEditSchema, token: string) => {
  const response = await fetch(`${API_CLINICS_URL}/editDoctor/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },
    body: JSON.stringify(doctor),
  });
  return response.json();
};

export const deleteDoctor = async (id: number, token: string) => {
  const response = await fetch(`${API_CLINICS_URL}/deleteDoctor/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },
  });
  return response.json();
};

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

// Obtener slots disponibles y ocupados de un doctor para una fecha
interface SlotInfo {
  time: string;
  available: boolean;
  appointmentId: number | null;
  status: string | null;
}

interface AvailableSlotsResponse {
  date: string;
  doctorId: number;
  workingHours: {
    start: string;
    end: string;
    sessionDuration: number;
  };
  slots: SlotInfo[];
  summary: {
    total: number;
    available: number;
    occupied: number;
  };
  availableSlots: string[];
  occupiedSlots: SlotInfo[];
}

const getAvailableSlots = async (
  doctorId: string,
  date: string,
  accessToken: string
): Promise<AvailableSlotsResponse> => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  };

  const url = `${BACKEND_URL}/doctors/${doctorId}/available-slots?date=${date}`;
  console.log("Fetching available slots from:", url);

  const response = await fetch(url, requestOptions);

  try {
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Backend returned status ${response.status}: ${errorBody}`);
      throw new Error(`Failed to fetch available slots: HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("Available slots data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching available slots:", error);
    throw error;
  }
};

export { getDoctorById, getAllAppointmentsByDoctorByDay, updateAppointmentTime, getAvailableSlots };

// Crear una cita para un paciente con un doctor
interface CreateAppointmentPayload {
  patient_id: number;
  start_time: string; // ISO string
  end_time: string; // ISO string
  service_type?: string;
  description?: string;
}

const createAppointment = async (
  doctorId: number,
  payload: CreateAppointmentPayload,
  accessToken: string
): Promise<any> => {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  };

  const url = `${BACKEND_URL}/doctors/${doctorId}/appointments`;
  console.log("Creating appointment:", url, payload);

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Backend returned status ${response.status}: ${errorBody}`);
    throw new Error(`Failed to create appointment: HTTP ${response.status}`);
  }

  return response.json();
};

export type { CreateAppointmentPayload };
export { createAppointment };

// Cancelar una cita
const cancelAppointment = async (appointmentId: number, accessToken: string): Promise<any> => {
  const requestOptions: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const url = `${BACKEND_URL}/doctors/appointments/${appointmentId}/cancel`;
  console.log("Cancelling appointment:", url);

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Backend returned status ${response.status}: ${errorBody}`);
    throw new Error(`Failed to cancel appointment: HTTP ${response.status}`);
  }

  return response.json();
};

export { cancelAppointment };

// Obtener detalles de una cita específica
const getAppointmentDetails = async (
  doctorId: string,
  appointmentId: number,
  accessToken: string
): Promise<any> => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  };

  const url = `${BACKEND_URL}/doctors/${doctorId}/appointments/${appointmentId}`;
  console.log("Fetching appointment details:", url);

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Backend returned status ${response.status}: ${errorBody}`);
    throw new Error(`Failed to fetch appointment details: HTTP ${response.status}`);
  }

  return response.json();
};

export { getAppointmentDetails };

// Actualizar estado de una cita
const updateAppointmentStatus = async (
  doctorId: string,
  appointmentId: number,
  status: "pending" | "confirmed" | "booked" | "arrived" | "fulfilled" | "cancelled" | "noshow",
  accessToken: string
): Promise<any> => {
  const requestOptions: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ status }),
  };

  const url = `${BACKEND_URL}/doctors/${doctorId}/appointments/${appointmentId}/status`;
  console.log("Updating appointment status:", url, status);

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Backend returned status ${response.status}: ${errorBody}`);
    throw new Error(`Failed to update appointment status: HTTP ${response.status}`);
  }

  return response.json();
};

export { updateAppointmentStatus };

// Agregar observación a una cita
interface AddObservationPayload {
  category: string;
  code: string;
  value_string?: string;
  value_unit?: string;
  notes?: string;
  date?: string;
  time?: string;
}

const addObservationToAppointment = async (
  doctorId: string,
  appointmentId: number,
  observation: AddObservationPayload,
  accessToken: string
): Promise<any> => {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(observation),
  };

  const url = `${BACKEND_URL}/doctors/${doctorId}/appointments/${appointmentId}/observations`;
  console.log("Adding observation to appointment:", url, observation);

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Backend returned status ${response.status}: ${errorBody}`);
    throw new Error(`Failed to add observation: HTTP ${response.status}`);
  }

  return response.json();
};

export type { AddObservationPayload };
export { addObservationToAppointment };

// Agregar prescripción a una cita
interface AddPrescriptionPayload {
  medication: string;
  dose: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

const addPrescriptionToAppointment = async (
  doctorId: string,
  appointmentId: number,
  prescription: AddPrescriptionPayload,
  accessToken: string
): Promise<any> => {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(prescription),
  };

  const url = `${BACKEND_URL}/doctors/${doctorId}/appointments/${appointmentId}/prescriptions`;
  console.log("Adding prescription to appointment:", url, prescription);

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Backend returned status ${response.status}: ${errorBody}`);
    throw new Error(`Failed to add prescription: HTTP ${response.status}`);
  }

  return response.json();
};

export type { AddPrescriptionPayload };
export { addPrescriptionToAppointment };

// Obtener prescripciones de una cita
const getPrescriptionsForAppointment = async (
  doctorId: string,
  appointmentId: number,
  accessToken: string
): Promise<any> => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  };

  const url = `${BACKEND_URL}/doctors/${doctorId}/appointments/${appointmentId}/prescriptions`;
  console.log("Fetching prescriptions:", url);

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Backend returned status ${response.status}: ${errorBody}`);
    throw new Error(`Failed to fetch prescriptions: HTTP ${response.status}`);
  }

  return response.json();
};

export { getPrescriptionsForAppointment };

// Buscar pacientes del doctor
const searchPatients = async (
  doctorId: string,
  searchQuery: string,
  accessToken: string
): Promise<any> => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  };

  const url = `${BACKEND_URL}/doctors/${doctorId}/search-patients?search=${encodeURIComponent(
    searchQuery
  )}`;
  console.log("Searching patients:", url);

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Backend returned status ${response.status}: ${errorBody}`);
    throw new Error(`Failed to search patients: HTTP ${response.status}`);
  }

  return response.json();
};

export { searchPatients };

// Obtener estadísticas del doctor
const getDoctorStatistics = async (doctorId: string, accessToken: string): Promise<any> => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  };

  const url = `${BACKEND_URL}/doctors/${doctorId}/statistics`;
  console.log("Fetching doctor statistics:", url);

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Backend returned status ${response.status}: ${errorBody}`);
    throw new Error(`Failed to fetch statistics: HTTP ${response.status}`);
  }

  return response.json();
};

export { getDoctorStatistics };
