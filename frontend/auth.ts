import { loginSchema } from "@/app/lib/validations_schema";
import { getOrCreateUser, login } from "@/services/api/authServices";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        console.log("🔐 Credenciales recibidas:", credentials);
        
        try {
          const validateCredentials = loginSchema.safeParse(credentials);
          if (!validateCredentials.success) {
            console.log("❌ Validación Zod fallida:", validateCredentials.error.format());
            return null;
          }

          const { email, password } = validateCredentials.data;
          console.log("✅ Validación Zod exitosa:", { email, password: "***" });

          const loginResult = await login({ email, password });
          console.log("📡 Resultado completo del login:", loginResult);
          
          if (loginResult.error || !loginResult.user) {
            console.log("❌ Error en login:", loginResult.error);
            return null;
          }

          console.log("✅ Usuario autenticado:", loginResult.user);
          
          // Retornar el usuario con el token de acceso si está disponible
          return {
            ...loginResult.user,
            accessToken: loginResult.accessToken // Incluir el token si existe
          };
          
        } catch (error) {
          console.error("💥 Error inesperado en authorize:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      console.log("🔄 JWT callback - Trigger:", trigger);
      console.log("🔄 JWT callback - User:", user);
      console.log("🔄 JWT callback - Token existente:", token);
      
      // Cuando el usuario inicia sesión (primera vez)
      if (user) {
        // Para login con Google
        if (account?.provider === "google") {
          try {
            const result = await getOrCreateUser(user.email!, user.name || "");
            if (result.user) {
              token.id = result.user.id;
              token.role = result.user.role;
              token.name = result.user.name;
              token.email = result.user.email;
            }
          } catch (error) {
            console.error("Error en jwt callback con Google:", error);
            token.role = token.role || "patient";
          }
        }
        
        // Para login con credentials
        if (account?.provider === "credentials") {
          token.id = user.id;
          token.role = user.role;
          token.name = user.name;
          token.email = user.email;
          
          // Incluir el token de acceso si está disponible
          if ((user as any).accessToken) {
            token.accessToken = (user as any).accessToken;
          }
        }
      }
      
      console.log("🔄 JWT callback - Token final:", token);
      return token;
    },

    async session({ session, token }) {
      console.log("🎯 Session callback - Token:", token);
      console.log("🎯 Session callback - Session inicial:", session);
      
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as string,
        };
        
        // Incluir el token de acceso en la sesión si está disponible
        if (token.accessToken) {
          (session as any).accessToken = token.accessToken;
        }
      }
      
      console.log("🎯 Session callback - Session final:", session);
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development", // Activar debug en desarrollo
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
    accessToken?: string; // Token de acceso opcional
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    accessToken?: string; // Token de acceso opcional
  }
}