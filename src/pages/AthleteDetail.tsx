/**
 * Page AthleteDetail - Vue détaillée d'un athlète avec onglets
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { Card, Tabs, Button, Badge } from '../components/ui';
import { useAthlete } from '../hooks/useAthletes';
import { ArrowLeft, Edit, TrendingUp, Ruler, Weight, Activity, Zap, Heart, History, Calendar } from 'lucide-react';
import { calculateAge, formatDate } from '../utils/formatters';
import type { Tab } from '../types';

const tabs: Tab[] = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: <TrendingUp size={16} /> },
  { id: 'anthropometry', label: 'Anthropométrie' },
  { id: 'strength', label: 'Force' },
  { id: 'power', label: 'Puissance' },
  { id: 'endurance', label: 'Endurance' },
  { id: 'wellness', label: 'Bien-être' },
  { id: 'training', label: 'Entraînement' },
];

export function AthleteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { athlete, loading } = useAthlete(id);
  const athleteId = id; // Pour les références dans le JSX
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <MainLayout>
        <Card className="p-12 text-center">
          <p className="text-text-muted">Chargement...</p>
        </Card>
      </MainLayout>
    );
  }

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
      title={`${athlete.firstName} ${athlete.lastName}`}
      subtitle={athlete.sport}
    >
      {/* En-tête du profil */}
      <Card className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-accent-primary/20 flex items-center justify-center">
              <span className="text-3xl font-bold text-accent-primary">
                {athlete.firstName[0]}{athlete.lastName[0]}
              </span>
            </div>

            {/* Informations principales */}
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                {athlete.firstName} {athlete.lastName}
              </h2>
              <div className="flex gap-4 mb-3">
                <Badge variant="info">{athlete.currentLevel}</Badge>
                <Badge>{athlete.sport}</Badge>
                {athlete.discipline && <Badge>{athlete.discipline}</Badge>}
              </div>
              <div className="text-sm text-text-secondary space-y-1">
                <p>🎂 {calculateAge(new Date(athlete.dateOfBirth))} ans</p>
                <p>📅 Créé le {formatDate(athlete.createdAt)}</p>
                {athlete.position && <p>📍 Poste: {athlete.position}</p>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              icon={<ArrowLeft size={18} />}
              onClick={() => navigate('/athletes')}
            >
              Retour
            </Button>
            <Button icon={<Edit size={18} />}>
              Modifier
            </Button>
          </div>
        </div>

        {/* Actions rapides de saisie */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Activity size={16} />}
            onClick={() => navigate('/wellness')}
          >
            Wellness
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Ruler size={16} />}
            onClick={() => navigate(`/athletes/${athleteId}/anthropometry`)}
          >
            Anthropométrie
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Weight size={16} />}
            onClick={() => navigate(`/athletes/${athleteId}/strength`)}
          >
            Force
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Zap size={16} />}
            onClick={() => navigate(`/athletes/${athleteId}/power`)}
          >
            Puissance
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Heart size={16} />}
            onClick={() => navigate(`/athletes/${athleteId}/endurance`)}
          >
            Endurance
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<History size={16} />}
            onClick={() => navigate(`/athletes/${athleteId}/history`)}
          >
            Historique
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Calendar size={16} />}
            onClick={() => navigate(`/athletes/${athleteId}/journal`)}
          >
            Journal
          </Button>
        </div>
      </Card>

      {/* Navigation par onglets */}
      <Card noPadding>
        <div className="px-6 pt-6">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-4">
                  <p className="text-text-secondary text-sm mb-1">Séances totales</p>
                  <p className="text-3xl font-bold text-text-primary">0</p>
                </Card>
                <Card className="p-4">
                  <p className="text-text-secondary text-sm mb-1">Records battus</p>
                  <p className="text-3xl font-bold text-accent-primary">0</p>
                </Card>
                <Card className="p-4">
                  <p className="text-text-secondary text-sm mb-1">Dernière séance</p>
                  <p className="text-lg font-bold text-text-primary">-</p>
                </Card>
              </div>

              <Card title="Objectifs">
                {athlete.goals?.shortTerm || athlete.goals?.mediumTerm || athlete.goals?.longTerm ? (
                  <div className="space-y-3">
                    {athlete.goals.shortTerm && (
                      <div>
                        <p className="font-medium text-text-primary">Court terme (1-3 mois)</p>
                        <p className="text-text-secondary text-sm">{athlete.goals.shortTerm}</p>
                      </div>
                    )}
                    {athlete.goals.mediumTerm && (
                      <div>
                        <p className="font-medium text-text-primary">Moyen terme (6-12 mois)</p>
                        <p className="text-text-secondary text-sm">{athlete.goals.mediumTerm}</p>
                      </div>
                    )}
                    {athlete.goals.longTerm && (
                      <div>
                        <p className="font-medium text-text-primary">Long terme (1-4 ans)</p>
                        <p className="text-text-secondary text-sm">{athlete.goals.longTerm}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-text-muted text-center py-8">
                    Aucun objectif défini pour le moment
                  </p>
                )}
              </Card>
            </div>
          )}

          {activeTab !== 'overview' && (
            <div className="text-center py-12 text-text-muted">
              <p>Cette section sera développée prochainement</p>
            </div>
          )}
        </div>
      </Card>
    </MainLayout>
  );
}
