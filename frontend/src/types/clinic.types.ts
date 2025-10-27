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
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
  CLINIC = 'clinic'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpData {
  name_given: string
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