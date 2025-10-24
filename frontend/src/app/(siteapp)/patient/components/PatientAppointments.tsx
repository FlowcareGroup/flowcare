"use client";

import { useEffect, useState } from "react";
import { getAvailableSlots, createAppointment } from "@/services/api/doctorService";
import { useSession } from "next-auth/react";

export default function PatientAppointments() {
  const { data: session } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const patientId = Number((session as any)?.user?.id);

  const [doctorId, setDoctorId] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [slots, setSlots] = useState<{ time: string, available: boolean }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadSlots = async () => {
      if (!accessToken) return;
      setLoading(true);
      setMessage(null);
      try {
        const res = await getAvailableSlots(String(doctorId), date, accessToken);
        setSlots(res.slots.map((s) => ({ time: s.time, available: s.available })));
      } catch (e: any) {
        setMessage(e?.message || "Error loading slots");
      } finally {
        setLoading(false);
      }
    };
    loadSlots();
  }, [doctorId, date, accessToken]);

  const handleBook = async (time: string) => {
    if (!accessToken || !patientId) return setMessage("Missing credentials");

    const startIso = new Date(`${date}T${time}:00Z`).toISOString();
    const endIso = new Date(new Date(`${date}T${time}:00Z`).getTime() + 15 * 60 * 1000).toISOString();

    setLoading(true);
    setMessage(null);
    try {
      const created = await createAppointment(doctorId, { patient_id: patientId, start_time: startIso, end_time: endIso, service_type: "general", description: "Online booking" }, accessToken);
      setMessage(`Cita creada #${created.id} a las ${time}`);
      const res = await getAvailableSlots(String(doctorId), date, accessToken);
      setSlots(res.slots.map((s) => ({ time: s.time, available: s.available })));
    } catch (e: any) {
      setMessage(e?.message || "Error creating appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm">Doctor ID</label>
        <input type="number" className="border px-2 py-1 rounded w-24" value={doctorId} onChange={(e) => setDoctorId(Number(e.target.value))} />
        <label className="text-sm ml-4">Fecha</label>
        <input type="date" className="border px-2 py-1 rounded" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      {message && <div className="text-sm">{message}</div>}
      {loading && <div className="text-sm">Cargando…</div>}

      <div className="grid grid-cols-4 gap-2">
        {slots.map(({ time, available }) => (
          <button
            key={time}
            className={`px-3 py-2 rounded text-sm ${available ? "bg-emerald-100 hover:bg-emerald-200" : "bg-red-200 cursor-not-allowed"}`}
            disabled={!available || loading}
            onClick={() => handleBook(time)}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}