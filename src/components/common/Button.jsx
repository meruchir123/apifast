import React from 'react';
export function Button({ children, variant = 'primary', size = 'md', loading = false, icon, iconPosition = 'left', fullWidth = false, className = '', disabled, ...props }) {
    const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';
    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm',
        secondary: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:bg-indigo-200',
        ghost: 'text-slate-600 hover:bg-slate-100 active:bg-slate-200',
        danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
        outline: 'border border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100 bg-white',
    };
    const sizes = {
        sm: 'text-xs px-3 py-1.5 gap-1.5',
        md: 'text-sm px-4 py-2 gap-2',
        lg: 'text-base px-6 py-3 gap-2.5',
    };
    return (<button className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`} disabled={disabled || loading} {...props}>
      {loading && (<svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>)}
      {!loading && icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      {children}
      {!loading && icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>);
}
