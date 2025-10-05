/**
 * Hook personnalisé pour gérer les mesures et la visualisation
 */

import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { measurementService, db } from '../services';
import { formatDate } from '../utils/formatters';
import type { Measurement, DateRange } from '../types';

export function useMeasurements(athleteId?: string, metricTypeId?: string, dateRange?: DateRange) {
  const measurements = useLiveQuery(
    async () => {
      if (!athleteId || !metricTypeId) return [];

      return await measurementService.getByAthleteAndMetric(
        athleteId,
        metricTypeId,
        dateRange
      );
    },
    [athleteId, metricTypeId, dateRange]
  );

  return {
    measurements: measurements || [],
    loading: measurements === undefined,
  };
}

export function usePersonalRecords(athleteId: string) {
  const records = useLiveQuery(
    async () => {
      if (!athleteId) return [];
      return await measurementService.getPersonalRecords(athleteId);
    },
    [athleteId]
  );

  return {
    records: records || [],
    loading: records === undefined,
  };
}

export function useMetricTypes() {
  const metricTypes = useLiveQuery(
    () => db.metricTypes.orderBy('category').toArray(),
    []
  );

  return {
    metricTypes: metricTypes || [],
    loading: metricTypes === undefined,
  };
}

export function useChartData(
  athleteId: string,
  metricIds: string[],
  dateRange?: DateRange
) {
  const measurements = useLiveQuery(
    async () => {
      if (!athleteId || metricIds.length === 0) return [];

      const allMeasurements: Measurement[] = [];

      for (const metricId of metricIds) {
        const metricMeasurements = await measurementService.getByAthleteAndMetric(
          athleteId,
          metricId,
          dateRange
        );
        allMeasurements.push(...metricMeasurements);
      }

      return allMeasurements;
    },
    [athleteId, metricIds, dateRange]
  );

  // Récupérer les noms des métriques depuis la DB
  const metricTypes = useLiveQuery(
    () => db.metricTypes.where('id').anyOf(metricIds).toArray(),
    [metricIds]
  );

  // Transformer les données pour les graphiques
  const chartData = useMemo(() => {
    if (!measurements || !metricTypes || measurements.length === 0) return [];

    // Créer un map des noms de métriques
    const metricNames = new Map<string, string>();
    metricTypes.forEach(metric => {
      metricNames.set(metric.id, metric.name);
    });

    // Grouper par date
    const groupedByDate = new Map<string, any>();

    for (const measurement of measurements) {
      const dateKey = formatDate(measurement.date);

      if (!groupedByDate.has(dateKey)) {
        groupedByDate.set(dateKey, { date: dateKey });
      }

      const metricName = metricNames.get(measurement.metricTypeId) || 'Unknown';
      groupedByDate.get(dateKey)![metricName] = typeof measurement.value === 'number'
        ? measurement.value
        : parseFloat(measurement.value as string) || 0;
    }

    return Array.from(groupedByDate.values()).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [measurements, metricTypes]);

  return {
    chartData: chartData || [],
    loading: measurements === undefined || metricTypes === undefined,
  };
}
