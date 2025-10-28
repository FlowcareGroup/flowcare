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
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>
        Panel de Administración de Clínica
      </h1>
      <p className='text-lg mb-8'>
        Bienvenido. Aquí puedes gestionar los doctores de tu clínica.
      </p>

      {dataDoctors.map((doctor) => (
        <div key={doctor.id} className='card'>
          <h2 className='text-lg font-semibold text-dark mb-3'>
            {doctor.name}
          </h2>
          <div className='space-y-1 text-text-secondary mb-4'>
            <p>
              <span className='font-medium text-dark'>Email:</span>{' '}
              {doctor.email}
            </p>
            <p>
              <span className='font-medium text-dark'>Teléfono:</span>{' '}
              {doctor.telf}
            </p>
            <p>
              <span className='font-medium text-dark'>Especialidad:</span>{' '}
              {doctor.specialty}
            </p>
            <p>
              <span className='font-medium text-dark'>Horario:</span>{' '}
              {doctor.hours}
            </p>
          </div>
          <div className='flex gap-3'>
            <button
              onClick={() => {
                editDoctorHandler(doctor.id)
              }}
              className='btn-primary'
            >
              Editar
            </button>
            <button
              onClick={() => {
                deleteDoctorHandler(doctor.id)
              }}
              className='btn-error'
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={() => {
          createDoctorHandler()
        }}
        className='btn-success mt-6'
      >
        Crear Doctor
      </button>
    </div>
  )
}
