export enum UserRole {
  PATIENT = "patient",
  DOCTOR = "doctor",
  ADMIN = "admin",
  CLINIC = "clinic",
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}
