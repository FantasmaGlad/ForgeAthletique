/**
 * Types pour les mesures temporelles (KPIs)
 * Structure flexible pour tous types de métriques
 */

export interface Measurement {
  id: string;
  athleteId: string;
  metricTypeId: string;
  date: Date;
  value: number | string;
  unit: string;
  notes?: string;
  createdAt: Date;
}

export interface MetricType {
  id: string;
  name: string;
  category: MetricCategory;
  unit: string;
  dataType: 'number' | 'string' | 'boolean';
  description?: string;
  isHigherBetter: boolean; // Pour déterminer les records
}

export type MetricCategory =
  | 'ANTHROPOMETRIE'
  | 'FORCE_MAXIMALE'
  | 'PUISSANCE_VITESSE'
  | 'ENDURANCE'
  | 'WELLNESS'
  | 'CHARGE_ENTRAINEMENT'
  | 'NUTRITION';

// Types spécifiques pour chaque catégorie

// ANTHROPOMÉTRIE
export interface AnthropometryData {
  height?: number; // cm
  weight?: number; // kg
  bmi?: number;
  circumferences?: {
    neck?: number;
    shoulders?: number;
    chest?: number;
    waist?: number;
    hips?: number;
    armLeft?: number;
    armRight?: number;
    forearmLeft?: number;
    forearmRight?: number;
    thighLeft?: number;
    thighRight?: number;
    calfLeft?: number;
    calfRight?: number;
  };
  skinfolds?: {
    biceps?: number;
    triceps?: number;
    subscapular?: number;
    suprailiac?: number;
    abdominal?: number;
    thigh?: number;
    calf?: number;
  };
  bodyFatPercentage?: number;
  leanMass?: number; // kg
}

// FORCE MAXIMALE
export type RMType = '1RM' | '3RM' | '5RM' | '8RM';

export interface StrengthTest {
  exerciseId: string;
  rmType: RMType;
  weight: number; // kg
  notes?: string;
}

// PUISSANCE & VITESSE
export interface PowerTest {
  type: 'CMJ' | 'SJ' | 'DropJump';
  height?: number; // cm
  rsi?: number; // Reactive Strength Index
  contactTime?: number; // ms
  power?: number; // watts
}

export interface SprintTest {
  distance: number; // m (10, 20, 30, 40)
  time: number; // s
  maxSpeed?: number; // m/s
}

export interface AgilityTest {
  type: 'T-Test' | '505' | 'Illinois';
  time: number; // s
}

// ENDURANCE
export interface EnduranceTest {
  type: 'Yo-Yo-IR1' | 'Yo-Yo-IR2' | '30-15-IFT' | 'VAM' | 'Cooper';
  result: number;
  vo2max?: number;
  estimatedVo2max?: number;
}

export interface ThresholdTest {
  type: 'Lactate' | 'FTP' | 'HRVT';
  value: number;
  unit: string;
}

export interface HeartRateData {
  restingHR?: number; // bpm
  maxHR?: number; // bpm
  hrv?: number; // ms
}

// WELLNESS QUOTIDIEN
export interface WellnessData {
  date: Date;
  sleepDuration?: number; // heures
  sleepQuality?: number; // 1-5
  fatigue?: number; // 1-5
  soreness?: number; // 1-5
  stress?: number; // 1-5
  mood?: number; // 1-5
  pain?: {
    level: number; // 0-10
    location?: string;
  };
  appetite?: number; // 1-5
  hydration?: number; // litres
  menstrualCycle?: string;
  notes?: string;
}
