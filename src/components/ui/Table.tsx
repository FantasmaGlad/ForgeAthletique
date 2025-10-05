/**
 * Composant Table - Tableau de données
 */

import { type ReactNode } from 'react';
import clsx from 'clsx';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  hoverable?: boolean;
  onRowClick?: (row: T) => void;
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = 'Aucune donnée disponible',
  hoverable = false,
  onRowClick,
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-background-tertiary">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-sm font-semibold text-text-primary"
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick?.(row)}
              className={clsx(
                'border-b border-background-tertiary/50',
                hoverable && 'hover:bg-background-tertiary transition-colors',
                onRowClick && 'cursor-pointer'
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-4 py-3 text-sm text-text-secondary"
                >
                  {column.render
                    ? column.render(row)
                    : (row[column.key as keyof T] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
