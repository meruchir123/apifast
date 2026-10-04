import React, { useEffect } from 'react';
import { X } from 'lucide-react';
const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
};
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape')
            onClose(); };
        if (isOpen)
            document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true"/>
      <div className={`relative bg-white rounded-2xl shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150`}>
        {title && (<div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 id="modal-title" className="text-base font-semibold text-slate-800">{title}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100" aria-label="Close modal">
              <X className="w-5 h-5"/>
            </button>
          </div>)}
        <div className="p-6">{children}</div>
      </div>
    </div>);
}
