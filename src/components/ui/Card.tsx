/**
 * Composant Card - Conteneur de type "widget cockpit"
 * Base pour tous les blocs d'information
 */

import { type ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: ReactNode;
  className?: string;
  noPadding?: boolean;
  glowEffect?: boolean;
}

export function Card({
  children,
  title,
  subtitle,
  headerAction,
  className,
  noPadding = false,
  glowEffect = false,
}: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow',
        glowEffect && 'shadow-lg shadow-blue-500/10',
        className
      )}
    >
      {(title || headerAction) && (
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            {title && (
              <h3 className="text-lg font-bold text-slate-900">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-slate-600 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && (
            <div className="flex-shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      )}
      <div className={clsx(!noPadding && 'p-6')}>
        {children}
      </div>
    </div>
  );
}
