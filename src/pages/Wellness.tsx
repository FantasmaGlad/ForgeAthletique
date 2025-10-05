/**
 * Page Wellness - Saisie quotidienne simplifiée du bien-être
 * Fonctionnalité U-02 du cahier des charges
 */

import { useState } from 'react';
import { MainLayout } from '../components/layout';
import { Card, Button } from '../components/ui';
import { useAthletes } from '../hooks/useAthletes';
import { measurementService, db } from '../services';
import { Check } from 'lucide-react';

interface WellnessFormData {
  athleteId: string;
  sleepDuration: number;
  sleepQuality: number;
  fatigue: number;
  soreness: number;
  stress: number;
  mood: number;
}

const SCALE_LABELS = [
  { value: 1, label: 'Très mauvais', emoji: '😞' },
  { value: 2, label: 'Mauvais', emoji: '😕' },
  { value: 3, label: 'Moyen', emoji: '😐' },
  { value: 4, label: 'Bon', emoji: '🙂' },
  { value: 5, label: 'Excellent', emoji: '😄' },
];

export function Wellness() {
  const { athletes } = useAthletes();
  const [formData, setFormData] = useState<WellnessFormData>({
    athleteId: '',
    sleepDuration: 7,
    sleepQuality: 3,
    fatigue: 3,
    soreness: 3,
    stress: 3,
    mood: 3,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.athleteId) return;

    setLoading(true);
    try {
      // Récupérer les IDs des métriques wellness
      const metricTypes = await db.metricTypes.toArray();
      const metricsMap = new Map(metricTypes.map(m => [m.name, m.id]));

      const today = new Date();
      
      // Créer les mesures pour chaque indicateur
      const measurements = [
        { name: 'Durée Sommeil', value: formData.sleepDuration, unit: 'h' },
        { name: 'Qualité Sommeil', value: formData.sleepQuality, unit: '/5' },
        { name: 'Niveau Fatigue', value: formData.fatigue, unit: '/5' },
        { name: 'Courbatures', value: formData.soreness, unit: '/5' },
        { name: 'Niveau Stress', value: formData.stress, unit: '/5' },
        { name: 'Humeur', value: formData.mood, unit: '/5' },
      ];

      for (const measurement of measurements) {
        const metricTypeId = metricsMap.get(measurement.name);
        if (metricTypeId) {
          await measurementService.create({
            athleteId: formData.athleteId,
            metricTypeId,
            date: today,
            value: measurement.value,
            unit: measurement.unit,
          });
        }
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Réinitialiser le formulaire
      setFormData(prev => ({
        ...prev,
        sleepQuality: 3,
        fatigue: 3,
        soreness: 3,
        stress: 3,
        mood: 3,
      }));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const ScaleSelector = ({ 
    label, 
    value, 
    onChange, 
    reversed = false 
  }: { 
    label: string; 
    value: number; 
    onChange: (value: number) => void;
    reversed?: boolean;
  }) => {
    const labels = reversed ? [...SCALE_LABELS].reverse() : SCALE_LABELS;
    
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-primary mb-3">{label}</label>
        <div className="flex gap-2 justify-between">
          {labels.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                value === item.value
                  ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                  : 'border-background-tertiary bg-background-tertiary/50 text-text-secondary hover:border-text-muted'
              }`}
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-xs font-medium">{item.value}</span>
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-text-muted">
          <span>{reversed ? SCALE_LABELS[4].label : SCALE_LABELS[0].label}</span>
          <span>{reversed ? SCALE_LABELS[0].label : SCALE_LABELS[4].label}</span>
        </div>
      </div>
    );
  };

  if (athletes.length === 0) {
    return (
      <MainLayout title="Wellness" subtitle="Saisie quotidienne du bien-être">
        <Card className="p-12 text-center">
          <h3 className="text-xl font-bold text-text-primary mb-3">
            Aucun athlète disponible
          </h3>
          <p className="text-text-secondary mb-6">
            Créez d'abord un profil d'athlète pour commencer le suivi wellness.
          </p>
          <Button onClick={() => window.location.href = '/athletes'}>
            Créer un athlète
          </Button>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="Wellness Quotidien" 
      subtitle="Suivez votre bien-être en moins d'une minute"
    >
      <div className="max-w-3xl mx-auto">
        {success && (
          <Card className="mb-6 p-4 bg-status-success/10 border-status-success/30">
            <div className="flex items-center gap-3 text-status-success">
              <Check size={24} />
              <p className="font-medium">Données enregistrées avec succès !</p>
            </div>
          </Card>
        )}

        <Card title="Saisie quotidienne" subtitle={`Date du jour : ${new Date().toLocaleDateString('fr-FR')}`}>
          <form onSubmit={handleSubmit}>
            {/* Sélection de l'athlète */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Athlète
              </label>
              <select
                value={formData.athleteId}
                onChange={(e) => setFormData(prev => ({ ...prev, athleteId: e.target.value }))}
                className="w-full px-4 py-2 bg-background-primary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30"
                required
              >
                <option value="">Sélectionner un athlète</option>
                {athletes.map(athlete => (
                  <option key={athlete.id} value={athlete.id}>
                    {athlete.firstName} {athlete.lastName}
                  </option>
                ))}
              </select>
            </div>

            {formData.athleteId && (
              <>
                {/* Durée de sommeil */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Heures de sommeil
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={formData.sleepDuration}
                    onChange={(e) => setFormData(prev => ({ ...prev, sleepDuration: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2 bg-background-primary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30"
                  />
                </div>

                {/* Qualité du sommeil */}
                <ScaleSelector
                  label="Qualité du sommeil"
                  value={formData.sleepQuality}
                  onChange={(v) => setFormData(prev => ({ ...prev, sleepQuality: v }))}
                />

                {/* Fatigue */}
                <ScaleSelector
                  label="Niveau de fatigue"
                  value={formData.fatigue}
                  onChange={(v) => setFormData(prev => ({ ...prev, fatigue: v }))}
                  reversed
                />

                {/* Courbatures */}
                <ScaleSelector
                  label="Courbatures / DOMS"
                  value={formData.soreness}
                  onChange={(v) => setFormData(prev => ({ ...prev, soreness: v }))}
                  reversed
                />

                {/* Stress */}
                <ScaleSelector
                  label="Niveau de stress"
                  value={formData.stress}
                  onChange={(v) => setFormData(prev => ({ ...prev, stress: v }))}
                  reversed
                />

                {/* Humeur */}
                <ScaleSelector
                  label="Humeur / Motivation"
                  value={formData.mood}
                  onChange={(v) => setFormData(prev => ({ ...prev, mood: v }))}
                />

                {/* Bouton de soumission */}
                <div className="pt-4 border-t border-background-tertiary">
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Enregistrement...' : 'Enregistrer mes données'}
                  </Button>
                </div>
              </>
            )}
          </form>
        </Card>

        {/* Informations */}
        <Card className="mt-6 p-6 bg-accent-primary/5">
          <h4 className="font-semibold text-text-primary mb-2">💡 Conseil</h4>
          <p className="text-sm text-text-secondary">
            Remplissez ce formulaire chaque matin pour un suivi optimal. 
            La régularité des données permet de détecter les signes de fatigue 
            et d'ajuster l'entraînement en conséquence.
          </p>
        </Card>
      </div>
    </MainLayout>
  );
}
