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
        'bg-background-secondary rounded-lg border border-background-tertiary',
        glowEffect && 'shadow-glow-blue',
        className
      )}
    >
      {(title || headerAction) && (
        <div className="px-6 py-4 border-b border-background-tertiary flex items-center justify-between">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-text-primary">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-text-secondary mt-1">
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
