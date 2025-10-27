"use client";
import { clinicSchema, type ClinicSchema } from "@/app/lib/validations_schema";
import {
  createClinic,
  deleteClinic,
  getAllClinics,
} from "@/services/api/clinicsServices";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function createClinicPage() {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClinicSchema>({
    resolver: zodResolver(clinicSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: ClinicSchema) => {
    try {
      const response = await createClinic(data, (session as any).accessToken);
      console.log("✅ Clínica creada:", response);
      router.push("/admin");
    } catch (error) {
      console.error("❌ Error al crear clínica:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Crear Nueva Clínica</h1>
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
          placeholder="Contraseña"
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
          Crear Clínica
        </button>
      </form>
    </div>
  );
}
