"use client";

import { useState } from "react";
import {
  getAllAppointmentsByDoctorByDay,
  updateAppointmentTime,
} from "@/services/api/doctorService";
import { SiGooglecalendar } from "react-icons/si";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaEdit } from "react-icons/fa";
import AppointmentEditModal from "./AppointmentEditModal";

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

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface AppointmentCalendarProps {
  doctorId: string;
  accessToken: string;
  initialData: {
    data: Appointment[];
    pagination: PaginationInfo;
  };
  initialDate: string;
}

export default function AppointmentCalendar({
  doctorId,
  accessToken,
  initialData,
  initialDate,
}: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [appointments, setAppointments] = useState<Appointment[]>(initialData.data);
  const [pagination, setPagination] = useState<PaginationInfo>(initialData.pagination);
  const [isLoading, setIsLoading] = useState(false);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Estados del modal de edición
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  // Función para cargar citas del día seleccionado
  const loadAppointments = async (date: string, page: number = 1, limit: number = itemsPerPage) => {
    setIsLoading(true);
    try {
      const response = await getAllAppointmentsByDoctorByDay(
        doctorId,
        date,
        accessToken,
        page,
        limit
      );
      setAppointments(response.data);
      setPagination(response.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error loading appointments:", error);
      setAppointments([]);
      setPagination({
        total: 0,
        page: 1,
        limit: limit,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambio de fecha
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setCurrentPage(1);
    loadAppointments(newDate, 1, itemsPerPage);
  };

  // Manejar cambio de items por página
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value);
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    loadAppointments(selectedDate, 1, newLimit);
  };

  // Navegar a página anterior
  const goToPreviousPage = () => {
    if (pagination?.hasPreviousPage) {
      loadAppointments(selectedDate, currentPage - 1, itemsPerPage);
    }
  };

  // Navegar a página siguiente
  const goToNextPage = () => {
    if (pagination?.hasNextPage) {
      loadAppointments(selectedDate, currentPage + 1, itemsPerPage);
    }
  };

  // Navegar a día anterior
  const goToPreviousDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    const newDate = currentDate.toISOString().split("T")[0];
    setSelectedDate(newDate);
    setCurrentPage(1);
    loadAppointments(newDate, 1, itemsPerPage);
  };

  // Navegar a día siguiente
  const goToNextDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    const newDate = currentDate.toISOString().split("T")[0];
    setSelectedDate(newDate);
    setCurrentPage(1);
    loadAppointments(newDate, 1, itemsPerPage);
  };

  // Ir a hoy
  const goToToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    setCurrentPage(1);
    loadAppointments(today, 1, itemsPerPage);
  };

  // Formatear fecha para mostrar
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Abrir modal de edición
  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
  };

  // Cerrar modal de edición
  const handleCloseEditModal = () => {
    setEditingAppointment(null);
  };

  // Guardar cambios de la cita
  const handleSaveAppointment = async (
    appointmentId: number,
    newStartTime: string,
    newEndTime: string
  ) => {
    try {
      await updateAppointmentTime(appointmentId, newStartTime, newEndTime, accessToken);

      // Recargar las citas de la página actual
      await loadAppointments(selectedDate, currentPage, itemsPerPage);

      // Cerrar modal
      setEditingAppointment(null);
    } catch (error) {
      console.error("Error saving appointment:", error);
      throw error;
    }
  };

  return (
    <div className='p-8 w-full border border-gray-300 rounded-lg shadow-md bg-white'>
      {/* Selector de fecha */}
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold'>Consultas del día</h2>
          <button
            onClick={goToToday}
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm'
          >
            Hoy
          </button>
        </div>

        {/* Controles de navegación de fecha */}
        <div className='flex items-center gap-4'>
          <button
            onClick={goToPreviousDay}
            className='p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition'
            title='Día anterior'
          >
            <FaChevronLeft size={18} />
          </button>

          <div className='flex-1 flex items-center gap-3'>
            <FaCalendarAlt
              className='text-gray-600'
              size={20}
            />
            <input
              type='date'
              value={selectedDate}
              onChange={handleDateChange}
              className='flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <button
            onClick={goToNextDay}
            className='p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition'
            title='Día siguiente'
          >
            <FaChevronRight size={18} />
          </button>
        </div>

        {/* Fecha seleccionada + selector de items por página */}
        <div className='mt-3 flex items-center justify-between'>
          <p className='text-gray-700 font-medium capitalize'>{formatDisplayDate(selectedDate)}</p>

          <div className='flex items-center gap-2'>
            <label className='text-sm text-gray-600'>Mostrar:</label>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className='px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value={4}>4 citas</option>
              <option value={10}>10 citas</option>
              <option value={20}>20 citas</option>
              <option value={9999}>Todas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de citas */}
      <div className='min-h-[200px]'>
        {isLoading ? (
          <div className='flex justify-center items-center h-40'>
            <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500'></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className='text-center py-10 text-gray-500'>
            <p className='text-lg'>No hay consultas programadas para este día</p>
          </div>
        ) : (
          <>
            <ul className='space-y-3'>
              {appointments.map((appointment) => {
                // Formatear fecha y hora
                const appointmentDate = new Date(appointment.start_time);
                const formattedTime = appointmentDate.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });

                const endDate = new Date(appointment.end_time);
                const formattedEndTime = endDate.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });

                return (
                  <li
                    key={appointment.id}
                    className='p-4 border border-gray-200 rounded-lg hover:shadow-md transition bg-gray-50'
                  >
                    <div className='flex justify-between items-start gap-4'>
                      <div className='flex-1'>
                        <p className='text-lg font-semibold text-gray-800'>
                          {appointment.patient.name_given} {appointment.patient.name_family}
                        </p>
                        <p className='text-sm text-gray-600 mt-1'>
                          <strong>Hora:</strong> {formattedTime} - {formattedEndTime}
                        </p>
                      </div>

                      <div className='flex items-center gap-2'>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            appointment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : appointment.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {appointment.status === "pending"
                            ? "Pendiente"
                            : appointment.status === "confirmed"
                            ? "Confirmada"
                            : appointment.status}
                        </span>

                        <button
                          onClick={() => handleEditAppointment(appointment)}
                          className='p-2 text-blue-600 hover:bg-blue-50 rounded-md transition'
                          title='Modificar fecha/hora'
                        >
                          <FaEdit size={16} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Controles de paginación */}
            {pagination && pagination.totalPages > 1 && (
              <div className='mt-6 flex items-center justify-between border-t pt-4'>
                <div className='text-sm text-gray-600'>
                  Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
                  {Math.min(currentPage * itemsPerPage, pagination.total)} de {pagination.total}{" "}
                  citas
                </div>

                <div className='flex items-center gap-2'>
                  <button
                    onClick={goToPreviousPage}
                    disabled={!pagination.hasPreviousPage}
                    className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm'
                  >
                    Anterior
                  </button>

                  <span className='px-4 py-2 text-sm font-medium'>
                    Página {currentPage} de {pagination.totalPages}
                  </span>

                  <button
                    onClick={goToNextPage}
                    disabled={!pagination.hasNextPage}
                    className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm'
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className='mt-6 pt-4 border-t border-gray-200'>
        <p className='flex gap-2 items-center text-sm text-gray-600'>
          <SiGooglecalendar
            size={20}
            className='text-blue-600'
          />
          Agenda sincronizada con Google Calendar
        </p>
      </div>

      {/* Modal de edición */}
      {editingAppointment && (
        <AppointmentEditModal
          appointment={editingAppointment}
          doctorId={doctorId}
          accessToken={accessToken}
          onClose={handleCloseEditModal}
          onSave={handleSaveAppointment}
        />
      )}
    </div>
  );
}
