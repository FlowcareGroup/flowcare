# 🚀 Quick Start Guide - Testing the New Features

## Prerequisites

- PostgreSQL running (Docker container with docker-compose)
- Node.js 18+ installed
- pnpm package manager

---

## Step 1: Database Migration

Run the Prisma migration to create the new `Prescription` table:

```bash
cd backend
npx prisma migrate dev --name add_prescriptions
```

This will:

- Create the `Prescription` table
- Set up all foreign keys to Appointments, Patients, and Doctors
- Generate updated Prisma client

---

## Step 2: Start Backend Server

```bash
cd backend
npm run dev
# or
pnpm dev
```

Server should start on `http://localhost:4000`

---

## Step 3: Start Frontend Development Server

```bash
cd frontend
npm run dev
# or
pnpm dev
```

Frontend should start on `http://localhost:3000`

---

## Step 4: Test the Features

### Feature 1: Prescriptions

1. Login as a doctor
2. Navigate to an appointment detail page
3. Click the "Prescripciones" tab
4. Fill in: Medication (e.g., "Amoxicilina"), Dose (e.g., "500mg"), Frequency (e.g., "Cada 8 horas"), Duration (e.g., "7 días")
5. Optionally add instructions
6. Click "Guardar Prescripción"
7. Verify prescription appears in the list below the form

### Feature 2: Patient Search

1. From the doctor dashboard
2. Scroll down to "Buscar Pacientes" section
3. Enter a patient name or email in the search box
4. Click "Buscar"
5. View results with patient details (name, email, phone, birth date)
6. Click "Ver Perfil" button (placeholder for future feature)

### Feature 3: Statistics Dashboard

1. From the doctor dashboard
2. View the statistics cards at the top showing:
   - **Today's Appointments**: Total, Completed, Pending, Cancelled
   - **Last Month's Stats**: Total appointments, Unique patients
3. Click "Actualizar" button to manually refresh
4. Wait 30 seconds to see auto-refresh in action

---

## API Endpoints Reference

### Prescriptions

- **POST** `/api/doctors/:doctorId/appointments/:appointmentId/prescriptions`
  - Body: `{ medication, dose, frequency, duration, instructions? }`
- **GET** `/api/doctors/:doctorId/appointments/:appointmentId/prescriptions`
  - Returns: `{ prescriptions: [...] }`

### Patient Search

- **GET** `/api/doctors/:doctorId/search-patients?search=query`
  - Returns: `{ patients: [...] }`

### Statistics

- **GET** `/api/doctors/:doctorId/statistics`
  - Returns: `{ statistics: { today: {...}, lastMonth: {...} } }`

---

## Troubleshooting

### Import Errors in VS Code

- Close and reopen VS Code
- Run `npm install` in both frontend and backend directories
- Clear the TypeScript cache

### Prescription Endpoint Returns 404

- Verify the doctor ID is correct
- Check that appointment exists for that appointment ID
- Ensure the route is defined before generic `/:id` routes (it is!)

### Statistics Shows 0 Appointments

- Create some test appointments first
- Make sure appointments are assigned to the logged-in doctor
- Check database connection

### Frontend Can't Connect to Backend

- Verify backend is running on port 4000
- Check `.env.local` has correct `BACKEND_URL=http://localhost:4000/api`
- Check CORS is not blocking requests

---

## Next Steps

### Before Presentation

- [ ] Test all 3 features thoroughly
- [ ] Test error cases (empty search, invalid data)
- [ ] Verify responsive design on mobile
- [ ] Test with multiple doctors/patients

### Post-Presentation Improvements

- [ ] Add patient profile detail page (click "Ver Perfil")
- [ ] Add prescription edit/delete functionality
- [ ] Add export prescriptions to PDF
- [ ] Add appointment history filtering
- [ ] Add notifications for new appointments
- [ ] Add doctor availability management

---

## Files Modified in This Session

**Backend**:

- `prisma/schema.prisma` - New Prescription model
- `src/controllers/doctors.controller.js` - 4 new methods
- `src/routers/doctor.routing.js` - 4 new routes

**Frontend**:

- `src/app/(siteapp)/doctor/page.tsx` - Integrated new components
- `src/app/(siteapp)/doctor/appointment/[id]/page.tsx` - Prescriptions tab
- `src/app/(siteapp)/doctor/components/DoctorDashboard.tsx` - NEW
- `src/app/(siteapp)/doctor/components/PatientSearch.tsx` - NEW
- `src/services/api/doctorService.ts` - 4 new service methods

---

## Questions?

If you encounter any issues, check:

1. The browser console for client-side errors
2. The terminal output for server-side errors
3. The database connection status
4. The environment variables in `.env.local` (frontend) and `.env` (backend)

Happy testing! 🎉
