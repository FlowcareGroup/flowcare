export interface Prescription {
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