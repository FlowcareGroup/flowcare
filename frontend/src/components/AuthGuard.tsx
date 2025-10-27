'use client'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    console.log('🛡️ AuthGuard ejecutándose')
    console.log('🛡️ Status:', status)
    console.log('🛡️ Session:', session)
    console.log('🛡️ Pathname:', pathname)

    if (status === 'loading') return

    const isLoggedIn = !!session
    const userRole = session?.user?.role

    console.log('🛡️ Usuario logueado:', isLoggedIn)
    console.log('🛡️ Rol:', userRole)

    // Rutas públicas
    const publicPaths = ['/auth/login', '/auth/signUp', '/', '/home']
    const isPublicPath = publicPaths.includes(pathname)

    console.log('🛡️ Es ruta pública:', isPublicPath)

    // Si no está logueado y trata de acceder a ruta protegida
    if (!isLoggedIn && !isPublicPath) {
      console.log('🚫 Redirecting to login - not authenticated')
      router.push('/auth/login')
      return
    }

    // Si está logueado y trata de acceder a login/signup
    if (
      isLoggedIn &&
      (pathname === '/auth/login' || pathname === '/auth/signUp')
    ) {
      console.log('✅ Redirecting authenticated user based on role')
      const redirectPath = getRoleBasedRoute(userRole)
      router.push(redirectPath)
      return
    }

    // Control de acceso por roles
    if (isLoggedIn && !isPublicPath) {
      const hasAccess = checkRoleAccess(pathname, userRole)
      console.log('🛡️ Has access:', hasAccess)

      if (!hasAccess) {
        console.log('🚫 Access denied, redirecting to role route')
        const redirectPath = getRoleBasedRoute(userRole)
        router.push(redirectPath)
        return
      }
    }
  }, [session, status, pathname, router])

  // Mostrar loading mientras se verifica la sesión
  if (status === 'loading') {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-lg'>Cargando...</div>
      </div>
    )
  }

  return <>{children}</>
}

function getRoleBasedRoute(role: string | undefined): string {
  switch (role) {
    case 'patient':
      return '/patient'
    case 'doctor':
      return '/patient' // Hasta que exista /doctor
    case 'admin':
      return '/admin'
    case 'clinic':
      return '/clinic' // Hasta que exista /center
    default:
      return '/patient'
  }
}

function checkRoleAccess(pathname: string, role: string | undefined): boolean {
  if (!role) return false

  const roleAccess = {
    patient: ['/patient', '/home'],
    doctor: ['/doctor', '/doctor/patient/[id]', '/home'],
    admin: ['/admin', '/home'],
    clinic: ['/clinic', '/home', '/clinic/createDoctor', '/clinic/editDoctor/[id]'],
  }

  const allowedPaths = roleAccess[role as keyof typeof roleAccess] || []
  return allowedPaths.some(
    (allowedPath) =>
      pathname.startsWith(allowedPath) || pathname === allowedPath
  )
}
