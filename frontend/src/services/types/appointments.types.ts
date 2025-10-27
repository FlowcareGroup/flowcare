export interface Appointment {
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
  id: number;
  date: string;
  time: string;
  category: string;
  code: string;
  value: string | number;
  unit: string | null;
  doctor: string;
  createdAt: string;
  updatedAt: string;
  value_string?: string;
  value_unit?: string;
  notes?: string;
}


