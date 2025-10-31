'use client'

import { useRouter } from 'next/navigation'

export default function ClientNavigation() {
  const router = useRouter()

  return (
    <button onClick={() => router.push('/ChatVideo')} className="btn-primary mt-4 font-bold py-2 px-4 rounded">
      Ir al video chat
    </button>
  )
}