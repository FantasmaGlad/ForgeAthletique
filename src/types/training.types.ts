/**
 * Types pour les séances d'entraînement et exercices
 */

export interface TrainingSession {
  id: string;
  athleteId: string;
  date: Date;
  name: string;
  warmup?: string;
  conditioning?: string;
  mobility?: string;
  exercises: ExercisePerformed[];
  globalRPE?: number; // 1-10
  postFatigue?: number; // 1-10
  pain?: {
    level: number; // 0-10
    location?: string;
  };
  comments?: string; // sommeil, stress, nutrition du jour
  duration?: number; // minutes
  totalVolume?: number; // tonnage total
  createdAt: Date;
  updatedAt: Date;
}

export interface ExercisePerformed {
  id: string;
  sessionId: string;
  exerciseId: string; // Référence à la bibliothèque
  sets: ExerciseSet[];
  rpe?: number; // 1-10 par exercice
  tempo?: string; // ex: "3-0-1-0"
  notes?: string;
  order: number; // ordre dans la séance
}

export interface ExerciseSet {
  setNumber: number;
  reps: number;
  weight?: number; // kg
  duration?: number; // secondes (pour exercices isométriques)
  distance?: number; // mètres (pour sprints, etc.)
  rest?: number; // secondes
  rpe?: number; // RPE par série si nécessaire
  completed: boolean;
}

// Bibliothèque d'exercices
export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  type: ExerciseType;
  description?: string;
  muscleGroups?: string[];
  equipment?: string[];
  videoUrl?: string;
  isCustom: boolean; // créé par l'utilisateur vs pré-défini
  createdAt: Date;
}

export type ExerciseCategory =
  | 'POLYARTICULAIRE'
  | 'ISOLATION'
  | 'PREHAB'
  | 'MOBILITE'
  | 'CARDIO'
  | 'PLIOMETRIE'
  | 'FORCE_ATHLETIQUE';

export type ExerciseType =
  | 'SQUAT'
  | 'DEADLIFT'
  | 'BENCH_PRESS'
  | 'OVERHEAD_PRESS'
  | 'PULL'
  | 'LUNGE'
  | 'HINGE'
  | 'CARRY'
  | 'OLYMPIC_LIFT'
  | 'SPRINT'
  | 'JUMP'
  | 'THROW'
  | 'AUTRE';

// Calculs de charge d'entraînement
export interface TrainingLoad {
  sessionId: string;
  date: Date;
  totalVolume: number; // tonnage
  totalReps: number;
  totalSets: number;
  sessionRPE: number;
  duration: number; // minutes
  load: number; // RPE x duration
  acuteLoad?: number; // moyenne 7 derniers jours
  chronicLoad?: number; // moyenne 28 derniers jours
  acuteChronicRatio?: number; // A:C ratio
}
