import { User } from "./user.types"

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
