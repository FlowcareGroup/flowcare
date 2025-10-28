// src/app/(auth)/auth/login/page.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/app/lib/validations_schema";
import { signIn } from "next-auth/react";
import { SingInGoogle } from "./components/SingInGoogle";
import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      console.error("❌ Error de login:", result.error);
      // TODO: Mostrar mensaje de error al usuario
      alert("Credenciales incorrectas. Intenta de nuevo.");
    } else {
      console.log("✅ Login exitoso, redirigiendo...");
    }
  };

  return (
    <div className='p-4 md:p-8 bg-white w-full'>
      <p className='text-base md:text-lg font-normal mb-6 text-center'>
        Utiliza los datos aportados por tu centro de salud para entrar en FlowCare
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-4'
      >
        <div className='w-full'>
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
            placeholder='prueva@preuva.com'
            className={`border p-3 w-full rounded-lg text-sm md:text-base ${
              errors.email ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
            disabled={isLoading}
          />
          {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
        </div>

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
        </div>

        <button
          type='submit'
          disabled={isLoading || isSubmitting}
          className='bg-blue-500 hover:bg-blue-600 text-white p-3 w-full rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors text-sm md:text-base'
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>
      <div className='my-6 text-center text-gray-500 flex w-full items-center gap-2'>
        <hr className='grow border-gray-300' />
        <span className='text-sm'>o</span>
        <hr className='grow border-gray-300' />
      </div>
      <SingInGoogle />

      {/* Link a Registro */}
      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-600'>
          ¿No tienes una cuenta?{" "}
          <Link
            href='/auth/signUp'
            className='text-blue-500 hover:text-blue-600 font-medium transition-colors'
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
