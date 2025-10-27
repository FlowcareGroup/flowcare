import { DateTime } from "next-auth/providers/kakao";

export interface doctors {
  id: number;
  name: string;
  email: string;
  telf: string;
  specialty: string;
  hours: DateTime,
}