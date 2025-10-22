-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'patient');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other', 'unknown');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('proposed', 'pending', 'booked', 'arrived', 'fulfilled', 'cancelled', 'noshow');

-- CreateEnum
CREATE TYPE "ObservationStatus" AS ENUM ('registered', 'preliminary', 'final', 'amended');

-- CreateEnum
CREATE TYPE "DoctorStatus" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patients" (
    "id" SERIAL NOT NULL,
    "identifier" VARCHAR(100),
    "password" VARCHAR(255),
    "role" "Role" NOT NULL DEFAULT 'patient',
    "active" BOOLEAN NOT NULL DEFAULT false,
    "name_family" VARCHAR(100),
    "name_given" VARCHAR(100),
    "email" VARCHAR(100) NOT NULL,
    "gender" "Gender",
    "birth_date" DATE,
    "address" TEXT,
    "marital_status" VARCHAR(50),
    "language" VARCHAR(50),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctors" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "telf" VARCHAR(20) NOT NULL,
    "hours" DATE NOT NULL,
    "specialty" VARCHAR(100) NOT NULL,
    "status" "DoctorStatus" NOT NULL DEFAULT 'active',
    "clinic_id" INTEGER NOT NULL,

    CONSTRAINT "Doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clinics" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "NIF" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "telf" VARCHAR(20) NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "Clinics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointments" (
    "id" SERIAL NOT NULL,
    "identifier" VARCHAR(100) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'pending',
    "service_type" VARCHAR(100) NOT NULL,
    "start_time" TIMESTAMP(0) NOT NULL,
    "end_time" TIMESTAMP(0) NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patient_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,

    CONSTRAINT "Appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Observations" (
    "id" SERIAL NOT NULL,
    "identifier" VARCHAR(100) NOT NULL,
    "status" "ObservationStatus" NOT NULL DEFAULT 'registered',
    "category" VARCHAR(100) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "code_display" VARCHAR(200) NOT NULL,
    "effective_datetime" TIMESTAMP(0) NOT NULL,
    "issued_datetime" TIMESTAMP(0) NOT NULL,
    "value_quantity" DECIMAL(10,2),
    "value_unit" VARCHAR(50),
    "value_string" TEXT,
    "interpretation" VARCHAR(100),
    "reference_range" TEXT,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patient_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,

    CONSTRAINT "Observations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescriptions" (
    "id" SERIAL NOT NULL,
    "identifier" VARCHAR(100) NOT NULL,
    "medication" VARCHAR(200) NOT NULL,
    "dose" VARCHAR(100) NOT NULL,
    "frequency" VARCHAR(100) NOT NULL,
    "duration" VARCHAR(100) NOT NULL,
    "instructions" TEXT,
    "status" VARCHAR(50) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "appointment_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,

    CONSTRAINT "Prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Patients_identifier_key" ON "Patients"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "Patients_email_key" ON "Patients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Doctors_email_key" ON "Doctors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Clinics_NIF_key" ON "Clinics"("NIF");

-- CreateIndex
CREATE UNIQUE INDEX "Appointments_identifier_key" ON "Appointments"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "Observations_identifier_key" ON "Observations"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "Prescriptions_identifier_key" ON "Prescriptions"("identifier");

-- AddForeignKey
ALTER TABLE "Doctors" ADD CONSTRAINT "Doctors_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "Clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observations" ADD CONSTRAINT "Observations_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observations" ADD CONSTRAINT "Observations_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescriptions" ADD CONSTRAINT "Prescriptions_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescriptions" ADD CONSTRAINT "Prescriptions_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescriptions" ADD CONSTRAINT "Prescriptions_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
