/**
 * Service de gestion des mesures temporelles
 */

import { db } from './database';
import type { Measurement, PersonalRecord, DateRange } from '../types';

export const measurementService = {
  /**
   * Créer une nouvelle mesure
   */
  async create(measurement: Omit<Measurement, 'id' | 'createdAt'>): Promise<string> {
    const newMeasurement: Measurement = {
      ...measurement,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    await db.measurements.add(newMeasurement);
    return newMeasurement.id;
  },

  /**
   * Récupérer toutes les mesures d'un athlète
   */
  async getByAthlete(athleteId: string): Promise<Measurement[]> {
    return await db.measurements
      .where('athleteId')
      .equals(athleteId)
      .sortBy('date');
  },

  /**
   * Récupérer les mesures d'un athlète pour une métrique spécifique
   */
  async getByAthleteAndMetric(
    athleteId: string,
    metricTypeId: string,
    dateRange?: DateRange
  ): Promise<Measurement[]> {
    let query = db.measurements
      .where(['athleteId', 'metricTypeId'])
      .equals([athleteId, metricTypeId]);

    if (dateRange) {
      query = query.filter(m => 
        m.date >= dateRange.start && m.date <= dateRange.end
      );
    }

    return await query.sortBy('date');
  },

  /**
   * Récupérer les dernières mesures d'un athlète
   */
  async getLatest(athleteId: string, limit = 10): Promise<Measurement[]> {
    return await db.measurements
      .where('athleteId')
      .equals(athleteId)
      .reverse()
      .sortBy('date')
      .then(results => results.slice(0, limit));
  },

  /**
   * Mettre à jour une mesure
   */
  async update(id: string, updates: Partial<Measurement>): Promise<void> {
    await db.measurements.update(id, updates);
  },

  /**
   * Supprimer une mesure
   */
  async delete(id: string): Promise<void> {
    await db.measurements.delete(id);
  },

  /**
   * Calculer les records personnels pour un athlète
   */
  async getPersonalRecords(athleteId: string): Promise<PersonalRecord[]> {
    const measurements = await db.measurements
      .where('athleteId')
      .equals(athleteId)
      .toArray();

    const metricTypes = await db.metricTypes.toArray();
    const metricTypeMap = new Map(metricTypes.map(mt => [mt.id, mt]));

    // Grouper par type de métrique
    const byMetric = new Map<string, Measurement[]>();
    
    for (const measurement of measurements) {
      if (!byMetric.has(measurement.metricTypeId)) {
        byMetric.set(measurement.metricTypeId, []);
      }
      byMetric.get(measurement.metricTypeId)!.push(measurement);
    }

    // Trouver le record pour chaque métrique
    const records: PersonalRecord[] = [];

    for (const [metricTypeId, measures] of byMetric.entries()) {
      const metricType = metricTypeMap.get(metricTypeId);
      if (!metricType || measures.length === 0) continue;

      // Ne considérer que les valeurs numériques
      const numericMeasures = measures.filter(m => typeof m.value === 'number');
      if (numericMeasures.length === 0) continue;

      const bestMeasure = metricType.isHigherBetter
        ? numericMeasures.reduce((best, current) => 
            (current.value as number) > (best.value as number) ? current : best
          )
        : numericMeasures.reduce((best, current) => 
            (current.value as number) < (best.value as number) ? current : best
          );

      records.push({
        metricTypeId,
        metricName: metricType.name,
        value: bestMeasure.value as number,
        unit: metricType.unit,
        date: bestMeasure.date,
        isHigherBetter: metricType.isHigherBetter,
      });
    }

    return records;
  },
};
