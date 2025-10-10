"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpSchema } from "@/app/lib/validations_schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpSchema) => {
    setIsLoading(true);
    setServerError(null);

    try {
      // TODO: Aquí harás el fetch a tu backend
      // const response = await fetch("http://localhost:4000/api/auth/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     firstName: data.firstName,
      //     lastName: data.lastName,
      //     email: data.email,
      //     password: data.password,
      //   }),
      // })

      // if (!response.ok) {
      //   const error = await response.json()
      //   throw new Error(error.message || "Error al registrar usuario")
      // }

      // Por ahora, simulamos registro exitoso
      console.log("📝 Datos de registro:", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });

      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("¡Registro exitoso! Redirigiendo al login...");
      router.push("/auth/login");
    } catch (error) {
      console.error("❌ Error en registro:", error);
      setServerError(
        error instanceof Error ? error.message : "Error al crear la cuenta. Intenta de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='p-8 w-full max-w-md'>
      <h1 className='text-2xl font-bold mb-2'>Crear Cuenta</h1>
      <p className='text-gray-600 mb-6'>Completa el formulario para registrarte en FlowCare</p>

      {serverError && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm'>
          {serverError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-4'
      >
        {/* Nombre */}
        <div>
          <label
            htmlFor='firstName'
            className='block text-sm font-medium mb-1'
          >
            Nombre
          </label>
          <input
            id='firstName'
            type='text'
            {...register("firstName")}
            placeholder='Juan'
            className={`border p-2 w-full rounded ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          />
          {errors.firstName && (
            <p className='text-red-500 text-sm mt-1'>{errors.firstName.message}</p>
          )}
        </div>

        {/* Apellido */}
        <div>
          <label
            htmlFor='lastName'
            className='block text-sm font-medium mb-1'
          >
            Apellido
          </label>
          <input
            id='lastName'
            type='text'
            {...register("lastName")}
            placeholder='Pérez'
            className={`border p-2 w-full rounded ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          />
          {errors.lastName && (
            <p className='text-red-500 text-sm mt-1'>{errors.lastName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium mb-1'
          >
            Correo Electrónico
          </label>
          <input
            id='email'
            type='email'
            {...register("email")}
            placeholder='juan.perez@ejemplo.com'
            className={`border p-2 w-full rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          />
          {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
        </div>

        {/* Contraseña */}
        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium mb-1'
          >
            Contraseña
          </label>
          <input
            id='password'
            type='password'
            {...register("password")}
            placeholder='••••••••'
            className={`border p-2 w-full rounded ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          />
          {errors.password && (
            <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>
          )}
          <p className='text-xs text-gray-500 mt-1'>
            Mínimo 8 caracteres, incluye mayúsculas, minúsculas y números
          </p>
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label
            htmlFor='confirmPassword'
            className='block text-sm font-medium mb-1'
          >
            Confirmar Contraseña
          </label>
          <input
            id='confirmPassword'
            type='password'
            {...register("confirmPassword")}
            placeholder='••••••••'
            className={`border p-2 w-full rounded ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className='text-red-500 text-sm mt-1'>{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Botón Submit */}
        <button
          type='submit'
          disabled={isLoading || isSubmitting}
          className='bg-blue-500 hover:bg-blue-600 text-white p-2 w-full rounded disabled:opacity-50 disabled:cursor-not-allowed font-medium'
        >
          {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
        </button>
      </form>

      {/* Link a Login */}
      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-600'>
          ¿Ya tienes una cuenta?{" "}
          <Link
            href='/auth/login'
            className='text-blue-500 hover:text-blue-600 font-medium'
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>

      {/* Nota de desarrollo */}
      <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded'>
        <p className='text-xs text-blue-800'>
          <strong>Nota de desarrollo:</strong>
          <br />
          El registro aún no está conectado al backend. Los datos se mostrarán en consola y
          redirigirá al login.
        </p>
      </div>
    </div>
  );
}
