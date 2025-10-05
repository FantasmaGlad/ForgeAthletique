/**
 * Page Saisie Anthropométrie - Module de saisie pour les mesures corporelles
 * Fonctionnalité A-03 du cahier des charges - Anthropométrie
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { Card, Button } from '../components/ui';
import { useAthletes } from '../hooks/useAthletes';
import { measurementService, db } from '../services';
import { Save, Calculator, Ruler, Weight } from 'lucide-react';

interface AnthropometryData {
  // Mesures de base
  height: number; // cm
  weight: number; // kg
  bmi?: number; // calculé automatiquement

  // Circonférences (cm)
  neck?: number;
  shoulders?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  armLeft?: number;
  armRight?: number;
  forearmLeft?: number;
  forearmRight?: number;
  thighLeft?: number;
  thighRight?: number;
  calfLeft?: number;
  calfRight?: number;

  // Plis cutanés (mm)
  biceps?: number;
  triceps?: number;
  subscapular?: number;
  suprailiac?: number;
  abdominal?: number;
  thigh?: number;
  calf?: number;

  // Composition corporelle
  bodyFatPercentage?: number;
  leanMass?: number; // kg
}

export function AnthropometryInput() {
  const { id: athleteId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { athletes } = useAthletes();

  const athlete = athletes.find(a => a.id === athleteId);

  const [formData, setFormData] = useState<AnthropometryData>({
    height: 0,
    weight: 0,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Calcul automatique de l'IMC
  const bmi = formData.height > 0 && formData.weight > 0
    ? (formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1)
    : undefined;

  const handleInputChange = (field: keyof AnthropometryData, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setFormData(prev => ({
      ...prev,
      [field]: numValue,
      // Recalculer l'IMC si nécessaire
      ...(field === 'height' || field === 'weight' ? { bmi: undefined } : {})
    }));
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

      // Préparer les mesures à sauvegarder
      const measurements = [];

      // Mesures de base
      if (formData.height > 0) {
        const heightMetricId = metricsMap.get('Taille');
        if (heightMetricId) {
          measurements.push({
            athleteId,
            metricTypeId: heightMetricId,
            date: today,
            value: formData.height,
            unit: 'cm',
          });
        }
      }

      if (formData.weight > 0) {
        const weightMetricId = metricsMap.get('Poids');
        if (weightMetricId) {
          measurements.push({
            athleteId,
            metricTypeId: weightMetricId,
            date: today,
            value: formData.weight,
            unit: 'kg',
          });
        }
      }

      if (bmi) {
        const bmiMetricId = metricsMap.get('IMC');
        if (bmiMetricId) {
          measurements.push({
            athleteId,
            metricTypeId: bmiMetricId,
            date: today,
            value: parseFloat(bmi),
            unit: '',
          });
        }
      }

      // Circonférences
      const circumferences = {
        'Circonférence Cou': formData.neck,
        'Circonférence Épaules': formData.shoulders,
        'Circonférence Poitrine': formData.chest,
        'Circonférence Taille': formData.waist,
        'Circonférence Hanches': formData.hips,
        'Circonférence Bras Gauche': formData.armLeft,
        'Circonférence Bras Droit': formData.armRight,
        'Circonférence Avant-bras Gauche': formData.forearmLeft,
        'Circonférence Avant-bras Droit': formData.forearmRight,
        'Circonférence Cuisse Gauche': formData.thighLeft,
        'Circonférence Cuisse Droite': formData.thighRight,
        'Circonférence Mollet Gauche': formData.calfLeft,
        'Circonférence Mollet Droit': formData.calfRight,
      };

      for (const [metricName, value] of Object.entries(circumferences)) {
        if (value && value > 0) {
          const metricId = metricsMap.get(metricName);
          if (metricId) {
            measurements.push({
              athleteId,
              metricTypeId: metricId,
              date: today,
              value,
              unit: 'cm',
            });
          }
        }
      }

      // Plis cutanés
      const skinfolds = {
        'Pli Cutané Biceps': formData.biceps,
        'Pli Cutané Triceps': formData.triceps,
        'Pli Cutané Sous-scapulaire': formData.subscapular,
        'Pli Cutané Supra-iliaque': formData.suprailiac,
        'Pli Cutané Abdominal': formData.abdominal,
        'Pli Cutané Cuisse': formData.thigh,
        'Pli Cutané Mollet': formData.calf,
      };

      for (const [metricName, value] of Object.entries(skinfolds)) {
        if (value && value > 0) {
          const metricId = metricsMap.get(metricName);
          if (metricId) {
            measurements.push({
              athleteId,
              metricTypeId: metricId,
              date: today,
              value,
              unit: 'mm',
            });
          }
        }
      }

      // Composition corporelle
      if (formData.bodyFatPercentage && formData.bodyFatPercentage > 0) {
        const bfMetricId = metricsMap.get('% Masse Grasse');
        if (bfMetricId) {
          measurements.push({
            athleteId,
            metricTypeId: bfMetricId,
            date: today,
            value: formData.bodyFatPercentage,
            unit: '%',
          });
        }
      }

      if (formData.leanMass && formData.leanMass > 0) {
        const lmMetricId = metricsMap.get('Masse Maigre');
        if (lmMetricId) {
          measurements.push({
            athleteId,
            metricTypeId: lmMetricId,
            date: today,
            value: formData.leanMass,
            unit: 'kg',
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
        // Réinitialiser le formulaire après succès
        setFormData({ height: 0, weight: 0 });
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
      title="Saisie Anthropométrie"
      subtitle={`${athlete.firstName} ${athlete.lastName} - Mesures corporelles`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
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

        {/* Message de succès */}
        {success && (
          <Card className="p-4 bg-status-success/10 border-status-success/30">
            <div className="flex items-center gap-3 text-status-success">
              <Save size={24} />
              <p className="font-medium">Mesures anthropométriques enregistrées avec succès !</p>
            </div>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          {/* Mesures de base */}
          <Card title="Mesures de Base" subtitle="Taille, poids et calculs automatiques">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Taille */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Taille (cm)
                </label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="300"
                    value={formData.height || ''}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background-primary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30"
                    placeholder="170.5"
                  />
                </div>
              </div>

              {/* Poids */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Poids (kg)
                </label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="500"
                    value={formData.weight || ''}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background-primary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30"
                    placeholder="70.5"
                  />
                </div>
              </div>

              {/* IMC calculé */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  IMC (calculé)
                </label>
                <div className="relative">
                  <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="text"
                    value={bmi || ''}
                    readOnly
                    className="w-full pl-10 pr-4 py-2 bg-background-tertiary/50 border border-background-tertiary rounded-lg text-text-primary"
                    placeholder="Calcul automatique"
                  />
                </div>
                {bmi && (
                  <p className="text-xs text-text-muted mt-1">
                    {parseFloat(bmi) < 18.5 ? 'Maigreur' :
                     parseFloat(bmi) < 25 ? 'Normal' :
                     parseFloat(bmi) < 30 ? 'Surpoids' : 'Obésité'}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Circonférences */}
          <Card title="Circonférences Corporelles" subtitle="Mesures en centimètres">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Haut du corps */}
              <div>
                <h4 className="font-medium text-text-primary mb-3">Haut du corps</h4>
                <div className="space-y-3">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Cou"
                    value={formData.neck || ''}
                    onChange={(e) => handleInputChange('neck', e.target.value)}
                    className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Épaules"
                    value={formData.shoulders || ''}
                    onChange={(e) => handleInputChange('shoulders', e.target.value)}
                    className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Poitrine"
                    value={formData.chest || ''}
                    onChange={(e) => handleInputChange('chest', e.target.value)}
                    className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Taille"
                    value={formData.waist || ''}
                    onChange={(e) => handleInputChange('waist', e.target.value)}
                    className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Hanches"
                    value={formData.hips || ''}
                    onChange={(e) => handleInputChange('hips', e.target.value)}
                    className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                  />
                </div>
              </div>

              {/* Bras */}
              <div>
                <h4 className="font-medium text-text-primary mb-3">Bras</h4>
                <div className="space-y-3">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Bras Gauche"
                    value={formData.armLeft || ''}
                    onChange={(e) => handleInputChange('armLeft', e.target.value)}
                    className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Bras Droit"
                    value={formData.armRight || ''}
                    onChange={(e) => handleInputChange('armRight', e.target.value)}
                    className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Avant-bras Gauche"
                    value={formData.forearmLeft || ''}
                    onChange={(e) => handleInputChange('forearmLeft', e.target.value)}
                    className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Avant-bras Droit"
                    value={formData.forearmRight || ''}
                    onChange={(e) => handleInputChange('forearmRight', e.target.value)}
                    className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                  />
                </div>
              </div>

              {/* Jambes */}
              <div>
                <h4 className="font-medium text-text-primary mb-3">Jambes</h4>
                <div className="space-y-3">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Cuisse Gauche"
                    value={formData.thighLeft || ''}
                    onChange={(e) => handleInputChange('thighLeft', e.target.value)}
                    className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Cuisse Droite"
                    value={formData.thighRight || ''}
                    onChange={(e) => handleInputChange('thighRight', e.target.value)}
                    className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Mollet Gauche"
                    value={formData.calfLeft || ''}
                    onChange={(e) => handleInputChange('calfLeft', e.target.value)}
                    className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Mollet Droit"
                    value={formData.calfRight || ''}
                    onChange={(e) => handleInputChange('calfRight', e.target.value)}
                    className="w-full px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Plis cutanés */}
          <Card title="Plis Cutanés" subtitle="Mesures en millimètres">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="Biceps"
                value={formData.biceps || ''}
                onChange={(e) => handleInputChange('biceps', e.target.value)}
                className="px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
              />
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="Triceps"
                value={formData.triceps || ''}
                onChange={(e) => handleInputChange('triceps', e.target.value)}
                className="px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
              />
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="Sous-scapulaire"
                value={formData.subscapular || ''}
                onChange={(e) => handleInputChange('subscapular', e.target.value)}
                className="px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
              />
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="Supra-iliaque"
                value={formData.suprailiac || ''}
                onChange={(e) => handleInputChange('suprailiac', e.target.value)}
                className="px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
              />
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="Abdominal"
                value={formData.abdominal || ''}
                onChange={(e) => handleInputChange('abdominal', e.target.value)}
                className="px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
              />
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="Cuisse"
                value={formData.thigh || ''}
                onChange={(e) => handleInputChange('thigh', e.target.value)}
                className="px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
              />
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="Mollet"
                value={formData.calf || ''}
                onChange={(e) => handleInputChange('calf', e.target.value)}
                className="px-3 py-2 bg-background-primary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
              />
            </div>
          </Card>

          {/* Composition corporelle */}
          <Card title="Composition Corporelle" subtitle="Pourcentage de masse grasse et masse maigre">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  % Masse Grasse
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.bodyFatPercentage || ''}
                    onChange={(e) => handleInputChange('bodyFatPercentage', e.target.value)}
                    className="w-full pr-12 px-4 py-2 bg-background-primary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30"
                    placeholder="15.5"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Masse Maigre (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.leanMass || ''}
                    onChange={(e) => handleInputChange('leanMass', e.target.value)}
                    className="w-full pr-8 px-4 py-2 bg-background-primary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30"
                    placeholder="65.5"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">kg</span>
                </div>
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
              disabled={loading || (!formData.height && !formData.weight && !Object.values(formData).some(v => v > 0))}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer les mesures'}
            </Button>
          </div>
        </form>

        {/* Informations utiles */}
        <Card className="p-6 bg-accent-primary/5">
          <h4 className="font-semibold text-text-primary mb-3">💡 Conseils de mesure</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary">
            <div>
              <p className="font-medium text-text-primary mb-2">Circonférences :</p>
              <ul className="space-y-1 text-xs">
                <li>• Mesurer à jeun le matin</li>
                <li>• Utiliser un mètre ruban flexible</li>
                <li>• Noter la mesure à 0.1 cm près</li>
                <li>• Prendre la moyenne de 2-3 mesures</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-text-primary mb-2">Plis cutanés :</p>
              <ul className="space-y-1 text-xs">
                <li>• Utiliser une pince à plis cutanés</li>
                <li>• Pincer perpendiculairement à la peau</li>
                <li>• Mesurer 4 secondes après le pincement</li>
                <li>• Prendre la moyenne de 2-3 mesures</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
