// src/app/(auth)/auth/login/page.tsx
import { signIn } from "../../../../../auth";
import { SingInGoogle } from "./components/SingInGoogle";

export default function Login() {
  return (
    <div className="p-8">
      <h1>Iniciar Sesión</h1>
      <SingInGoogle />
      
      {/* Separador */}
      <div className="my-4 text-center">o</div>
      
      <form
        action={async (formData) => {
          "use server";
          await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirectTo: "/patient", // Redirige a home (cambia a /dashboard cuando lo crees)
          });
          // ⚠️ Este código nunca se ejecuta si el login es exitoso
        }}
      >
        <div>
          <input
            type="email"
            name="email"
            required
            placeholder="prueva@preuva.com"
            className="border p-2 mb-2 w-full"
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            required
            placeholder="password"
            className="border p-2 mb-2 w-full"
          />
        </div>
        <button 
          type="submit"
          className="bg-blue-500 text-white p-2 w-full"
        >
          Login con Credenciales
        </button>
      </form>

      {/* Mensaje de ayuda */}
      <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400">
        <p className="text-sm">
          <strong>Credenciales de prueba:</strong><br/>
          Email: prueva@preuva.com<br/>
          Password: password
        </p>
      </div>
    </div>
  );
}