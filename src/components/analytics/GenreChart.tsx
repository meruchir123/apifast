import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import type { GenreAnalytic } from '../../types/analytics';

interface GenreChartProps {
  data: GenreAnalytic[];
  dataKey?: 'count' | 'avgScore';
  label?: string;
}

const COLORS = [
  '#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd',
  '#818cf8', '#4f46e5', '#7c3aed', '#6d28d9',
  '#5b21b6', '#4c1d95', '#3730a3', '#312e81',
  '#4338ca', '#4f46e5', '#6366f1',
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-slate-700 mb-1">{label}</p>
      <p className="text-xs text-slate-600">{payload[0].name}: <strong>{payload[0].value?.toLocaleString()}</strong></p>
    </div>
  );
};

export function GenreChart({ data, dataKey = 'count', label = 'Count' }: GenreChartProps) {
  const sorted = [...data].sort((a, b) => b[dataKey] - a[dataKey]).slice(0, 10);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={sorted} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 60 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
        <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis dataKey="genre" type="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={55} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={dataKey} name={label} radius={[0, 4, 4, 0]} maxBarSize={20}>
          {sorted.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
