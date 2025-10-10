export { auth as middleware } from "./auth"

// Configuración para evitar que el middleware se ejecute en rutas de auth
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /login, /signUp (rutas de autenticación)
     * - /_next/* (archivos estáticos de Next.js)
     * - /api/auth/* (endpoints de Auth.js)
     * - /*.* (archivos estáticos: favicon.ico, etc.)
     */
    "/((?!login|signUp|_next/static|_next/image|api/auth|favicon.ico|.*\\..*).+)",
  ],
}