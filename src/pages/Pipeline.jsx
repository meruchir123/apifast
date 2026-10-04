import React from 'react';
import { PipelineStatusView } from '../components/pipeline/PipelineStatus';
import { PipelineRunsTable } from '../components/pipeline/PipelineRunsTable';
import { StatCard } from '../components/analytics/StatCard';
import { StatCardSkeleton } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { useAsync } from '../hooks/useAsync';
import { getPipelineStatus, getPipelineRuns, getPipelineStats } from '../api/pipeline';
import { CheckCircle2, AlertTriangle, Database, Clock } from 'lucide-react';
export function Pipeline() {
    const nodesState = useAsync(getPipelineStatus, []);
    const runsState = useAsync(getPipelineRuns, []);
    const statsState = useAsync(getPipelineStats, []);
    const stats = statsState.data;
    return (<div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsState.loading ? (Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i}/>)) : stats ? (<>
            <StatCard title="Last Successful Run" value={stats.lastSuccessful} icon={<CheckCircle2 className="w-4 h-4"/>} iconColor="bg-emerald-50 text-emerald-600"/>
            <StatCard title="Failed Today" value={stats.failedToday} icon={<AlertTriangle className="w-4 h-4"/>} iconColor="bg-red-50 text-red-500" description={stats.failedToday > 0 ? 'Check pipeline for errors' : 'All clear'}/>
            <StatCard title="Records Today" value={stats.totalRecordsToday.toLocaleString()} icon={<Database className="w-4 h-4"/>} iconColor="bg-indigo-50 text-indigo-600"/>
            <StatCard title="Avg Duration" value={stats.avgDuration} icon={<Clock className="w-4 h-4"/>} iconColor="bg-blue-50 text-blue-600" description={`${stats.successRate}% success rate`}/>
          </>) : null}
      </div>

      {/* Pipeline Flow */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-1">Data Flow</h3>
        <p className="text-xs text-slate-400 mb-5">End-to-end pipeline from source ingestion to the AniVerse API.</p>
        {nodesState.loading ? (<div className="flex gap-4 overflow-x-auto pb-2">
            {Array.from({ length: 7 }).map((_, i) => <div key={i} className="skeleton w-32 h-28 rounded-xl shrink-0"/>)}
          </div>) : nodesState.error ? (<ErrorState description={nodesState.error} onRetry={nodesState.refetch}/>) : nodesState.data ? (<PipelineStatusView nodes={nodesState.data}/>) : null}
      </div>

      {/* Recent Runs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">Recent Pipeline Runs</h3>
          <p className="text-xs text-slate-400 mt-0.5">Latest DAG executions and their status</p>
        </div>
        <div className="p-5">
          {runsState.loading ? (<div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-10 rounded-lg"/>)}
            </div>) : runsState.error ? (<ErrorState description={runsState.error} onRetry={runsState.refetch}/>) : runsState.data ? (<PipelineRunsTable runs={runsState.data}/>) : null}
        </div>
      </div>
    </div>);
}
