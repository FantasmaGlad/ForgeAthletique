/**
 * Page Analytics - Moteur de Visualisation Dynamique (COEUR du projet)
 * Fonctionnalité A-04 du cahier des charges
 */

import { useState, useRef } from 'react';
import { MainLayout } from '../components/layout';
import { Card, Button, Badge } from '../components/ui';
import { MetricSelector } from '../components/forms/MetricSelector';
import { LineChart, MultiLineChart, BarChart, AreaChart } from '../components/charts';
import { useAthletes, useMetricTypes, useChartData } from '../hooks';
import { TrendingUp, Download, Filter, Calendar, BarChart3 } from 'lucide-react';
import { downloadChartAsPNG } from '../utils/chartExport';
import { analyzeCorrelations } from '../utils/dataExport';
import type { DateRange } from '../types';

export function Analytics() {
  const { athletes } = useAthletes();
  const { metricTypes: availableMetrics } = useMetricTypes();
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedAthlete, setSelectedAthlete] = useState<string>('');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 jours en arrière
    end: new Date(),
  });
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [showCorrelations, setShowCorrelations] = useState(false);
  const [correlations, setCorrelations] = useState<any[]>([]);

  // Utiliser le hook personnalisé pour les données du graphique
  const { chartData } = useChartData(selectedAthlete, selectedMetrics, dateRange);

  // Obtenir les métriques sélectionnées
  const selectedMetricObjects = availableMetrics.filter((m: any) =>
    selectedMetrics.includes(m.id)
  );

  const handleCalculateCorrelations = async () => {
    if (selectedMetrics.length < 2 || !selectedAthlete) return;

    try {
      const correlationData = await analyzeCorrelations(selectedAthlete, selectedMetrics, dateRange);
      setCorrelations(correlationData);
      setShowCorrelations(true);
    } catch (error) {
      console.error('Erreur lors du calcul des corrélations:', error);
      alert('Erreur lors du calcul des corrélations');
    }
  };

  const handleExportChart = () => {
    if (chartRef.current) {
      const athleteName = selectedAthlete
        ? athletes.find(a => a.id === selectedAthlete)?.firstName + '-' + athletes.find(a => a.id === selectedAthlete)?.lastName
        : 'tous-athletes';

      const metricsNames = selectedMetricObjects.map((m: any) => m.name).join('-');
      const filename = `analyse-${athleteName}-${metricsNames}-${new Date().toISOString().split('T')[0]}`;

      // Exporter en PNG par défaut (plus compatible)
      downloadChartAsPNG(chartRef.current, filename);
    }
  };

  const handleResetFilters = () => {
    setSelectedAthlete('');
    setSelectedMetrics([]);
    setDateRange({
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(),
    });
  };

  return (
    <MainLayout
      title="Moteur de Visualisation"
      subtitle="Analysez les performances de vos athlètes"
    >
      <div className="space-y-6">
        {/* Filtres et Configuration */}
        <Card title="Configuration de l'Analyse" subtitle="Sélectionnez les paramètres d'affichage">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Sélection Athlète */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Athlète
              </label>
              <select
                value={selectedAthlete}
                onChange={(e) => setSelectedAthlete(e.target.value)}
                className="w-full px-4 py-2 bg-background-primary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30"
              >
                <option value="">Tous les athlètes</option>
                {athletes.map(athlete => (
                  <option key={athlete.id} value={athlete.id}>
                    {athlete.firstName} {athlete.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Type de Graphique */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Type de graphique
              </label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as any)}
                className="w-full px-4 py-2 bg-background-primary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30"
              >
                <option value="line">Courbe</option>
                <option value="bar">Barres</option>
                <option value="area">Aires</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-end gap-2">
              <Button
                variant="secondary"
                icon={<Filter size={18} />}
                onClick={handleResetFilters}
              >
                Réinitialiser
              </Button>
              {selectedMetrics.length > 0 && (
                <>
                  <Button
                    icon={<Download size={18} />}
                    onClick={handleExportChart}
                  >
                    Exporter
                  </Button>
                  {selectedMetrics.length >= 2 && (
                    <Button
                      variant="secondary"
                      icon={<BarChart3 size={18} />}
                      onClick={handleCalculateCorrelations}
                    >
                      Corrélations
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sélecteur de métriques */}
          <div className="mb-6">
            <MetricSelector
              availableMetrics={availableMetrics}
              selectedMetrics={selectedMetrics}
              onSelectionChange={setSelectedMetrics}
              maxSelections={5}
            />
          </div>

          {/* Sélecteur de période */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={dateRange.start.toISOString().split('T')[0]}
                onChange={(e) => setDateRange(prev => ({
                  ...prev,
                  start: new Date(e.target.value)
                }))}
                className="w-full px-4 py-2 bg-background-primary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={dateRange.end.toISOString().split('T')[0]}
                onChange={(e) => setDateRange(prev => ({
                  ...prev,
                  end: new Date(e.target.value)
                }))}
                className="w-full px-4 py-2 bg-background-primary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30"
              />
            </div>
          </div>
        </Card>

        {/* Zone de Graphique */}
        <Card
          title={`Analyse ${selectedMetrics.length > 0 ? `(${selectedMetrics.length} métrique${selectedMetrics.length > 1 ? 's' : ''})` : '(Aucune métrique sélectionnée)'}`}
          subtitle={selectedAthlete ?
            `Athlète: ${athletes.find(a => a.id === selectedAthlete)?.firstName} ${athletes.find(a => a.id === selectedAthlete)?.lastName}` :
            'Tous les athlètes'
          }
          headerAction={
            selectedMetrics.length > 0 ? (
              <div className="flex items-center gap-2">
                <Badge variant="success">
                  {chartData.length} point{chartData.length > 1 ? 's' : ''} de données
                </Badge>
              </div>
            ) : undefined
          }
        >
          {selectedMetrics.length === 0 ? (
            <div className="h-96 flex items-center justify-center text-text-muted">
              <div className="text-center">
                <TrendingUp size={64} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">Sélectionnez des métriques</h3>
                <p className="text-sm">
                  Choisissez un athlète et au moins une métrique pour commencer l'analyse
                </p>
              </div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-96 flex items-center justify-center text-text-muted">
              <div className="text-center">
                <Calendar size={64} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">Aucune donnée</h3>
                <p className="text-sm">
                  Aucune mesure trouvée pour cette période et ces métriques
                </p>
              </div>
            </div>
          ) : (
            <div ref={chartRef} className="h-96">
              {selectedMetrics.length === 1 ? (
                // Graphique simple pour une métrique
                <>
                  {chartType === 'line' && (
                    <LineChart
                      data={chartData}
                      dataKey={selectedMetricObjects[0]?.name || ''}
                      color="#0066FF"
                    />
                  )}
                  {chartType === 'bar' && (
                    <BarChart
                      data={chartData}
                      dataKey={selectedMetricObjects[0]?.name || ''}
                      color="#0066FF"
                    />
                  )}
                  {chartType === 'area' && (
                    <AreaChart
                      data={chartData}
                      dataKey={selectedMetricObjects[0]?.name || ''}
                      color="#0066FF"
                    />
                  )}
                </>
              ) : (
                // Graphique multi-métriques
                <MultiLineChart
                  data={chartData}
                  lines={selectedMetricObjects.map((metric: any, index: number) => ({
                    dataKey: metric.name,
                    name: metric.name,
                    color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`, // Palette de couleurs variées
                  }))}
                />
              )}
            </div>
          )}
        </Card>

        {/* Statistiques rapides */}
        {chartData.length > 0 && selectedMetrics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4">
              <div className="text-center">
                <p className="text-text-secondary text-sm mb-1">Points de données</p>
                <p className="text-2xl font-bold text-text-primary">{chartData.length}</p>
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-center">
                <p className="text-text-secondary text-sm mb-1">Métriques analysées</p>
                <p className="text-2xl font-bold text-accent-primary">{selectedMetrics.length}</p>
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-center">
                <p className="text-text-secondary text-sm mb-1">Période d'analyse</p>
                <p className="text-sm font-medium text-text-primary">
                  {Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24))} jours
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Section des corrélations */}
        {showCorrelations && correlations.length > 0 && (
          <Card title="🔗 Analyse des Corrélations" subtitle="Relations entre les métriques sélectionnées">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {correlations.map((correlation, index) => (
                  <div
                    key={index}
                    className="p-4 border border-background-tertiary rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text-primary">
                        {correlation.metric1}
                      </span>
                      <span className="text-xs text-text-muted">↔</span>
                      <span className="text-sm font-medium text-text-primary">
                        {correlation.metric2}
                      </span>
                    </div>

                    <div className="text-center mb-3">
                      <p className={`text-2xl font-bold ${
                        Math.abs(correlation.correlation) > 0.7 ? 'text-status-success' :
                        Math.abs(correlation.correlation) > 0.5 ? 'text-status-warning' :
                        'text-text-muted'
                      }`}>
                        {correlation.correlation > 0 ? '+' : ''}{correlation.correlation}
                      </p>
                      <Badge
                        variant={
                          Math.abs(correlation.correlation) > 0.7 ? 'success' :
                          Math.abs(correlation.correlation) > 0.5 ? 'warning' : 'default'
                        }
                        size="sm"
                      >
                        Corrélation {correlation.strength}
                      </Badge>
                    </div>

                    <p className="text-xs text-text-muted text-center">
                      {correlation.dataPoints} points de données
                    </p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Button
                  variant="secondary"
                  onClick={() => setShowCorrelations(false)}
                >
                  Masquer les corrélations
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Section des corrélations (vide) */}
        {showCorrelations && correlations.length === 0 && (
          <Card title="🔗 Analyse des Corrélations" subtitle="Résultats du calcul">
            <div className="text-center py-8 text-text-muted">
              <BarChart3 size={48} className="mx-auto mb-3 opacity-50" />
              <p>Aucune corrélation significative trouvée</p>
              <p className="text-sm">Il faut au moins 3 points de données communs pour calculer une corrélation</p>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
