/**
 * Header - Barre de navigation supérieure
 */

import { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { Button, Modal } from '../ui';
import { CoachProfileForm } from '../forms';
import { useLiveQuery } from 'dexie-react-hooks';
import { coachService } from '../../services';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title = 'Tableau de Bord', subtitle }: HeaderProps) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Récupérer le profil coach
  const coachProfile = useLiveQuery(() => coachService.getProfile());

  const handleSaveProfile = async (data: any) => {
    try {
      await coachService.saveProfile(data);
      setIsProfileModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
      alert('Erreur lors de la sauvegarde du profil');
    }
  };

  // Initiales pour l'avatar
  const initials = coachProfile
    ? `${coachProfile.firstName[0]}${coachProfile.lastName[0]}`.toUpperCase()
    : 'CP';

  return (
    <>
      <header className="h-16 bg-background-secondary border-b border-background-tertiary px-6 flex items-center justify-between">
        {/* Titre de la page */}
        <div>
          <h2 className="text-xl font-bold text-text-primary">{title}</h2>
          {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Barre de recherche */}
          <div className="relative w-64">
            <input
              type="search"
              placeholder="Rechercher..."
              className="w-full px-4 py-2 pl-10 bg-background-primary border border-background-tertiary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/30"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              size={18}
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" className="relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-status-danger rounded-full"></span>
          </Button>

          {/* Profil utilisateur - CLIQUABLE */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center hover:bg-accent-primary/30 transition-colors cursor-pointer"
            title={coachProfile ? `${coachProfile.firstName} ${coachProfile.lastName}` : 'Mon Profil'}
          >
            <span className="text-accent-primary font-semibold text-sm">
              {initials}
            </span>
          </button>
        </div>
      </header>

      {/* Modal de profil coach */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Mon Profil Coach"
        size="lg"
      >
        <CoachProfileForm
          profile={coachProfile}
          onSubmit={handleSaveProfile}
          onCancel={() => setIsProfileModalOpen(false)}
        />
      </Modal>
    </>
  );
}
