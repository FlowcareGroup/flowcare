"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaSave, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { getAvailableSlots } from "@/services/api/doctorService";

interface Appointment {
  id: number;
  start_time: string;
  end_time: string;
  status: string;
  patient: {
    name_given: string;
    name_family: string;
  };
}

interface AppointmentEditModalProps {
  appointment: Appointment;
  doctorId: string;
  accessToken: string;
  onClose: () => void;
  onSave: (appointmentId: number, newStartTime: string, newEndTime: string) => Promise<void>;
}

export default function AppointmentEditModal({
  appointment,
  onClose,
  doctorId,
  accessToken,
  onSave,
}: AppointmentEditModalProps) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [allSlots, setAllSlots] = useState<any[]>([]);
  const [error, setError] = useState("");

  const DOCTOR_END_HOUR = 14; // 2:00 PM
  const SESSION_DURATION = 15; // minutos
  // Cargar slots disponibles cuando cambia la fecha
  useEffect(() => {
    if (date) {
      loadAvailableSlots(date);
    }
  }, [date]);

  // Función para cargar slots disponibles
  const loadAvailableSlots = async (selectedDate: string) => {
    setIsFetchingSlots(true);
    try {
      const slotsData = await getAvailableSlots(doctorId, selectedDate, accessToken);
      setAvailableSlots(slotsData.availableSlots);
      setAllSlots(slotsData.slots);
    } catch (error) {
      console.error("Error loading available slots:", error);
      setAvailableSlots([]);
      setAllSlots([]);
    } finally {
      setIsFetchingSlots(false);
    }
  };
  // Inicializar valores del formulario
  useEffect(() => {
    // Convertir a fecha local (sin UTC)
    const startDate = new Date(appointment.start_time);

    // Extraer fecha en formato local
    const year = startDate.getFullYear();
    const month = (startDate.getMonth() + 1).toString().padStart(2, "0");
    const day = startDate.getDate().toString().padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;
    setDate(dateString);

    // Extraer hora en formato local
    const hours = startDate.getHours().toString().padStart(2, "0");
    const minutes = startDate.getMinutes().toString().padStart(2, "0");
    const startTimeString = `${hours}:${minutes}`;

    setStartTime(startTimeString);

    // Cargar slots para la fecha inicial
    loadAvailableSlots(dateString);
  }, [appointment]);

  // Calcular hora de fin automáticamente (15 minutos después)
  const calculateEndTime = (start: string): string => {
    if (!start) return "";

    const [hours, minutes] = start.split(":").map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + SESSION_DURATION;

    const endHours = Math.floor(endMinutes / 60) % 24;
    const endMins = endMinutes % 60;

    return `${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`;
  };

  // Manejar selección de hora (pill)
  const handleTimeSelect = (time: string) => {
    // Permitir seleccionar incluso si está ocupado (para reprogramar)
    setStartTime(time);
    setError("");
  };

  // Validar y guardar
  const handleSave = async () => {
    setError("");

    // Validaciones
    if (!date || !startTime) {
      setError("Debes seleccionar fecha y hora");
      return;
    }

    // Calcular hora de fin (15 minutos después)
    const endTime = calculateEndTime(startTime);

    // Construir timestamps en formato local (el backend manejará la conversión)
    const [year, month, day] = date.split("-");
    const [startHour, startMin] = startTime.split(":");
    const [endHour, endMin] = endTime.split(":");

    // Crear fechas en hora local y convertir a ISO
    const startDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(startHour),
      parseInt(startMin)
    );
    const endDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(endHour),
      parseInt(endMin)
    );

    const newStartTime = startDate.toISOString();
    const newEndTime = endDate.toISOString();

    setIsLoading(true);
    try {
      await onSave(appointment.id, newStartTime, newEndTime);
      onClose();
    } catch (err) {
      setError("Error al guardar la cita. Intenta nuevamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl p-6 w-full max-w-md'>
        {/* Header */}
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-xl font-semibold text-gray-800'>Modificar Cita</h3>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 transition'
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Información del paciente */}
        <div className='mb-4 p-3 bg-blue-50 rounded-md'>
          <p className='text-sm text-gray-600'>Paciente:</p>
          <p className='font-semibold text-gray-800'>
            {appointment.patient.name_given} {appointment.patient.name_family}
          </p>
        </div>

        {/* Formulario */}
        <div className='space-y-4'>
          {/* Fecha */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              📅 Fecha de la Cita
            </label>
            <input
              type='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Hora de inicio con pills */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              🕐 Selecciona Hora de Inicio
            </label>

            {isFetchingSlots ? (
              <div className='flex justify-center items-center h-32'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
              </div>
            ) : (
              <div className='grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-md'>
                {allSlots.map((slot) => {
                  const isSelected = slot.time === startTime;
                  const isAvailable = slot.available;
                  const isCurrentAppointment = slot.appointmentId === appointment.id;

                  return (
                    <button
                      key={slot.time}
                      type='button'
                      onClick={() => handleTimeSelect(slot.time)}
                      disabled={!isAvailable && !isCurrentAppointment}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all relative ${
                        isSelected
                          ? "bg-blue-500 text-white shadow-md transform scale-105"
                          : isAvailable || isCurrentAppointment
                          ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                          : "bg-red-100 text-red-400 cursor-not-allowed opacity-50"
                      }`}
                    >
                      {slot.time}
                      {isAvailable && !isSelected && (
                        <FaCheckCircle className='absolute top-0 right-0 text-green-500 text-xs' />
                      )}
                      {!isAvailable && !isCurrentAppointment && (
                        <FaTimesCircle className='absolute top-0 right-0 text-red-500 text-xs' />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <div className='flex items-center gap-4 mt-2 text-xs text-gray-600'>
              <span className='flex items-center gap-1'>
                <div className='w-3 h-3 bg-green-100 border border-green-300 rounded'></div>
                Disponible
              </span>
              <span className='flex items-center gap-1'>
                <div className='w-3 h-3 bg-red-100 border border-red-300 rounded'></div>
                Ocupado
              </span>
              <span className='flex items-center gap-1'>
                <div className='w-3 h-3 bg-blue-500 rounded'></div>
                Seleccionado
              </span>
            </div>
          </div>

          {/* Hora de fin automática */}
          {startTime && (
            <div className='p-3 bg-green-50 border border-green-200 rounded-md'>
              <p className='text-sm text-green-800'>
                <strong>Hora de Fin:</strong> {calculateEndTime(startTime)} (15 minutos de sesión)
              </p>
            </div>
          )}

          {/* Mensaje de error */}
          {error && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
              <p className='text-sm text-red-600'>{error}</p>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className='mt-6 flex gap-3'>
          <button
            onClick={onClose}
            disabled={isLoading}
            className='flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition disabled:opacity-50'
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className='flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2'
          >
            {isLoading ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                Guardando...
              </>
            ) : (
              <>
                <FaSave />
                Guardar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
