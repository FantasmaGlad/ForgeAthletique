/**
 * Page Historique des Mesures - Consultation détaillée des données saisies
 * Fonctionnalité A-05 du cahier des charges - Historique des Mesures
 */

import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { Card, Button, Select, Badge, Table } from '../components/ui';
import { useAthletes, useMeasurements } from '../hooks';
import { db } from '../services';
import { Search, Filter, Calendar, TrendingUp, Eye } from 'lucide-react';
import { formatDate, formatValue } from '../utils/formatters';

interface SortConfig {
  key: 'date' | 'value';
  direction: 'asc' | 'desc';
}

export function MeasurementHistory() {
  const { id: athleteId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { athletes } = useAthletes();

  const athlete = athletes.find(a => a.id === athleteId);

  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'desc' });
  const [availableMetrics, setAvailableMetrics] = useState<any[]>([]);

  // Récupérer les métriques disponibles pour cet athlète
  useMemo(async () => {
    if (athleteId) {
      const metrics = await db.metricTypes.toArray();
      setAvailableMetrics(metrics);
    }
  }, [athleteId]);

  // Récupérer les mesures pour la métrique sélectionnée
  const { measurements } = useMeasurements(
    athleteId,
    selectedMetric,
    undefined // Pas de filtre de date pour l'historique complet
  );

  // Filtrer les mesures par terme de recherche
  const filteredMeasurements = useMemo(() => {
    if (!searchTerm) return measurements;

    return measurements.filter(measurement => {
      const metric = availableMetrics.find(m => m.id === measurement.metricTypeId);
      return metric?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             measurement.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [measurements, searchTerm, availableMetrics]);

  // Trier les mesures
  const sortedMeasurements = useMemo(() => {
    return [...filteredMeasurements].sort((a, b) => {
      let aValue, bValue;

      if (sortConfig.key === 'date') {
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
      } else {
        aValue = typeof a.value === 'number' ? a.value : parseFloat(a.value as string) || 0;
        bValue = typeof b.value === 'number' ? b.value : parseFloat(b.value as string) || 0;
      }

      if (sortConfig.direction === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }, [filteredMeasurements, sortConfig]);


  // Colonnes du tableau
  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (measurement: any) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-text-muted" />
          <span className="font-medium">{formatDate(measurement.date)}</span>
        </div>
      ),
    },
    {
      key: 'metric',
      label: 'Métrique',
      render: (measurement: any) => {
        const metric = availableMetrics.find(m => m.id === measurement.metricTypeId);
        return (
          <div>
            <p className="font-medium text-text-primary">{metric?.name}</p>
            <p className="text-xs text-text-muted">{metric?.category.replace('_', ' ')}</p>
          </div>
        );
      },
    },
    {
      key: 'value',
      label: 'Valeur',
      render: (measurement: any) => {
        const metric = availableMetrics.find(m => m.id === measurement.metricTypeId);
        return (
          <div className="text-center">
            <p className="font-bold text-lg text-accent-primary">
              {formatValue(measurement.value, metric?.unit || '')}
            </p>
          </div>
        );
      },
    },
    {
      key: 'notes',
      label: 'Notes',
      render: (measurement: any) => (
        <p className="text-sm text-text-secondary max-w-xs truncate">
          {measurement.notes || '-'}
        </p>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '100px',
      render: () => (
        <Button
          variant="ghost"
          size="sm"
          icon={<Eye size={16} />}
          onClick={() => {
            // TODO: Afficher les détails de la mesure
          }}
        >
          Détails
        </Button>
      ),
    },
  ];

  if (!athlete) {
    return (
      <MainLayout>
        <Card className="p-12 text-center">
          <h3 className="text-xl font-bold text-text-primary mb-3">
            Athlète non trouvé
          </h3>
          <Button onClick={() => navigate('/athletes')}>
            Retour à la liste
          </Button>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Historique des Mesures"
      subtitle={`${athlete.firstName} ${athlete.lastName} - Consultation détaillée`}
    >
      <div className="space-y-6">
        {/* Informations athlète */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent-primary/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-accent-primary">
                  {athlete.firstName[0]}{athlete.lastName[0]}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary">
                  {athlete.firstName} {athlete.lastName}
                </h3>
                <p className="text-text-secondary">{athlete.sport} • {athlete.currentLevel}</p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => navigate(`/athletes/${athleteId}`)}>
              Voir le profil
            </Button>
          </div>
        </Card>

        {/* Filtres et recherche */}
        <Card title="Filtres et Recherche" subtitle="Affinez votre recherche de données">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Sélection de métrique */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Métrique à consulter
              </label>
              <Select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                options={[
                  { value: '', label: 'Toutes les métriques' },
                  ...availableMetrics.map(metric => ({
                    value: metric.id,
                    label: `${metric.name} (${metric.unit}) - ${metric.category.replace('_', ' ')}`,
                  })),
                ]}
                fullWidth
              />
            </div>

            {/* Recherche */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Recherche
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher par métrique ou notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background-primary border border-background-tertiary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/30"
                />
              </div>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-background-tertiary/30 rounded-lg">
              <p className="text-2xl font-bold text-accent-primary">{measurements.length}</p>
              <p className="text-sm text-text-secondary">Total des mesures</p>
            </div>
            <div className="text-center p-3 bg-background-tertiary/30 rounded-lg">
              <p className="text-2xl font-bold text-status-success">
                {availableMetrics.filter(m => measurements.some(me => me.metricTypeId === m.id)).length}
              </p>
              <p className="text-sm text-text-secondary">Métriques différentes</p>
            </div>
            <div className="text-center p-3 bg-background-tertiary/30 rounded-lg">
              <p className="text-2xl font-bold text-status-warning">
                {new Set(measurements.map(m => formatDate(m.date))).size}
              </p>
              <p className="text-sm text-text-secondary">Jours d'activité</p>
            </div>
          </div>
        </Card>

        {/* Tableau des mesures */}
        <Card
          title={`Historique des Mesures ${selectedMetric ? '(Métrique filtrée)' : '(Toutes les métriques)'}`}
          subtitle={`${sortedMeasurements.length} mesure${sortedMeasurements.length > 1 ? 's' : ''} trouvée${sortedMeasurements.length > 1 ? 's' : ''}`}
        >
          {sortedMeasurements.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              <div className="w-20 h-20 rounded-full bg-background-tertiary flex items-center justify-center mx-auto mb-4">
                <Filter size={40} className="text-text-muted" />
              </div>
              <h3 className="text-xl font-bold mb-2">Aucune mesure trouvée</h3>
              <p className="text-sm mb-4">
                {selectedMetric ?
                  'Aucune mesure pour cette métrique. Commencez par saisir des données.' :
                  'Aucune mesure enregistrée pour cet athlète.'
                }
              </p>
              {!selectedMetric && (
                <Button onClick={() => navigate('/wellness')}>
                  Commencer la saisie
                </Button>
              )}
            </div>
          ) : (
            <Table
              data={sortedMeasurements}
              columns={columns}
              keyExtractor={(measurement) => measurement.id}
              hoverable
            />
          )}
        </Card>

        {/* Actions et outils */}
        {sortedMeasurements.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="info">
                  {sortedMeasurements.length} mesure{sortedMeasurements.length > 1 ? 's' : ''} affichée{sortedMeasurements.length > 1 ? 's' : ''}
                </Badge>
                <Badge variant="success">
                  Tri par {sortConfig.key === 'date' ? 'date' : 'valeur'} ({sortConfig.direction === 'desc' ? '↓ décroissant' : '↑ croissant'})
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  icon={<Filter size={18} />}
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedMetric('');
                    setSortConfig({ key: 'date', direction: 'desc' });
                  }}
                >
                  Réinitialiser
                </Button>
                <Button
                  icon={<TrendingUp size={18} />}
                  onClick={() => navigate('/analytics')}
                >
                  Analyser
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Conseils d'utilisation */}
        <Card className="p-6 bg-accent-primary/5">
          <h4 className="font-semibold text-text-primary mb-3">💡 Utilisation de l'historique</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary">
            <div>
              <p className="font-medium text-text-primary mb-2">Consultation :</p>
              <ul className="space-y-1 text-xs">
                <li>• Sélectionnez une métrique spécifique</li>
                <li>• Utilisez la recherche pour filtrer</li>
                <li>• Triez par date ou valeur</li>
                <li>• Consultez les détails de chaque mesure</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-text-primary mb-2">Analyse :</p>
              <ul className="space-y-1 text-xs">
                <li>• Identifiez les tendances de progression</li>
                <li>• Détectez les records personnels</li>
                <li>• Analysez les périodes de stagnation</li>
                <li>• Exportez vers le moteur d'analyse</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
