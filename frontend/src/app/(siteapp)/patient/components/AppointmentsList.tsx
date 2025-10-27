'use client'

import { useState } from 'react'
import {
  cancelAppointment,
  updateAppointmentTime
} from '@/services/api/doctorService'

interface Appointment {
  id: number
  date: string
  time: string
  endTime: string
  status: string
  doctor: string
  service_type: string
  description: string
}

interface Props {
  appointments: Appointment[]
  accessToken: string
  onRefresh: () => void // callback para actualizar la lista tras editar o cancelar
}

export default function AppointmentList({
  appointments,
  accessToken,
  onRefresh
}: Props) {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleCancel = async (appointmentId: number) => {
    if (!confirm('¿Seguro que deseas cancelar esta cita?')) return
    setLoading(true)
    try {
      await cancelAppointment(appointmentId, accessToken)
      setMessage('Cita cancelada correctamente')
      onRefresh()
    } catch (err: any) {
      setMessage(err.message || 'Error al cancelar la cita')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTime = async (
    appointmentId: number,
    newStart: string,
    newEnd: string
  ) => {
    setLoading(true)
    try {
      await updateAppointmentTime(appointmentId, newStart, newEnd, accessToken)
      setMessage('Cita actualizada correctamente')
      onRefresh()
    } catch (err: any) {
      setMessage(err.message || 'Error al actualizar la cita')
    } finally {
      setLoading(false)
      setShowModal(false)
    }
  }

  return (
    <div className='space-y-6'>
      <h2 className='text-lg font-semibold mb-4'>Mis citas</h2>

      {message && (
        <div className='text-sm bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded'>
          {message}
        </div>
      )}

      {appointments.length === 0 && (
        <p className='text-gray-500'>No tienes citas registradas.</p>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className='border border-gray-200 bg-white rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition'
          >
            <div>
              <h3 className='font-semibold text-emerald-700 mb-1'>
                {apt.service_type}
              </h3>
              <p className='text-sm text-gray-700'>
                <span className='font-medium'>Doctor:</span> {apt.doctor}
              </p>
              <p className='text-sm text-gray-700'>
                <span className='font-medium'>Fecha:</span> {apt.date}
              </p>
              <p className='text-sm text-gray-700'>
                <span className='font-medium'>Hora:</span> {apt.time} -{' '}
                {apt.endTime}
              </p>
              <p className='text-sm text-gray-700'>
                <span className='font-medium'>Estado:</span>{' '}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    apt.status === 'fulfilled'
                      ? 'bg-emerald-100 text-emerald-700'
                      : apt.status === 'booked'
                      ? 'bg-blue-100 text-blue-700'
                      : apt.status === 'cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {apt.status}
                </span>
              </p>
            </div>

            <div className='mt-4 flex justify-end gap-2'>
              <button
                className='px-3 py-1 rounded bg-blue-100 text-blue-700 text-sm hover:bg-blue-200'
                onClick={() => {
                  setSelectedAppointment(apt)
                  setShowModal(true)
                }}
              >
                Editar
              </button>
              <button
                className='px-3 py-1 rounded bg-red-100 text-red-700 text-sm hover:bg-red-200'
                onClick={() => handleCancel(apt.id)}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedAppointment && (
        <EditModal
          appointment={selectedAppointment}
          onClose={() => setShowModal(false)}
          onSave={handleUpdateTime}
        />
      )}
    </div>
  )
}

/** --- Modal interno --- */
function EditModal({
  appointment,
  onClose,
  onSave
}: {
  appointment: Appointment
  onClose: () => void
  onSave: (id: number, newStart: string, newEnd: string) => void
}) {
  const [newDate, setNewDate] = useState(appointment.date)
  const [newTime, setNewTime] = useState(appointment.time)
  const [duration] = useState(() => {
    // duración estimada para calcular endTime
    const start = new Date(`2000-01-01T${appointment.time}`)
    const end = new Date(`2000-01-01T${appointment.endTime}`)
    return (end.getTime() - start.getTime()) / 60000
  })

  const handleSubmit = () => {
    const startIso = new Date(`${newDate}T${newTime}:00Z`).toISOString()
    const endIso = new Date(
      new Date(`${newDate}T${newTime}:00Z`).getTime() + duration * 60000
    ).toISOString()
    onSave(appointment.id, startIso, endIso)
  }

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
      <div className='bg-white rounded-xl p-6 w-full max-w-sm shadow-lg space-y-4'>
        <h3 className='text-lg font-semibold text-gray-800 mb-2'>
          Editar cita
        </h3>

        <div className='flex flex-col gap-3'>
          <label className='text-sm text-gray-700'>
            Fecha:
            <input
              type='date'
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className='mt-1 w-full border rounded px-2 py-1'
            />
          </label>
          <label className='text-sm text-gray-700'>
            Hora:
            <input
              type='time'
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className='mt-1 w-full border rounded px-2 py-1'
            />
          </label>
        </div>

        <div className='flex justify-end gap-3 mt-4'>
          <button
            onClick={onClose}
            className='px-3 py-1 rounded bg-gray-100 text-gray-700 text-sm hover:bg-gray-200'
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className='px-3 py-1 rounded bg-emerald-600 text-white text-sm hover:bg-emerald-700'
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  )
}
