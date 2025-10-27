
"use client";
import { deleteClinic, getAllClinics } from "@/services/api/clinicsServices";
import { clinics } from "@/types/auth.types";
import {  useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";


export default function AdminPage() {
   const router = useRouter();
const [dataClinics, setdataClinics] = useState<clinics[]>([]);
  const { data: session } = useSession();
  useEffect(() => {
    console.log("dataClinics", dataClinics);
    clinicsAll();
  }, []);

  const clinicsAll = async () => {
    try {
      const accessToken = (session as any)?.accessToken;
      if (!accessToken) return;
      const response = await getAllClinics(accessToken);
      setdataClinics(response);
      console.log("✅ Get data:", response);
    } catch (error) {
      console.error("❌ Error in getAllClinics:", error);
    }
  };


  const createClinicHandler = async () => {
   router.push("/admin/createClinic");

  }


   const editClinicHandler = async (id: number) => {
   router.push(`/admin/editClienc/${id}`);
    
  }

   const deleteClinicHandler = async (id: number) => {
   try {
      const response = await deleteClinic(id);
      
      console.log("✅ Delete data:", response);
    } catch (error) {
      console.error("❌ Error in delete:", error);
    }

    
  }


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>

      <p>
        Bienvenido al panel de administración. Aquí puedes gestionar usuarios,
        roles y configuraciones del sistema.
      </p>

       {dataClinics.map((clinic) => (
        <div key={clinic.id} className="border p-4 my-2 rounded">
          <h2 className="text-xl font-semibold">{clinic.name}</h2>
          <p className="text-gray-600">{clinic.email}</p>
          <p className="text-gray-600">Teléfono: {clinic.telf}</p>
          <p className="text-gray-600">Doctores: {clinic.doctors.map((doctor) => doctor.name).join(', ')|| 'No hay doctores'}</p>
          <button onClick={() => {editClinicHandler(clinic.id)}}className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">editar</button> 
          <button  onClick={() => {deleteClinicHandler(clinic.id)}}className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">borrar</button> 

        </div>
       ))}
        <button onClick={() => {createClinicHandler()}}className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">crear</button> 


    </div>
  );
}
