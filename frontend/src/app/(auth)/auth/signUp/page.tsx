"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpSchema } from "@/app/lib/validations_schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/services/api/authServices";
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
      const response = await signUp(data);

      console.log("✅ Registro exitoso, datos:", response);
      setIsLoading(false);
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
    <div className='p-4 md:p-8 w-full'>
      <p className='text-base md:text-lg text-gray-600 mb-4 text-center'>
        Completa el formulario para registrarte en FlowCare
      </p>

      {serverError && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
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
            htmlFor='name_given'
            className='block text-sm font-medium mb-2'
          >
            Nombre y Apellidos
          </label>
          <input
            id='name_given'
            type='text'
            {...register("name_given")}
            placeholder='Juan'
            className={`border p-3 w-full rounded-lg text-sm md:text-base ${
              errors.name_given ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
            disabled={isLoading}
          />
          {errors.name_given && (
            <p className='text-red-500 text-sm mt-1'>{errors.name_given.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium mb-2'
          >
            Correo Electrónico
          </label>
          <input
            id='email'
            type='email'
            {...register("email")}
            placeholder='juan.perez@ejemplo.com'
            className={`border p-3 w-full rounded-lg text-sm md:text-base ${
              errors.email ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
            disabled={isLoading}
          />
          {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
        </div>

        {/* Contraseña */}
        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium mb-2'
          >
            Contraseña
          </label>
          <input
            id='password'
            type='password'
            {...register("password")}
            placeholder='••••••••'
            className={`border p-3 w-full rounded-lg text-sm md:text-base ${
              errors.password ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
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
            className='block text-sm font-medium mb-2'
          >
            Confirmar Contraseña
          </label>
          <input
            id='confirmPassword'
            type='password'
            {...register("confirmPassword")}
            placeholder='••••••••'
            className={`border p-3 w-full rounded-lg text-sm md:text-base ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
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
          className='bg-blue-500 hover:bg-blue-600 text-white p-3 w-full rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors text-sm md:text-base'
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
            className='text-blue-500 hover:text-blue-600 font-medium transition-colors'
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
