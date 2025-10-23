// @deprecated - Use specific type files instead
// Import from:
// - user.types.ts for User and UserRole
// - credentials.types.ts for LoginCredentials and SignUpData
// - response.types.ts for AuthResponse and Session
// Or use: import * from './index'


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

   PATIENT = "patient",
  DOCTOR = "doctor",
  ADMIN = "admin",
  CLINIC = "clinic",
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


export interface clinics{
id: number
name : string
email: string
NIF: string 
telf: number 
doctors: Array<{ id: number; name: string }>
password: string
}

export interface doctors{
id: number
name : string
email: string
specialty: string 
telf: number 
hours:Date
password: string
clinic: string
}

export * from "./user.types";
export * from "./credentials.types";
export * from "./response.types";

