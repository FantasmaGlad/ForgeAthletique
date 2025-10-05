/**
 * Composant Select - Liste déroulante stylisée
 */

import { type SelectHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, fullWidth = false, className, ...props }, ref) => {
    return (
      <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label className="text-sm font-medium text-text-primary">
            {label}
            {props.required && <span className="text-status-danger ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            className={clsx(
              'w-full px-4 py-2 bg-background-primary border rounded-lg appearance-none',
              'text-text-primary',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:border-accent-primary',
              'cursor-pointer',
              error
                ? 'border-status-danger focus:ring-status-danger/30'
                : 'border-background-tertiary focus:ring-accent-primary/30',
              props.disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
            <ChevronDown size={20} />
          </div>
        </div>

        {error && (
          <p className="text-sm text-status-danger">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
