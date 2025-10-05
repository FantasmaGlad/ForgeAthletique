/**
 * Hook personnalisé pour gérer les athlètes
 */

import { useLiveQuery } from 'dexie-react-hooks';
import { athleteService } from '../services';
// Aucun import Athlete nécessaire ici

export function useAthletes(includeArchived = false) {
  const athletes = useLiveQuery(
    () => athleteService.getAll(includeArchived),
    [includeArchived]
  );

  return {
    athletes: athletes || [],
    loading: athletes === undefined,
  };
}

export function useAthlete(id: string | undefined) {
  const athlete = useLiveQuery(
    () => (id ? athleteService.getById(id) : undefined),
    [id]
  );

  return {
    athlete,
    loading: athlete === undefined && id !== undefined,
  };
}
