import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function PageContainer({ children, className = '', noPadding = false }: PageContainerProps) {
  return (
    <main
      className={`flex-1 overflow-y-auto bg-slate-50 min-h-0 ${
        noPadding ? '' : 'p-6'
      } ${className}`}
    >
      {children}
    </main>
  );
}
