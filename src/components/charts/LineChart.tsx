/**
 * Composant LineChart - Graphique en ligne pour l'évolution temporelle
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

interface DataPoint {
  date: string;
  value: number;
  [key: string]: string | number;
}

interface LineChartProps {
  data: DataPoint[];
  dataKey: string;
  xAxisKey?: string;
  title?: string;
  color?: string;
  showGrid?: boolean;
  showLegend?: boolean;
}

export function LineChart({
  data,
  dataKey,
  xAxisKey = 'date',
  color = '#0066FF',
  showGrid = true,
  showLegend = true,
}: LineChartProps) {
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
          <Legend
            wrapperStyle={{ color: '#A0A0A0' }}
          />
        )}
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, r: 4 }}
          activeDot={{ r: 6, fill: color, stroke: color }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
