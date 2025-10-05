/**
 * Service de gestion du profil coach
 */

import { db } from './database';
import type { CoachProfile } from '../types';

export const coachService = {
  /**
   * Créer ou mettre à jour le profil coach
   */
  async saveProfile(profile: Omit<CoachProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const existing = await db.coachProfile.toArray();
    const now = new Date();

    if (existing.length > 0) {
      // Mettre à jour le profil existant
      const id = existing[0].id;
      await db.coachProfile.update(id, {
        ...profile,
        updatedAt: now,
      });
      return id;
    } else {
      // Créer un nouveau profil
      const newProfile: CoachProfile = {
        ...profile,
        id: 'coach-profile',
        createdAt: now,
        updatedAt: now,
      };
      await db.coachProfile.add(newProfile);
      return newProfile.id;
    }
  },

  /**
   * Récupérer le profil coach
   */
  async getProfile(): Promise<CoachProfile | undefined> {
    const profiles = await db.coachProfile.toArray();
    return profiles.length > 0 ? profiles[0] : undefined;
  },

  /**
   * Initialiser un profil par défaut si aucun n'existe
   */
  async initializeDefaultProfile(): Promise<void> {
    const existing = await this.getProfile();
    if (!existing) {
      await this.saveProfile({
        firstName: 'Coach',
        lastName: 'Pro',
        preferences: {
          theme: 'dark',
          language: 'fr',
          notifications: true,
          measurementUnits: 'metric',
        },
      });
    }
  },
};
