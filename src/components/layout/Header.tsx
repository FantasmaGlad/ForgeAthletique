/**
 * Header - Barre de navigation supérieure
 */

import { useState } from 'react';
import { Bell, Search, LogOut } from 'lucide-react';
import { Button, Modal } from '../ui';
import { CoachProfileForm } from '../forms';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabaseCoachService } from '../../services';
import { useLiveQuery } from 'dexie-react-hooks';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title = 'Tableau de Bord', subtitle }: HeaderProps) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const coachProfile = useLiveQuery(async () => {
    try {
      return await supabaseCoachService.getCurrentProfile();
    } catch {
      return null;
    }
  });

  const handleSaveProfile = async (data: any) => {
    try {
      await supabaseCoachService.updateProfile(data);
      setIsProfileModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
      alert('Erreur lors de la sauvegarde du profil');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const initials = coachProfile
    ? `${coachProfile.firstName[0]}${coachProfile.lastName[0]}`.toUpperCase()
    : 'CP';

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <img src="/logoforge.png" alt="La Forge Athlétique" className="w-8 h-8" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64 hidden md:block">
            <input
              type="search"
              placeholder="Rechercher..."
              className="w-full px-4 py-2 pl-10 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
          </div>

          <Button variant="ghost" className="relative hover:bg-slate-100">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </Button>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 hover:bg-slate-50 rounded-lg px-2 py-1.5 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-sm">
                  {initials}
                </span>
              </div>
              {coachProfile && (
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-semibold text-slate-900">
                    {coachProfile.firstName} {coachProfile.lastName}
                  </p>
                  <p className="text-xs text-slate-500">Coach</p>
                </div>
              )}
            </button>

            <Button
              variant="ghost"
              onClick={handleSignOut}
              title="Se déconnecter"
              className="hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={18} />
            </Button>
          </div>
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
          profile={coachProfile || undefined}
          onSubmit={handleSaveProfile}
          onCancel={() => setIsProfileModalOpen(false)}
        />
      </Modal>
    </>
  );
}
