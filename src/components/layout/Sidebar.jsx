import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Compass, BarChart3, MessageSquare, Star, GitBranch, Settings, ChevronLeft, ChevronRight, Sparkles, } from 'lucide-react';
const NAV_ITEMS = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5"/> },
    { label: 'Explore Anime', path: '/explore', icon: <Compass className="w-5 h-5"/> },
    { label: 'Analytics', path: '/analytics', icon: <BarChart3 className="w-5 h-5"/> },
    { label: 'Reviews', path: '/reviews', icon: <MessageSquare className="w-5 h-5"/> },
    { label: 'Recommendations', path: '/recommendations', icon: <Star className="w-5 h-5"/> },
    { label: 'Pipeline', path: '/pipeline', icon: <GitBranch className="w-5 h-5"/> },
];
export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    return (<aside className={`hidden lg:flex flex-col bg-[#0f1117] text-white transition-all duration-200 shrink-0 ${collapsed ? 'w-16' : 'w-60'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-white"/>
        </div>
        {!collapsed && (<Link to="/" className="font-bold text-lg tracking-tight text-white hover:text-indigo-300 transition-colors">
            AniVerse
          </Link>)}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto" role="navigation" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (<NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${isActive
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/8'}`} title={collapsed ? item.label : undefined}>
            <span className="shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>))}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 space-y-0.5 border-t border-white/10 pt-4">
        <NavLink to="/settings" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/8'}`} title={collapsed ? 'Settings' : undefined}>
          <Settings className="w-5 h-5 shrink-0"/>
          {!collapsed && <span>Settings</span>}
        </NavLink>

        <button onClick={() => setCollapsed(!collapsed)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/8 transition-all duration-150 w-full" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <ChevronRight className="w-5 h-5"/> : <ChevronLeft className="w-5 h-5"/>}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>);
}
