
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const COLORS = [
  '#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd',
  '#818cf8', '#4f46e5', '#7c3aed', '#6d28d9',
  '#5b21b6', '#4c1d95', '#3730a3', '#312e81',
  '#4338ca', '#4f46e5', '#6366f1',
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-slate-700 mb-1">
        {label}
      </p>
      <p className="text-xs text-slate-600">
        {payload[0].name}:{' '}
        <strong>
          {Number(payload[0].value ?? 0).toLocaleString()}
        </strong>
      </p>
    </div>
  );
};

export function GenreChart({
  data = [],
  dataKey,
  label = 'Count',
}) {
  // Support both backend fields and existing mock-data fields.
  const resolvedKey =
    dataKey ||
    (data.some((item) => item.anime_count != null)
      ? 'anime_count'
      : 'count');

  const sorted = data
    .map((item) => ({
      ...item,
      [resolvedKey]: Number(
        item[resolvedKey] ??
        item.anime_count ??
        item.count ??
        item.average_score ??
        item.avg_score ??
        0
      ),
    }))
    .filter((item) => Number.isFinite(item[resolvedKey]))
    .sort((a, b) => b[resolvedKey] - a[resolvedKey])
    .slice(0, 10);

  if (sorted.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-sm text-slate-500">
        No genre data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 0, right: 24, bottom: 0, left: 60 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          stroke="#f1f5f9"
        />

        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          domain={[0, 'auto']}
          allowDecimals={false}
        />

        <YAxis
          dataKey="genre"
          type="category"
          tick={{ fontSize: 11, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          width={55}
        />

        <Tooltip content={<CustomTooltip />} />

        <Bar
          dataKey={resolvedKey}
          name={label}
          radius={[0, 4, 4, 0]}
          maxBarSize={20}
          isAnimationActive={false}
        >
          {sorted.map((item, index) => (
            <Cell
              key={item.genre ?? index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
