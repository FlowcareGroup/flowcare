import { loginSchema } from "@/app/lib/validations_schema";
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
 credentials: {
  email: {  },
  password: {  },
 },
 authorize: async ( credentials ) => {
    const validateCredentials = loginSchema.safeParse(credentials);
    if (!validateCredentials.success) {
      return null;
    }
    
    const { email, password } = validateCredentials.data;
    
    // Aquí harás el fetch a tu backend
    // const res = await fetch("http://tu-backend/api/auth/login", {...})
    
    // Por ahora, validación hardcoded
    if (email === "prueva@preuva.com" && password === "password") {
      return {
        id: "1",
        name: "John Doe",
        email: "prueva@preuva.com",
      }
    }
    
    return null;
},     
    })
  ],
})