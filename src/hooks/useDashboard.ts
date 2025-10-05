/**
 * Hook personnalisé pour le tableau de bord personnel
 */

import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { measurementService, db } from '../services';
import { formatDate } from '../utils/formatters';
import type { Measurement, DateRange } from '../types';

export function useDashboardData(athleteId: string) {
  // Récupérer tous les records personnels
  const personalRecords = useLiveQuery(
    async () => {
      if (!athleteId) return [];
      return await measurementService.getPersonalRecords(athleteId);
    },
    [athleteId]
  );

  // Récupérer les données récentes (7 derniers jours)
  const recentMeasurements = useLiveQuery(
    async () => {
      if (!athleteId) return [];

      const dateRange: DateRange = {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(),
      };

      // Récupérer les métriques clés pour le dashboard
      const keyMetrics = [
        'Poids', 'IMC', 'Sommeil', 'Fatigue', 'Humeur',
        'CMJ Hauteur', 'Sprint 20m', '1RM Back Squat'
      ];

      const allMeasurements: Measurement[] = [];

      for (const metricName of keyMetrics) {
        const metricType = await db.metricTypes.where('name').equals(metricName).first();
        if (metricType) {
          const measurements = await measurementService.getByAthleteAndMetric(
            athleteId,
            metricType.id,
            dateRange
          );
          allMeasurements.push(...measurements);
        }
      }

      return allMeasurements;
    },
    [athleteId]
  );

  // Transformer les données pour les graphiques
  const dashboardData = useMemo(() => {
    if (!recentMeasurements || recentMeasurements.length === 0) {
      return {
        weightTrend: [],
        wellnessTrend: [],
        performanceTrend: [],
        recentActivity: 0,
      };
    }

    // Récupérer les noms des métriques depuis la DB
    const metricTypes = useLiveQuery(
      () => db.metricTypes.toArray(),
      []
    );

    if (!metricTypes) {
      return {
        weightTrend: [],
        wellnessTrend: [],
        performanceTrend: [],
        recentActivity: 0,
      };
    }

    const metricNames = new Map<string, string>();
    metricTypes.forEach(metric => {
      metricNames.set(metric.id, metric.name);
    });

    // Grouper par date
    const groupedByDate = new Map<string, any>();

    for (const measurement of recentMeasurements) {
      const dateKey = formatDate(measurement.date);

      if (!groupedByDate.has(dateKey)) {
        groupedByDate.set(dateKey, { date: dateKey });
      }

      const metricName = metricNames.get(measurement.metricTypeId) || 'Unknown';
      groupedByDate.get(dateKey)![metricName] = typeof measurement.value === 'number'
        ? measurement.value
        : parseFloat(measurement.value as string) || 0;
    }

    const sortedData = Array.from(groupedByDate.values()).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Séparer les données par catégorie
    const weightTrend = sortedData.map(point => ({
      date: point.date,
      poids: point['Poids'] || 0,
      imc: point['IMC'] || 0,
    })).filter(point => point.poids > 0);

    const wellnessTrend = sortedData.map(point => ({
      date: point.date,
      sommeil: point['Sommeil'] || 0,
      fatigue: point['Fatigue'] || 0,
      humeur: point['Humeur'] || 0,
    })).filter(point => point.sommeil > 0 || point.fatigue > 0 || point.humeur > 0);

    const performanceTrend = sortedData.map(point => ({
      date: point.date,
      cmj: point['CMJ Hauteur'] || 0,
      sprint: point['Sprint 20m'] || 0,
      force: point['1RM Back Squat'] || 0,
    })).filter(point => point.cmj > 0 || point.sprint > 0 || point.force > 0);

    return {
      weightTrend,
      wellnessTrend,
      performanceTrend,
      recentActivity: sortedData.length,
    };
  }, [recentMeasurements]);

  return {
    personalRecords: personalRecords || [],
    dashboardData,
    loading: personalRecords === undefined || recentMeasurements === undefined,
  };
}
