/**
 * Initialisation de la base de données avec les données par défaut
 */

import { db } from '../services/database';
import { defaultMetrics } from './defaultMetrics';

export async function seedDatabase() {
  try {
    // Vérifier si des métriques existent déjà
    const existingMetrics = await db.metricTypes.count();
    
    if (existingMetrics === 0) {
      console.log('🌱 Initialisation des métriques par défaut...');
      
      // Ajouter toutes les métriques par défaut
      const metricsToAdd = defaultMetrics.map(metric => ({
        ...metric,
        id: crypto.randomUUID(),
      }));
      
      await db.metricTypes.bulkAdd(metricsToAdd);
      
      console.log(`✅ ${metricsToAdd.length} métriques ajoutées avec succès`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    return false;
  }
}
