/**
 * Composant Badge - Étiquette pour statuts et catégories
 */

import { type ReactNode } from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const variants = {
    default: 'bg-background-tertiary text-text-primary',
    success: 'bg-status-success/20 text-status-success border border-status-success/30',
    danger: 'bg-status-danger/20 text-status-danger border border-status-danger/30',
    warning: 'bg-status-warning/20 text-status-warning border border-status-warning/30',
    info: 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size]
      )}
    >
      {children}
    </span>
  );
}
