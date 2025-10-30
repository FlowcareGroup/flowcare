const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api'

export interface PersonalData {
  name_given: string
  name_family: string | null
  email: string
  gender: string | null
  birth_date: string | null
  address: string | null
  marital_status: string | null
  identifier: string | null
}

export interface Appointment {
  id: number
  date: string
  time: string
  endTime: string
  status: string
  doctor: string
  service_type: string
  description: string
}

export interface Observation {
  id: number
  date: string
  time: string
  category: string
  code: string
  value: string | number
  unit: string | null
  doctor: string
}

export interface PatientProfile {
  id: number
  personalData: PersonalData
  appointments: Appointment[]
  observations: Observation[]
}

const getPatientProfile = async (
  patientId: number,
  accessToken: string
): Promise<PatientProfile> => {
  const requestOptions: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    cache: 'no-store'
  }

  const url = `${BACKEND_URL}/patients/${patientId}`
  console.log('Fetching patient profile from:', url)

  const response = await fetch(url, requestOptions)

  if (!response.ok) {
    const errorBody = await response.text()
    console.error(`Backend returned status ${response.status}: ${errorBody}`)
    throw new Error(`Failed to fetch patient profile: HTTP ${response.status}`)
  }

  const data = await response.json()
  console.log('Patient profile data:', data)
  return data
}

const updatePatientProfile = async (
  patientId: number,
  data: any,
  accessToken: string
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patientspatients/${patientId}/EditProfile`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(data)
    }
  )
  if (!res.ok) throw new Error('Error updating profile')
  return res.json()
}

const deletePatientAccount = async (patientId: number, accessToken: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/${patientId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
  if (!res.ok) throw new Error('Error deleting account')
  return res.json()
}

export { getPatientProfile, updatePatientProfile, deletePatientAccount }
