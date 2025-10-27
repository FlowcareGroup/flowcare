"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaArrowLeft, FaEnvelope, FaMapPin, FaCalendar } from "react-icons/fa";
import { getPatientProfile, type PatientProfile } from "@/services/api/patientService";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PatientDataPage({ params }: PageProps) {
  const [patientId, setPatientId] = useState<number | null>(null);
  const { data: session } = useSession();
  const accessToken = (session as any)?.accessToken;

  useEffect(() => {
    params.then((p) => setPatientId(parseInt(p.id)));
  }, [params]);

  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || patientId === null) return;

    const loadPatient = async () => {
      try {
        const data = await getPatientProfile(patientId, accessToken);
        setPatient(data);
      } catch (err: any) {
        setError(err.message || "Error loading patient data");
      } finally {
        setLoading(false);
      }
    };

    loadPatient();
  }, [patientId, accessToken]);

  if (loading) {
    return (
      <div className='p-8 max-w-6xl mx-auto'>
        <div className='text-center'>Cargando datos del paciente...</div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className='p-8 max-w-6xl mx-auto'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 text-red-700'>
          {error || "Paciente no encontrado"}
        </div>
        <Link href='/doctor'>
          <button className='mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
            <FaArrowLeft /> Volver
          </button>
        </Link>
      </div>
    );
  }

  const { personalData, appointments, observations } = patient;

  return (
    <div className='p-8 max-w-6xl mx-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <Link href='/doctor'>
            <button className='flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition'>
              <FaArrowLeft /> Volver
            </button>
          </Link>
          <h1 className='text-3xl font-bold text-gray-800'>
            {personalData.name_given} {personalData.name_family || ""}
          </h1>
        </div>
      </div>

      {/* Datos Personales */}
      <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>Datos Personales</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          <div>
            <label className='text-sm text-gray-600'>Email</label>
            <div className='flex items-center gap-2 mt-1'>
              <FaEnvelope className='text-gray-400' />
              <a
                href={`mailto:${personalData.email}`}
                className='text-blue-600 hover:underline'
              >
                {personalData.email}
              </a>
            </div>
          </div>

          {personalData.gender && (
            <div>
              <label className='text-sm text-gray-600'>Género</label>
              <p className='mt-1 capitalize'>
                {personalData.gender === "male"
                  ? "Masculino"
                  : personalData.gender === "female"
                  ? "Femenino"
                  : personalData.gender}
              </p>
            </div>
          )}

          {personalData.birth_date && (
            <div>
              <label className='text-sm text-gray-600'>Fecha Nacimiento</label>
              <p className='mt-1'>
                {new Date(personalData.birth_date).toLocaleDateString("es-ES")}
              </p>
            </div>
          )}

          {personalData.address && (
            <div className='col-span-2 md:col-span-3'>
              <label className='text-sm text-gray-600'>Dirección</label>
              <div className='flex items-center gap-2 mt-1'>
                <FaMapPin className='text-gray-400' />
                <p>{personalData.address}</p>
              </div>
            </div>
          )}

          {personalData.marital_status && (
            <div>
              <label className='text-sm text-gray-600'>Estado Civil</label>
              <p className='mt-1 capitalize'>
                {personalData.marital_status === "single"
                  ? "Soltero/a"
                  : personalData.marital_status === "married"
                  ? "Casado/a"
                  : personalData.marital_status}
              </p>
            </div>
          )}

          {personalData.identifier && (
            <div>
              <label className='text-sm text-gray-600'>Identificador</label>
              <p className='mt-1 text-sm font-mono'>{personalData.identifier}</p>
            </div>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Historial de Citas */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'>
            <FaCalendar /> Historial de Citas ({appointments.length})
          </h2>
          {appointments.length === 0 ? (
            <p className='text-gray-500'>No hay citas registradas</p>
          ) : (
            <div className='space-y-3 max-h-96 overflow-y-auto'>
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className='border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition'
                >
                  <div className='flex justify-between items-start'>
                    <div>
                      <div className='font-semibold text-gray-800'>
                        {apt.date} - {apt.time}
                      </div>
                      <div className='text-sm text-gray-600'>Dr. {apt.doctor}</div>
                      <div className='text-xs text-gray-500 mt-1'>{apt.service_type}</div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        apt.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : apt.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : apt.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {apt.status === "pending"
                        ? "Pendiente"
                        : apt.status === "confirmed"
                        ? "Confirmada"
                        : apt.status === "cancelled"
                        ? "Cancelada"
                        : apt.status}
                    </span>
                  </div>
                  {apt.description && (
                    <div className='text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded'>
                      {apt.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Observaciones Médicas */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Observaciones ({observations.length})
          </h2>
          {observations.length === 0 ? (
            <p className='text-gray-500'>No hay observaciones registradas</p>
          ) : (
            <div className='space-y-3 max-h-96 overflow-y-auto'>
              {observations.map((obs) => (
                <div
                  key={obs.id}
                  className='border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition'
                >
                  <div className='flex justify-between items-start'>
                    <div>
                      <div className='font-semibold text-gray-800'>{obs.category}</div>
                      <div className='text-xs text-gray-600'>
                        {obs.date} {obs.time} - Dr. {obs.doctor}
                      </div>
                    </div>
                  </div>
                  <div className='mt-2 text-sm text-gray-700'>
                    <span className='font-medium'>{obs.code}:</span> {obs.value}
                    {obs.unit && <span className='text-gray-500 ml-1'>{obs.unit}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notas para la Visita */}
      <div className='bg-white rounded-lg shadow-md p-6 mt-6'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>📝 Notas de la Visita</h2>
        <textarea
          placeholder='Escribe aquí las notas de esta visita...'
          className='w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <div className='flex gap-2 mt-4'>
          <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'>
            Guardar Notas
          </button>
          <button className='px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition'>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
