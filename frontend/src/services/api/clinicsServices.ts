import { clinics } from "@/types/auth.types";

const API_CLINICS_URL = `${process.env.BACKEND_URL}/clinics`;


export const getAllClinics = async () => {
  console.log("🔗 Conectando a:", `${API_CLINICS_URL}/getAllClinics`);

  const response = await fetch(`${API_CLINICS_URL}/getAllClinics`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json" /*, authorization: "Bearer " + token*/,
    },
  });
  return response.json();
};



export const getClinicById = async (id: number) => {
  const response = await fetch(`${API_CLINICS_URL}/getClinics/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
     /*, authorization: "Bearer " + token*/
    },
     });
  return response.json();
};


export const createClinic = async (credentials: clinics) => {   
    const response = await fetch(`${API_CLINICS_URL}/createClinic`, {
      method: "POST",
      headers: { "Content-Type": "application/json"  /*, authorization: "Bearer " + token*/},
        body: JSON.stringify(credentials),
    });
    return response.json();

}


export const  editClinic= async (credentials: clinics , id: number) => {   
    const response = await fetch(`${API_CLINICS_URL}/editClinic/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json"  /*, authorization: "Bearer " + token*/},
        body: JSON.stringify(credentials),
    });
    return response.json();

}


export const  deleteClinic= async ( id: number) => {   
    const response = await fetch(`${API_CLINICS_URL}/deleteClinic/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json"  /*, authorization: "Bearer " + token*/},
    });
    return response.json();

}