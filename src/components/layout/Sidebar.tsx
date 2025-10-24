/**
 * Sidebar - Navigation latérale persistante style "cockpit"
 */

import { NavLink } from 'react-router-dom';
import {
  Activity,
  Home,
  Users,
  BarChart3,
  Settings,
} from 'lucide-react';
import clsx from 'clsx';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/', icon: <Home size={20} />, label: 'Tableau de bord' },
  { to: '/athletes', icon: <Users size={20} />, label: 'Athlètes' },
  { to: '/wellness', icon: <Activity size={20} />, label: 'Bien-être' },
  { to: '/analytics', icon: <BarChart3 size={20} />, label: 'Analyses' },
  { to: '/settings', icon: <Settings size={20} />, label: 'Paramètres' },
];

export function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img src="/logoforge.png" alt="La Forge Athlétique" className="w-10 h-10" />
          <div>
            <h1 className="text-lg font-bold text-white">La Forge</h1>
            <p className="text-xs text-slate-400">Athlétique</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                'text-slate-400 hover:text-white hover:bg-slate-800',
                isActive && 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/50'
              )
            }
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-2">Besoin d'aide ?</p>
          <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">
            Documentation
          </button>
        </div>
      </div>
    </aside>
  );
}
