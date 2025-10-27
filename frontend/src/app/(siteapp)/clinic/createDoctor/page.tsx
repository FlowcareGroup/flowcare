'use client'
import { doctorSchema, type DoctorSchema } from '@/app/lib/validations_schema'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { createDoctor } from '@/services/api/doctorService'

export default function createDoctorPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<DoctorSchema>({
    resolver: zodResolver(doctorSchema)
  })
  const router = useRouter()
  const { data: session, status } = useSession()
  if (status === 'loading' || !session) return <p>Cargando o no autenticado</p>
  const backendToken = (session as any).accessToken || ''

  const onSubmit = async (data: DoctorSchema) => {
    try {
      const response = await createDoctor(data, backendToken)
      console.log('✅ Doctor creado:', response)
      router.push('/clinic')
    } catch (error) {
      console.error('❌ Error al crear doctor:', error)
    }
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Crear Nuevo Doctor</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 max-w-lg'>
        <input
          type='text'
          placeholder='Nombre'
          {...register('name')}
          className='w-full p-2 border border-gray-300 rounded'
        />
        {errors.name && <p className='text-red-500'>{errors.name.message}</p>}

        <input
          type='email'
          placeholder='Email'
          {...register('email')}
          className='w-full p-2 border border-gray-300 rounded'
        />
        {errors.email && <p className='text-red-500'>{errors.email.message}</p>}

        <input
          type='text'
          placeholder='specialty'
          {...register('specialty')}
          className='w-full p-2 border border-gray-300 rounded'
        />
        {errors.specialty && (
          <p className='text-red-500'>{errors.specialty.message}</p>
        )}

        <input
          type='date'
          placeholder='hours'
          {...register('hours')}
          className='w-full p-2 border border-gray-300 rounded'
        />
        {errors.hours && <p className='text-red-500'>{errors.hours.message}</p>}
        <input
          type='number'
          placeholder='Telf'
          {...register('telf')}
          className='w-full p-2 border border-gray-300 rounded'
        />
        {errors.telf && <p className='text-red-500'>{errors.telf.message}</p>}

        <input
          type='password'
          placeholder='Contraseña'
          {...register('password')}
          className='w-full p-2 border border-gray-300 rounded'
        />
        {errors.password && (
          <p className='text-red-500'>{errors.password.message}</p>
        )}

        <button
          type='submit'
          disabled={isSubmitting}
          className='bg-blue-500 hover:bg-blue-600 text-white p-2 w-full rounded disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Crear Doctor
        </button>
      </form>
    </div>
  )
}
