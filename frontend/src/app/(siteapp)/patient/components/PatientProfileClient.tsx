'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  updatePatientProfile,
  deletePatientAccount
} from '@/services/api/patientService'

export default function PatientProfileClient({
  profile,
  patientId,
  accessToken
}: {
  profile: any
  patientId: number
  accessToken: string
}) {
  const router = useRouter()
  const personal = profile.personalData
  const observations = profile.observations || []

  const [formData, setFormData] = useState(personal)
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setMessage(null)
      await updatePatientProfile(patientId, formData, accessToken)
      setMessage('✅ Datos actualizados correctamente.')
      setIsEditing(false)
    } catch (err) {
      console.error(err)
      setMessage('❌ Error al actualizar los datos.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (
      !confirm(
        '⚠️ ¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.'
      )
    )
      return
    try {
      setLoading(true)
      await deletePatientAccount(patientId, accessToken)
      alert('Tu cuenta ha sido eliminada.')
      router.push('/')
    } catch (err) {
      console.error(err)
      alert('Error al eliminar la cuenta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Tu ficha médica</h1>
        <button
          onClick={() => router.push('/patient')}
          className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm'
        >
          ← Volver al panel principal
        </button>
      </div>

      {message && <p className='mb-4 text-sm text-emerald-700'>{message}</p>}

      {/* Datos personales */}
      <section className='bg-white shadow rounded-xl p-6 mb-8'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>Datos personales</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className='text-sm text-emerald-600 hover:underline'
          >
            {isEditing ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm'>
          {[
            { label: 'Nombre', name: 'name_given' },
            { label: 'Apellidos', name: 'name_family' },
            { label: 'Email', name: 'email' },
            { label: 'Género', name: 'gender' },
            { label: 'Fecha de nacimiento', name: 'birth_date' },
            { label: 'Dirección', name: 'address' },
            { label: 'Estado civil', name: 'marital_status' },
            { label: 'NIF, ID', name: 'identifier' }
          ].map(({ label, name }) => (
            <div key={name}>
              <p className='text-gray-500 text-xs uppercase tracking-wider'>
                {label}
              </p>
              {isEditing ? (
                <input
                  name={name}
                  value={formData[name] || ''}
                  onChange={handleChange}
                  className='border rounded px-2 py-1 w-full text-sm'
                />
              ) : (
                <p className='text-gray-900 font-medium'>
                  {formData[name] || '—'}
                </p>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className='mt-6 flex justify-end gap-3'>
            <button
              onClick={handleSave}
              disabled={loading}
              className='px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm'
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        )}
      </section>

      {/* Observaciones */}
      <section className='bg-white shadow rounded-xl p-6 mb-8'>
        <h2 className='text-lg font-semibold mb-4'>Observaciones médicas</h2>
        {observations.length === 0 ? (
          <p className='text-gray-500'>No hay observaciones registradas.</p>
        ) : (
          <table className='min-w-full text-sm border border-gray-200 rounded-lg'>
            <thead className='bg-gray-50 text-gray-700 text-left'>
              <tr>
                <th className='px-4 py-2 border-b'>Fecha</th>
                <th className='px-4 py-2 border-b'>Categoría</th>
                <th className='px-4 py-2 border-b'>Código</th>
                <th className='px-4 py-2 border-b'>Valor</th>
                <th className='px-4 py-2 border-b'>Unidad</th>
                <th className='px-4 py-2 border-b'>Médico</th>
              </tr>
            </thead>
            <tbody>
              {observations.map((obs: any) => (
                <tr key={obs.id} className='border-b hover:bg-gray-50'>
                  <td className='px-4 py-2'>{obs.date}</td>
                  <td className='px-4 py-2'>{obs.category}</td>
                  <td className='px-4 py-2'>{obs.code}</td>
                  <td className='px-4 py-2'>{obs.value}</td>
                  <td className='px-4 py-2'>{obs.unit || '—'}</td>
                  <td className='px-4 py-2'>{obs.doctor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <div className='flex justify-end'>
        <button
          onClick={handleDelete}
          disabled={loading}
          className='px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700'
        >
          {loading ? 'Eliminando...' : 'Darse de baja'}
        </button>
      </div>
    </div>
  )
}
