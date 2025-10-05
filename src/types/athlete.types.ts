/**
 * Types et interfaces pour l'entité Athlète et ses données de profil
 * Basé sur le cahier des charges "La Forge Athlétique"
 */

export interface Athlete {
  id: string;
  // IDENTITÉ & CONTEXTE
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  age: number;
  sex: 'M' | 'F' | 'Autre';
  dominantHand: 'Droite' | 'Gauche' | 'Ambidextre';
  dominantFoot: 'Droit' | 'Gauche' | 'Ambidextre';
  sport: string;
  discipline?: string;
  position?: string;
  currentLevel: string;
  competitionCalendar?: string;
  constraints?: string; // temps/équipement/lieu
  medicalHistory?: string;
  medicalContacts?: MedicalContact[];
  medicalAuthorizations?: string;

  // OBJECTIFS (SMART)
  goals: AthleteGoals;

  // HISTORIQUE DE BLESSURES
  injuryHistory: InjuryRecord[];

  // NUTRITION & HYDRATATION (Préférences)
  nutritionProfile?: NutritionProfile;

  // PLAN D'ENTRAÎNEMENT
  trainingPlan?: TrainingPlan;

  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
}

export interface MedicalContact {
  type: 'Médecin' | 'Kinésithérapeute' | 'Ostéopathe' | 'Autre';
  name: string;
  phone?: string;
  email?: string;
}

export interface AthleteGoals {
  shortTerm?: string; // 1-3 mois
  mediumTerm?: string; // 6-12 mois
  longTerm?: string; // 1-4 ans
  priorities?: string[]; // Top 3
  mainKPIs?: string[];
  evaluationFrequency?: string;
}

export interface InjuryRecord {
  id: string;
  date: Date;
  type: string;
  mechanism?: string;
  diagnosis?: string;
  treatment?: string;
  recoveryDuration?: number; // en jours
  surgery?: boolean;
  rehabProgram?: string;
  riskFactors?: string[];
}

export interface NutritionProfile {
  allergies?: string[];
  intolerances?: string[];
  habits?: string;
  environment?: string; // repas hors domicile, budget, etc.
}

export interface TrainingPlan {
  periodization?: string; // macro/meso/micro-cycles
  weeklyDistribution?: string;
  targetVolumes?: string;
  intensity?: string;
  keySessions?: string;
  plannedProgression?: string;
  deloadSchedule?: string; // semaines de récupération
}
