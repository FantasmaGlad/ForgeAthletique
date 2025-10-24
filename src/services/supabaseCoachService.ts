import { supabase } from '../lib/supabase';
import type { CoachProfile } from '../types';

interface CoachRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  specialization: string | null;
  certifications: string[];
  bio: string | null;
  avatar: string | null;
  preferences: any;
  created_at: string;
  updated_at: string;
}

function rowToCoach(row: CoachRow): CoachProfile {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email || undefined,
    phone: row.phone || undefined,
    specialization: row.specialization || undefined,
    certifications: row.certifications || [],
    bio: row.bio || undefined,
    avatar: row.avatar || undefined,
    preferences: row.preferences || {
      theme: 'light',
      language: 'fr',
      notifications: true,
      measurementUnits: 'metric',
    },
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export const supabaseCoachService = {
  async getCurrentProfile(): Promise<CoachProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data ? rowToCoach(data) : null;
  },

  async updateProfile(updates: Partial<CoachProfile>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const updateData: any = {};

    if (updates.firstName !== undefined) updateData.first_name = updates.firstName;
    if (updates.lastName !== undefined) updateData.last_name = updates.lastName;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.specialization !== undefined) updateData.specialization = updates.specialization;
    if (updates.certifications !== undefined) updateData.certifications = updates.certifications;
    if (updates.bio !== undefined) updateData.bio = updates.bio;
    if (updates.avatar !== undefined) updateData.avatar = updates.avatar;
    if (updates.preferences !== undefined) updateData.preferences = updates.preferences;

    const { error } = await supabase
      .from('coaches')
      .update(updateData)
      .eq('id', user.id);

    if (error) throw error;
  },

  async updatePreferences(preferences: Partial<CoachProfile['preferences']>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const currentProfile = await this.getCurrentProfile();
    const updatedPreferences = {
      ...currentProfile?.preferences,
      ...preferences,
    };

    const { error } = await supabase
      .from('coaches')
      .update({ preferences: updatedPreferences })
      .eq('id', user.id);

    if (error) throw error;
  },
};
