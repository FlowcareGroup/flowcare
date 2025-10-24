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
  addPrescriptionToAppointment,
  getPrescriptionsForAppointment,
  updateAppointmentTime,
} from "@/services/api/doctorService";
import type { AddObservationPayload, AddPrescriptionPayload } from "@/services/api/doctorService";
import AppointmentEditModal from "@/app/(siteapp)/doctor/components/AppointmentEditModal";
import { Appointment, Prescription } from "@/types";

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const appointmentId = parseInt(params.id as string);
  const doctorId = parseInt((session?.user as any)?.id || "0");
  const doctorIdStr = (session?.user as any)?.id || "0";

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "details" | "observations" | "prescriptions" | "history"
  >("details");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(false);
  const [observationForm, setObservationForm] = useState<AddObservationPayload>({
    category: "clinical",
    code: "",
    value_string: "",
    value_unit: "",
    notes: "",
  });
  const [submittingObservation, setSubmittingObservation] = useState(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [prescriptionForm, setPrescriptionForm] = useState<AddPrescriptionPayload>({
    medication: "",
    dose: "",
    frequency: "",
    duration: "",
    instructions: "",
  });
  const [submittingPrescription, setSubmittingPrescription] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated" && doctorId && appointmentId) {
      fetchAppointmentDetails();
      fetchPrescriptions();
    }
  }, [status, doctorId, appointmentId]);

  const fetchPrescriptions = async () => {
    try {
      const accessToken = (session as any).accessToken;
      const data = await getPrescriptionsForAppointment(
        doctorIdStr,
        appointmentId,
        accessToken as string
      );
      setPrescriptions(data.prescriptions || []);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  const fetchAppointmentDetails = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const accessToken = (session as any).accessToken;
      const data = await getAppointmentDetails(doctorIdStr, appointmentId, accessToken as string);
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

    console.log("Changing status to:", newStatus);
    try {
      setStatusUpdating(true);
      const accessToken = (session as any).accessToken;
      console.log("Calling updateAppointmentStatus with:", {
        doctorIdStr,
        appointmentId,
        newStatus,
      });
      await updateAppointmentStatus(
        doctorIdStr,
        appointmentId,
        newStatus as
          | "pending"
          | "confirmed"
          | "booked"
          | "arrived"
          | "fulfilled"
          | "cancelled"
          | "noshow",
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
        doctorIdStr,
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

  const handleAddPrescription = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !prescriptionForm.medication.trim() ||
      !prescriptionForm.dose.trim() ||
      !prescriptionForm.frequency.trim() ||
      !prescriptionForm.duration.trim()
    ) {
      alert("Todos los campos son requeridos");
      return;
    }

    try {
      setSubmittingPrescription(true);
      const accessToken = (session as any).accessToken;
      await addPrescriptionToAppointment(
        doctorIdStr,
        appointmentId,
        prescriptionForm,
        accessToken as string
      );

      // Refresh prescriptions list
      const response = await getPrescriptionsForAppointment(
        doctorIdStr,
        appointmentId,
        accessToken as string
      );
      setPrescriptions(response.prescriptions || []);

      // Reset form
      setPrescriptionForm({
        medication: "",
        dose: "",
        frequency: "",
        duration: "",
        instructions: "",
      });

      alert("Prescripción agregada correctamente");
    } catch (error) {
      console.error("Error adding prescription:", error);
      alert("Error al agregar la prescripción");
    } finally {
      setSubmittingPrescription(false);
    }
  };

  const handleEditAppointment = async (
    appointmentId: number,
    newStartTime: string,
    newEndTime: string
  ) => {
    try {
      const accessToken = (session as any).accessToken;
      await updateAppointmentTime(appointmentId, newStartTime, newEndTime, accessToken as string);

      // Refresh appointment details
      await fetchAppointmentDetails(false);
      setEditingAppointment(false);
      alert("Cita actualizada correctamente");
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("Error al actualizar la cita");
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10 md:p-8'>
        <div className='flex justify-center items-center h-96'>
          <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600'></div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10 md:p-8'>
        <div className='mx-auto w-full max-w-4xl'>
          <button
            onClick={() => router.back()}
            className='mb-6 flex items-center gap-2 text-indigo-600 transition hover:text-indigo-800'
          >
            <FaArrowLeft /> Volver
          </button>
          <div className='rounded-lg bg-white p-6 shadow'>
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
      booked: "Reservada",
      arrived: "Llegó",
      fulfilled: "Completada",
      cancelled: "Cancelada",
      noshow: "No presentarse",
    };
    return labels[status] || status;
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10 md:p-8'>
      <div className='mx-auto w-full max-w-6xl'>
        {/* Header */}
        <div className='mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <button
            onClick={() => router.back()}
            className='flex items-center gap-2 text-indigo-600 transition hover:text-indigo-800'
          >
            <FaArrowLeft /> Volver
          </button>
          <h1 className='text-2xl font-bold text-gray-800 sm:text-3xl'>Detalle de Cita</h1>
          <button
            onClick={() => setEditingAppointment(true)}
            className='flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700'
          >
            <FaEdit /> Editar
          </button>
        </div>

        {/* Edit Modal */}
        {editingAppointment && appointment && (
          <AppointmentEditModal
            appointment={{
              id: appointment.id,
              start_time: appointment.start_time,
              end_time: appointment.end_time,
              status: appointment.status,
              patient: {
                name_given: appointment.patient.name.split(" ")[0],
                name_family: appointment.patient.name.split(" ").slice(1).join(" "),
              },
            }}
            doctorId={doctorIdStr}
            accessToken={(session as any).accessToken}
            onClose={() => setEditingAppointment(false)}
            onSave={handleEditAppointment}
          />
        )}

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
          {/* Sidebar - Quick Info */}
          <div className='lg:col-span-1'>
            <div className='space-y-4 rounded-lg bg-white p-6 shadow sm:p-5'>
              <h2 className='mb-4 text-lg font-bold text-gray-800'>Resumen</h2>

              {/* Status */}
              <div>
                <p className='mb-2 text-sm text-gray-500'>Estado</p>
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
                <p className='mb-2 text-sm text-gray-500'>Paciente</p>
                <p className='font-semibold text-gray-800'>{appointment.patient.name}</p>
                <p className='text-xs text-gray-600'>{appointment.patient.email}</p>
              </div>

              {/* Date */}
              <div>
                <p className='mb-2 flex items-center gap-2 text-sm text-gray-500'>
                  <FaCalendar /> Fecha
                </p>
                <p className='font-semibold text-gray-800'>
                  {formatDateTime(appointment.start_time).split(" ").slice(0, 3).join(" ")}
                </p>
              </div>

              {/* Time */}
              <div>
                <p className='mb-2 flex items-center gap-2 text-sm text-gray-500'>
                  <FaClock /> Hora
                </p>
                <p className='font-semibold text-gray-800'>
                  {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                </p>
              </div>

              {/* Observations Count */}
              <div className='border-t pt-4'>
                <p className='text-sm text-gray-500'>Observaciones</p>
                <p className='text-2xl font-bold text-primary'>{appointment.observations.length}</p>
              </div>

              {/* Prescriptions Count */}
              <div className='border-t pt-4'>
                <p className='text-sm text-gray-500'>Prescripciones</p>
                <p className='text-2xl font-bold text-success'>{prescriptions.length}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='lg:col-span-3'>
            {/* Tabs */}
            <div className='mb-6 rounded-lg bg-white shadow'>
              <div className='flex flex-wrap border-b'>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`flex-1 px-4 py-3 text-sm font-semibold transition sm:px-6 sm:py-4 ${
                    activeTab === "details"
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Detalles
                </button>
                <button
                  onClick={() => setActiveTab("observations")}
                  className={`flex-1 px-4 py-3 text-sm font-semibold transition sm:px-6 sm:py-4 ${
                    activeTab === "observations"
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Observaciones ({appointment.observations.length})
                </button>
                <button
                  onClick={() => setActiveTab("prescriptions")}
                  className={`flex-1 px-4 py-3 text-sm font-semibold transition sm:px-6 sm:py-4 ${
                    activeTab === "prescriptions"
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Prescripciones ({prescriptions.length})
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex-1 px-4 py-3 text-sm font-semibold transition sm:px-6 sm:py-4 ${
                    activeTab === "history"
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Historial
                </button>
              </div>

              {/* Tab Content */}
              <div className='p-4 sm:p-6'>
                {/* Details Tab */}
                {activeTab === "details" && (
                  <div className='space-y-6'>
                    {/* Appointment Info */}
                    <div>
                      <h3 className='text-lg font-bold text-gray-800 mb-4'>
                        Información de la Cita
                      </h3>
                      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                        <div>
                          <p className='mb-1 text-sm text-gray-500'>Tipo de Servicio</p>
                          <p className='font-semibold text-gray-800'>
                            {appointment.service_type || "General"}
                          </p>
                        </div>
                        <div>
                          <p className='mb-1 text-sm text-gray-500'>Creada</p>
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
                      <div className='grid grid-cols-1 gap-4 rounded bg-gray-50 p-4 sm:grid-cols-2'>
                        <div>
                          <p className='mb-1 text-sm text-gray-500'>Nombre</p>
                          <p className='font-semibold text-gray-800'>{appointment.patient.name}</p>
                        </div>
                        <div>
                          <p className='mb-1 text-sm text-gray-500'>Email</p>
                          <p className='font-semibold text-gray-800'>{appointment.patient.email}</p>
                        </div>
                        <div>
                          <p className='mb-1 text-sm text-gray-500'>Teléfono</p>
                          <p className='font-semibold text-gray-800'>{appointment.patient.phone}</p>
                        </div>
                        <div>
                          <p className='mb-1 text-sm text-gray-500'>Fecha de Nacimiento</p>
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
                      <h3 className='text-lg font-bold text-darker mb-4'>Cambiar Estado</h3>
                      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                        {[
                          "pending",
                          "confirmed",
                          "booked",
                          "arrived",
                          "fulfilled",
                          "cancelled",
                          "noshow",
                        ].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            disabled={statusUpdating || appointment.status === status}
                            className={`px-4 py-2 rounded font-semibold transition ${
                              appointment.status === status
                                ? "bg-primary text-white cursor-not-allowed"
                                : "btn-secondary"
                            }`}
                          >
                            {getStatusLabel(status)}
                          </button>
                        ))}
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
                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                          <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                              Categoría
                            </label>
                            <select
                              value={observationForm.category}
                              onChange={(e) =>
                                setObservationForm({ ...observationForm, category: e.target.value })
                              }
                              className='w-full rounded border border-gray-300 px-3 py-2 focus:border-indigo-600 focus:outline-none'
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
                              className='w-full rounded border border-gray-300 px-3 py-2 focus:border-indigo-600 focus:outline-none'
                            />
                          </div>
                        </div>
                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
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
                              className='w-full rounded border border-gray-300 px-3 py-2 focus:border-indigo-600 focus:outline-none'
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
                              className='w-full rounded border border-gray-300 px-3 py-2 focus:border-indigo-600 focus:outline-none'
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
                            className='input-primary'
                          ></textarea>
                        </div>
                        <button
                          type='submit'
                          disabled={submittingObservation}
                          className='btn-primary w-full disabled:opacity-50'
                        >
                          {submittingObservation ? "Guardando..." : "Guardar Observación"}
                        </button>
                      </form>
                    </div>

                    {/* Observations List */}
                    {appointment.observations.length > 0 ? (
                      <div>
                        <h3 className='text-lg font-bold text-darker mb-4'>
                          Observaciones Registradas
                        </h3>
                        <div className='space-y-3'>
                          {appointment.observations.map((obs) => (
                            <div
                              key={obs.id}
                              className='rounded border border-gray-200 bg-white p-4'
                            >
                              <div className='mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
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

                {/* Prescriptions Tab */}
                {activeTab === "prescriptions" && (
                  <div className='space-y-6'>
                    {/* Add Prescription Form */}
                    <div className='rounded border border-green-200 bg-green-50 p-6'>
                      <h3 className='mb-4 flex items-center gap-2 text-lg font-bold text-darker'>
                        <FaPlus /> Agregar Prescripción
                      </h3>
                      <form
                        onSubmit={handleAddPrescription}
                        className='space-y-4'
                      >
                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                          <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                              Medicamento *
                            </label>
                            <input
                              type='text'
                              value={prescriptionForm.medication}
                              onChange={(e) =>
                                setPrescriptionForm({
                                  ...prescriptionForm,
                                  medication: e.target.value,
                                })
                              }
                              placeholder='Ej: Amoxicilina'
                              required
                              className='input-primary'
                            />
                          </div>
                          <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                              Dosis *
                            </label>
                            <input
                              type='text'
                              value={prescriptionForm.dose}
                              onChange={(e) =>
                                setPrescriptionForm({ ...prescriptionForm, dose: e.target.value })
                              }
                              placeholder='Ej: 500mg'
                              required
                              className='input-primary'
                            />
                          </div>
                        </div>
                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                          <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                              Frecuencia *
                            </label>
                            <input
                              type='text'
                              value={prescriptionForm.frequency}
                              onChange={(e) =>
                                setPrescriptionForm({
                                  ...prescriptionForm,
                                  frequency: e.target.value,
                                })
                              }
                              placeholder='Ej: Cada 8 horas'
                              required
                              className='input-primary'
                            />
                          </div>
                          <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                              Duración *
                            </label>
                            <input
                              type='text'
                              value={prescriptionForm.duration}
                              onChange={(e) =>
                                setPrescriptionForm({
                                  ...prescriptionForm,
                                  duration: e.target.value,
                                })
                              }
                              placeholder='Ej: 7 días'
                              required
                              className='input-primary'
                            />
                          </div>
                        </div>
                        <div>
                          <label className='block text-sm font-semibold text-gray-700 mb-2'>
                            Instrucciones Especiales
                          </label>
                          <textarea
                            value={prescriptionForm.instructions}
                            onChange={(e) =>
                              setPrescriptionForm({
                                ...prescriptionForm,
                                instructions: e.target.value,
                              })
                            }
                            placeholder='Ej: Tomar con alimentos, evitar leche...'
                            rows={3}
                            className='input-primary'
                          ></textarea>
                        </div>
                        <button
                          type='submit'
                          disabled={submittingPrescription}
                          className='btn-success w-full disabled:opacity-50'
                        >
                          {submittingPrescription ? "Guardando..." : "Guardar Prescripción"}
                        </button>
                      </form>
                    </div>

                    {/* Prescriptions List */}
                    {prescriptions.length > 0 ? (
                      <div>
                        <h3 className='text-lg font-bold text-darker mb-4'>
                          Prescripciones Registradas
                        </h3>
                        <div className='space-y-3'>
                          {prescriptions.map((presc) => (
                            <div
                              key={presc.id}
                              className='rounded border-success border-l-4 bg-light p-4'
                            >
                              <div className='mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
                                <div>
                                  <p className='font-semibold text-darker'>{presc.medication}</p>
                                  <div className='text-sm text-gray-600 mt-1 space-y-1'>
                                    <p>Dosis: {presc.dose}</p>
                                    <p>Frecuencia: {presc.frequency}</p>
                                    <p>Duración: {presc.duration}</p>
                                  </div>
                                </div>
                                <span className='text-xs text-gray-500'>
                                  {new Date(presc.created_at).toLocaleDateString("es-ES")}
                                </span>
                              </div>
                              {presc.instructions && (
                                <p className='text-sm text-gray-700 mt-2 bg-white p-2 rounded border border-green-100'>
                                  <span className='font-semibold'>Instrucciones: </span>
                                  {presc.instructions}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className='text-gray-600 text-center py-8'>
                        No hay prescripciones registradas aún
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
                            className='cursor-pointer rounded border border-gray-200 bg-gray-50 p-4 transition hover:bg-gray-100'
                          >
                            <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
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
