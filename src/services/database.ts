/**
 * Configuration de la base de données IndexedDB avec Dexie
 * Gestion de la persistance locale pour l'application
 */

import Dexie, { type Table } from 'dexie';
import type {
  Athlete,
  Measurement,
  MetricType,
  TrainingSession,
  ExercisePerformed,
  Exercise,
  CoachProfile,
} from '../types';

export class LaForgeDatabase extends Dexie {
  // Tables
  athletes!: Table<Athlete, string>;
  measurements!: Table<Measurement, string>;
  metricTypes!: Table<MetricType, string>;
  trainingSessions!: Table<TrainingSession, string>;
  exercisesPerformed!: Table<ExercisePerformed, string>;
  exercises!: Table<Exercise, string>;
  coachProfile!: Table<CoachProfile, string>;

  constructor() {
    super('LaForgeAthletique');

    this.version(2).stores({
      athletes: 'id, lastName, firstName, sport, isArchived, createdAt',
      measurements: 'id, athleteId, metricTypeId, date, [athleteId+metricTypeId]',
      metricTypes: 'id, name, category',
      trainingSessions: 'id, athleteId, date, [athleteId+date]',
      exercisesPerformed: 'id, sessionId, exerciseId',
      exercises: 'id, name, category, type, isCustom',
      coachProfile: 'id',
    });
  }
}

// Instance singleton de la base de données
export const db = new LaForgeDatabase();
