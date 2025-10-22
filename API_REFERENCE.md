# API Payload Reference

## 1. Prescriptions Endpoints

### Add Prescription

```
POST /api/doctors/{doctorId}/appointments/{appointmentId}/prescriptions
Content-Type: application/json
Authorization: Bearer {accessToken}

REQUEST BODY:
{
  "medication": "Amoxicilina",
  "dose": "500mg",
  "frequency": "Cada 8 horas",
  "duration": "7 días",
  "instructions": "Tomar con alimentos, evitar leche"  // optional
}

RESPONSE (201 Created):
{
  "id": 1,
  "identifier": "RX-2025-10-001",
  "medication": "Amoxicilina",
  "dose": "500mg",
  "frequency": "Cada 8 horas",
  "duration": "7 días",
  "instructions": "Tomar con alimentos, evitar leche",
  "status": "active",
  "appointmentId": 42,
  "patientId": 5,
  "doctorId": 3,
  "created_at": "2025-10-21T14:30:00.000Z",
  "updated_at": "2025-10-21T14:30:00.000Z"
}

ERROR RESPONSE (400 Bad Request):
{
  "error": "Missing required fields: medication, dose, frequency, duration"
}
```

### Get Prescriptions for Appointment

```
GET /api/doctors/{doctorId}/appointments/{appointmentId}/prescriptions
Authorization: Bearer {accessToken}

RESPONSE (200 OK):
{
  "prescriptions": [
    {
      "id": 1,
      "identifier": "RX-2025-10-001",
      "medication": "Amoxicilina",
      "dose": "500mg",
      "frequency": "Cada 8 horas",
      "duration": "7 días",
      "instructions": "Tomar con alimentos",
      "status": "active",
      "created_at": "2025-10-21T14:30:00.000Z"
    },
    {
      "id": 2,
      "identifier": "RX-2025-10-002",
      "medication": "Paracetamol",
      "dose": "500mg",
      "frequency": "Cada 6 horas",
      "duration": "3 días",
      "instructions": null,
      "status": "active",
      "created_at": "2025-10-21T14:45:00.000Z"
    }
  ]
}

ERROR RESPONSE (404 Not Found):
{
  "error": "Appointment not found"
}
```

---

## 2. Patient Search Endpoint

### Search Patients

```
GET /api/doctors/{doctorId}/search-patients?search={query}
Authorization: Bearer {accessToken}

QUERY PARAMETERS:
- search: string (min 1 char) - searches in name and email fields

EXAMPLE:
GET /api/doctors/3/search-patients?search=juan

RESPONSE (200 OK):
{
  "patients": [
    {
      "id": 5,
      "name": "Juan García López",
      "email": "juan.garcia@example.com",
      "phone": "+34 912 345 678",
      "date_of_birth": "1985-03-15"
    },
    {
      "id": 12,
      "name": "Juanita Martínez",
      "email": "juanita.martinez@example.com",
      "phone": "+34 934 567 890",
      "date_of_birth": "1992-07-22"
    }
  ]
}

RESPONSE - No Results (200 OK):
{
  "patients": []
}

ERROR RESPONSE (400 Bad Request):
{
  "error": "Search query is required"
}
```

---

## 3. Statistics Endpoint

### Get Doctor Statistics

```
GET /api/doctors/{doctorId}/statistics
Authorization: Bearer {accessToken}

RESPONSE (200 OK):
{
  "statistics": {
    "today": {
      "total": 5,
      "completed": 2,
      "pending": 2,
      "cancelled": 1
    },
    "lastMonth": {
      "total": 42,
      "uniquePatients": 28
    }
  }
}

BREAKDOWN:
- today.total: All appointments for today (any status)
- today.completed: Appointments with status="completed"
- today.pending: Appointments with status="pending"
- today.cancelled: Appointments with status="cancelled" or "noshow"
- lastMonth.total: All appointments from last 30 days
- lastMonth.uniquePatients: Count of distinct patients in last 30 days

RESPONSE STRUCTURE (no errors expected):
{
  "statistics": {
    "today": {
      "total": 0,
      "completed": 0,
      "pending": 0,
      "cancelled": 0
    },
    "lastMonth": {
      "total": 0,
      "uniquePatients": 0
    }
  }
}
```

---

## 4. Combined: Appointment Detail with Prescriptions

### Get Appointment Details (existing, now used with prescriptions)

```
GET /api/doctors/{doctorId}/appointments/{appointmentId}
Authorization: Bearer {accessToken}

RESPONSE (200 OK):
{
  "data": {
    "id": 42,
    "start_time": "2025-10-21T15:00:00.000Z",
    "end_time": "2025-10-21T16:00:00.000Z",
    "status": "completed",
    "service_type": "Consulta General",
    "description": "Revisión de presión arterial",
    "patient": {
      "id": 5,
      "name": "Juan García López",
      "email": "juan.garcia@example.com",
      "phone": "+34 912 345 678",
      "date_of_birth": "1985-03-15"
    },
    "doctor": {
      "id": 3,
      "name": "Dr. Francisco López",
      "specialty": "Medicina General"
    },
    "observations": [
      {
        "id": "obs-1",
        "category": "clinical",
        "code": "BP",
        "value_string": "140/90",
        "value_unit": "mmHg",
        "notes": "Presión elevada",
        "status": "active",
        "createdAt": "2025-10-21T15:05:00.000Z"
      }
    ],
    "prescriptions": [
      // <- NOW populated via separate endpoint
    ],
    "previousAppointments": [
      {
        "id": 41,
        "start_time": "2025-10-14T14:00:00.000Z",
        "end_time": "2025-10-14T15:00:00.000Z",
        "status": "completed",
        "service_type": "Seguimiento",
        "description": null
      }
    ],
    "created_at": "2025-10-15T10:00:00.000Z"
  }
}
```

---

## Testing with cURL

### Test Add Prescription

```bash
curl -X POST http://localhost:4000/api/doctors/3/appointments/42/prescriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "medication": "Amoxicilina",
    "dose": "500mg",
    "frequency": "Cada 8 horas",
    "duration": "7 días",
    "instructions": "Con alimentos"
  }'
```

### Test Get Prescriptions

```bash
curl -X GET http://localhost:4000/api/doctors/3/appointments/42/prescriptions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test Patient Search

```bash
curl -X GET "http://localhost:4000/api/doctors/3/search-patients?search=juan" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test Statistics

```bash
curl -X GET http://localhost:4000/api/doctors/3/statistics \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Frontend Service Usage

### TypeScript Interfaces

```typescript
// Prescription
interface Prescription {
  id: number;
  identifier: string;
  medication: string;
  dose: string;
  frequency: string;
  duration: string;
  instructions?: string;
  status: string;
  created_at: string;
}

// Add Prescription Payload
interface AddPrescriptionPayload {
  medication: string;
  dose: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

// Patient Summary
interface PatientSummary {
  id: number;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
}

// Statistics
interface StatisticsData {
  today: {
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
  };
  lastMonth: {
    total: number;
    uniquePatients: number;
  };
}
```

### Service Method Calls

```typescript
// Add prescription
import { addPrescriptionToAppointment } from "@/services/api/doctorService";

const response = await addPrescriptionToAppointment(
  "3", // doctorId (string)
  42, // appointmentId (number)
  {
    medication: "Amoxicilina",
    dose: "500mg",
    frequency: "Cada 8 horas",
    duration: "7 días",
    instructions: "Con alimentos",
  },
  "eyJhbGc..." // accessToken
);
// Returns: Prescription object

// Get prescriptions
import { getPrescriptionsForAppointment } from "@/services/api/doctorService";

const response = await getPrescriptionsForAppointment(
  "3", // doctorId
  42, // appointmentId
  "eyJhbGc..."
);
// Returns: { prescriptions: Prescription[] }

// Search patients
import { searchPatients } from "@/services/api/doctorService";

const response = await searchPatients(
  "3", // doctorId
  "juan", // searchQuery
  "eyJhbGc..."
);
// Returns: { patients: PatientSummary[] }

// Get statistics
import { getDoctorStatistics } from "@/services/api/doctorService";

const response = await getDoctorStatistics(
  "3", // doctorId
  "eyJhbGc..."
);
// Returns: { statistics: StatisticsData }
```

---

## Status Codes Summary

| Code | Meaning      | Common Cause                  |
| ---- | ------------ | ----------------------------- |
| 200  | OK           | Successful GET request        |
| 201  | Created      | Successful POST request       |
| 400  | Bad Request  | Missing/invalid fields        |
| 401  | Unauthorized | Missing/invalid token         |
| 403  | Forbidden    | Doctor ID doesn't match token |
| 404  | Not Found    | Resource doesn't exist        |
| 500  | Server Error | Backend issue                 |
