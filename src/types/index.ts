/**
 * Point d'entrée pour tous les types TypeScript
 * Facilite les imports dans le reste de l'application
 */

export * from './athlete.types';
export * from './measurement.types';
export * from './training.types';
export * from './coach.types';

// Types utilitaires généraux
export interface SelectOption {
  value: string;
  label: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ChartDataPoint {
  date: string | Date;
  value: number;
  label?: string;
}

export interface PersonalRecord {
  metricTypeId: string;
  metricName: string;
  value: number;
  unit: string;
  date: Date;
  isHigherBetter: boolean;
}

// Types pour le moteur de visualisation
export interface VisualizationConfig {
  athleteId: string;
  metricTypeIds: string[];
  dateRange: DateRange;
  chartType: 'line' | 'bar' | 'scatter' | 'area';
  showTrendLine?: boolean;
  compareMetrics?: boolean;
}

export interface ChartConfig {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  colors: string[];
  showGrid: boolean;
  showLegend: boolean;
}

// Re-export du type Tab depuis les composants UI
export type { Tab } from '../components/ui/Tabs';
