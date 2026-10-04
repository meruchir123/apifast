import React from 'react';
import { CheckCircle2, Loader2, XCircle, Clock } from 'lucide-react';
function StatusBadge({ status }) {
    const s = status;
    const config = {
        success: { icon: <CheckCircle2 className="w-3.5 h-3.5"/>, className: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Success' },
        running: { icon: <Loader2 className="w-3.5 h-3.5 animate-spin"/>, className: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Running' },
        failed: { icon: <XCircle className="w-3.5 h-3.5"/>, className: 'bg-red-50 text-red-700 border-red-200', label: 'Failed' },
        pending: { icon: <Clock className="w-3.5 h-3.5"/>, className: 'bg-slate-50 text-slate-600 border-slate-200', label: 'Pending' },
    };
    const cfg = config[s] ?? config.pending;
    return (<span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.className}`}>
      {cfg.icon} {cfg.label}
    </span>);
}
export function PipelineRunsTable({ runs }) {
    return (<div className="overflow-x-auto">
      <table className="w-full text-sm" aria-label="Pipeline runs">
        <thead>
          <tr className="border-b border-slate-200">
            {['DAG', 'Status', 'Start Time', 'Duration', 'Records Processed'].map((h) => (<th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-2.5 px-3 whitespace-nowrap">{h}</th>))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {runs.map((run) => (<tr key={run.id} className="hover:bg-slate-50 transition-colors">
              <td className="py-3 px-3 font-mono text-xs text-slate-700 whitespace-nowrap">{run.dagName}</td>
              <td className="py-3 px-3"><StatusBadge status={run.status}/></td>
              <td className="py-3 px-3 text-xs text-slate-500 whitespace-nowrap">{run.startTime}</td>
              <td className="py-3 px-3 text-xs text-slate-500">{run.duration}</td>
              <td className="py-3 px-3 text-xs font-medium text-slate-700">{run.recordsProcessed.toLocaleString()}</td>
            </tr>))}
        </tbody>
      </table>
      {runs.length === 0 && (<p className="text-center text-sm text-slate-400 py-8">No pipeline runs available.</p>)}
    </div>);
}
