
export enum AppTab {
  HOME = 'HOME',
  EXPLORE = 'EXPLORE',
  MAP = 'MAP',
  PROFILE = 'PROFILE'
}

export type UserRole = 'TOURIST' | 'ADMIN' | 'RESPONDER' | 'STAFF';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  allowedRoles: UserRole[];
  status?: 'Active' | 'Suspended';
  phone?: string;
  nationality?: string;
  sex?: string;
  age?: number;
  birthdate?: string;
}

export interface Attraction {
  id: string;
  name: string;
  category: 'Nature' | 'Historical' | 'Urban' | 'Beach';
  rating: number;
  imageUrl: string;
  safetyLevel: 'Safe' | 'Caution' | 'High Risk';
  description: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  type: 'Police' | 'Medical' | 'Fire' | 'Tourism';
  distance: string;
}

export interface PersonalContact {
  id: string;
  name: string;
  number: string;
  relation: string;
}

export interface SafetyAlert {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  details: string;
}

export interface Incident {
  id: string;
  type: string;
  location: string;
  distance?: string;
  timeReported: string;
  caller: string;
  contact: string;
  status: 'PENDING' | 'RESOLVED' | 'IN_PROGRESS';
  coordinates?: { lat: number; lng: number };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface WeatherData {
  day: string;
  date: string;
  temp: number;
  condition: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
}
