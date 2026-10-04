import React from 'react';
import { CheckCircle2, Loader2, XCircle, Clock } from 'lucide-react';
function StatusIcon({ status }) {
    switch (status) {
        case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500"/>;
        case 'running': return <Loader2 className="w-5 h-5 text-blue-500 animate-spin"/>;
        case 'failed': return <XCircle className="w-5 h-5 text-red-500"/>;
        case 'pending': return <Clock className="w-5 h-5 text-slate-400"/>;
    }
}
function statusClasses(status) {
    switch (status) {
        case 'success': return 'border-emerald-200 bg-emerald-50';
        case 'running': return 'border-blue-200 bg-blue-50';
        case 'failed': return 'border-red-200 bg-red-50';
        case 'pending': return 'border-slate-200 bg-slate-50';
    }
}
function statusLabel(status) {
    switch (status) {
        case 'success': return 'Success';
        case 'running': return 'Running';
        case 'failed': return 'Failed';
        case 'pending': return 'Pending';
    }
}
function statusTextColor(status) {
    switch (status) {
        case 'success': return 'text-emerald-600';
        case 'running': return 'text-blue-600';
        case 'failed': return 'text-red-600';
        case 'pending': return 'text-slate-500';
    }
}
export function PipelineStatusView({ nodes }) {
    return (<div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 overflow-x-auto pb-2">
      {nodes.map((node, idx) => (<React.Fragment key={node.id}>
          <div className={`flex flex-col items-center p-4 rounded-xl border min-w-[130px] ${statusClasses(node.status)}`}>
            <StatusIcon status={node.status}/>
            <span className="text-sm font-semibold text-slate-800 mt-2 text-center">{node.label}</span>
            {node.sublabel && (<span className="text-xs text-slate-500 text-center mt-0.5">{node.sublabel}</span>)}
            <span className={`text-xs font-medium mt-1.5 ${statusTextColor(node.status)}`}>
              {statusLabel(node.status)}
            </span>
          </div>
          {idx < nodes.length - 1 && (<div className="text-slate-300 font-bold text-xl hidden lg:block flex-shrink-0">→</div>)}
        </React.Fragment>))}
    </div>);
}
