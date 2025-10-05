/**
 * Page Saisie Endurance - Module de saisie pour les tests d'endurance et capacités aérobies/anaérobies
 * Fonctionnalité A-03 du cahier des charges - Endurance
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { Card, Button } from '../components/ui';
import { useAthletes } from '../hooks/useAthletes';
import { measurementService, db } from '../services';
import { Save, Heart, Activity, Timer } from 'lucide-react';

interface EnduranceTest {
  type: 'Yo-Yo-IR1' | 'Yo-Yo-IR2' | '30-15-IFT' | 'VAM' | 'Cooper';
  result: number;
  estimatedVo2max?: number;
  notes?: string;
}

interface ThresholdTest {
  type: 'Lactate' | 'FTP' | 'HRVT';
  value: number;
  unit: string;
  notes?: string;
}

interface HeartRateData {
  restingHR?: number;
  maxHR?: number;
  hrv?: number; // Variabilité de fréquence cardiaque
}

export function EnduranceInput() {
  const { id: athleteId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { athletes } = useAthletes();

  const athlete = athletes.find(a => a.id === athleteId);

  const [enduranceTests, setEnduranceTests] = useState<EnduranceTest[]>([]);
  const [thresholdTests, setThresholdTests] = useState<ThresholdTest[]>([]);
  const [heartRateData, setHeartRateData] = useState<HeartRateData>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddEnduranceTest = () => {
    setEnduranceTests([...enduranceTests, {
      type: 'Yo-Yo-IR1',
      result: 0,
      notes: '',
    }]);
  };

  const handleAddThresholdTest = () => {
    setThresholdTests([...thresholdTests, {
      type: 'Lactate',
      value: 0,
      unit: 'mmol/L',
      notes: '',
    }]);
  };

  const handleUpdateEnduranceTest = (index: number, field: keyof EnduranceTest, value: any) => {
    const updated = [...enduranceTests];
    updated[index] = { ...updated[index], [field]: value };

    // Calcul automatique VO2max estimé selon le test
    if (field === 'result' || field === 'type') {
      const test = updated[index];
      if (test.result > 0) {
        let estimatedVo2max = 0;

        switch (test.type) {
          case 'Cooper':
            // VO2max = (distance en m - 504.9) / 44.73
            estimatedVo2max = (test.result - 504.9) / 44.73;
            break;
          case 'Yo-Yo-IR1':
            // Formule approximative pour Yo-Yo IR1
            estimatedVo2max = 45 + (test.result / 100);
            break;
          case 'Yo-Yo-IR2':
            // Formule approximative pour Yo-Yo IR2
            estimatedVo2max = 48 + (test.result / 80);
            break;
          case '30-15-IFT':
            // VO2max = 28.5 + (test.result * 1.03)
            estimatedVo2max = 28.5 + (test.result * 1.03);
            break;
          case 'VAM':
            // VO2max approximatif basé sur VAM
            estimatedVo2max = 35 + (test.result - 15) * 2;
            break;
        }

        updated[index].estimatedVo2max = Math.max(0, estimatedVo2max);
      }
    }

    setEnduranceTests(updated);
  };

  const handleUpdateThresholdTest = (index: number, field: keyof ThresholdTest, value: any) => {
    const updated = [...thresholdTests];
    updated[index] = { ...updated[index], [field]: value };
    setThresholdTests(updated);
  };

  const handleUpdateHeartRate = (field: keyof HeartRateData, value: number) => {
    setHeartRateData(prev => ({ ...prev, [field]: value }));
  };

  const handleRemoveEnduranceTest = (index: number) => {
    setEnduranceTests(enduranceTests.filter((_, i) => i !== index));
  };

  const handleRemoveThresholdTest = (index: number) => {
    setThresholdTests(thresholdTests.filter((_, i) => i !== index));
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

      // Tests d'endurance
      for (const test of enduranceTests) {
        if (test.result > 0) {
          const metricId = metricsMap.get(test.type);
          if (metricId) {
            measurements.push({
              athleteId,
              metricTypeId: metricId,
              date: today,
              value: test.result,
              unit: test.type === 'Cooper' ? 'm' : test.type.includes('Yo-Yo') ? 'm' : test.type === 'VAM' ? 'km/h' : 'm',
              notes: test.notes,
            });
          }

          // VO2max estimé si calculé
          if (test.estimatedVo2max && test.estimatedVo2max > 0) {
            const vo2MetricId = metricsMap.get('VO2max');
            if (vo2MetricId) {
              measurements.push({
                athleteId,
                metricTypeId: vo2MetricId,
                date: today,
                value: test.estimatedVo2max,
                unit: 'ml/kg/min',
                notes: `Estimé depuis ${test.type}`,
              });
            }
          }
        }
      }

      // Tests de seuil
      for (const test of thresholdTests) {
        if (test.value > 0) {
          const metricId = metricsMap.get(test.type);
          if (metricId) {
            measurements.push({
              athleteId,
              metricTypeId: metricId,
              date: today,
              value: test.value,
              unit: test.unit,
              notes: test.notes,
            });
          }
        }
      }

      // Fréquence cardiaque
      if (heartRateData.restingHR && heartRateData.restingHR > 0) {
        const restingHRMetricId = metricsMap.get('FC Repos');
        if (restingHRMetricId) {
          measurements.push({
            athleteId,
            metricTypeId: restingHRMetricId,
            date: today,
            value: heartRateData.restingHR,
            unit: 'bpm',
          });
        }
      }

      if (heartRateData.maxHR && heartRateData.maxHR > 0) {
        const maxHRMetricId = metricsMap.get('FC Max');
        if (maxHRMetricId) {
          measurements.push({
            athleteId,
            metricTypeId: maxHRMetricId,
            date: today,
            value: heartRateData.maxHR,
            unit: 'bpm',
          });
        }
      }

      if (heartRateData.hrv && heartRateData.hrv > 0) {
        const hrvMetricId = metricsMap.get('VFC (HRV)');
        if (hrvMetricId) {
          measurements.push({
            athleteId,
            metricTypeId: hrvMetricId,
            date: today,
            value: heartRateData.hrv,
            unit: 'ms',
          });
        }
      }

      // Sauvegarder toutes les mesures
      for (const measurement of measurements) {
        await measurementService.create(measurement);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setEnduranceTests([]);
        setThresholdTests([]);
        setHeartRateData({});
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
      title="Tests d'Endurance"
      subtitle={`${athlete.firstName} ${athlete.lastName} - VO2max, Seuils, Fréquence Cardiaque`}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Informations athlète */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent-primary/20 flex items-center justify-center">
                <Heart className="w-8 h-8 text-accent-primary" />
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
              <p className="font-medium">Tests d'endurance enregistrés avec succès !</p>
            </div>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          {/* Tests d'endurance terrain */}
          <Card title="Tests d'Endurance sur le Terrain" subtitle="VO2max estimé et capacités aérobies">
            <div className="space-y-4">
              {enduranceTests.map((test, index) => (
                <div key={index} className="p-4 border border-background-tertiary rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-text-primary">Test #{index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveEnduranceTest(index)}
                      type="button"
                    >
                      Supprimer
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Type de test */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Type de test
                      </label>
                      <select
                        value={test.type}
                        onChange={(e) => handleUpdateEnduranceTest(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                      >
                        <option value="Yo-Yo-IR1">Yo-Yo IR1</option>
                        <option value="Yo-Yo-IR2">Yo-Yo IR2</option>
                        <option value="30-15-IFT">30-15 IFT</option>
                        <option value="VAM">VAM-Éval</option>
                        <option value="Cooper">Test Cooper (12 min)</option>
                      </select>
                    </div>

                    {/* Résultat */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Résultat
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={test.result || ''}
                          onChange={(e) => handleUpdateEnduranceTest(index, 'result', parseInt(e.target.value) || 0)}
                          className="w-full pr-16 px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                          placeholder={
                            test.type === 'Cooper' ? '2400' :
                            test.type.includes('Yo-Yo') ? '1600' :
                            test.type === '30-15-IFT' ? '18' :
                            test.type === 'VAM' ? '18' : '0'
                          }
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
                          {test.type === 'Cooper' ? 'm' :
                           test.type.includes('Yo-Yo') ? 'm' :
                           test.type === '30-15-IFT' ? 'palier' :
                           test.type === 'VAM' ? 'km/h' : ''}
                        </span>
                      </div>
                    </div>

                    {/* VO2max estimé */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        VO2max estimé
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={test.estimatedVo2max?.toFixed(1) || ''}
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
                      onChange={(e) => handleUpdateEnduranceTest(index, 'notes', e.target.value)}
                      className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                      placeholder="Conditions météo, protocole, etc."
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={handleAddEnduranceTest}
                className="w-full"
              >
                + Ajouter un test d'endurance
              </Button>
            </div>
          </Card>

          {/* Tests de seuil */}
          <Card title="Tests de Seuil" subtitle="Seuils lactate, FTP, HRVT">
            <div className="space-y-4">
              {thresholdTests.map((test, index) => (
                <div key={index} className="p-4 border border-background-tertiary rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-text-primary">Test #{index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveThresholdTest(index)}
                      type="button"
                    >
                      Supprimer
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Type de seuil */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Type de seuil
                      </label>
                      <select
                        value={test.type}
                        onChange={(e) => handleUpdateThresholdTest(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                      >
                        <option value="Lactate">Seuil Lactate</option>
                        <option value="FTP">FTP (Functional Threshold Power)</option>
                        <option value="HRVT">HRVT (Heart Rate Ventilatory Threshold)</option>
                      </select>
                    </div>

                    {/* Valeur */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Valeur
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={test.value || ''}
                          onChange={(e) => handleUpdateThresholdTest(index, 'value', parseFloat(e.target.value) || 0)}
                          className="w-full pr-16 px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                          placeholder={
                            test.type === 'Lactate' ? '4.0' :
                            test.type === 'FTP' ? '250' : '165'
                          }
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
                          {test.type === 'Lactate' ? 'mmol/L' :
                           test.type === 'FTP' ? 'watts' : 'bpm'}
                        </span>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Notes
                      </label>
                      <input
                        type="text"
                        value={test.notes || ''}
                        onChange={(e) => handleUpdateThresholdTest(index, 'notes', e.target.value)}
                        className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                        placeholder="Protocole, conditions, etc."
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={handleAddThresholdTest}
                className="w-full"
              >
                + Ajouter un test de seuil
              </Button>
            </div>
          </Card>

          {/* Fréquence cardiaque */}
          <Card title="Fréquence Cardiaque" subtitle="Repos, maximale et variabilité">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  FC Repos (bpm)
                </label>
                <div className="relative">
                  <Heart className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="number"
                    min="30"
                    max="100"
                    value={heartRateData.restingHR || ''}
                    onChange={(e) => handleUpdateHeartRate('restingHR', parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-12 px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                    placeholder="60"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">bpm</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  FC Max (bpm)
                </label>
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="number"
                    min="150"
                    max="220"
                    value={heartRateData.maxHR || ''}
                    onChange={(e) => handleUpdateHeartRate('maxHR', parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-12 px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                    placeholder="195"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">bpm</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  VFC (HRV) (ms)
                </label>
                <div className="relative">
                  <Timer className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={heartRateData.hrv || ''}
                    onChange={(e) => handleUpdateHeartRate('hrv', parseFloat(e.target.value) || 0)}
                    className="w-full pl-10 pr-12 px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                    placeholder="45.5"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">ms</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Conseils */}
          <Card className="p-6 bg-accent-primary/5">
            <h4 className="font-semibold text-text-primary mb-3">❤️ Conseils pour les tests d'endurance</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary">
              <div>
                <p className="font-medium text-text-primary mb-2">Tests terrain :</p>
                <ul className="space-y-1 text-xs">
                  <li>• Respecter le protocole officiel</li>
                  <li>• Conditions météo similaires</li>
                  <li>• Surface plane et mesurée</li>
                  <li>• Échauffement progressif</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-text-primary mb-2">Tests de seuil :</p>
                <ul className="space-y-1 text-xs">
                  <li>• Test incremental progressif</li>
                  <li>• Mesure précise des gaz/FC</li>
                  <li>• Repos adéquat entre paliers</li>
                  <li>• Analyse post-effort immédiate</li>
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
              disabled={loading || (enduranceTests.length === 0 && thresholdTests.length === 0 && Object.values(heartRateData).every(v => !v))}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer les tests'}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
