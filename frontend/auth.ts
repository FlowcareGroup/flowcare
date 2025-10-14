import { loginSchema } from "@/app/lib/validations_schema";
import { getOrCreateUser, login } from "@/services/api/authServices";
import { get } from "http";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        console.log("🔐 Credenciales recibidas:", credentials);
        const validateCredentials = loginSchema.safeParse(credentials);
        if (!validateCredentials.success) {
          console.log("❌ Validación Zod fallida:", validateCredentials.error);
          return null;
        }

        const { email, password } = validateCredentials.data;
        console.log("✅ Validación Zod exitosa:", validateCredentials.data);

        const loginResult = await login({ email, password });
        if (loginResult.error || !loginResult.user) {
          console.log("❌ Error en login:", loginResult.error);
          return null;
        }
        console.log("✅ Usuario autenticado:", loginResult.user);
        return loginResult.user;

        // if (email === "prueva@preuva.com" && password === "password") {
        //   console.log("✅ Credenciales correctas, creando sesión...");
        //   return {
        //     id: "1",
        //     name: "John Doe",
        //     email: "prueva@preuva.com",
        //   };
        // }

        console.log("❌ Credenciales incorrectas");

        return null;
      },
    }),
  ],
  // ⚠️ AGREGAR ESTAS CONFIGURACIONES ESENCIALES
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login", // Para mostrar errores
  },
  callbacks: {
  async jwt({ token, user }) {
    if (user && user.email) {
      try {
        // Usar tu servicio existente
        const result = await getOrCreateUser(user.email, user.name || "");
        
        if (result.error || !result.user) {
          throw new Error(result.error || "Usuario no encontrado/creado");
        }

        // Actualizar token con datos del usuario de la base de datos
        token.id = result.user.id;
        token.role = result.user.role;
        token.name = result.user.name;
        token.email = result.user.email;
        
      } catch (error) {
        console.error("Error en jwt callback:", error);
        // Valores por defecto en caso de error
        token.role = token.role || "patient";
        token.id = token.id || user.id;
      }
    }
    return token;
  },

  async session({ session, token }) {
    if (token) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.role = token.role as string;
    }
    return session;
  },
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnLoginPage = request.nextUrl.pathname === "/login";
      const isOnSignUpPage = request.nextUrl.pathname === "/signUp";

      // Permitir acceso a páginas de auth sin login
      if (isOnLoginPage || isOnSignUpPage) {
        return true;
      }

      // Proteger otras rutas
      if (!isLoggedIn) {
        return Response.redirect(new URL("/login", request.nextUrl));
      }

      return true;
    },
  },
});

// Tipos personalizados para NextAuth
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    } & DefaultSession["user"];
  }
}
