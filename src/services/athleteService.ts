/**
 * Service de gestion des athlètes (CRUD)
 */

import { db } from './database';
import type { Athlete } from '../types';

export const athleteService = {
  /**
   * Créer un nouvel athlète
   */
  async create(athlete: Omit<Athlete, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();
    const newAthlete: Athlete = {
      ...athlete,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      isArchived: false,
      injuryHistory: athlete.injuryHistory || [],
      goals: athlete.goals || {},
    };

    await db.athletes.add(newAthlete);
    return newAthlete.id;
  },

  /**
   * Récupérer tous les athlètes (non archivés par défaut)
   */
  async getAll(includeArchived = false): Promise<Athlete[]> {
    if (includeArchived) {
      return await db.athletes.toArray();
    }
    // Filtrer les athlètes non archivés
    return await db.athletes.filter(a => !a.isArchived).toArray();
  },

  /**
   * Récupérer un athlète par ID
   */
  async getById(id: string): Promise<Athlete | undefined> {
    return await db.athletes.get(id);
  },

  /**
   * Mettre à jour un athlète
   */
  async update(id: string, updates: Partial<Athlete>): Promise<void> {
    await db.athletes.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  },

  /**
   * Archiver un athlète (soft delete)
   */
  async archive(id: string): Promise<void> {
    await db.athletes.update(id, {
      isArchived: true,
      updatedAt: new Date(),
    });
  },

  /**
   * Supprimer définitivement un athlète et toutes ses données
   */
  async delete(id: string): Promise<void> {
    await db.transaction('rw', [db.athletes, db.measurements, db.trainingSessions], async () => {
      // Supprimer l'athlète
      await db.athletes.delete(id);
      
      // Supprimer toutes ses mesures
      await db.measurements.where('athleteId').equals(id).delete();
      
      // Supprimer toutes ses séances
      const sessions = await db.trainingSessions.where('athleteId').equals(id).toArray();
      const sessionIds = sessions.map(s => s.id);
      
      for (const sessionId of sessionIds) {
        await db.exercisesPerformed.where('sessionId').equals(sessionId).delete();
      }
      
      await db.trainingSessions.where('athleteId').equals(id).delete();
    });
  },

  /**
   * Rechercher des athlètes
   */
  async search(query: string): Promise<Athlete[]> {
    const lowerQuery = query.toLowerCase();
    return await db.athletes
      .filter(athlete => 
        athlete.firstName.toLowerCase().includes(lowerQuery) ||
        athlete.lastName.toLowerCase().includes(lowerQuery) ||
        athlete.sport.toLowerCase().includes(lowerQuery)
      )
      .toArray();
  },
};
