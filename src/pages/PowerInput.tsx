/**
 * Page Saisie Puissance & Vitesse - Module de saisie pour les tests de puissance et vitesse
 * Fonctionnalité A-03 du cahier des charges - Puissance & Vitesse
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { Card, Button } from '../components/ui';
import { useAthletes } from '../hooks/useAthletes';
import { measurementService, db } from '../services';
import { Save, Zap } from 'lucide-react';

interface PowerTest {
  type: 'CMJ' | 'SJ' | 'DropJump';
  height?: number; // cm
  rsi?: number; // Reactive Strength Index
  contactTime?: number; // ms
  power?: number; // watts
  notes?: string;
}

interface SprintTest {
  distance: number; // m (10, 20, 30, 40)
  time: number; // s
  maxSpeed?: number; // m/s (calculé)
  notes?: string;
}

interface AgilityTest {
  type: 'T-Test' | '505' | 'Illinois';
  time: number; // s
  notes?: string;
}

export function PowerInput() {
  const { id: athleteId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { athletes } = useAthletes();

  const athlete = athletes.find(a => a.id === athleteId);

  const [powerTests, setPowerTests] = useState<PowerTest[]>([]);
  const [sprintTests, setSprintTests] = useState<SprintTest[]>([]);
  const [agilityTests, setAgilityTests] = useState<AgilityTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddPowerTest = () => {
    setPowerTests([...powerTests, {
      type: 'CMJ',
      height: 0,
      notes: '',
    }]);
  };

  const handleAddSprintTest = () => {
    setSprintTests([...sprintTests, {
      distance: 10,
      time: 0,
      notes: '',
    }]);
  };

  const handleAddAgilityTest = () => {
    setAgilityTests([...agilityTests, {
      type: 'T-Test',
      time: 0,
      notes: '',
    }]);
  };

  const handleUpdatePowerTest = (index: number, field: keyof PowerTest, value: any) => {
    const updated = [...powerTests];
    updated[index] = { ...updated[index], [field]: value };
    setPowerTests(updated);
  };

  const handleUpdateSprintTest = (index: number, field: keyof SprintTest, value: any) => {
    const updated = [...sprintTests];
    updated[index] = { ...updated[index], [field]: value };

    // Calcul automatique de la vitesse max
    if (field === 'time' || field === 'distance') {
      const test = updated[index];
      if (test.distance > 0 && test.time > 0) {
        updated[index].maxSpeed = test.distance / test.time;
      }
    }

    setSprintTests(updated);
  };

  const handleUpdateAgilityTest = (index: number, field: keyof AgilityTest, value: any) => {
    const updated = [...agilityTests];
    updated[index] = { ...updated[index], [field]: value };
    setAgilityTests(updated);
  };

  const handleRemovePowerTest = (index: number) => {
    setPowerTests(powerTests.filter((_, i) => i !== index));
  };

  const handleRemoveSprintTest = (index: number) => {
    setSprintTests(sprintTests.filter((_, i) => i !== index));
  };

  const handleRemoveAgilityTest = (index: number) => {
    setAgilityTests(agilityTests.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!athleteId) return;

    setLoading(true);
    try {
      const today = new Date();

      // Récupérer les métriques disponibles
      const metricTypes = await db.metricTypes.toArray();
      const metricsMap = new Map(metricTypes.map(m => [m.name, m.id]));

      const measurements = [];

      // Tests de puissance
      for (const test of powerTests) {
        if (test.height && test.height > 0) {
          const metricName = `${test.type} Hauteur`;
          const metricId = metricsMap.get(metricName);
          if (metricId) {
            measurements.push({
              athleteId,
              metricTypeId: metricId,
              date: today,
              value: test.height,
              unit: 'cm',
              notes: test.notes,
            });
          }
        }

        if (test.rsi && test.rsi > 0) {
          const metricName = `${test.type} RSI`;
          const metricId = metricsMap.get(metricName);
          if (metricId) {
            measurements.push({
              athleteId,
              metricTypeId: metricId,
              date: today,
              value: test.rsi,
              unit: '',
              notes: test.notes,
            });
          }
        }
      }

      // Tests de sprint
      for (const test of sprintTests) {
        if (test.time > 0) {
          const metricName = `Sprint ${test.distance}m`;
          const metricId = metricsMap.get(metricName);
          if (metricId) {
            measurements.push({
              athleteId,
              metricTypeId: metricId,
              date: today,
              value: test.time,
              unit: 's',
              notes: test.notes,
            });
          }
        }

        if (test.maxSpeed && test.maxSpeed > 0) {
          const metricName = 'Vitesse Max';
          const metricId = metricsMap.get(metricName);
          if (metricId) {
            measurements.push({
              athleteId,
              metricTypeId: metricId,
              date: today,
              value: test.maxSpeed,
              unit: 'm/s',
              notes: test.notes,
            });
          }
        }
      }

      // Tests d'agilité
      for (const test of agilityTests) {
        if (test.time > 0) {
          const metricName = test.type;
          const metricId = metricsMap.get(metricName);
          if (metricId) {
            measurements.push({
              athleteId,
              metricTypeId: metricId,
              date: today,
              value: test.time,
              unit: 's',
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
        setPowerTests([]);
        setSprintTests([]);
        setAgilityTests([]);
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
      title="Tests Puissance & Vitesse"
      subtitle={`${athlete.firstName} ${athlete.lastName} - CMJ, Sprints, Agilité`}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Informations athlète */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent-primary/20 flex items-center justify-center">
                <Zap className="w-8 h-8 text-accent-primary" />
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
              <p className="font-medium">Tests de puissance enregistrés avec succès !</p>
            </div>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          {/* Tests de puissance (CMJ, SJ, Drop Jump) */}
          <Card title="Tests de Puissance" subtitle="Sauts verticaux et puissance">
            <div className="space-y-4">
              {powerTests.map((test, index) => (
                <div key={index} className="p-4 border border-background-tertiary rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-text-primary">Test #{index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePowerTest(index)}
                      type="button"
                    >
                      Supprimer
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Type de saut */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Type de saut
                      </label>
                      <select
                        value={test.type}
                        onChange={(e) => handleUpdatePowerTest(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                      >
                        <option value="CMJ">CMJ (Counter Movement Jump)</option>
                        <option value="SJ">SJ (Squat Jump)</option>
                        <option value="DropJump">Drop Jump</option>
                      </select>
                    </div>

                    {/* Hauteur */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Hauteur (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={test.height || ''}
                        onChange={(e) => handleUpdatePowerTest(index, 'height', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                        placeholder="45.5"
                      />
                    </div>

                    {/* RSI (pour Drop Jump) */}
                    {test.type === 'DropJump' && (
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          RSI (Reactive Strength Index)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={test.rsi || ''}
                          onChange={(e) => handleUpdatePowerTest(index, 'rsi', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                          placeholder="1.25"
                        />
                      </div>
                    )}

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Notes
                      </label>
                      <input
                        type="text"
                        value={test.notes || ''}
                        onChange={(e) => handleUpdatePowerTest(index, 'notes', e.target.value)}
                        className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                        placeholder="Conditions, technique, etc."
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={handleAddPowerTest}
                className="w-full"
              >
                + Ajouter un test de puissance
              </Button>
            </div>
          </Card>

          {/* Tests de sprint */}
          <Card title="Tests de Sprint" subtitle="Vitesse sur différentes distances">
            <div className="space-y-4">
              {sprintTests.map((test, index) => (
                <div key={index} className="p-4 border border-background-tertiary rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-text-primary">Sprint #{index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSprintTest(index)}
                      type="button"
                    >
                      Supprimer
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Distance */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Distance (m)
                      </label>
                      <select
                        value={test.distance}
                        onChange={(e) => handleUpdateSprintTest(index, 'distance', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                      >
                        <option value={10}>10m</option>
                        <option value={20}>20m</option>
                        <option value={30}>30m</option>
                        <option value={40}>40m</option>
                      </select>
                    </div>

                    {/* Temps */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Temps (s)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={test.time || ''}
                        onChange={(e) => handleUpdateSprintTest(index, 'time', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                        placeholder="2.15"
                      />
                    </div>

                    {/* Vitesse calculée */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Vitesse (m/s)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={test.maxSpeed?.toFixed(2) || ''}
                        readOnly
                        className="w-full px-3 py-2 bg-background-tertiary/50 border border-background-tertiary rounded text-text-primary"
                        placeholder="Calcul automatique"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mt-3">
                    <input
                      type="text"
                      value={test.notes || ''}
                      onChange={(e) => handleUpdateSprintTest(index, 'notes', e.target.value)}
                      className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                      placeholder="Conditions, départ, etc."
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={handleAddSprintTest}
                className="w-full"
              >
                + Ajouter un test de sprint
              </Button>
            </div>
          </Card>

          {/* Tests d'agilité */}
          <Card title="Tests d'Agilité" subtitle="Changement de direction et coordination">
            <div className="space-y-4">
              {agilityTests.map((test, index) => (
                <div key={index} className="p-4 border border-background-tertiary rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-text-primary">Test #{index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAgilityTest(index)}
                      type="button"
                    >
                      Supprimer
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Type de test */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Type de test
                      </label>
                      <select
                        value={test.type}
                        onChange={(e) => handleUpdateAgilityTest(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                      >
                        <option value="T-Test">T-Test</option>
                        <option value="505">505 Test</option>
                        <option value="Illinois">Illinois Test</option>
                      </select>
                    </div>

                    {/* Temps */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Temps (s)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={test.time || ''}
                        onChange={(e) => handleUpdateAgilityTest(index, 'time', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                        placeholder="11.25"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mt-3">
                    <input
                      type="text"
                      value={test.notes || ''}
                      onChange={(e) => handleUpdateAgilityTest(index, 'notes', e.target.value)}
                      className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                      placeholder="Conditions, technique, etc."
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={handleAddAgilityTest}
                className="w-full"
              >
                + Ajouter un test d'agilité
              </Button>
            </div>
          </Card>

          {/* Conseils */}
          <Card className="p-6 bg-accent-primary/5">
            <h4 className="font-semibold text-text-primary mb-3">⚡ Conseils pour les tests de puissance</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary">
              <div>
                <p className="font-medium text-text-primary mb-2">Tests de saut :</p>
                <ul className="space-y-1 text-xs">
                  <li>• Bien s'échauffer (5-10 min)</li>
                  <li>• Utiliser une surface stable</li>
                  <li>• Effectuer 3-5 sauts par test</li>
                  <li>• Prendre la meilleure performance</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-text-primary mb-2">Tests de sprint :</p>
                <ul className="space-y-1 text-xs">
                  <li>• Surface plane et uniforme</li>
                  <li>• Départ arrêté ou volant selon protocole</li>
                  <li>• Chronométrage précis au 1/100ème</li>
                  <li>• Répéter 2-3 fois avec repos</li>
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
              disabled={loading || (powerTests.length === 0 && sprintTests.length === 0 && agilityTests.length === 0)}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer les tests'}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
