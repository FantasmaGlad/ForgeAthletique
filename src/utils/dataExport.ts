/**
 * Utilitaires pour l'export et l'import de données
 */

import { db } from '../services/database';

/**
 * Exporter toutes les données au format JSON
 */
export async function exportAllDataToJSON(): Promise<string> {
  try {
    // Récupérer toutes les données des tables
    const athletes = await db.athletes.toArray();
    const measurements = await db.measurements.toArray();
    const metricTypes = await db.metricTypes.toArray();
    const trainingSessions = await db.trainingSessions.toArray();
    const exercisesPerformed = await db.exercisesPerformed.toArray();
    const exercises = await db.exercises.toArray();

    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0',
        description: 'Export complet des données La Forge Athlétique',
      },
      athletes,
      measurements,
      metricTypes,
      trainingSessions,
      exercisesPerformed,
      exercises,
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Erreur lors de l\'export des données:', error);
    throw new Error('Impossible d\'exporter les données');
  }
}

/**
 * Importer des données depuis un fichier JSON
 */
export async function importDataFromJSON(jsonString: string): Promise<{
  athletes: number;
  measurements: number;
  trainingSessions: number;
  exercises: number;
}> {
  try {
    const importData = JSON.parse(jsonString);

    if (!importData.athletes || !importData.measurements || !importData.metricTypes) {
      throw new Error('Format de fichier JSON invalide');
    }

    // Importer les données dans l'ordre des dépendances
    let athletesCount = 0;
    let measurementsCount = 0;
    let trainingSessionsCount = 0;
    let exercisesCount = 0;

    // 1. Importer les métriques d'abord (dépendances)
    if (importData.metricTypes && importData.metricTypes.length > 0) {
      await db.metricTypes.bulkPut(importData.metricTypes);
    }

    // 2. Importer les exercices (dépendances)
    if (importData.exercises && importData.exercises.length > 0) {
      await db.exercises.bulkPut(importData.exercises);
      exercisesCount = importData.exercises.length;
    }

    // 3. Importer les athlètes
    if (importData.athletes && importData.athletes.length > 0) {
      await db.athletes.bulkPut(importData.athletes);
      athletesCount = importData.athletes.length;
    }

    // 4. Importer les mesures
    if (importData.measurements && importData.measurements.length > 0) {
      await db.measurements.bulkPut(importData.measurements);
      measurementsCount = importData.measurements.length;
    }

    // 5. Importer les séances d'entraînement
    if (importData.trainingSessions && importData.trainingSessions.length > 0) {
      await db.trainingSessions.bulkPut(importData.trainingSessions);
      trainingSessionsCount = importData.trainingSessions.length;
    }

    // 6. Importer les exercices réalisés
    if (importData.exercisesPerformed && importData.exercisesPerformed.length > 0) {
      await db.exercisesPerformed.bulkPut(importData.exercisesPerformed);
    }

    return {
      athletes: athletesCount,
      measurements: measurementsCount,
      trainingSessions: trainingSessionsCount,
      exercises: exercisesCount,
    };
  } catch (error) {
    console.error('Erreur lors de l\'import des données:', error);
    throw new Error('Impossible d\'importer les données');
  }
}

/**
 * Télécharger les données au format JSON
 */
export function downloadDataAsJSON() {
  exportAllDataToJSON()
    .then(jsonData => {
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `la-forge-athletique-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();

      URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors de l\'export des données');
    });
}

/**
 * Calculer les corrélations entre deux séries de données
 */
export function calculateCorrelation(data1: number[], data2: number[]): number {
  if (data1.length !== data2.length || data1.length < 2) {
    return 0;
  }

  const n = data1.length;
  const sum1 = data1.reduce((a, b) => a + b, 0);
  const sum2 = data2.reduce((a, b) => a + b, 0);

  const sum1Sq = data1.reduce((a, b) => a + b * b, 0);
  const sum2Sq = data2.reduce((a, b) => a + b * b, 0);

  const pSum = data1.reduce((a, b, i) => a + b * data2[i], 0);

  const num = pSum - (sum1 * sum2 / n);
  const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));

  if (den === 0) return 0;

  return num / den;
}

/**
 * Analyser les corrélations entre plusieurs métriques
 */
export function analyzeCorrelations(
  athleteId: string,
  metricIds: string[],
  _dateRange?: { start: Date; end: Date }
): Promise<Array<{
  metric1: string;
  metric2: string;
  correlation: number;
  strength: string;
  dataPoints: number;
}>> {
  return new Promise(async (resolve) => {
    try {
      const correlations: Array<{
        metric1: string;
        metric2: string;
        correlation: number;
        strength: string;
        dataPoints: number;
      }> = [];

      // Récupérer les données pour chaque métrique
      const metricData = new Map<string, Array<{ date: Date; value: number }>>();

      for (const metricId of metricIds) {
        const measurements = await db.measurements
          .where('[athleteId+metricTypeId]')
          .equals([athleteId, metricId])
          .toArray();

        if (measurements.length > 0) {
          metricData.set(metricId, measurements.map(m => ({
            date: new Date(m.date),
            value: typeof m.value === 'number' ? m.value : parseFloat(m.value as string) || 0,
          })));
        }
      }

      // Récupérer les noms des métriques
      const metricTypes = await db.metricTypes.where('id').anyOf(metricIds).toArray();
      const metricNames = new Map(metricTypes.map(m => [m.id, m.name]));

      // Calculer les corrélations entre chaque paire de métriques
      const metricsArray = Array.from(metricData.keys());

      for (let i = 0; i < metricsArray.length; i++) {
        for (let j = i + 1; j < metricsArray.length; j++) {
          const metric1Id = metricsArray[i];
          const metric2Id = metricsArray[j];

          const data1 = metricData.get(metric1Id) || [];
          const data2 = metricData.get(metric2Id) || [];

          // Trouver les dates communes
          const commonData1: number[] = [];
          const commonData2: number[] = [];

          data1.forEach(d1 => {
            const matchingD2 = data2.find(d2 => d2.date.getTime() === d1.date.getTime());
            if (matchingD2) {
              commonData1.push(d1.value);
              commonData2.push(matchingD2.value);
            }
          });

          if (commonData1.length >= 3) { // Minimum 3 points pour une corrélation significative
            const correlation = calculateCorrelation(commonData1, commonData2);

            let strength = 'faible';
            if (Math.abs(correlation) > 0.7) strength = 'forte';
            else if (Math.abs(correlation) > 0.5) strength = 'modérée';

            correlations.push({
              metric1: metricNames.get(metric1Id) || 'Unknown',
              metric2: metricNames.get(metric2Id) || 'Unknown',
              correlation: Math.round(correlation * 100) / 100,
              strength,
              dataPoints: commonData1.length,
            });
          }
        }
      }

      // Trier par force de corrélation (absolue)
      correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));

      resolve(correlations);
    } catch (error) {
      console.error('Erreur lors de l\'analyse des corrélations:', error);
      resolve([]);
    }
  });
}
