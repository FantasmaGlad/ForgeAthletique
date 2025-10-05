/**
 * Page Journal d'Entraînement - Consultation des séances passées
 * Fonctionnalité U-03 du cahier des charges - Journal d'Entraînement
 */

import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { Card, Button, Badge, Select, Table } from '../components/ui';
import { useAthletes } from '../hooks/useAthletes';
import { Calendar, Clock, Activity, Plus } from 'lucide-react';
import { formatDate } from '../utils/formatters';

interface TrainingSession {
  id: string;
  date: Date;
  name: string;
  exercises: ExercisePerformed[];
  globalRPE?: number;
  duration?: number;
  notes?: string;
}

interface ExercisePerformed {
  id: string;
  exerciseName: string;
  sets: ExerciseSet[];
  rpe?: number;
  notes?: string;
}

interface ExerciseSet {
  setNumber: number;
  reps: number;
  weight?: number;
  duration?: number;
  distance?: number;
  rpe?: number;
  completed: boolean;
}

export function TrainingJournal() {
  const { id: athleteId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { athletes } = useAthletes();

  const athlete = athletes.find(a => a.id === athleteId);

  const [selectedPeriod, setSelectedPeriod] = useState<string>('30'); // jours
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'rpe'>('date');

  // Données de démonstration (sera remplacé par de vraies données IndexedDB)
  const mockSessions: TrainingSession[] = [
    {
      id: '1',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      name: 'Séance Full Body',
      globalRPE: 8,
      duration: 75,
      notes: 'Bonne séance, technique propre',
      exercises: [
        {
          id: '1',
          exerciseName: 'Back Squat',
          rpe: 8,
          sets: [
            { setNumber: 1, reps: 5, weight: 100, completed: true },
            { setNumber: 2, reps: 5, weight: 105, completed: true },
            { setNumber: 3, reps: 5, weight: 110, completed: true },
          ],
        },
        {
          id: '2',
          exerciseName: 'Bench Press',
          rpe: 7,
          sets: [
            { setNumber: 1, reps: 8, weight: 80, completed: true },
            { setNumber: 2, reps: 8, weight: 82, completed: true },
            { setNumber: 3, reps: 8, weight: 85, completed: true },
          ],
        },
      ],
    },
    {
      id: '2',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      name: 'Séance Push',
      globalRPE: 7,
      duration: 60,
      notes: 'Focus sur la technique',
      exercises: [
        {
          id: '3',
          exerciseName: 'Overhead Press',
          rpe: 7,
          sets: [
            { setNumber: 1, reps: 10, weight: 50, completed: true },
            { setNumber: 2, reps: 10, weight: 52, completed: true },
          ],
        },
      ],
    },
  ];

  const [sessions] = useState<TrainingSession[]>(mockSessions);

  // Filtrer les séances par période
  const filteredSessions = useMemo(() => {
    const days = parseInt(selectedPeriod);
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    return sessions.filter(session => session.date >= cutoffDate);
  }, [sessions, selectedPeriod]);

  // Trier les séances
  const sortedSessions = useMemo(() => {
    return [...filteredSessions].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.date.getTime() - a.date.getTime();
        case 'duration':
          return (b.duration || 0) - (a.duration || 0);
        case 'rpe':
          return (b.globalRPE || 0) - (a.globalRPE || 0);
        default:
          return 0;
      }
    });
  }, [filteredSessions, sortBy]);

  // Colonnes du tableau
  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (session: TrainingSession) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-text-muted" />
          <div>
            <p className="font-medium">{formatDate(session.date)}</p>
            <p className="text-xs text-text-muted">{session.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'duration',
      label: 'Durée',
      render: (session: TrainingSession) => (
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-text-muted" />
          <span className="font-medium">{session.duration || '-'} min</span>
        </div>
      ),
    },
    {
      key: 'rpe',
      label: 'RPE Global',
      render: (session: TrainingSession) => (
        <div className="text-center">
          {session.globalRPE ? (
            <Badge variant={session.globalRPE >= 8 ? 'danger' : session.globalRPE >= 6 ? 'warning' : 'success'}>
              {session.globalRPE}/10
            </Badge>
          ) : (
            <span className="text-text-muted">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'exercises',
      label: 'Exercices',
      render: (session: TrainingSession) => (
        <div className="text-center">
          <span className="font-bold text-accent-primary">{session.exercises.length}</span>
          <p className="text-xs text-text-muted">exercice{session.exercises.length > 1 ? 's' : ''}</p>
        </div>
      ),
    },
    {
      key: 'volume',
      label: 'Volume Total',
      render: (session: TrainingSession) => {
        const totalWeight = session.exercises.reduce((total, exercise) => {
          return total + exercise.sets.reduce((exerciseTotal, set) => {
            return exerciseTotal + ((set.weight || 0) * set.reps);
          }, 0);
        }, 0);

        return (
          <div className="text-center">
            <p className="font-bold text-status-success">{totalWeight.toFixed(0)} kg</p>
            <p className="text-xs text-text-muted">tonnage</p>
          </div>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '120px',
      render: (session: TrainingSession) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // TODO: Afficher les détails de la séance
            alert(`Détails de la séance: ${session.name}`);
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
      title="Journal d'Entraînement"
      subtitle={`${athlete.firstName} ${athlete.lastName} - Historique des séances`}
    >
      <div className="space-y-6">
        {/* Informations athlète */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent-primary/20 flex items-center justify-center">
                <Activity className="w-8 h-8 text-accent-primary" />
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

        {/* Filtres et statistiques */}
        <Card title="Filtres et Statistiques" subtitle="Analysez vos séances d'entraînement">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Période */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Période d'analyse
              </label>
              <Select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                options={[
                  { value: '7', label: '7 derniers jours' },
                  { value: '30', label: '30 derniers jours' },
                  { value: '90', label: '3 derniers mois' },
                  { value: '365', label: 'Cette année' },
                ]}
                fullWidth
              />
            </div>

            {/* Tri */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Trier par
              </label>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                options={[
                  { value: 'date', label: 'Date (récent d\'abord)' },
                  { value: 'duration', label: 'Durée' },
                  { value: 'rpe', label: 'RPE Global' },
                ]}
                fullWidth
              />
            </div>

            {/* Actions */}
            <div className="flex items-end">
              <Button
                icon={<Plus size={18} />}
                onClick={() => {
                  // TODO: Créer une nouvelle séance
                  alert('Créer une nouvelle séance - Fonctionnalité à développer');
                }}
              >
                Nouvelle séance
              </Button>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-background-tertiary/30 rounded-lg">
              <p className="text-2xl font-bold text-accent-primary">{sortedSessions.length}</p>
              <p className="text-sm text-text-secondary">Séances totales</p>
            </div>
            <div className="text-center p-3 bg-background-tertiary/30 rounded-lg">
              <p className="text-2xl font-bold text-status-success">
                {sortedSessions.reduce((total, session) => total + (session.duration || 0), 0)} min
              </p>
              <p className="text-sm text-text-secondary">Temps total</p>
            </div>
            <div className="text-center p-3 bg-background-tertiary/30 rounded-lg">
              <p className="text-2xl font-bold text-status-warning">
                {Math.round(sortedSessions.reduce((total, session) => total + (session.globalRPE || 0), 0) / Math.max(sortedSessions.length, 1))}
              </p>
              <p className="text-sm text-text-secondary">RPE moyen</p>
            </div>
            <div className="text-center p-3 bg-background-tertiary/30 rounded-lg">
              <p className="text-2xl font-bold text-accent-secondary">
                {sortedSessions.reduce((total, session) =>
                  total + session.exercises.reduce((exerciseTotal, exercise) =>
                    exerciseTotal + exercise.sets.length, 0), 0)}
              </p>
              <p className="text-sm text-text-secondary">Séries totales</p>
            </div>
          </div>
        </Card>

        {/* Tableau des séances */}
        <Card
          title={`Séances d'Entraînement (${selectedPeriod} jours)`}
          subtitle={`${sortedSessions.length} séance${sortedSessions.length > 1 ? 's' : ''} trouvée${sortedSessions.length > 1 ? 's' : ''}`}
        >
          {sortedSessions.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              <div className="w-20 h-20 rounded-full bg-background-tertiary flex items-center justify-center mx-auto mb-4">
                <Activity size={40} className="text-text-muted" />
              </div>
              <h3 className="text-xl font-bold mb-2">Aucune séance trouvée</h3>
              <p className="text-sm mb-4">
                Commencez par créer votre première séance d'entraînement.
              </p>
              <Button icon={<Plus size={18} />}>
                Créer une séance
              </Button>
            </div>
          ) : (
            <Table
              data={sortedSessions}
              columns={columns}
              keyExtractor={(session) => session.id}
              hoverable
            />
          )}
        </Card>

        {/* Conseils d'utilisation */}
        <Card className="p-6 bg-accent-primary/5">
          <h4 className="font-semibold text-text-primary mb-3">💡 Utilisation du journal</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary">
            <div>
              <p className="font-medium text-text-primary mb-2">Suivi des séances :</p>
              <ul className="space-y-1 text-xs">
                <li>• Consultez l'historique de vos entraînements</li>
                <li>• Analysez votre progression sur le temps</li>
                <li>• Identifiez les tendances de performance</li>
                <li>• Ajustez votre programmation</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-text-primary mb-2">Planification :</p>
              <ul className="space-y-1 text-xs">
                <li>• Préparez vos prochaines séances</li>
                <li>• Suivez la charge d'entraînement</li>
                <li>• Respectez les périodes de récupération</li>
                <li>• Optimisez votre progression</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
