'use client'

import {
  deleteDoctor,
  getAllDoctorsBYClinic
} from '@/services/api/doctorService'
import { doctors } from '@/services/types'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ClinicPage() {
  const router = useRouter()
  const [dataDoctors, setDataDoctors] = useState<doctors[]>([])
  const { data: session, status } = useSession()

  if (status === 'loading' || !session) return <p>Cargando o no autenticado</p>
  const backendToken = session.accessToken

  useEffect(() => {
    if (session) {
      doctorsAll()
    }
  }, [session])

  const doctorsAll = async () => {
    try {
      const response = await getAllDoctorsBYClinic(backendToken as string)

      // Validate that response is an array
      if (!Array.isArray(response)) {
        console.error('Invalid response from getAllDoctorsBYClinic:', response)
        setDataDoctors([])
        return
      }

      setDataDoctors(response)
      console.log('✅ Get data:', response)
    } catch (error) {
      console.error('❌ Error in getAllDoctors:', error)
      setDataDoctors([])
    }
  }

  const createDoctorHandler = async () => {
    router.push('/clinic/createDoctor')
  }

  const editDoctorHandler = async (id: number) => {
    router.push(`/clinic/editDoctor/${id}`)
  }

  const deleteDoctorHandler = async (id: number) => {
    try {
      const response = await deleteDoctor(id, backendToken as string)
      console.log('✅ Delete data:', response)
    } catch (error) {
      console.error('❌ Error in deleteDoctor:', error)
    }
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Panel de Administración</h1>
      <p>Bienvenido al panel de clicicas</p>

      {dataDoctors.map((doctor) => (
        <div key={doctor.id} className='border p-4 my-2 rounded'>
          <h2 className='text-xl font-semibold'>{doctor.name}</h2>
          <p className='text-gray-600'>{doctor.email}</p>
          <p className='text-gray-600'>Teléfono: {doctor.telf}</p>
          <p className='text-gray-600'>Especialidad: {doctor.specialty}</p>
          <p className='text-gray-600'>Horario: {doctor.hours}</p>
          <button
            onClick={() => {
              editDoctorHandler(doctor.id)
            }}
            className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            editar
          </button>
          <button
            onClick={() => {
              deleteDoctorHandler(doctor.id)
            }}
            className='mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
          >
            borrar
          </button>
        </div>
      ))}

      <button
        onClick={() => {
          createDoctorHandler()
        }}
        className='mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
      >
        crear
      </button>
    </div>
  )
}
