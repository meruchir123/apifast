export function LoadingSkeleton({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton rounded-lg ${className}`} style={style} />;
}

import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <LoadingSkeleton className="h-56 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-3 w-1/2" />
        <LoadingSkeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
      <LoadingSkeleton className="h-3 w-1/3" />
      <LoadingSkeleton className="h-8 w-1/2" />
      <LoadingSkeleton className="h-3 w-1/4" />
    </div>
  );
}

export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <LoadingSkeleton className="h-4 w-1/3 mb-4" />
      <LoadingSkeleton className="w-full rounded-lg" style={{ height }} />
    </div>
  );
}

export function TableRowSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <LoadingSkeleton className="h-4 w-8" />
          <LoadingSkeleton className="h-4 flex-1" />
          <LoadingSkeleton className="h-4 w-16" />
          <LoadingSkeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}
