export { auth as middleware } from "./auth"
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const { pathname } = req.nextUrl;

  console.log("🔍 Middleware - Ruta:", pathname);
  console.log("🔍 Middleware - Usuario autenticado:", isLoggedIn);
  console.log("🔍 Middleware - User data:", req.auth?.user);

  // Rutas públicas que no requieren autenticación
  const publicPaths = ["/auth/login", "/auth/signup", "/"];
  const isPublicPath = publicPaths.includes(pathname);

  // Si no está logueado y trata de acceder a una ruta protegida
  if (!isLoggedIn && !isPublicPath) {
    console.log("🚫 Acceso denegado - Redirigiendo a login");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Si está logueado y trata de acceder a login/signup
  if (isLoggedIn && (pathname === "/auth/login" || pathname === "/auth/signup")) {
    console.log("✅ Usuario logueado - Redirigiendo a dashboard");
    return NextResponse.redirect(new URL("/patient/dashboard", req.url));
  }

  return NextResponse.next();
});


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