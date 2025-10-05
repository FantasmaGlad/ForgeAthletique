/**
 * Page Dashboard - Tableau de bord principal
 */

import { MainLayout } from '../components/layout';
import { Card } from '../components/ui';
import { Activity, TrendingUp, Users, Calendar } from 'lucide-react';

export function Dashboard() {
  return (
    <MainLayout title="Tableau de Bord" subtitle="Vue d'ensemble de vos performances">
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Athlètes Actifs</p>
              <p className="text-3xl font-bold text-text-primary">0</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-accent-primary/20 flex items-center justify-center">
              <Users className="text-accent-primary" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Séances ce mois</p>
              <p className="text-3xl font-bold text-text-primary">0</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-status-success/20 flex items-center justify-center">
              <Activity className="text-status-success" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Records battus</p>
              <p className="text-3xl font-bold text-text-primary">0</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-status-warning/20 flex items-center justify-center">
              <TrendingUp className="text-status-warning" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Prochaine séance</p>
              <p className="text-3xl font-bold text-text-primary">-</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-accent-secondary/20 flex items-center justify-center">
              <Calendar className="text-accent-secondary" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Graphiques et contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card 
          title="Progression Récente" 
          subtitle="Dernières performances enregistrées"
        >
          <div className="h-64 flex items-center justify-center text-text-muted">
            Aucune donnée disponible
          </div>
        </Card>

        <Card 
          title="Wellness" 
          subtitle="Suivi du bien-être quotidien"
        >
          <div className="h-64 flex items-center justify-center text-text-muted">
            Aucune donnée disponible
          </div>
        </Card>
      </div>

      {/* Message de bienvenue */}
      <Card className="mt-6 p-8 text-center" glowEffect>
        <h3 className="text-2xl font-bold text-text-primary mb-4">
          Bienvenue dans La Forge Athlétique 🏋️
        </h3>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Commencez par créer un profil d'athlète pour démarrer le suivi des performances.
          L'application est prête à centraliser toutes vos données de performance,
          bien-être et anthropométrie.
        </p>
      </Card>
    </MainLayout>
  );
}
