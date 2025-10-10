// src/app/(auth)/auth/login/page.tsx
"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginSchema } from "@/app/lib/validations_schema"
import { signIn } from "next-auth/react"
import { SingInGoogle } from "./components/SingInGoogle"
import { useState } from "react"

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true)
    
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: "/patient",
      redirect: false,
    })

    setIsLoading(false)

    if (result?.error) {
      console.error("❌ Error de login:", result.error)
      // TODO: Mostrar mensaje de error al usuario
      alert("Credenciales incorrectas. Intenta de nuevo.")
    } else {
      console.log("✅ Login exitoso, redirigiendo...")
      window.location.href = "/patient"
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
      
      <SingInGoogle />
      
      <div className="my-4 text-center text-gray-500">o</div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            placeholder="prueva@preuva.com"
            className={`border p-2 w-full rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            placeholder="••••••••"
            className={`border p-2 w-full rounded ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button 
          type="submit"
          disabled={isLoading || isSubmitting}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 w-full rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>

      {/* Solo para desarrollo - ELIMINAR en producción */}
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-800">
          <strong>Credenciales de prueba:</strong><br/>
          Email: prueva@preuva.com<br/>
          Password: password
        </p>
      </div>
    </div>
  )
}