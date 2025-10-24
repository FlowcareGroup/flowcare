import { DoctorEditSchema, DoctorSchema } from "@/app/lib/validations_schema";





const API_CLINICS_URL = process.env.BACKEND_URL 
  ? `${process.env.BACKEND_URL}/doctors`
  : "http://localhost:4000/api/doctors";


export const getAllDoctors = async (token: string) => {
  console.log("🔗 Conectando a:", `${API_CLINICS_URL}/getAllDoctors`);

  const response = await fetch(`${API_CLINICS_URL}/getAllDoctors`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json" , authorization: "Bearer " + token,
    },
  });
  return response.json();
};


export const getDoctorById = async (id: number,token: string) => {
  const response = await fetch(`${API_CLINICS_URL}/getDoctorById/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + token
    },
     });
  return response.json();
};


export const createDoctor = async (doctor: DoctorSchema, token: string) => {
    const response = await fetch(`${API_CLINICS_URL}/createDoctor`, {
      method: "POST",
      headers: {    
        "Content-Type": "application/json", authorization: "Bearer " + token,
      },
      body: JSON.stringify(doctor),
    });
    return response.json();
  };

//pasarlo 
export const editDoctor = async (id: number, doctor: DoctorEditSchema, token: string) => {
    const response = await fetch(`${API_CLINICS_URL}/editDoctor/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", authorization: "Bearer " + token,
      },
      body: JSON.stringify(doctor),
    });
    return response.json();
  };



export const deleteDoctor = async (id: number, token: string) => {
    const response = await fetch(`${API_CLINICS_URL}/deleteDoctor/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json", authorization: "Bearer " + token,
      },
    });
    return response.json();
  }