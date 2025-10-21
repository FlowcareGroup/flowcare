"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FaCalendar,
  FaClock,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaPlus,
  FaArrowLeft,
} from "react-icons/fa";
import {
  getAppointmentDetails,
  updateAppointmentStatus,
  addObservationToAppointment,
} from "@/services/api/doctorService";
import type { AddObservationPayload } from "@/services/api/doctorService";

interface Appointment {
  id: number;
  start_time: string;
  end_time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "noshow";
  service_type: string;
  description: string;
  patient_id: number;
  doctor_id: number;
  createdAt: string;
  patient: {
    id: number;
    name: string;
    email: string;
    phone: string;
    date_of_birth: string;
  };
  doctor: {
    id: number;
    name: string;
    speciality: string;
  };
  observations: Observation[];
  previousAppointments: Appointment[];
}

interface Observation {
  id: string;
  category: string;
  code: string;
  value_string?: string;
  value_unit?: string;
  notes?: string;
  status: string;
  createdAt: string;
}

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const appointmentId = parseInt(params.id as string);
  const doctorId = parseInt((session?.user as any)?.id || "0");

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "observations" | "history">("details");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [observationForm, setObservationForm] = useState<AddObservationPayload>({
    category: "clinical",
    code: "",
    value_string: "",
    value_unit: "",
    notes: "",
  });
  const [submittingObservation, setSubmittingObservation] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated" && doctorId && appointmentId) {
      fetchAppointmentDetails();
    }
  }, [status, doctorId, appointmentId]);

  const fetchAppointmentDetails = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const accessToken = (session as any).accessToken;
      const data = await getAppointmentDetails(doctorId, appointmentId, accessToken as string);
      setAppointment(data.data);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      alert("Error al cargar los detalles de la cita");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!appointment) return;

    try {
      setStatusUpdating(true);
      const accessToken = (session as any).accessToken;
      await updateAppointmentStatus(
        doctorId,
        appointmentId,
        newStatus as "pending" | "confirmed" | "completed" | "cancelled" | "noshow",
        accessToken as string
      );
      setAppointment({ ...appointment, status: newStatus as any });
      alert("Estado actualizado correctamente");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error al actualizar el estado");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAddObservation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!observationForm.code.trim()) {
      alert("El código de observación es requerido");
      return;
    }

    try {
      setSubmittingObservation(true);
      const accessToken = (session as any).accessToken;
      await addObservationToAppointment(
        doctorId,
        appointmentId,
        observationForm,
        accessToken as string
      );

      // Refresh appointment details
      await fetchAppointmentDetails(false);

      // Reset form
      setObservationForm({
        category: "clinical",
        code: "",
        value_string: "",
        value_unit: "",
        notes: "",
      });

      alert("Observación agregada correctamente");
    } catch (error) {
      console.error("Error adding observation:", error);
      alert("Error al agregar la observación");
    } finally {
      setSubmittingObservation(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8'>
        <div className='flex justify-center items-center h-96'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8'>
        <div className='max-w-4xl mx-auto'>
          <button
            onClick={() => router.back()}
            className='flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6'
          >
            <FaArrowLeft /> Volver
          </button>
          <div className='bg-white rounded-lg shadow p-6'>
            <p className='text-gray-600'>Cita no encontrada</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "noshow":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: "Pendiente",
      confirmed: "Confirmada",
      completed: "Completada",
      cancelled: "Cancelada",
      noshow: "No presentarse",
    };
    return labels[status] || status;
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <button
            onClick={() => router.back()}
            className='flex items-center gap-2 text-indigo-600 hover:text-indigo-800'
          >
            <FaArrowLeft /> Volver
          </button>
          <h1 className='text-3xl font-bold text-gray-800'>Detalle de Cita</h1>
          <div className='w-24'></div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Sidebar - Quick Info */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow p-6 space-y-4'>
              <h2 className='font-bold text-gray-800 mb-4'>Resumen</h2>

              {/* Status */}
              <div>
                <p className='text-sm text-gray-500 mb-2'>Estado</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(
                    appointment.status
                  )}`}
                >
                  {getStatusLabel(appointment.status)}
                </span>
              </div>

              {/* Patient */}
              <div>
                <p className='text-sm text-gray-500 mb-2'>Paciente</p>
                <p className='font-semibold text-gray-800'>{appointment.patient.name}</p>
                <p className='text-xs text-gray-600'>{appointment.patient.email}</p>
              </div>

              {/* Date */}
              <div>
                <p className='text-sm text-gray-500 mb-2 flex items-center gap-2'>
                  <FaCalendar /> Fecha
                </p>
                <p className='font-semibold text-gray-800'>
                  {formatDateTime(appointment.start_time).split(" ").slice(0, 3).join(" ")}
                </p>
              </div>

              {/* Time */}
              <div>
                <p className='text-sm text-gray-500 mb-2 flex items-center gap-2'>
                  <FaClock /> Hora
                </p>
                <p className='font-semibold text-gray-800'>
                  {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                </p>
              </div>

              {/* Observations Count */}
              <div className='pt-4 border-t'>
                <p className='text-sm text-gray-500'>Observaciones</p>
                <p className='text-2xl font-bold text-indigo-600'>
                  {appointment.observations.length}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='lg:col-span-3'>
            {/* Tabs */}
            <div className='bg-white rounded-lg shadow mb-6'>
              <div className='flex border-b'>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`flex-1 px-6 py-4 font-semibold transition ${
                    activeTab === "details"
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Detalles
                </button>
                <button
                  onClick={() => setActiveTab("observations")}
                  className={`flex-1 px-6 py-4 font-semibold transition ${
                    activeTab === "observations"
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Observaciones ({appointment.observations.length})
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex-1 px-6 py-4 font-semibold transition ${
                    activeTab === "history"
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Historial
                </button>
              </div>

              {/* Tab Content */}
              <div className='p-6'>
                {/* Details Tab */}
                {activeTab === "details" && (
                  <div className='space-y-6'>
                    {/* Appointment Info */}
                    <div>
                      <h3 className='text-lg font-bold text-gray-800 mb-4'>
                        Información de la Cita
                      </h3>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <p className='text-sm text-gray-500 mb-1'>Tipo de Servicio</p>
                          <p className='font-semibold text-gray-800'>
                            {appointment.service_type || "General"}
                          </p>
                        </div>
                        <div>
                          <p className='text-sm text-gray-500 mb-1'>Creada</p>
                          <p className='font-semibold text-gray-800'>
                            {formatDateTime(appointment.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {appointment.description && (
                      <div>
                        <p className='text-sm text-gray-500 mb-2'>Descripción</p>
                        <div className='bg-gray-50 p-4 rounded border border-gray-200'>
                          <p className='text-gray-800'>{appointment.description}</p>
                        </div>
                      </div>
                    )}

                    {/* Patient Info */}
                    <div>
                      <h3 className='text-lg font-bold text-gray-800 mb-4'>
                        Información del Paciente
                      </h3>
                      <div className='grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded'>
                        <div>
                          <p className='text-sm text-gray-500 mb-1'>Nombre</p>
                          <p className='font-semibold text-gray-800'>{appointment.patient.name}</p>
                        </div>
                        <div>
                          <p className='text-sm text-gray-500 mb-1'>Email</p>
                          <p className='font-semibold text-gray-800'>{appointment.patient.email}</p>
                        </div>
                        <div>
                          <p className='text-sm text-gray-500 mb-1'>Teléfono</p>
                          <p className='font-semibold text-gray-800'>{appointment.patient.phone}</p>
                        </div>
                        <div>
                          <p className='text-sm text-gray-500 mb-1'>Fecha de Nacimiento</p>
                          <p className='font-semibold text-gray-800'>
                            {new Date(appointment.patient.date_of_birth).toLocaleDateString(
                              "es-ES"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Change Buttons */}
                    <div>
                      <h3 className='text-lg font-bold text-gray-800 mb-4'>Cambiar Estado</h3>
                      <div className='grid grid-cols-2 gap-3'>
                        {["pending", "confirmed", "completed", "noshow", "cancelled"].map(
                          (status) => (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(status)}
                              disabled={statusUpdating || appointment.status === status}
                              className={`px-4 py-2 rounded font-semibold transition ${
                                appointment.status === status
                                  ? "bg-indigo-600 text-white cursor-not-allowed"
                                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                              }`}
                            >
                              {getStatusLabel(status)}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Observations Tab */}
                {activeTab === "observations" && (
                  <div className='space-y-6'>
                    {/* Add Observation Form */}
                    <div className='bg-gray-50 p-6 rounded border border-gray-200'>
                      <h3 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
                        <FaPlus /> Agregar Observación
                      </h3>
                      <form
                        onSubmit={handleAddObservation}
                        className='space-y-4'
                      >
                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                              Categoría
                            </label>
                            <select
                              value={observationForm.category}
                              onChange={(e) =>
                                setObservationForm({ ...observationForm, category: e.target.value })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-600'
                            >
                              <option value='clinical'>Clínica</option>
                              <option value='diagnostic'>Diagnóstico</option>
                              <option value='treatment'>Tratamiento</option>
                              <option value='follow-up'>Seguimiento</option>
                            </select>
                          </div>
                          <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                              Código *
                            </label>
                            <input
                              type='text'
                              value={observationForm.code}
                              onChange={(e) =>
                                setObservationForm({ ...observationForm, code: e.target.value })
                              }
                              placeholder='Ej: HTN, DM2, etc.'
                              required
                              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-600'
                            />
                          </div>
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                              Valor
                            </label>
                            <input
                              type='text'
                              value={observationForm.value_string}
                              onChange={(e) =>
                                setObservationForm({
                                  ...observationForm,
                                  value_string: e.target.value,
                                })
                              }
                              placeholder='Ej: 140/90'
                              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-600'
                            />
                          </div>
                          <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                              Unidad
                            </label>
                            <input
                              type='text'
                              value={observationForm.value_unit}
                              onChange={(e) =>
                                setObservationForm({
                                  ...observationForm,
                                  value_unit: e.target.value,
                                })
                              }
                              placeholder='Ej: mmHg'
                              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-600'
                            />
                          </div>
                        </div>
                        <div>
                          <label className='block text-sm font-semibold text-gray-700 mb-2'>
                            Notas
                          </label>
                          <textarea
                            value={observationForm.notes}
                            onChange={(e) =>
                              setObservationForm({ ...observationForm, notes: e.target.value })
                            }
                            placeholder='Observaciones adicionales...'
                            rows={3}
                            className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-600'
                          ></textarea>
                        </div>
                        <button
                          type='submit'
                          disabled={submittingObservation}
                          className='w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition disabled:bg-gray-400'
                        >
                          {submittingObservation ? "Guardando..." : "Guardar Observación"}
                        </button>
                      </form>
                    </div>

                    {/* Observations List */}
                    {appointment.observations.length > 0 ? (
                      <div>
                        <h3 className='text-lg font-bold text-gray-800 mb-4'>
                          Observaciones Registradas
                        </h3>
                        <div className='space-y-3'>
                          {appointment.observations.map((obs) => (
                            <div
                              key={obs.id}
                              className='bg-white border border-gray-200 p-4 rounded'
                            >
                              <div className='flex justify-between items-start mb-2'>
                                <div>
                                  <p className='font-semibold text-gray-800'>
                                    {obs.category} - {obs.code}
                                  </p>
                                  {obs.value_string && (
                                    <p className='text-sm text-gray-600'>
                                      Valor: {obs.value_string} {obs.value_unit}
                                    </p>
                                  )}
                                </div>
                                <span className='text-xs text-gray-500'>
                                  {new Date(obs.createdAt).toLocaleDateString("es-ES")}
                                </span>
                              </div>
                              {obs.notes && (
                                <p className='text-sm text-gray-700 mt-2'>{obs.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className='text-gray-600 text-center py-8'>
                        No hay observaciones registradas aún
                      </p>
                    )}
                  </div>
                )}

                {/* History Tab */}
                {activeTab === "history" && (
                  <div className='space-y-4'>
                    <h3 className='text-lg font-bold text-gray-800 mb-4'>
                      Citas Anteriores del Paciente
                    </h3>
                    {appointment.previousAppointments &&
                    appointment.previousAppointments.length > 0 ? (
                      <div className='space-y-3'>
                        {appointment.previousAppointments.map((prev) => (
                          <div
                            key={prev.id}
                            className='bg-gray-50 border border-gray-200 p-4 rounded hover:bg-gray-100 transition cursor-pointer'
                          >
                            <div className='flex justify-between items-start'>
                              <div>
                                <p className='font-semibold text-gray-800'>
                                  {formatDateTime(prev.start_time).split(" ").slice(0, 3).join(" ")}
                                </p>
                                <p className='text-sm text-gray-600'>
                                  {formatTime(prev.start_time)} - {formatTime(prev.end_time)}
                                </p>
                                {prev.description && (
                                  <p className='text-sm text-gray-700 mt-1'>{prev.description}</p>
                                )}
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(
                                  prev.status
                                )}`}
                              >
                                {getStatusLabel(prev.status)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className='text-gray-600 text-center py-8'>No hay citas anteriores</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
