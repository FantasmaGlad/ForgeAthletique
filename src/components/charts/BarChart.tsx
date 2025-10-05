/**
 * Composant BarChart - Graphique en barres pour comparaisons
 */

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BarChartProps {
  data: any[];
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  showGrid?: boolean;
  showLegend?: boolean;
}

export function BarChart({
  data,
  dataKey,
  xAxisKey = 'date',
  color = '#0066FF',
  showGrid = true,
  showLegend = true,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
          cursor={{ fill: 'rgba(0, 102, 255, 0.1)' }}
        />
        {showLegend && (
          <Legend wrapperStyle={{ color: '#A0A0A0' }} />
        )}
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
