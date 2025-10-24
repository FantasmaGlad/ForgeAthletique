/**
 * Formulaire de profil coach
 */

import { useState } from 'react';
import { Input, Button } from '../ui';
import type { CoachProfile } from '../../types';

interface CoachProfileFormProps {
  profile?: CoachProfile;
  onSubmit: (data: Partial<CoachProfile>) => void | Promise<void>;
  onCancel: () => void;
}

export function CoachProfileForm({ profile, onSubmit, onCancel }: CoachProfileFormProps) {
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    specialization: profile?.specialization || '',
    bio: profile?.bio || '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        ...formData,
        preferences: profile?.preferences || {
          theme: 'dark',
          language: 'fr',
          notifications: true,
          measurementUnits: 'metric',
        },
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Identité */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Informations personnelles</h3>
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
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            fullWidth
          />
          <Input
            label="Téléphone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            fullWidth
          />
        </div>
      </div>

      {/* Spécialisation */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Informations professionnelles</h3>
        <div className="space-y-4">
          <Input
            label="Spécialisation"
            value={formData.specialization}
            onChange={(e) => handleChange('specialization', e.target.value)}
            fullWidth
            placeholder="ex: Préparation physique, Force & Conditionnement..."
          />
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Biographie / Présentation
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 min-h-[100px] transition-all"
              placeholder="Quelques mots sur vous, votre expérience..."
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <Button variant="secondary" onClick={onCancel} type="button">
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
}
