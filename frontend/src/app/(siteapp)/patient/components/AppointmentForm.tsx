"use client";

import { useEffect, useState } from "react";
import { getAllClinics } from "@/services/api/clinicsServices";
import { getAvailableSlots, createAppointment } from "@/services/api/doctorService";
import CalendarPicker from "./CalendarPicker";
import { useSession } from "next-auth/react";

interface Clinic {
  id: number;
  name: string;
  specialties: string[];
  doctors: { id: number; name: string; specialty: string }[];
}

interface Props {
  patientId: number;
  accessToken: string;
  onAppointmentCreated: () => void;
}

export default function AppointmentForm({ patientId, accessToken, onAppointmentCreated }: Props) {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<number | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { data: session } = useSession();

  const backendToken = accessToken || (session as any)?.accessToken || "";

  // 🔹 1. Cargar clínicas con sus doctores
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        // Verificar que el token existe antes de proceder
        if (!backendToken || backendToken.trim() === "") {
          console.error("Token no disponible para getAllClinics");
          setMessage("Error: Debe estar autenticado para ver las clínicas");
          return;
        }

        // 👇 Forzamos el tipo de "data" para que TypeScript entienda la estructura
        const data = (await getAllClinics(backendToken)) as Clinic[];

        // Verificar que la respuesta es un array (no un error)
        if (!Array.isArray(data)) {
          console.error("Respuesta inválida de getAllClinics:", data);
          setMessage("Error al cargar las clínicas");
          return;
        }

        setClinics(data);
        console.log("getAllClinics result:", data);

        // Crear lista de especialidades únicas
        const uniqueSpecialties: string[] = Array.from(
          new Set(
            data.flatMap((clinic: Clinic) =>
              clinic.doctors.map((d: { specialty: string }) => d.specialty)
            )
          )
        );

        setSpecialties(uniqueSpecialties);
      } catch (err) {
        console.error("Error fetching clinics:", err);
        setMessage("Error al cargar las clínicas. Intenta más tarde.");
      }
    };
    fetchClinics();
  }, [backendToken]);

  // 🔹 2. Lógica de interconexión entre selects
  const filteredDoctors = clinics
    .flatMap((c) => c.doctors)
    .filter((d) => {
      if (
        selectedClinic &&
        !clinics.find((c) => c.id === selectedClinic)?.doctors.some((doc) => doc.id === d.id)
      )
        return false;
      if (selectedSpecialty && d.specialty !== selectedSpecialty) return false;
      return true;
    });

  // Si seleccionas doctor, autocompletar clínica y especialidad
  useEffect(() => {
    if (selectedDoctor) {
      const foundClinic = clinics.find((c) => c.doctors.some((d) => d.id === selectedDoctor));
      const foundDoctor = foundClinic?.doctors.find((d) => d.id === selectedDoctor);
      if (foundClinic) setSelectedClinic(foundClinic.id);
      if (foundDoctor) setSelectedSpecialty(foundDoctor.specialty);
    }
  }, [selectedDoctor]);

  // 🔹 3. Cargar slots disponibles al seleccionar fecha y doctor
  useEffect(() => {
    const loadSlots = async () => {
      if (!selectedDoctor || !selectedDate || !accessToken) return;
      setLoadingSlots(true);
      setMessage(null);
      try {
        const res = await getAvailableSlots(String(selectedDoctor), selectedDate, accessToken);
        setAvailableSlots(res.slots);
      } catch (e: any) {
        setMessage("Error cargando horarios disponibles.");
      } finally {
        setLoadingSlots(false);
      }
    };
    loadSlots();
  }, [selectedDoctor, selectedDate]);

  // 🔹 4. Crear nueva cita
  const handleCreateAppointment = async () => {
    if (!selectedDoctor || !selectedTime || !selectedDate || !accessToken) {
      setMessage("Por favor, completa todos los campos.");
      return;
    }

    const startIso = new Date(`${selectedDate}T${selectedTime}:00Z`).toISOString();
    const endIso = new Date(
      new Date(`${selectedDate}T${selectedTime}:00Z`).getTime() + 15 * 60 * 1000
    ).toISOString();

    const payload = {
      patient_id: patientId,
      start_time: startIso,
      end_time: endIso,
      service_type: selectedSpecialty || "general",
      description: "Reserva desde panel de paciente",
    };

    try {
      await createAppointment(selectedDoctor, payload, accessToken);
      setMessage("✅ Cita creada correctamente");
      setSelectedClinic(null);
      setSelectedDoctor(null);
      setSelectedSpecialty(null);
      setSelectedDate("");
      setAvailableSlots([]);
      setSelectedTime(null);
      onAppointmentCreated();
    } catch (err: any) {
      setMessage(err.message || "Error creando cita.");
    }
  };

  return (
    <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mt-8'>
      <h2 className='text-lg font-semibold text-emerald-700'>Nueva cita médica</h2>

      {message && (
        <div className='text-sm bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded'>
          {message}
        </div>
      )}

      {/* Filtros */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Especialidad */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Especialidad</label>
          <select
            className='w-full border rounded-md px-3 py-2'
            value={selectedSpecialty || ""}
            onChange={(e) => setSelectedSpecialty(e.target.value || null)}
          >
            <option value=''>Seleccione</option>
            {specialties.map((sp) => (
              <option
                key={sp}
                value={sp}
              >
                {sp}
              </option>
            ))}
          </select>
        </div>

        {/* Doctor */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Doctor</label>
          <select
            className='w-full border rounded-md px-3 py-2'
            value={selectedDoctor || ""}
            onChange={(e) => setSelectedDoctor(Number(e.target.value) || null)}
          >
            <option value=''>Seleccione</option>
            {filteredDoctors.map((doc) => (
              <option
                key={doc.id}
                value={doc.id}
              >
                {doc.name} ({doc.specialty})
              </option>
            ))}
          </select>
        </div>

        {/* Clínica */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Clínica</label>
          <select
            className='w-full border rounded-md px-3 py-2'
            value={selectedClinic || ""}
            onChange={(e) => setSelectedClinic(Number(e.target.value) || null)}
          >
            <option value=''>Seleccione</option>
            {clinics.map((cl) => (
              <option
                key={cl.id}
                value={cl.id}
              >
                {cl.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fecha */}
      {/* <div className='flex flex-col md:flex-row items-center gap-3'>
        <label className='text-sm font-medium text-gray-700'>Fecha:</label>
        <input
          type='date'
          className='border rounded-md px-3 py-2'
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          disabled={!selectedDoctor}
        />
      </div> */}

      {/* Fecha y calendario */}
      {selectedDoctor && (
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>Selecciona una fecha</label>

          <div className='border border-gray-200 rounded-xl p-4 bg-white'>
            <h3 className='text-emerald-700 font-semibold mb-2'>Selecciona una fecha</h3>
            <CalendarPicker
              selectedDate={selectedDate || null}
              onSelectDate={(date) => setSelectedDate(date)}
              availableDates={
                // opcional: muestra días con disponibilidad (si lo soporta el backend)
                availableSlots.length > 0
                  ? [selectedDate!] // o [] si no hay endpoint para obtener fechas disponibles
                  : []
              }
            />
          </div>
        </div>
      )}

      {/* Horarios disponibles */}
      {loadingSlots && <p className='text-sm text-gray-500'>Cargando horarios...</p>}

      {!loadingSlots && availableSlots.length > 0 && (
        <div className='grid grid-cols-4 md:grid-cols-6 gap-2'>
          {availableSlots.map(({ time, available }) => (
            <button
              key={time}
              className={`px-3 py-2 text-sm rounded ${
                available
                  ? selectedTime === time
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-100 hover:bg-emerald-200"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              disabled={!available}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </button>
          ))}
        </div>
      )}

      {/* Botón de confirmación */}
      <div className='flex justify-end'>
        <button
          onClick={handleCreateAppointment}
          className='px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 text-sm'
        >
          Confirmar cita
        </button>
      </div>
    </div>
  );
}
