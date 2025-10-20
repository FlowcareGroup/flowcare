"use client";
import { clinicEditSchema , type ClinicEditSchema} from "@/app/lib/validations_schema";
import {
  editClinic,
  getClinicById,
} from "@/services/api/clinicsServices";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Resolver } from "react-hook-form";

export default function editClinicPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ClinicEditSchema>({
    // Cast resolver to the react-hook-form Resolver type to avoid subtle optional/required
    // discrepancy between Zod-inferred and RHF generic shapes.
    resolver: zodResolver(clinicEditSchema) as unknown as Resolver<ClinicEditSchema>,
  });
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  


  useEffect(() => {
    ClinicById(id);
  }, [id,reset]);

  const ClinicById = async (id: number) => {

    try {

        const response = await getClinicById(id);
        console.log("✅ Clínica obtenida:", response);
        reset(response);

    }catch (error) {
      console.error("❌ Error al obtener clínica:", error);
    }
  };



  const onSubmit = async (data: ClinicEditSchema) => {
    try {
      const response = await editClinic(data ,id);
      console.log("✅ Clínica editada:", response);
      router.push("/admin");
    } catch (error) {
      console.error("❌ Error al crear clínica:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">editar Clínica</h1>
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
          placeholder="NIF"
          {...register("NIF")}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {errors.NIF && <p className="text-red-500">{errors.NIF.message}</p>}

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
          Editar Clínica
        </button>
      </form>
    </div>
  );
}
