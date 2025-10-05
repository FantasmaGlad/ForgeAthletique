/**
 * Types pour le profil du coach/utilisateur
 */

export interface CoachProfile {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  specialization?: string;
  certifications?: string[];
  bio?: string;
  avatar?: string; // URL ou base64
  preferences: CoachPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface CoachPreferences {
  theme?: 'dark' | 'light';
  language?: 'fr' | 'en';
  defaultView?: string;
  notifications?: boolean;
  measurementUnits?: 'metric' | 'imperial';
}
