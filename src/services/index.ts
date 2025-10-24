/**
 * Point d'entrée pour tous les services
 */

export * from './database';
export * from './athleteService';
export * from './measurementService';
export * from './coachService';
export * from './supabaseAthleteService';
export * from './supabaseMeasurementService';
export * from './supabaseCoachService';

export { db } from './database';
export { athleteService } from './athleteService';
export { measurementService } from './measurementService';
export { coachService } from './coachService';
export { supabaseAthleteService } from './supabaseAthleteService';
export { supabaseMeasurementService } from './supabaseMeasurementService';
export { supabaseCoachService } from './supabaseCoachService';
