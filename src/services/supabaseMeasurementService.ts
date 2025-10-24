import { supabase } from '../lib/supabase';
import type { Measurement, MetricType } from '../types';

interface MeasurementRow {
  id: string;
  athlete_id: string;
  metric_type_id: string;
  date: string;
  value: string;
  unit: string;
  notes: string | null;
  created_at: string;
}

interface MetricTypeRow {
  id: string;
  name: string;
  category: string;
  unit: string;
  data_type: string;
  description: string | null;
  is_higher_better: boolean;
  created_at: string;
}

function rowToMeasurement(row: MeasurementRow): Measurement {
  return {
    id: row.id,
    athleteId: row.athlete_id,
    metricTypeId: row.metric_type_id,
    date: new Date(row.date),
    value: row.value,
    unit: row.unit,
    notes: row.notes || undefined,
    createdAt: new Date(row.created_at),
  };
}

function rowToMetricType(row: MetricTypeRow): MetricType {
  return {
    id: row.id,
    name: row.name,
    category: row.category as any,
    unit: row.unit,
    dataType: row.data_type as any,
    description: row.description || undefined,
    isHigherBetter: row.is_higher_better,
  };
}

export const supabaseMeasurementService = {
  async addMeasurement(measurement: Omit<Measurement, 'id' | 'createdAt'>): Promise<string> {
    const { data, error } = await supabase
      .from('measurements')
      .insert({
        athlete_id: measurement.athleteId,
        metric_type_id: measurement.metricTypeId,
        date: measurement.date.toISOString().split('T')[0],
        value: String(measurement.value),
        unit: measurement.unit,
        notes: measurement.notes,
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  },

  async getMeasurementsByAthlete(athleteId: string, metricTypeId?: string): Promise<Measurement[]> {
    let query = supabase
      .from('measurements')
      .select('*')
      .eq('athlete_id', athleteId)
      .order('date', { ascending: false });

    if (metricTypeId) {
      query = query.eq('metric_type_id', metricTypeId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(rowToMeasurement);
  },

  async getMeasurementsByDateRange(
    athleteId: string,
    startDate: Date,
    endDate: Date,
    metricTypeId?: string
  ): Promise<Measurement[]> {
    let query = supabase
      .from('measurements')
      .select('*')
      .eq('athlete_id', athleteId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (metricTypeId) {
      query = query.eq('metric_type_id', metricTypeId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(rowToMeasurement);
  },

  async deleteMeasurement(id: string): Promise<void> {
    const { error } = await supabase
      .from('measurements')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getAllMetricTypes(): Promise<MetricType[]> {
    const { data, error } = await supabase
      .from('metric_types')
      .select('*')
      .order('name');

    if (error) throw error;
    return (data || []).map(rowToMetricType);
  },

  async getMetricTypesByCategory(category: string): Promise<MetricType[]> {
    const { data, error } = await supabase
      .from('metric_types')
      .select('*')
      .eq('category', category)
      .order('name');

    if (error) throw error;
    return (data || []).map(rowToMetricType);
  },

  async createMetricType(metricType: Omit<MetricType, 'id'>): Promise<string> {
    const { data, error } = await supabase
      .from('metric_types')
      .insert({
        name: metricType.name,
        category: metricType.category,
        unit: metricType.unit,
        data_type: metricType.dataType,
        description: metricType.description,
        is_higher_better: metricType.isHigherBetter,
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  },
};
