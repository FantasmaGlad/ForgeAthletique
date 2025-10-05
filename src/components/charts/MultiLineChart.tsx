/**
 * Composant MultiLineChart - Graphique multi-lignes pour comparer plusieurs métriques
 */

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface MetricLine {
  dataKey: string;
  name: string;
  color: string;
}

interface MultiLineChartProps {
  data: any[];
  lines: MetricLine[];
  xAxisKey?: string;
  showGrid?: boolean;
  showLegend?: boolean;
}

const COLORS = ['#0066FF', '#FF6B35', '#10B981', '#F59E0B', '#EF4444'];

export function MultiLineChart({
  data,
  lines,
  xAxisKey = 'date',
  showGrid = true,
  showLegend = true,
}: MultiLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#2F2F2F" />
        )}
        <XAxis
          dataKey={xAxisKey}
          stroke="#A0A0A0"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#A0A0A0"
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#252525',
            border: '1px solid #2F2F2F',
            borderRadius: '8px',
            color: '#F5F5F5',
          }}
          labelStyle={{ color: '#A0A0A0' }}
        />
        {showLegend && (
          <Legend wrapperStyle={{ color: '#A0A0A0' }} />
        )}
        {lines.map((line, index) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color || COLORS[index % COLORS.length]}
            strokeWidth={2}
            dot={{ fill: line.color || COLORS[index % COLORS.length], r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
