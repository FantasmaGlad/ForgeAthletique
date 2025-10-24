import { supabase } from '../lib/supabase';
import type { Athlete } from '../types';

interface AthleteRow {
  id: string;
  coach_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  sex: string;
  dominant_hand: string | null;
  dominant_foot: string | null;
  sport: string;
  discipline: string | null;
  position: string | null;
  current_level: string;
  competition_calendar: string | null;
  constraints: string | null;
  medical_history: string | null;
  medical_contacts: any;
  medical_authorizations: string | null;
  goals: any;
  nutrition_profile: any;
  training_plan: any;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

function rowToAthlete(row: AthleteRow): Athlete {
  const dateOfBirth = new Date(row.date_of_birth);
  const today = new Date();
  const age = today.getFullYear() - dateOfBirth.getFullYear();

  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    dateOfBirth,
    age,
    sex: row.sex as 'M' | 'F' | 'Autre',
    dominantHand: row.dominant_hand as any,
    dominantFoot: row.dominant_foot as any,
    sport: row.sport,
    discipline: row.discipline || undefined,
    position: row.position || undefined,
    currentLevel: row.current_level,
    competitionCalendar: row.competition_calendar || undefined,
    constraints: row.constraints || undefined,
    medicalHistory: row.medical_history || undefined,
    medicalContacts: row.medical_contacts || [],
    medicalAuthorizations: row.medical_authorizations || undefined,
    goals: row.goals || {},
    injuryHistory: [],
    nutritionProfile: row.nutrition_profile || undefined,
    trainingPlan: row.training_plan || undefined,
    isArchived: row.is_archived,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export const supabaseAthleteService = {
  async create(athlete: Omit<Athlete, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('athletes')
      .insert({
        coach_id: user.id,
        first_name: athlete.firstName,
        last_name: athlete.lastName,
        date_of_birth: athlete.dateOfBirth.toISOString().split('T')[0],
        sex: athlete.sex,
        dominant_hand: athlete.dominantHand,
        dominant_foot: athlete.dominantFoot,
        sport: athlete.sport,
        discipline: athlete.discipline,
        position: athlete.position,
        current_level: athlete.currentLevel,
        competition_calendar: athlete.competitionCalendar,
        constraints: athlete.constraints,
        medical_history: athlete.medicalHistory,
        medical_contacts: athlete.medicalContacts || [],
        medical_authorizations: athlete.medicalAuthorizations,
        goals: athlete.goals || {},
        nutrition_profile: athlete.nutritionProfile || {},
        training_plan: athlete.trainingPlan || {},
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  },

  async getAll(includeArchived = false): Promise<Athlete[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    let query = supabase
      .from('athletes')
      .select('*')
      .eq('coach_id', user.id);

    if (!includeArchived) {
      query = query.eq('is_archived', false);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(rowToAthlete);
  },

  async getById(id: string): Promise<Athlete | undefined> {
    const { data, error } = await supabase
      .from('athletes')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data ? rowToAthlete(data) : undefined;
  },

  async update(id: string, updates: Partial<Athlete>): Promise<void> {
    const updateData: any = {};

    if (updates.firstName !== undefined) updateData.first_name = updates.firstName;
    if (updates.lastName !== undefined) updateData.last_name = updates.lastName;
    if (updates.dateOfBirth !== undefined) updateData.date_of_birth = updates.dateOfBirth.toISOString().split('T')[0];
    if (updates.sex !== undefined) updateData.sex = updates.sex;
    if (updates.dominantHand !== undefined) updateData.dominant_hand = updates.dominantHand;
    if (updates.dominantFoot !== undefined) updateData.dominant_foot = updates.dominantFoot;
    if (updates.sport !== undefined) updateData.sport = updates.sport;
    if (updates.discipline !== undefined) updateData.discipline = updates.discipline;
    if (updates.position !== undefined) updateData.position = updates.position;
    if (updates.currentLevel !== undefined) updateData.current_level = updates.currentLevel;
    if (updates.competitionCalendar !== undefined) updateData.competition_calendar = updates.competitionCalendar;
    if (updates.constraints !== undefined) updateData.constraints = updates.constraints;
    if (updates.medicalHistory !== undefined) updateData.medical_history = updates.medicalHistory;
    if (updates.medicalContacts !== undefined) updateData.medical_contacts = updates.medicalContacts;
    if (updates.medicalAuthorizations !== undefined) updateData.medical_authorizations = updates.medicalAuthorizations;
    if (updates.goals !== undefined) updateData.goals = updates.goals;
    if (updates.nutritionProfile !== undefined) updateData.nutrition_profile = updates.nutritionProfile;
    if (updates.trainingPlan !== undefined) updateData.training_plan = updates.trainingPlan;
    if (updates.isArchived !== undefined) updateData.is_archived = updates.isArchived;

    const { error } = await supabase
      .from('athletes')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  },

  async archive(id: string): Promise<void> {
    const { error } = await supabase
      .from('athletes')
      .update({ is_archived: true })
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('athletes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async search(query: string): Promise<Athlete[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const lowerQuery = query.toLowerCase();
    const { data, error } = await supabase
      .from('athletes')
      .select('*')
      .eq('coach_id', user.id)
      .or(`first_name.ilike.%${lowerQuery}%,last_name.ilike.%${lowerQuery}%,sport.ilike.%${lowerQuery}%`);

    if (error) throw error;
    return (data || []).map(rowToAthlete);
  },
};
