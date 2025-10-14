// Tipos relacionados con autenticación

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  PATIENT = "PATIENT",
  DOCTOR = "DOCTOR",
  ADMIN = "ADMIN",
  MEDICAL_CENTER = "MEDICAL_CENTER",
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}

export interface Session {
  user: User
  token: string
  role: string
  accessToken: string
  expiresAt: Date
}
