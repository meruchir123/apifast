import React from 'react';
export function PageContainer({ children, className = '', noPadding = false }) {
    return (<main className={`flex-1 overflow-y-auto bg-slate-50 min-h-0 ${noPadding ? '' : 'p-6'} ${className}`}>
      {children}
    </main>);
}
