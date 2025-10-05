/**
 * Composant MetricSelector - Sélection multiple de métriques avec interface améliorée
 */

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface MetricType {
  id: string;
  name: string;
  category: string;
  unit: string;
}

interface MetricSelectorProps {
  availableMetrics: MetricType[];
  selectedMetrics: string[];
  onSelectionChange: (metricIds: string[]) => void;
  maxSelections?: number;
}

export function MetricSelector({
  availableMetrics,
  selectedMetrics,
  onSelectionChange,
  maxSelections = 5,
}: MetricSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Filtrer les métriques disponibles (non sélectionnées)
  const unselectedMetrics = availableMetrics.filter(
    metric => !selectedMetrics.includes(metric.id)
  );

  // Filtrer par terme de recherche
  const filteredMetrics = unselectedMetrics.filter(metric =>
    metric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    metric.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Grouper par catégorie
  const metricsByCategory = filteredMetrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, MetricType[]>);

  // Sélectionner une métrique
  const handleSelectMetric = (metricId: string) => {
    if (selectedMetrics.length < maxSelections) {
      onSelectionChange([...selectedMetrics, metricId]);
    }
  };

  // Désélectionner une métrique
  const handleDeselectMetric = (metricId: string) => {
    onSelectionChange(selectedMetrics.filter(id => id !== metricId));
  };

  // Vérifier si on peut ajouter plus de métriques
  const canAddMore = selectedMetrics.length < maxSelections;

  return (
    <div className="space-y-4">
      {/* Métriques sélectionnées */}
      {selectedMetrics.length > 0 && (
        <div>
          <p className="text-sm font-medium text-text-primary mb-2">
            Métriques sélectionnées ({selectedMetrics.length}/{maxSelections}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedMetrics.map(metricId => {
              const metric = availableMetrics.find(m => m.id === metricId);
              if (!metric) return null;

              return (
                <span
                  key={metricId}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-accent-primary/20 text-accent-primary border border-accent-primary/30 cursor-pointer hover:bg-accent-primary/30"
                  onClick={() => handleDeselectMetric(metricId)}
                >
                  {metric.name} ({metric.unit})
                  <X size={12} className="ml-1" />
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
        <input
          type="text"
          placeholder="Rechercher une métrique..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-background-primary border border-background-tertiary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/30"
        />
      </div>

      {/* Métriques disponibles */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-text-primary">
            Métriques disponibles {canAddMore ? '' : '(limite atteinte)'}
          </p>
          {Object.keys(metricsByCategory).length > 3 && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-sm text-accent-primary hover:text-accent-hover"
            >
              {showAllCategories ? 'Réduire' : 'Voir toutes les catégories'}
            </button>
          )}
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {Object.entries(metricsByCategory).map(([category, metrics]) => {
            // Masquer certaines catégories si showAllCategories est false
            if (!showAllCategories && ['CHARGE_ENTRAINEMENT', 'NUTRITION'].includes(category)) {
              return null;
            }

            return (
              <div key={category}>
                <h4 className="text-sm font-semibold text-text-primary mb-2 uppercase tracking-wide">
                  {category.replace('_', ' ')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {metrics.map(metric => (
                    <button
                      key={metric.id}
                      onClick={() => handleSelectMetric(metric.id)}
                      disabled={!canAddMore}
                      className={`p-3 text-left border rounded-lg transition-all duration-200 ${
                        canAddMore
                          ? 'border-background-tertiary hover:border-accent-primary hover:bg-accent-primary/5 text-text-primary'
                          : 'border-background-tertiary/50 text-text-muted cursor-not-allowed'
                      }`}
                    >
                      <div className="font-medium">{metric.name}</div>
                      <div className="text-xs text-text-muted">{metric.unit}</div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {!canAddMore && (
          <p className="text-xs text-text-muted mt-2">
            Limite de {maxSelections} métriques atteinte. Désélectionnez-en une pour en ajouter une autre.
          </p>
        )}
      </div>
    </div>
  );
}
