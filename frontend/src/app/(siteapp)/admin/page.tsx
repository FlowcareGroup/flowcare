"use client";
import { deleteClinic, getAllClinics } from "@/services/api/clinicsServices";
import { clinics } from "@/services/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function AdminPage() {
  const router = useRouter();
  const [dataClinics, setdataClinics] = useState<clinics[]>([]);
  const { data: session } = useSession();
  useEffect(() => {
    console.log("dataClinics", dataClinics);
  }, [dataClinics]);

  useEffect(() => {
    if (session) {
      clinicsAll();
    }
  }, [session]);

  const clinicsAll = async () => {
    try {
      const accessToken = (session as any)?.accessToken;
      if (!accessToken) {
        console.warn("No access token available");
        setdataClinics([]);
        return;
      }
      const response = await getAllClinics(accessToken as string);

      // Validar que la respuesta es un array
      if (!Array.isArray(response)) {
        console.error("Invalid response from getAllClinics:", response);
        setdataClinics([]);
        return;
      }

      setdataClinics(response);
      console.log("✅ Get data:", response);
    } catch (error) {
      console.error("❌ Error in getAllClinics:", error);
      setdataClinics([]);
    }
  };

  const createClinicHandler = async () => {
    router.push("/admin/createClinic");
  };

  const editClinicHandler = async (id: number) => {
    router.push(`/admin/editClienc/${id}`);
  };

  const deleteClinicHandler = async (id: number) => {
    try {
      const response = await deleteClinic(id, (session as any).accessToken);
      console.log("✅ Delete data:", response);
    } catch (error) {
      console.error("❌ Error in delete:", error);
    }
  };

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>
        Bienvenido al Panel de Administración
      </h1>

      <p className='text-lg mb-8'>
        Aquí puedes gestionar clínicas, doctores y configuraciones del sistema.
      </p>

      {dataClinics.map((clinic) => (
        <div
          key={clinic.id}
          className='card'
        >
          <h2 className='text-lg font-semibold text-dark mb-3'>{clinic.name}</h2>
          <div className='space-y-1 text-text-secondary mb-4'>
            <p><span className='font-medium text-dark'>Email:</span> {clinic.email}</p>
            <p><span className='font-medium text-dark'>Teléfono:</span> {clinic.telf}</p>
            <p><span className='font-medium text-dark'>Doctores:</span> {clinic.doctors.map((doctor) => doctor.name).join(", ") || "No hay doctores"}</p>
          </div>
          <div className='flex gap-3'>
            <button
              onClick={() => {
                editClinicHandler(clinic.id);
              }}
              className='btn-primary'
            >
              Editar
            </button>
            <button
              onClick={() => {
                deleteClinicHandler(clinic.id);
              }}
              className='btn-error'
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() => {
          createClinicHandler();
        }}
        className='btn-success mt-6'
      >
        Crear Clínica
      </button>
    </div>
  );
}
