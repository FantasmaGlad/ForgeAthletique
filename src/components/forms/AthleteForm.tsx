/**
 * Formulaire de création/modification d'athlète
 */

import { useState } from 'react';
import { Input, Select, Button } from '../ui';
import type { Athlete } from '../../types';

interface AthleteFormProps {
  athlete?: Athlete;
  onSubmit: (data: Partial<Athlete>) => void | Promise<void>;
  onCancel: () => void;
}

export function AthleteForm({ athlete, onSubmit, onCancel }: AthleteFormProps) {
  const [formData, setFormData] = useState({
    firstName: athlete?.firstName || '',
    lastName: athlete?.lastName || '',
    dateOfBirth: athlete?.dateOfBirth ? new Date(athlete.dateOfBirth).toISOString().split('T')[0] : '',
    sex: athlete?.sex || 'M',
    dominantHand: athlete?.dominantHand || 'Droite',
    dominantFoot: athlete?.dominantFoot || 'Droit',
    sport: athlete?.sport || '',
    discipline: athlete?.discipline || '',
    position: athlete?.position || '',
    currentLevel: athlete?.currentLevel || '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const age = formData.dateOfBirth
        ? new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear()
        : 0;

      await onSubmit({
        ...formData,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date(),
        age,
        sex: formData.sex as 'M' | 'F' | 'Autre',
        dominantHand: formData.dominantHand as any,
        dominantFoot: formData.dominantFoot as any,
      });
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Identité */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Identité</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Prénom"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            required
            fullWidth
          />
          <Input
            label="Nom"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            required
            fullWidth
          />
          <Input
            label="Date de naissance"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            required
            fullWidth
          />
          <Select
            label="Sexe"
            value={formData.sex}
            onChange={(e) => handleChange('sex', e.target.value)}
            options={[
              { value: 'M', label: 'Masculin' },
              { value: 'F', label: 'Féminin' },
              { value: 'Autre', label: 'Autre' },
            ]}
            required
            fullWidth
          />
          <Select
            label="Main dominante"
            value={formData.dominantHand}
            onChange={(e) => handleChange('dominantHand', e.target.value)}
            options={[
              { value: 'Droite', label: 'Droite' },
              { value: 'Gauche', label: 'Gauche' },
              { value: 'Ambidextre', label: 'Ambidextre' },
            ]}
            fullWidth
          />
          <Select
            label="Pied dominant"
            value={formData.dominantFoot}
            onChange={(e) => handleChange('dominantFoot', e.target.value)}
            options={[
              { value: 'Droit', label: 'Droit' },
              { value: 'Gauche', label: 'Gauche' },
              { value: 'Ambidextre', label: 'Ambidextre' },
            ]}
            fullWidth
          />
        </div>
      </div>

      {/* Sport & Discipline */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Sport & Discipline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Sport"
            value={formData.sport}
            onChange={(e) => handleChange('sport', e.target.value)}
            required
            fullWidth
            placeholder="ex: Football, Rugby, Athlétisme..."
          />
          <Input
            label="Discipline / Spécialité"
            value={formData.discipline}
            onChange={(e) => handleChange('discipline', e.target.value)}
            fullWidth
            placeholder="ex: Sprint, 400m haies..."
          />
          <Input
            label="Poste"
            value={formData.position}
            onChange={(e) => handleChange('position', e.target.value)}
            fullWidth
            placeholder="ex: Attaquant, Défenseur..."
          />
          <Input
            label="Niveau actuel"
            value={formData.currentLevel}
            onChange={(e) => handleChange('currentLevel', e.target.value)}
            required
            fullWidth
            placeholder="ex: National, Régional, Amateur..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-background-tertiary">
        <Button variant="secondary" onClick={onCancel} type="button">
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Enregistrement...' : athlete ? 'Mettre à jour' : 'Créer l\'athlète'}
        </Button>
      </div>
    </form>
  );
}
