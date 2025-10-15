import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Log directo en el terminal (lado del servidor)
  console.log('🚨🚨🚨 MIDDLEWARE SERVER LOG:', path)
  
  // Intentar log en el cliente también
  if (typeof window !== 'undefined') {
    console.log('🚨🚨🚨 MIDDLEWARE CLIENT LOG:', path)
  }
  
  // Para debug, agregar header personalizado
  const response = NextResponse.next()
  response.headers.set('x-middleware-executed', 'true')
  response.headers.set('x-middleware-path', path)
  
  return response
}

export const config = {
  matcher: [
    // Incluir TODAS las rutas
    '/(.*)',
  ],
}
