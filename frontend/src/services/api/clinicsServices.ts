import { ClinicEditSchema, ClinicSchema } from "@/app/lib/validations_schema";

const API_CLINICS_URL = process.env.BACKEND_URL //el .evn no funciona
  ? `${process.env.BACKEND_URL}/clinics`
  : "http://localhost:4000/api/clinics";

export const getAllClinics = async (token: string) => {
  console.log("🔗 Conectando a:", `${API_CLINICS_URL}/getAllClinics`);

  const response = await fetch(`${API_CLINICS_URL}/getAllClinics`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return response.json();
};

export const getClinicById = async (id: number, token: string) => {
  const response = await fetch(`${API_CLINICS_URL}/getClinics/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return response.json();
};

export const createClinic = async (credentials: ClinicSchema, token: string) => {
  const response = await fetch(`${API_CLINICS_URL}/createClinic`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

export const editClinic = async (credentials: ClinicEditSchema, id: number, token: string) => {
  const response = await fetch(`${API_CLINICS_URL}/editClinic/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

export const deleteClinic = async (id: number, token: string) => {
  const response = await fetch(`${API_CLINICS_URL}/deleteClinic/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
  });
  return response.json();
};
