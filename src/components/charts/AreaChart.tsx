/**
 * Composant AreaChart - Graphique en aire pour visualiser les tendances
 */

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AreaChartProps {
  data: any[];
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  showGrid?: boolean;
}

export function AreaChart({
  data,
  dataKey,
  xAxisKey = 'date',
  color = '#0066FF',
  showGrid = true,
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          fill={`${color}40`}
          strokeWidth={2}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
