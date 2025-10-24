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
      <div className={clsx('flex flex-col gap-2', fullWidth && 'w-full')}>
        {label && (
          <label className="text-sm font-semibold text-slate-700">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full px-4 py-2.5 bg-white border rounded-lg',
              'text-slate-900 placeholder-slate-400',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:border-blue-500',
              error
                ? 'border-red-500 focus:ring-red-500/30'
                : 'border-slate-300 focus:ring-blue-500/30 hover:border-slate-400',
              icon && 'pl-10',
              props.disabled && 'opacity-50 cursor-not-allowed bg-slate-50',
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-600 rounded-full"></span>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-sm text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
