/**
 * Page Paramètres - Configuration et outils avancés
 */

import { useState } from 'react';
import { MainLayout } from '../components/layout';
import { Card, Button, Badge } from '../components/ui';
import { db } from '../services/database';
import { downloadDataAsJSON, importDataFromJSON } from '../utils/dataExport';
import {
  Download,
  Upload,
  Database,
  Users,
  Activity,
  Calculator,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export function Settings() {
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');

  // Statistiques de la base de données
  const [dbStats, setDbStats] = useState<{
    athletes: number;
    measurements: number;
    trainingSessions: number;
    exercises: number;
  }>({
    athletes: 0,
    measurements: 0,
    trainingSessions: 0,
    exercises: 0,
  });

  // Charger les statistiques
  useState(() => {
    const loadStats = async () => {
      try {
        const [athletesCount, measurementsCount, sessionsCount, exercisesCount] = await Promise.all([
          db.athletes.count(),
          db.measurements.count(),
          db.trainingSessions.count(),
          db.exercises.count(),
        ]);

        setDbStats({
          athletes: athletesCount,
          measurements: measurementsCount,
          trainingSessions: sessionsCount,
          exercises: exercisesCount,
        });
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    };

    loadStats();
  });

  const handleExportData = () => {
    downloadDataAsJSON();
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonData = e.target?.result as string;
        const result = await importDataFromJSON(jsonData);

        setImportStatus('success');
        setImportMessage(
          `Import réussi : ${result.athletes} athlètes, ${result.measurements} mesures, ${result.trainingSessions} séances, ${result.exercises} exercices`
        );

        // Recharger la page après 2 secondes
        setTimeout(() => {
          window.location.reload();
        }, 2000);

      } catch (error) {
        setImportStatus('error');
        setImportMessage('Erreur lors de l\'import des données');
        console.error('Erreur d\'import:', error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <MainLayout
      title="Paramètres et Outils"
      subtitle="Configuration avancée et gestion des données"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Statistiques de la base de données */}
        <Card title="📊 Statistiques de la Base de Données" subtitle="Vue d'ensemble de vos données">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-background-tertiary/30 rounded-lg">
              <div className="w-12 h-12 rounded-lg bg-accent-primary/20 flex items-center justify-center mx-auto mb-3">
                <Users className="text-accent-primary" size={24} />
              </div>
              <p className="text-2xl font-bold text-text-primary">{dbStats.athletes}</p>
              <p className="text-sm text-text-secondary">Athlète{dbStats.athletes > 1 ? 's' : ''}</p>
            </div>

            <div className="text-center p-4 bg-background-tertiary/30 rounded-lg">
              <div className="w-12 h-12 rounded-lg bg-status-success/20 flex items-center justify-center mx-auto mb-3">
                <Activity className="text-status-success" size={24} />
              </div>
              <p className="text-2xl font-bold text-text-primary">{dbStats.measurements}</p>
              <p className="text-sm text-text-secondary">Mesure{dbStats.measurements > 1 ? 's' : ''}</p>
            </div>

            <div className="text-center p-4 bg-background-tertiary/30 rounded-lg">
              <div className="w-12 h-12 rounded-lg bg-status-warning/20 flex items-center justify-center mx-auto mb-3">
                <Database className="text-status-warning" size={24} />
              </div>
              <p className="text-2xl font-bold text-text-primary">{dbStats.trainingSessions}</p>
              <p className="text-sm text-text-secondary">Séance{dbStats.trainingSessions > 1 ? 's' : ''}</p>
            </div>

            <div className="text-center p-4 bg-background-tertiary/30 rounded-lg">
              <div className="w-12 h-12 rounded-lg bg-accent-secondary/20 flex items-center justify-center mx-auto mb-3">
                <Calculator className="text-accent-secondary" size={24} />
              </div>
              <p className="text-2xl font-bold text-text-primary">{dbStats.exercises}</p>
              <p className="text-sm text-text-secondary">Exercice{dbStats.exercises > 1 ? 's' : ''}</p>
            </div>
          </div>
        </Card>

        {/* Export/Import des données */}
        <Card title="💾 Gestion des Données" subtitle="Sauvegarde et restauration de vos données">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Download size={24} className="text-accent-primary" />
                <div>
                  <h3 className="font-semibold text-text-primary">Exporter les données</h3>
                  <p className="text-sm text-text-secondary">
                    Téléchargez toutes vos données au format JSON
                  </p>
                </div>
              </div>

              <div className="p-4 bg-background-tertiary/30 rounded-lg">
                <p className="text-sm text-text-secondary mb-3">
                  Cette sauvegarde inclut tous les athlètes, mesures, séances d'entraînement et exercices.
                </p>
                <Button onClick={handleExportData} className="w-full">
                  <Download size={18} className="mr-2" />
                  Exporter en JSON
                </Button>
              </div>
            </div>

            {/* Import */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Upload size={24} className="text-status-warning" />
                <div>
                  <h3 className="font-semibold text-text-primary">Importer des données</h3>
                  <p className="text-sm text-text-secondary">
                    Restaurer des données depuis un fichier JSON
                  </p>
                </div>
              </div>

              <div className="p-4 bg-background-tertiary/30 rounded-lg">
                <p className="text-sm text-text-secondary mb-3">
                  Attention : cette action remplacera les données existantes.
                </p>

                {importStatus === 'success' && (
                  <div className="mb-3 p-3 bg-status-success/10 border border-status-success/30 rounded text-status-success text-sm">
                    <CheckCircle size={16} className="inline mr-2" />
                    {importMessage}
                  </div>
                )}

                {importStatus === 'error' && (
                  <div className="mb-3 p-3 bg-status-danger/10 border border-status-danger/30 rounded text-status-danger text-sm">
                    <AlertTriangle size={16} className="inline mr-2" />
                    {importMessage}
                  </div>
                )}

                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-accent-primary file:text-white hover:file:bg-accent-hover"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Informations système */}
        <Card title="ℹ️ Informations Système" subtitle="Détails techniques de l'application">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-text-primary mb-2">Version</h4>
                <p className="text-text-secondary">La Forge Athlétique v1.0.0</p>
              </div>

              <div>
                <h4 className="font-medium text-text-primary mb-2">Stockage</h4>
                <p className="text-text-secondary">Base de données locale (IndexedDB)</p>
              </div>

              <div>
                <h4 className="font-medium text-text-primary mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="info">React 19</Badge>
                  <Badge variant="info">TypeScript 5</Badge>
                  <Badge variant="info">Vite 7</Badge>
                  <Badge variant="info">Tailwind CSS</Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-text-primary mb-2">Fonctionnalités</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success">90% Complété</Badge>
                  <Badge variant="success">70+ Métriques</Badge>
                  <Badge variant="success">Export JSON</Badge>
                  <Badge variant="success">Visualisation</Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions avancées */}
        <Card title="⚙️ Actions Avancées" subtitle="Outils de gestion avancés">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="secondary"
              onClick={() => {
                if (confirm('Êtes-vous sûr de vouloir vider complètement la base de données ? Cette action est irréversible.')) {
                  // TODO: Implémenter la suppression complète
                  alert('Fonctionnalité à implémenter');
                }
              }}
            >
              <AlertTriangle size={18} className="mr-2" />
              Vider la base de données
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                // TODO: Implémenter la réinitialisation avec données de démonstration
                alert('Réinitialisation - Fonctionnalité à implémenter');
              }}
            >
              <Database size={18} className="mr-2" />
              Données de démonstration
            </Button>
          </div>
        </Card>

        {/* Conseils d'utilisation */}
        <Card className="p-6 bg-accent-primary/5">
          <h4 className="font-semibold text-text-primary mb-3">💡 Conseils d'utilisation</h4>
          <div className="space-y-3 text-sm text-text-secondary">
            <p>
              <strong>Export régulier :</strong> Pensez à exporter vos données régulièrement pour éviter toute perte accidentelle.
            </p>
            <p>
              <strong>Sauvegarde externe :</strong> Conservez vos fichiers d'export dans un endroit sûr (cloud, disque externe).
            </p>
            <p>
              <strong>Import prudent :</strong> L'import remplace complètement les données existantes. Assurez-vous d'avoir une sauvegarde récente.
            </p>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
