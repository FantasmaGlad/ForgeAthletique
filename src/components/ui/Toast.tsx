/**
 * Composant Toast - Notifications temporaires
 */

import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: <CheckCircle size={20} />,
  error: <AlertCircle size={20} />,
  warning: <AlertTriangle size={20} />,
  info: <Info size={20} />,
};

const styles = {
  success: 'bg-status-success/20 border-status-success/30 text-status-success',
  error: 'bg-status-danger/20 border-status-danger/30 text-status-danger',
  warning: 'bg-status-warning/20 border-status-warning/30 text-status-warning',
  info: 'bg-accent-primary/20 border-accent-primary/30 text-accent-primary',
};

export function Toast({ type, message, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className={clsx(
        'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg',
        'animate-in slide-in-from-top-5 fade-in duration-300',
        styles[type]
      )}
    >
      <span className="flex-shrink-0">{icons[type]}</span>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X size={18} />
      </button>
    </div>
  );
}

// Container pour gérer les toasts
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    message: string;
  }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}
