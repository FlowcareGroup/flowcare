'use client'

import { useRouter } from 'next/navigation'

export default function ClientNavigation() {
  const router = useRouter()

  return (
    <button onClick={() => router.push('/ChatVideo')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
      Ir al video chat
    </button>
  )
}