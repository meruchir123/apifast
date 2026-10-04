import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import type { ScoreVsPopularity } from '../../types/analytics';

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as ScoreVsPopularity;
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-slate-800">{d.title}</p>
      <p className="text-xs text-slate-500">{d.genre}</p>
      <p className="text-xs text-slate-600 mt-1">Score: <strong>{d.score}</strong></p>
      <p className="text-xs text-slate-600">Popularity Rank: <strong>#{d.popularity}</strong></p>
    </div>
  );
};

export function PopularityChart({ data }: { data: ScoreVsPopularity[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ScatterChart margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="score"
          name="Score"
          type="number"
          domain={[6.5, 9.5]}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          label={{ value: 'Score', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#94a3b8' }}
        />
        <YAxis
          dataKey="popularity"
          name="Popularity Rank"
          type="number"
          reversed
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          label={{ value: 'Popularity Rank', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94a3b8' }}
        />
        <ZAxis range={[40, 40]} />
        <Tooltip content={<CustomTooltip />} />
        <Scatter data={data} fill="#6366f1" fillOpacity={0.7} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
