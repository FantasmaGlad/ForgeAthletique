/**
 * Page PersonalDashboard - Tableau de Bord Personnel (U-01)
 * Vue principale pour les athlètes avec records, performances et motivation
 */

import { useState, useMemo } from 'react';
import { MainLayout } from '../components/layout';
import { Card, Button, Badge, Select } from '../components/ui';
import { LineChart, MultiLineChart } from '../components/charts';
import { useAthletes, useDashboardData } from '../hooks';
import {
  Trophy,
  TrendingUp,
  Target,
  Activity,
  Award,
  Calendar,
  Zap,
  Heart,
  Ruler,
  Dumbbell
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

export function PersonalDashboard() {
  const { athletes } = useAthletes();
  const [selectedAthlete, setSelectedAthlete] = useState<string>('');

  // Sélectionner automatiquement le premier athlète s'il n'y en a qu'un
  useMemo(() => {
    if (athletes.length === 1 && !selectedAthlete) {
      setSelectedAthlete(athletes[0].id);
    }
  }, [athletes, selectedAthlete]);

  const { personalRecords, dashboardData } = useDashboardData(selectedAthlete);
  const currentAthlete = athletes.find(a => a.id === selectedAthlete);

  // Les données sont maintenant gérées par le hook useDashboardData

  // Records personnels organisés par catégorie
  const recordsByCategory = useMemo(() => {
    const categories = {
      'ANTHROPOMETRIE': { icon: Ruler, color: 'text-blue-400', records: [] as any[] },
      'FORCE_MAXIMALE': { icon: Dumbbell, color: 'text-orange-400', records: [] as any[] },
      'PUISSANCE_VITESSE': { icon: Zap, color: 'text-yellow-400', records: [] as any[] },
      'ENDURANCE': { icon: Heart, color: 'text-red-400', records: [] as any[] },
    };

    personalRecords.forEach(record => {
      // Déterminer la catégorie depuis le nom de la métrique
      let category = 'AUTRE';
      if (record.metricName.includes('Poids') || record.metricName.includes('Taille') || record.metricName.includes('IMC')) {
        category = 'ANTHROPOMETRIE';
      } else if (record.metricName.includes('1RM') || record.metricName.includes('3RM') || record.metricName.includes('5RM')) {
        category = 'FORCE_MAXIMALE';
      } else if (record.metricName.includes('Sprint') || record.metricName.includes('CMJ') || record.metricName.includes('Vitesse')) {
        category = 'PUISSANCE_VITESSE';
      } else if (record.metricName.includes('VO2max') || record.metricName.includes('Cooper') || record.metricName.includes('Yo-Yo')) {
        category = 'ENDURANCE';
      }

      if (categories[category as keyof typeof categories]) {
        categories[category as keyof typeof categories].records.push(record);
      }
    });

    return categories;
  }, [personalRecords]);

  if (athletes.length === 0) {
    return (
      <MainLayout title="Tableau de Bord Personnel" subtitle="Vue d'ensemble de vos performances">
        <Card className="p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-background-tertiary flex items-center justify-center mx-auto mb-6">
            <Activity size={40} className="text-text-muted" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-3">
            Aucun athlète enregistré
          </h3>
          <p className="text-text-secondary mb-6">
            Créez d'abord un profil d'athlète pour commencer le suivi.
          </p>
          <Button onClick={() => window.location.href = '/athletes'}>
            Créer mon profil
          </Button>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Tableau de Bord Personnel"
      subtitle={currentAthlete ? `${currentAthlete.firstName} ${currentAthlete.lastName}` : "Sélectionnez un athlète"}
    >
      <div className="space-y-6">
        {/* Sélecteur d'athlète (pour les coachs) */}
        {athletes.length > 1 && (
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-text-primary">
                Athlète:
              </label>
              <Select
                value={selectedAthlete}
                onChange={(e) => setSelectedAthlete(e.target.value)}
                options={[
                  { value: '', label: 'Sélectionner un athlète' },
                  ...athletes.map(athlete => ({
                    value: athlete.id,
                    label: `${athlete.firstName} ${athlete.lastName} (${athlete.sport})`,
                  })),
                ]}
                fullWidth={false}
              />
            </div>
          </Card>
        )}

        {selectedAthlete && currentAthlete && (
          <>
            {/* En-tête avec informations principales */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-accent-primary/20 flex items-center justify-center">
                    <span className="text-3xl font-bold text-accent-primary">
                      {currentAthlete.firstName[0]}{currentAthlete.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-1">
                      {currentAthlete.firstName} {currentAthlete.lastName}
                    </h2>
                    <div className="flex items-center gap-4 text-text-secondary">
                      <Badge variant="info">{currentAthlete.sport}</Badge>
                      <Badge>{currentAthlete.currentLevel}</Badge>
                      <span>👤 {Math.floor((Date.now() - new Date(currentAthlete.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365))} ans</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-muted mb-1">Membre depuis</p>
                  <p className="text-lg font-bold text-text-primary">
                    {formatDate(currentAthlete.createdAt)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Records personnels */}
            <Card title="🏆 Records Personnels" subtitle="Vos meilleures performances">
              {personalRecords.length === 0 ? (
                <div className="text-center py-8 text-text-muted">
                  <Trophy size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Aucun record enregistré pour le moment</p>
                  <p className="text-sm">Commencez par saisir des données de performance</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(recordsByCategory).map(([category, data]) => {
                    const Icon = data.icon;
                    if (data.records.length === 0) return null;

                    return (
                      <div key={category} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Icon size={20} className={data.color} />
                          <h4 className="font-semibold text-text-primary">
                            {category.replace('_', ' ')}
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {data.records.slice(0, 3).map((record: any) => (
                            <div
                              key={record.metricTypeId}
                              className="flex items-center justify-between p-3 bg-background-tertiary/30 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-text-primary">{record.metricName}</p>
                                <p className="text-xs text-text-muted">{formatDate(record.date)}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-accent-primary">
                                  {record.value} {record.unit}
                                </p>
                                <Badge variant="success" size="sm">Record</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Graphiques de tendance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Évolution du poids */}
              <Card
                title="📊 Évolution du Poids (7j)"
                subtitle="Tendance récente de votre poids"
                headerAction={
                  dashboardData.weightTrend.length > 0 ? (
                    <Badge variant="info">{dashboardData.weightTrend.length} mesures</Badge>
                  ) : undefined
                }
              >
                {dashboardData.weightTrend.length > 0 ? (
                  <div className="h-64">
                    <LineChart
                      data={dashboardData.weightTrend.map(point => ({
                        date: point.date,
                        value: point.poids
                      }))}
                      dataKey="value"
                      color="#0066FF"
                    />
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-text-muted">
                    <div className="text-center">
                      <Ruler size={48} className="mx-auto mb-3 opacity-50" />
                      <p>Aucune donnée de poids récente</p>
                    </div>
                  </div>
                )}
              </Card>

              {/* Wellness récent */}
              <Card
                title="💪 Bien-être Récent (7j)"
                subtitle="Évolution de votre forme quotidienne"
                headerAction={
                  dashboardData.wellnessTrend.length > 0 ? (
                    <Badge variant="info">{dashboardData.wellnessTrend.length} jours</Badge>
                  ) : undefined
                }
              >
                {dashboardData.wellnessTrend.length > 0 ? (
                  <div className="h-64">
                    <MultiLineChart
                      data={dashboardData.wellnessTrend}
                      lines={[
                        { dataKey: 'sommeil', name: 'Sommeil', color: '#10B981' },
                        { dataKey: 'humeur', name: 'Humeur', color: '#F59E0B' },
                        { dataKey: 'fatigue', name: 'Fatigue', color: '#EF4444' },
                      ]}
                    />
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-text-muted">
                    <div className="text-center">
                      <Heart size={48} className="mx-auto mb-3 opacity-50" />
                      <p>Aucune donnée wellness récente</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Graphiques de tendance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performances physiques récentes */}
              <Card
                title="⚡ Performances Physiques"
                subtitle="Évolution de vos capacités"
                headerAction={
                  dashboardData.performanceTrend.length > 0 ? (
                    <Badge variant="info">{dashboardData.performanceTrend.length} mesures</Badge>
                  ) : undefined
                }
              >
                {dashboardData.performanceTrend.length > 0 ? (
                  <div className="h-64">
                    <MultiLineChart
                      data={dashboardData.performanceTrend}
                      lines={[
                        { dataKey: 'cmj', name: 'Saut (CMJ)', color: '#0066FF' },
                        { dataKey: 'sprint', name: 'Sprint 20m', color: '#FF6B35' },
                        { dataKey: 'force', name: 'Force (Squat)', color: '#10B981' },
                      ]}
                    />
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-text-muted">
                    <div className="text-center">
                      <Zap size={48} className="mx-auto mb-3 opacity-50" />
                      <p>Aucune donnée de performance récente</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <div className="w-12 h-12 rounded-lg bg-accent-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Trophy className="text-accent-primary" size={24} />
                </div>
                <p className="text-2xl font-bold text-text-primary">{personalRecords.length}</p>
                <p className="text-sm text-text-secondary">Records personnels</p>
              </Card>

              <Card className="p-4 text-center">
                <div className="w-12 h-12 rounded-lg bg-status-success/20 flex items-center justify-center mx-auto mb-3">
                  <Activity className="text-status-success" size={24} />
                </div>
                <p className="text-2xl font-bold text-text-primary">{dashboardData.recentActivity}</p>
                <p className="text-sm text-text-secondary">Jours d'activité</p>
              </Card>

              <Card className="p-4 text-center">
                <div className="w-12 h-12 rounded-lg bg-status-warning/20 flex items-center justify-center mx-auto mb-3">
                  <Target className="text-status-warning" size={24} />
                </div>
                <p className="text-2xl font-bold text-text-primary">
                  {currentAthlete.goals?.shortTerm ? '1' : '0'}
                </p>
                <p className="text-sm text-text-secondary">Objectif actif</p>
              </Card>

              <Card className="p-4 text-center">
                <div className="w-12 h-12 rounded-lg bg-accent-secondary/20 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="text-accent-secondary" size={24} />
                </div>
                <p className="text-2xl font-bold text-text-primary">
                  {Math.floor((Date.now() - new Date(currentAthlete.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                </p>
                <p className="text-sm text-text-secondary">Jours d'entraînement</p>
              </Card>
            </div>

            {/* Objectifs et motivation */}
            <Card
              title="🎯 Vos Objectifs"
              subtitle="Restez motivé avec vos objectifs SMART"
              className="bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border-accent-primary/30"
            >
              {currentAthlete.goals?.shortTerm || currentAthlete.goals?.mediumTerm || currentAthlete.goals?.longTerm ? (
                <div className="space-y-4">
                  {currentAthlete.goals.shortTerm && (
                    <div className="p-4 bg-background-tertiary/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target size={20} className="text-accent-primary" />
                        <span className="font-medium text-text-primary">Objectif Court Terme</span>
                        <Badge variant="info">1-3 mois</Badge>
                      </div>
                      <p className="text-text-secondary">{currentAthlete.goals.shortTerm}</p>
                    </div>
                  )}

                  {currentAthlete.goals.mediumTerm && (
                    <div className="p-4 bg-background-tertiary/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={20} className="text-accent-secondary" />
                        <span className="font-medium text-text-primary">Objectif Moyen Terme</span>
                        <Badge variant="warning">6-12 mois</Badge>
                      </div>
                      <p className="text-text-secondary">{currentAthlete.goals.mediumTerm}</p>
                    </div>
                  )}

                  {currentAthlete.goals.longTerm && (
                    <div className="p-4 bg-background-tertiary/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Award size={20} className="text-status-success" />
                        <span className="font-medium text-text-primary">Objectif Long Terme</span>
                        <Badge variant="success">1-4 ans</Badge>
                      </div>
                      <p className="text-text-secondary">{currentAthlete.goals.longTerm}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-text-muted">
                  <Target size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Aucun objectif défini pour le moment</p>
                  <p className="text-sm">Définissez vos objectifs dans votre profil</p>
                </div>
              )}
            </Card>

            {/* Actions rapides */}
            <Card title="⚡ Actions Rapides" subtitle="Accédez rapidement à vos outils">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="ghost"
                  className="h-auto p-4 flex-col gap-2"
                  onClick={() => window.location.href = '/wellness'}
                >
                  <Heart size={24} className="text-accent-primary" />
                  <span className="text-sm">Wellness</span>
                </Button>

                <Button
                  variant="ghost"
                  className="h-auto p-4 flex-col gap-2"
                  onClick={() => window.location.href = `/athletes/${selectedAthlete}/anthropometry`}
                >
                  <Ruler size={24} className="text-accent-primary" />
                  <span className="text-sm">Anthropométrie</span>
                </Button>

                <Button
                  variant="ghost"
                  className="h-auto p-4 flex-col gap-2"
                  onClick={() => window.location.href = `/athletes/${selectedAthlete}/strength`}
                >
                  <Dumbbell size={24} className="text-accent-primary" />
                  <span className="text-sm">Force</span>
                </Button>

                <Button
                  variant="ghost"
                  className="h-auto p-4 flex-col gap-2"
                  onClick={() => window.location.href = '/analytics'}
                >
                  <TrendingUp size={24} className="text-accent-primary" />
                  <span className="text-sm">Analyses</span>
                </Button>
              </div>
            </Card>
          </>
        )}

        {/* Sélection d'athlète si pas encore choisi */}
        {!selectedAthlete && athletes.length > 1 && (
          <Card className="p-8 text-center">
            <h3 className="text-xl font-bold text-text-primary mb-4">
              Sélectionnez un Athlète
            </h3>
            <p className="text-text-secondary mb-6">
              Choisissez l'athlète dont vous souhaitez consulter le tableau de bord.
            </p>
            <div className="max-w-md mx-auto">
              <Select
                value={selectedAthlete}
                onChange={(e) => setSelectedAthlete(e.target.value)}
                options={[
                  { value: '', label: 'Sélectionner un athlète' },
                  ...athletes.map(athlete => ({
                    value: athlete.id,
                    label: `${athlete.firstName} ${athlete.lastName} (${athlete.sport})`,
                  })),
                ]}
                fullWidth
              />
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
