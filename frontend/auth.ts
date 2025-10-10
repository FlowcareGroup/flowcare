import { loginSchema } from "@/app/lib/validations_schema";
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
        // Aquí harás el fetch a tu backend
        // const res = await fetch("http://tu-backend/api/auth/login", {...})

        // Por ahora, validación hardcoded
        if (email === "prueva@preuva.com" && password === "password") {
          return {
            id: "1",
            name: "John Doe",
            email: "prueva@preuva.com",
          };
        }

        return null;
      },
    }),
  ],
  // ⚠️ AGREGAR ESTAS CONFIGURACIONES ESENCIALES
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login", // Para mostrar errores
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnAuthPage = request.nextUrl.pathname.startsWith('/auth');
      
      // Permitir acceso a páginas de auth sin login
      if (isOnAuthPage) {
        return true;
      }
      
      // Proteger otras rutas
      if (!isLoggedIn) {
        return Response.redirect(new URL('/auth/login', request.nextUrl));
      }
      
      return true;
    },
  },
});
