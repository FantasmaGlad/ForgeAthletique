/**
 * Page Saisie Force Maximale - Module de saisie pour les tests de force (1RM, 3RM, 5RM, 8RM)
 * Fonctionnalité A-03 du cahier des charges - Force Maximale
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { Card, Button } from '../components/ui';
import { useAthletes } from '../hooks/useAthletes';
import { measurementService, db } from '../services';
import { Save, Dumbbell, Calculator } from 'lucide-react';

type RMType = '1RM' | '3RM' | '5RM' | '8RM';

interface StrengthTest {
  exerciseId: string;
  exerciseName: string;
  rmType: RMType;
  weight: number;
  notes?: string;
}

export function StrengthInput() {
  const { id: athleteId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { athletes } = useAthletes();

  const athlete = athletes.find(a => a.id === athleteId);

  const [tests, setTests] = useState<StrengthTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Exercices disponibles pour les tests de force
  const strengthExercises = [
    { id: 'back-squat', name: 'Back Squat' },
    { id: 'front-squat', name: 'Front Squat' },
    { id: 'deadlift', name: 'Soulevé de Terre' },
    { id: 'bench-press', name: 'Développé Couché' },
    { id: 'overhead-press', name: 'Développé Militaire' },
    { id: 'pull-ups', name: 'Tractions Lestées' },
    { id: 'snatch', name: 'Arraché (Snatch)' },
    { id: 'clean-jerk', name: 'Épaulé-Jeté' },
    { id: 'hip-thrust', name: 'Hip Thrust' },
  ];

  const handleAddTest = () => {
    setTests([...tests, {
      exerciseId: '',
      exerciseName: '',
      rmType: '1RM',
      weight: 0,
      notes: '',
    }]);
  };

  const handleUpdateTest = (index: number, field: keyof StrengthTest, value: any) => {
    const updatedTests = [...tests];
    updatedTests[index] = { ...updatedTests[index], [field]: value };

    // Si l'exercice change, mettre à jour le nom
    if (field === 'exerciseId') {
      const exercise = strengthExercises.find(ex => ex.id === value);
      updatedTests[index].exerciseName = exercise?.name || '';
    }

    setTests(updatedTests);
  };

  const handleRemoveTest = (index: number) => {
    setTests(tests.filter((_, i) => i !== index));
  };

  // Calcul de 1RM estimé à partir d'autres RM
  const estimate1RM = (weight: number, reps: number): number => {
    // Formule d'Epley: 1RM = weight / (1.0278 - 0.0278 * reps)
    return weight / (1.0278 - 0.0278 * reps);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!athleteId || tests.length === 0) return;

    setLoading(true);
    try {
      const today = new Date();

      // Récupérer les métriques disponibles
      const metricTypes = await db.metricTypes.toArray();
      const metricsMap = new Map(metricTypes.map(m => [m.name, m.id]));

      const measurements = [];

      for (const test of tests) {
        if (test.weight > 0 && test.exerciseName) {
          // Créer le nom de la métrique (ex: "1RM Back Squat")
          const metricName = `${test.rmType} ${test.exerciseName}`;

          const metricId = metricsMap.get(metricName);
          if (metricId) {
            measurements.push({
              athleteId,
              metricTypeId: metricId,
              date: today,
              value: test.weight,
              unit: 'kg',
              notes: test.notes,
            });
          }
        }
      }

      // Sauvegarder toutes les mesures
      for (const measurement of measurements) {
        await measurementService.create(measurement);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setTests([]); // Réinitialiser après succès
      }, 2000);

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

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
      title="Tests de Force Maximale"
      subtitle={`${athlete.firstName} ${athlete.lastName} - 1RM, 3RM, 5RM, 8RM`}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Informations athlète */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent-primary/20 flex items-center justify-center">
                <Dumbbell className="w-8 h-8 text-accent-primary" />
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

        {/* Message de succès */}
        {success && (
          <Card className="p-4 bg-status-success/10 border-status-success/30">
            <div className="flex items-center gap-3 text-status-success">
              <Save size={24} />
              <p className="font-medium">Tests de force enregistrés avec succès !</p>
            </div>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          {/* Tests de force */}
          <Card title={`Tests de Force (${tests.length})`} subtitle="Saisissez les performances maximales">
            <div className="space-y-6">
              {tests.map((test, index) => (
                <div key={index} className="p-4 border border-background-tertiary rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-text-primary">Test #{index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTest(index)}
                      type="button"
                    >
                      Supprimer
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Exercice */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Exercice
                      </label>
                      <select
                        value={test.exerciseId}
                        onChange={(e) => handleUpdateTest(index, 'exerciseId', e.target.value)}
                        className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                        required
                      >
                        <option value="">Sélectionner un exercice</option>
                        {strengthExercises.map(exercise => (
                          <option key={exercise.id} value={exercise.id}>
                            {exercise.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Type de RM */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Type de RM
                      </label>
                      <select
                        value={test.rmType}
                        onChange={(e) => handleUpdateTest(index, 'rmType', e.target.value)}
                        className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                      >
                        <option value="1RM">1RM</option>
                        <option value="3RM">3RM</option>
                        <option value="5RM">5RM</option>
                        <option value="8RM">8RM</option>
                      </select>
                    </div>

                    {/* Charge */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Charge (kg)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={test.weight || ''}
                        onChange={(e) => handleUpdateTest(index, 'weight', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                        placeholder="100.5"
                        required
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Notes
                      </label>
                      <input
                        type="text"
                        value={test.notes || ''}
                        onChange={(e) => handleUpdateTest(index, 'notes', e.target.value)}
                        className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                        placeholder="Conditions, technique, etc."
                      />
                    </div>
                  </div>

                  {/* Calcul 1RM estimé */}
                  {test.rmType !== '1RM' && test.weight > 0 && (
                    <div className="mt-3 p-3 bg-accent-primary/10 rounded">
                      <div className="flex items-center gap-2 text-accent-primary">
                        <Calculator size={16} />
                        <span className="text-sm font-medium">
                          1RM estimé: {estimate1RM(test.weight, parseInt(test.rmType.replace('RM', ''))).toFixed(1)} kg
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Bouton ajouter test */}
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddTest}
                className="w-full"
              >
                + Ajouter un test de force
              </Button>
            </div>
          </Card>

          {/* Informations sur les tests */}
          <Card className="p-6 bg-accent-primary/5">
            <h4 className="font-semibold text-text-primary mb-3">💪 Conseils pour les tests de force</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary">
              <div>
                <p className="font-medium text-text-primary mb-2">Préparation :</p>
                <ul className="space-y-1 text-xs">
                  <li>• Bien s'échauffer avant les tests</li>
                  <li>• Utiliser une technique irréprochable</li>
                  <li>• Avoir un partenaire pour la sécurité</li>
                  <li>• Noter les conditions (heure, fatigue, etc.)</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-text-primary mb-2">Méthodologie :</p>
                <ul className="space-y-1 text-xs">
                  <li>• Commencer par des charges légères</li>
                  <li>• Augmenter progressivement</li>
                  <li>• Repos de 3-5 min entre séries</li>
                  <li>• S'arrêter au premier échec technique</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate(`/athletes/${athleteId}`)}
              type="button"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading || tests.length === 0 || tests.some(t => !t.exerciseId || t.weight <= 0)}
            >
              {loading ? 'Enregistrement...' : `Enregistrer ${tests.length} test${tests.length > 1 ? 's' : ''}`}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
