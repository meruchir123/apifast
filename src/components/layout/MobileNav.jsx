import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Compass, BarChart3, MessageSquare, Star, GitBranch, Settings, Menu, X, Sparkles } from 'lucide-react';
const NAV_ITEMS = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5"/> },
    { label: 'Explore', path: '/explore', icon: <Compass className="w-5 h-5"/> },
    { label: 'Analytics', path: '/analytics', icon: <BarChart3 className="w-5 h-5"/> },
    { label: 'Reviews', path: '/reviews', icon: <MessageSquare className="w-5 h-5"/> },
    { label: 'Recommendations', path: '/recommendations', icon: <Star className="w-5 h-5"/> },
    { label: 'Pipeline', path: '/pipeline', icon: <GitBranch className="w-5 h-5"/> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5"/> },
];
export function MobileNav() {
    const [open, setOpen] = useState(false);
    return (<>
      {/* Top bar for mobile */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0f1117] border-b border-white/10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white"/>
          </div>
          <span className="font-bold text-white text-lg tracking-tight">AniVerse</span>
        </Link>
        <button onClick={() => setOpen(true)} className="text-slate-400 hover:text-white p-1" aria-label="Open menu">
          <Menu className="w-6 h-6"/>
        </button>
      </div>

      {/* Drawer */}
      {open && (<div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-hidden="true"/>
          <nav className="absolute left-0 top-0 bottom-0 w-72 bg-[#0f1117] flex flex-col shadow-xl" role="navigation" aria-label="Mobile navigation">
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white"/>
                </div>
                <span className="font-bold text-white text-lg">AniVerse</span>
              </Link>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white p-1" aria-label="Close menu">
                <X className="w-5 h-5"/>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
              {NAV_ITEMS.map((item) => (<NavLink key={item.path} to={item.path} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/8'}`}>
                  {item.icon}
                  {item.label}
                </NavLink>))}
            </div>
          </nav>
        </div>)}
    </>);
}
