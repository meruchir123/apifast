
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-slate-700">{label}</p>
      <p className="text-xs text-slate-600">
        {payload[0].name}:{' '}
        <strong>{payload[0].value?.toLocaleString()}</strong>
      </p>
    </div>
  );
};

export function ReleaseTrendChart({ data }) {
  const chartData = (data ?? []).map((item) => ({
    ...item,
    year: item.year,
    count: item.anime_count ?? item.count ?? 0,
  }));

  if (!chartData.length) {
    return (
      <div className="h-[240px] flex items-center justify-center text-sm text-slate-400">
        No release trend data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart
        data={chartData}
        margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
      >
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f1f5f9"
        />

        <XAxis
          dataKey="year"
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

        <Area
          type="monotone"
          dataKey="count"
          name="Anime Released"
          stroke="#6366f1"
          strokeWidth={2}
          fill="url(#colorCount)"
          dot={false}
          activeDot={{ r: 4, fill: '#6366f1' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ReviewsOverTimeChart({ data }) {
  const chartData = data ?? [];

  if (!chartData.length) {
    return (
      <div className="h-[240px] flex items-center justify-center text-sm text-slate-400">
        Review trend data is not available yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={chartData}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f1f5f9"
        />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="count"
          name="Reviews"
          stroke="#8b5cf6"
          strokeWidth={2}
          fill="#8b5cf6"
          fillOpacity={0.1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
