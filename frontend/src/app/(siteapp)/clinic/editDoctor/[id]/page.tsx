"use client";
import { doctorEditSchema , type DoctorEditSchema } from "@/app/lib/validations_schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Resolver } from "react-hook-form";
import { useSession } from "next-auth/react";
import { editDoctor, getDoctorByIdClinic } from "@/services/api/doctorService";

export default function editDoctorPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<DoctorEditSchema>({
    resolver: zodResolver(doctorEditSchema) as unknown as Resolver<DoctorEditSchema>,
  });
  
  const router = useRouter();
  const { data: session, status } = useSession();
   // if (status === "loading" || !session) return <p>Cargando o no autenticado</p>;
  //const backendToken = session.accessToken;
  const backendToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJTYW5qdWFuQGdtYWlsLmNvbSIsInJvbGUiOiJjbGluaWMiLCJpYXQiOjE3NjExMTk4MzB9.bWBuoyQ9osVkCb7Rm0cdBX6n6KNiSMsET7qHrw6uksI"

  const params = useParams();
  const id = Number(params.id);

  useEffect(() => {
    DoctorById(id);
  }, [id, reset]);

  const DoctorById = async (id: number) => {
    try {
        const response = await getDoctorByIdClinic(id,backendToken);
        console.log("✅ Doctor obtenido:", response);
        const formattedResponse = {
      ...response,
      hours: response.hours
        ? new Date(response.hours).toISOString().split("T")[0]
        : ""
    };

    reset(formattedResponse);
    } catch (error) {
      console.error("❌ Error al obtener doctor:", error);
    }
  };

  const onSubmit = async (data: DoctorEditSchema ) => {
    try {
      const response = await editDoctor(id,data ,backendToken);
      console.log("✅ Doctor editado:", response);
      router.push("/clinic");
    } catch (error) {
      console.error("❌ Error al editar doctor:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Doctor</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <input
          type="text"
          placeholder="Nombre"
          {...register("name")}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input
          type="text"
          placeholder="specialty"
          {...register("specialty")}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {errors.specialty && (
          <p className="text-red-500">{errors.specialty.message}</p>
        )}

        <input
          type="date"
          placeholder="hours"
          {...register("hours")}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {errors.hours && (
          <p className="text-red-500">{errors.hours.message}</p>
        )}
        <input
          type="number"
          placeholder="Telf"
          {...register("telf")}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {errors.telf && <p className="text-red-500">{errors.telf.message}</p>}

        <input
          type="password"
          placeholder="Nueva Contraseña (opcional)"
          {...register("password")}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 w-full rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Editar Doctor
        </button>
      </form>
    </div>
  );
}
