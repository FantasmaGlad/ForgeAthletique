/**
 * Page Athletes - Gestion des profils d'athlètes
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { Card, Button, Modal, Badge, Table } from '../components/ui';
import { AthleteForm } from '../components/forms';
import { useAthletes } from '../hooks/useAthletes';
import { athleteService } from '../services';
import { Plus, UserPlus, Eye, Edit, Archive } from 'lucide-react';
import { formatDate, calculateAge } from '../utils/formatters';
import type { Athlete } from '../types';

export function Athletes() {
  const { athletes, loading } = useAthletes();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | undefined>();

  const handleCreate = async (data: Partial<Athlete>) => {
    try {
      // S'assurer que tous les champs obligatoires sont présents
      const athleteData = {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        dateOfBirth: data.dateOfBirth || new Date(),
        age: data.age || 0,
        sex: data.sex || 'M' as 'M' | 'F' | 'Autre',
        dominantHand: data.dominantHand || 'Droite' as 'Droite' | 'Gauche' | 'Ambidextre',
        dominantFoot: data.dominantFoot || 'Droit' as 'Droit' | 'Gauche' | 'Ambidextre',
        sport: data.sport || '',
        discipline: data.discipline,
        position: data.position,
        currentLevel: data.currentLevel || '',
        goals: data.goals || {
          shortTerm: '',
          mediumTerm: '',
          longTerm: '',
        },
        injuryHistory: data.injuryHistory || [],
        isArchived: false,
      };

      await athleteService.create(athleteData);
      setIsModalOpen(false);
      
      // Afficher un message de succès (optionnel)
      console.log('Athlète créé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création de l\'athlète:', error);
      alert('Erreur lors de la création de l\'athlète. Veuillez réessayer.');
    }
  };

  const handleEdit = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    setIsModalOpen(true);
  };

  const handleUpdate = async (data: Partial<Athlete>) => {
    if (selectedAthlete) {
      try {
        await athleteService.update(selectedAthlete.id, data);
        setIsModalOpen(false);
        setSelectedAthlete(undefined);
        console.log('Athlète mis à jour avec succès !');
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'athlète:', error);
        alert('Erreur lors de la mise à jour de l\'athlète. Veuillez réessayer.');
      }
    }
  };

  const handleArchive = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir archiver cet athlète ?')) {
      await athleteService.archive(id);
    }
  };

  const handleView = (id: string) => {
    navigate(`/athletes/${id}`);
  };

  const columns = [
    {
      key: 'name',
      label: 'Nom',
      render: (athlete: Athlete) => (
        <div>
          <p className="font-medium text-text-primary">
            {athlete.firstName} {athlete.lastName}
          </p>
          <p className="text-xs text-text-muted">{athlete.sport}</p>
        </div>
      ),
    },
    {
      key: 'age',
      label: 'Âge',
      render: (athlete: Athlete) => (
        <span className="text-text-primary">{calculateAge(new Date(athlete.dateOfBirth))} ans</span>
      ),
    },
    {
      key: 'level',
      label: 'Niveau',
      render: (athlete: Athlete) => (
        <Badge variant="info">{athlete.currentLevel}</Badge>
      ),
    },
    {
      key: 'created',
      label: 'Créé le',
      render: (athlete: Athlete) => (
        <span className="text-text-secondary text-sm">
          {formatDate(athlete.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '200px',
      render: (athlete: Athlete) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye size={16} />}
            onClick={() => handleView(athlete.id)}
          >
            Voir
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Edit size={16} />}
            onClick={() => handleEdit(athlete)}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={<Archive size={16} />}
            onClick={() => handleArchive(athlete.id)}
          />
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <MainLayout title="Athlètes" subtitle="Gérer les profils de vos athlètes">
        <Card className="p-12 text-center">
          <p className="text-text-muted">Chargement...</p>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Athlètes" subtitle="Gérer les profils de vos athlètes">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Liste des athlètes</h3>
          <p className="text-sm text-text-secondary">{athletes.length} athlète(s) enregistré(s)</p>
        </div>
        <Button
          icon={<Plus size={20} />}
          onClick={() => {
            setSelectedAthlete(undefined);
            setIsModalOpen(true);
          }}
        >
          Ajouter un athlète
        </Button>
      </div>

      {athletes.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-background-tertiary flex items-center justify-center mx-auto mb-6">
            <UserPlus size={40} className="text-text-muted" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-3">
            Aucun athlète enregistré
          </h3>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Commencez par créer un profil d'athlète pour démarrer le suivi des performances.
            Vous pourrez ensuite saisir des mesures, des séances d'entraînement et visualiser
            les progressions.
          </p>
          <Button
            icon={<Plus size={20} />}
            size="lg"
            onClick={() => setIsModalOpen(true)}
          >
            Créer mon premier athlète
          </Button>
        </Card>
      ) : (
        <Card>
          <Table
            data={athletes}
            columns={columns}
            keyExtractor={(athlete) => athlete.id}
            hoverable
          />
        </Card>
      )}

      {/* Modal de création/modification */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAthlete(undefined);
        }}
        title={selectedAthlete ? 'Modifier l\'athlète' : 'Nouvel athlète'}
        size="lg"
      >
        <AthleteForm
          athlete={selectedAthlete}
          onSubmit={selectedAthlete ? handleUpdate : handleCreate}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedAthlete(undefined);
          }}
        />
      </Modal>
    </MainLayout>
  );
}
