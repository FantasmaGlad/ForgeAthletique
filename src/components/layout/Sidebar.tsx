/**
 * Sidebar - Navigation latérale persistante style "cockpit"
 */

import { NavLink } from 'react-router-dom';
import {
  Activity,
  Home,
  Users,
  BarChart3,
  Calendar,
  Settings,
  TrendingUp,
  Dumbbell,
} from 'lucide-react';
import clsx from 'clsx';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/', icon: <Home size={20} />, label: 'Mon Tableau de Bord' },
  { to: '/athletes', icon: <Users size={20} />, label: 'Athlètes' },
  { to: '/wellness', icon: <Activity size={20} />, label: 'Wellness' },
  { to: '/analytics', icon: <BarChart3 size={20} />, label: 'Analyses' },
  { to: '/settings', icon: <Settings size={20} />, label: 'Paramètres' },
  { to: '/training', icon: <Dumbbell size={20} />, label: 'Entraînement' },
  { to: '/performance', icon: <TrendingUp size={20} />, label: 'Performance' },
  { to: '/planning', icon: <Calendar size={20} />, label: 'Planification' },
];

export function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-background-secondary border-r border-background-tertiary flex flex-col">
      {/* Logo / Header */}
      <div className="p-6 border-b border-background-tertiary">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-primary/20 flex items-center justify-center">
            <Activity className="w-6 h-6 text-accent-primary" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-primary">La Forge</h1>
            <p className="text-xs text-text-muted">Athlétique</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                'text-text-secondary hover:text-text-primary hover:bg-background-tertiary',
                isActive && 'bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 shadow-glow-blue'
              )
            }
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer - Paramètres */}
      <div className="p-4 border-t border-background-tertiary">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
              'text-text-secondary hover:text-text-primary hover:bg-background-tertiary',
              isActive && 'bg-accent-primary/10 text-accent-primary'
            )
          }
        >
          <Settings size={20} />
          <span className="font-medium">Paramètres</span>
        </NavLink>
      </div>
    </aside>
  );
}
