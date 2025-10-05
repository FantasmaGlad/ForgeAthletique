/**
 * Bibliothèque par défaut des métriques
 * Basée sur le cahier des charges (90+ métriques)
 */

import type { MetricType } from '../types';

export const defaultMetrics: Omit<MetricType, 'id'>[] = [
  // ANTHROPOMÉTRIE & COMPOSITION CORPORELLE
  { name: 'Taille', category: 'ANTHROPOMETRIE', unit: 'cm', dataType: 'number', isHigherBetter: true },
  { name: 'Poids', category: 'ANTHROPOMETRIE', unit: 'kg', dataType: 'number', isHigherBetter: false },
  { name: 'IMC', category: 'ANTHROPOMETRIE', unit: '', dataType: 'number', isHigherBetter: false },
  { name: 'Circonférence Cou', category: 'ANTHROPOMETRIE', unit: 'cm', dataType: 'number', isHigherBetter: false },
  { name: 'Circonférence Épaules', category: 'ANTHROPOMETRIE', unit: 'cm', dataType: 'number', isHigherBetter: false },
  { name: 'Circonférence Poitrine', category: 'ANTHROPOMETRIE', unit: 'cm', dataType: 'number', isHigherBetter: false },
  { name: 'Circonférence Taille', category: 'ANTHROPOMETRIE', unit: 'cm', dataType: 'number', isHigherBetter: false },
  { name: 'Circonférence Hanches', category: 'ANTHROPOMETRIE', unit: 'cm', dataType: 'number', isHigherBetter: false },
  { name: 'Circonférence Bras Gauche', category: 'ANTHROPOMETRIE', unit: 'cm', dataType: 'number', isHigherBetter: false },
  { name: 'Circonférence Bras Droit', category: 'ANTHROPOMETRIE', unit: 'cm', dataType: 'number', isHigherBetter: false },
  { name: 'Circonférence Avant-bras Gauche', category: 'ANTHROPOMETRIE', unit: 'cm', dataType: 'number', isHigherBetter: false },
  { name: 'Circonférence Avant-bras Droit', category: 'ANTHROPOMETRIE', unit: 'cm', dataType: 'number', isHigherBetter: false },
  { name: 'Circonférence Cuisse Gauche', category: 'ANTHROPOMETRIE', unit: 'cm', dataType: 'number', isHigherBetter: false },
  { name: 'Circonférence Cuisse Droite', category: 'ANTHROPOMETRIE', unit: 'cm', dataType: 'number', isHigherBetter: false },
  { name: 'Circonférence Mollet Gauche', category: 'ANTHROPOMETRIE', unit: 'cm', dataType: 'number', isHigherBetter: false },
  { name: 'Circonférence Mollet Droit', category: 'ANTHROPOMETRIE', unit: 'cm', dataType: 'number', isHigherBetter: false },
  { name: 'Pli Cutané Biceps', category: 'ANTHROPOMETRIE', unit: 'mm', dataType: 'number', isHigherBetter: false },
  { name: 'Pli Cutané Triceps', category: 'ANTHROPOMETRIE', unit: 'mm', dataType: 'number', isHigherBetter: false },
  { name: 'Pli Cutané Sous-scapulaire', category: 'ANTHROPOMETRIE', unit: 'mm', dataType: 'number', isHigherBetter: false },
  { name: 'Pli Cutané Supra-iliaque', category: 'ANTHROPOMETRIE', unit: 'mm', dataType: 'number', isHigherBetter: false },
  { name: 'Pli Cutané Abdominal', category: 'ANTHROPOMETRIE', unit: 'mm', dataType: 'number', isHigherBetter: false },
  { name: 'Pli Cutané Cuisse', category: 'ANTHROPOMETRIE', unit: 'mm', dataType: 'number', isHigherBetter: false },
  { name: 'Pli Cutané Mollet', category: 'ANTHROPOMETRIE', unit: 'mm', dataType: 'number', isHigherBetter: false },
  { name: '% Masse Grasse', category: 'ANTHROPOMETRIE', unit: '%', dataType: 'number', isHigherBetter: false },
  { name: 'Masse Maigre', category: 'ANTHROPOMETRIE', unit: 'kg', dataType: 'number', isHigherBetter: true },

  // FORCE MAXIMALE (1RM)
  { name: '1RM Back Squat', category: 'FORCE_MAXIMALE', unit: 'kg', dataType: 'number', isHigherBetter: true },
  { name: '1RM Front Squat', category: 'FORCE_MAXIMALE', unit: 'kg', dataType: 'number', isHigherBetter: true },
  { name: '1RM Soulevé de Terre', category: 'FORCE_MAXIMALE', unit: 'kg', dataType: 'number', isHigherBetter: true },
  { name: '1RM Développé Couché', category: 'FORCE_MAXIMALE', unit: 'kg', dataType: 'number', isHigherBetter: true },
  { name: '1RM Développé Militaire', category: 'FORCE_MAXIMALE', unit: 'kg', dataType: 'number', isHigherBetter: true },
  { name: '1RM Tractions Lestées', category: 'FORCE_MAXIMALE', unit: 'kg', dataType: 'number', isHigherBetter: true },
  { name: '1RM Arraché (Snatch)', category: 'FORCE_MAXIMALE', unit: 'kg', dataType: 'number', isHigherBetter: true },
  { name: '1RM Épaulé-Jeté', category: 'FORCE_MAXIMALE', unit: 'kg', dataType: 'number', isHigherBetter: true },
  { name: '1RM Hip Thrust', category: 'FORCE_MAXIMALE', unit: 'kg', dataType: 'number', isHigherBetter: true },

  // PUISSANCE & VITESSE
  { name: 'CMJ Hauteur', category: 'PUISSANCE_VITESSE', unit: 'cm', dataType: 'number', isHigherBetter: true },
  { name: 'CMJ RSI', category: 'PUISSANCE_VITESSE', unit: '', dataType: 'number', isHigherBetter: true },
  { name: 'Squat Jump', category: 'PUISSANCE_VITESSE', unit: 'cm', dataType: 'number', isHigherBetter: true },
  { name: 'Drop Jump Hauteur', category: 'PUISSANCE_VITESSE', unit: 'cm', dataType: 'number', isHigherBetter: true },
  { name: 'Drop Jump RSI', category: 'PUISSANCE_VITESSE', unit: '', dataType: 'number', isHigherBetter: true },
  { name: 'Sprint 10m', category: 'PUISSANCE_VITESSE', unit: 's', dataType: 'number', isHigherBetter: false },
  { name: 'Sprint 20m', category: 'PUISSANCE_VITESSE', unit: 's', dataType: 'number', isHigherBetter: false },
  { name: 'Sprint 30m', category: 'PUISSANCE_VITESSE', unit: 's', dataType: 'number', isHigherBetter: false },
  { name: 'Sprint 40m', category: 'PUISSANCE_VITESSE', unit: 's', dataType: 'number', isHigherBetter: false },
  { name: 'Vitesse Max', category: 'PUISSANCE_VITESSE', unit: 'm/s', dataType: 'number', isHigherBetter: true },
  { name: 'T-Test', category: 'PUISSANCE_VITESSE', unit: 's', dataType: 'number', isHigherBetter: false },
  { name: 'Test 505', category: 'PUISSANCE_VITESSE', unit: 's', dataType: 'number', isHigherBetter: false },
  { name: 'Illinois Test', category: 'PUISSANCE_VITESSE', unit: 's', dataType: 'number', isHigherBetter: false },

  // ENDURANCE
  { name: 'VO2max', category: 'ENDURANCE', unit: 'ml/kg/min', dataType: 'number', isHigherBetter: true },
  { name: 'Yo-Yo IR1', category: 'ENDURANCE', unit: 'm', dataType: 'number', isHigherBetter: true },
  { name: 'Yo-Yo IR2', category: 'ENDURANCE', unit: 'm', dataType: 'number', isHigherBetter: true },
  { name: 'VAM', category: 'ENDURANCE', unit: 'km/h', dataType: 'number', isHigherBetter: true },
  { name: 'Test Cooper', category: 'ENDURANCE', unit: 'm', dataType: 'number', isHigherBetter: true },
  { name: 'Seuil Lactate', category: 'ENDURANCE', unit: 'mmol/L', dataType: 'number', isHigherBetter: false },
  { name: 'FTP', category: 'ENDURANCE', unit: 'watts', dataType: 'number', isHigherBetter: true },
  { name: 'FC Repos', category: 'ENDURANCE', unit: 'bpm', dataType: 'number', isHigherBetter: false },
  { name: 'FC Max', category: 'ENDURANCE', unit: 'bpm', dataType: 'number', isHigherBetter: true },
  { name: 'VFC (HRV)', category: 'ENDURANCE', unit: 'ms', dataType: 'number', isHigherBetter: true },

  // WELLNESS QUOTIDIEN
  { name: 'Durée Sommeil', category: 'WELLNESS', unit: 'h', dataType: 'number', isHigherBetter: true },
  { name: 'Qualité Sommeil', category: 'WELLNESS', unit: '/5', dataType: 'number', isHigherBetter: true },
  { name: 'Niveau Fatigue', category: 'WELLNESS', unit: '/5', dataType: 'number', isHigherBetter: false },
  { name: 'Courbatures', category: 'WELLNESS', unit: '/5', dataType: 'number', isHigherBetter: false },
  { name: 'Niveau Stress', category: 'WELLNESS', unit: '/5', dataType: 'number', isHigherBetter: false },
  { name: 'Humeur', category: 'WELLNESS', unit: '/5', dataType: 'number', isHigherBetter: true },
  { name: 'Niveau Douleur', category: 'WELLNESS', unit: '/10', dataType: 'number', isHigherBetter: false },
  { name: 'Appétit', category: 'WELLNESS', unit: '/5', dataType: 'number', isHigherBetter: true },
  { name: 'Hydratation', category: 'WELLNESS', unit: 'L', dataType: 'number', isHigherBetter: true },

  // CHARGE D'ENTRAÎNEMENT
  { name: 'RPE Séance', category: 'CHARGE_ENTRAINEMENT', unit: '/10', dataType: 'number', isHigherBetter: false },
  { name: 'Volume Total', category: 'CHARGE_ENTRAINEMENT', unit: 'kg', dataType: 'number', isHigherBetter: false },
  { name: 'Distance Totale', category: 'CHARGE_ENTRAINEMENT', unit: 'km', dataType: 'number', isHigherBetter: false },
  { name: 'Ratio Charge A:C', category: 'CHARGE_ENTRAINEMENT', unit: '', dataType: 'number', isHigherBetter: false },

  // NUTRITION
  { name: 'Apport Calorique', category: 'NUTRITION', unit: 'kcal', dataType: 'number', isHigherBetter: false },
  { name: 'Protéines', category: 'NUTRITION', unit: 'g', dataType: 'number', isHigherBetter: false },
  { name: 'Glucides', category: 'NUTRITION', unit: 'g', dataType: 'number', isHigherBetter: false },
  { name: 'Lipides', category: 'NUTRITION', unit: 'g', dataType: 'number', isHigherBetter: false },
];
