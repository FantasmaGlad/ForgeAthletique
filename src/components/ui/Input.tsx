/**
 * Composant Input - Champ de saisie stylisé
 */

import { type InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = false, icon, className, ...props }, ref) => {
    return (
      <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label className="text-sm font-medium text-text-primary">
            {label}
            {props.required && <span className="text-status-danger ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full px-4 py-2 bg-background-primary border rounded-lg',
              'text-text-primary placeholder-text-muted',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:border-accent-primary',
              error
                ? 'border-status-danger focus:ring-status-danger/30'
                : 'border-background-tertiary focus:ring-accent-primary/30',
              icon && 'pl-10',
              props.disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="text-sm text-status-danger">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
