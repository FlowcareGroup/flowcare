"use client";

import React, { useState } from "react";
import { FaSearch, FaPhone, FaEnvelope, FaCalendar } from "react-icons/fa";
import { searchPatients } from "@/services/api/doctorService";

interface PatientSummary {
  id: number;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  lastAppointment?: string;
}

interface PatientSearchProps {
  doctorId: string;
  accessToken: string;
}

export default function PatientSearch({ doctorId, accessToken }: PatientSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError("Ingresa un nombre o email para buscar");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await searchPatients(doctorId, searchQuery, accessToken);
      setPatients(data.patients || []);
      setSearched(true);
    } catch (err) {
      console.error("Error searching patients:", err);
      setError("Error al buscar pacientes");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setPatients([]);
    setSearched(false);
    setError("");
  };

  return (
    <div className='card mb-12'>
      <h2 className='text-xl font-bold text-darker mb-4'>Buscar Pacientes</h2>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className='mb-6'
      >
        <div className='flex gap-2'>
          <div className='flex-1 relative'>
            <FaSearch className='absolute left-3 top-3 text-gray-400' />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Busca por nombre o email del paciente...'
              className='input-primary pl-10'
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='btn-primary disabled:opacity-50'
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
          {searchQuery && (
            <button
              type='button'
              onClick={handleClearSearch}
              className='btn-secondary'
            >
              Limpiar
            </button>
          )}
        </div>
        {error && <p className='text-red-600 text-sm mt-2'>{error}</p>}
      </form>

      {/* Search Results */}
      {searched && (
        <div>
          {patients.length > 0 ? (
            <div>
              <p className='text-gray-600 mb-4 text-sm'>
                Se encontraron <span className='font-bold'>{patients.length}</span> paciente(s)
              </p>
              <div className='space-y-3'>
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    className='card-primary hover-lift'
                  >
                    <div className='flex justify-between items-start mb-2'>
                      <div>
                        <p className='font-bold text-darker text-lg'>{patient.name}</p>
                        <div className='flex flex-col gap-1 text-sm text-gray-600 mt-2'>
                          <div className='flex items-center gap-2'>
                            <FaEnvelope className='text-primary' />
                            <span>{patient.email}</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <FaPhone className='text-success' />
                            <span>{patient.phone}</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <FaCalendar className='text-dark' />
                            <span>
                              Nacimiento:{" "}
                              {new Date(patient.date_of_birth).toLocaleDateString("es-ES")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          // TODO: Navigate to patient detail or create appointment
                          console.log("Create appointment with patient", patient.id);
                        }}
                        className='btn-success'
                      >
                        Ver Perfil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='text-center py-8'>
              <p className='text-gray-600'>No se encontraron pacientes con "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
