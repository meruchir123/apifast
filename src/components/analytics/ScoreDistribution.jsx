
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

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-slate-700">{label}</p>
      <p className="text-xs text-slate-600">
        Anime:{' '}
        <strong>{payload[0].value?.toLocaleString()}</strong>
      </p>
    </div>
  );
};

export function ScoreDistribution({ data }) {
  const chartData = (data ?? []).map((item) => ({
    ...item,
    range: item.score_range ?? item.range,
    count: item.anime_count ?? item.count ?? 0,
  }));

  if (!chartData.length) {
    return (
      <div className="h-[240px] flex items-center justify-center text-sm text-slate-400">
        No score distribution data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f1f5f9"
        />

        <XAxis
          dataKey="range"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip content={<CustomTooltip />} />

        <Bar
          dataKey="count"
          name="Anime Count"
          radius={[4, 4, 0, 0]}
          maxBarSize={48}
        >
          {chartData.map((_, i) => (
            <Cell
              key={i}
              fill={i >= 4 ? '#6366f1' : '#a5b4fc'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
