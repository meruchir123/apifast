import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
function SettingsSection({ title, children }) {
    return (<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>);
}
function ToggleSwitch({ enabled, onToggle, label }) {
    return (<label className="flex items-center justify-between cursor-pointer group">
      <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">{label}</span>
      <button role="switch" aria-checked={enabled} onClick={onToggle} className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${enabled ? 'bg-indigo-600' : 'bg-slate-200'}`}>
        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ${enabled ? 'translate-x-4' : 'translate-x-0'}`}/>
      </button>
    </label>);
}
export function Settings() {
    const [notifications, setNotifications] = useState({ reviews: true, pipeline: true, recommendations: false });
    const [theme, setTheme] = useState('light');
    return (<div className="max-w-2xl space-y-5">
      {/* Profile */}
      <SettingsSection title="Profile">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
            AV
          </div>
          <div>
            <p className="font-semibold text-slate-800">AniVerse User</p>
            <p className="text-sm text-slate-500">user@aniverse.app</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[{ label: 'Display Name', placeholder: 'AniVerse User' }, { label: 'Email', placeholder: 'user@aniverse.app' }].map((f) => (<div key={f.label}>
              <label className="text-xs font-medium text-slate-500 block mb-1">{f.label}</label>
              <input type="text" placeholder={f.placeholder} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>))}
        </div>
        <Button variant="outline" size="sm" className="mt-4">Save Profile</Button>
      </SettingsSection>

      {/* Appearance */}
      <SettingsSection title="Appearance">
        <div className="flex gap-2">
          {['light', 'dark', 'system'].map((t) => (<button key={t} onClick={() => setTheme(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize border transition-all ${theme === t
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>
              {t}
            </button>))}
        </div>
        <p className="text-xs text-slate-400 mt-3">Dark mode is coming soon. Currently only light theme is supported.</p>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notifications">
        <div className="space-y-4">
          <ToggleSwitch label="New reviews on saved anime" enabled={notifications.reviews} onToggle={() => setNotifications(p => ({ ...p, reviews: !p.reviews }))}/>
          <ToggleSwitch label="Pipeline failure alerts" enabled={notifications.pipeline} onToggle={() => setNotifications(p => ({ ...p, pipeline: !p.pipeline }))}/>
          <ToggleSwitch label="New recommendation available" enabled={notifications.recommendations} onToggle={() => setNotifications(p => ({ ...p, recommendations: !p.recommendations }))}/>
        </div>
      </SettingsSection>

      {/* API Status */}
      <SettingsSection title="API Status">
        <div className="space-y-3">
          {[
            { label: 'Frontend (React + Vite)', status: 'operational' },
            { label: 'FastAPI Backend', status: 'not connected' },
            { label: 'PostgreSQL', status: 'not connected' },
            { label: 'Kafka', status: 'not connected' },
        ].map((s) => (<div key={s.label} className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{s.label}</span>
              <Badge variant={s.status === 'operational' ? 'success' : 'default'}>
                {s.status}
              </Badge>
            </div>))}
        </div>
        <p className="text-xs text-slate-400 mt-3">
          The frontend is currently running with mock data. Connect a FastAPI backend at
          <code className="ml-1 text-indigo-600 bg-indigo-50 px-1 rounded">VITE_API_BASE_URL</code> to enable live data.
        </p>
      </SettingsSection>

      {/* Data */}
      <SettingsSection title="Data & Refresh">
        <p className="text-sm text-slate-600 mb-3">Mock data was last refreshed at application startup. In production, data refreshes via the Airflow ETL pipeline.</p>
        <div className="flex items-center gap-2 text-sm text-emerald-600">
          <CheckCircle2 className="w-4 h-4"/>
          <span>Mock data loaded — 20 anime, 20 reviews, 15 genres</span>
        </div>
      </SettingsSection>
    </div>);
}
