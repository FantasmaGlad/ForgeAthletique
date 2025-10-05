/**
 * Fonctions utilitaires de formatage
 */

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formate une date en format court (ex: 05/10/2025)
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'dd/MM/yyyy', { locale: fr });
}

/**
 * Formate une date avec l'heure (ex: 05/10/2025 à 14h30)
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, "dd/MM/yyyy 'à' HH'h'mm", { locale: fr });
}

/**
 * Formate une date en format relatif (ex: "il y a 2 jours")
 */
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
  return `Il y a ${Math.floor(diffDays / 365)} ans`;
}

/**
 * Formate un nombre avec une unité
 */
export function formatValue(value: number | string, unit: string): string {
  if (typeof value === 'string') return `${value} ${unit}`;
  
  // Formater avec 2 décimales max, mais sans décimales inutiles
  const formatted = value % 1 === 0 ? value.toString() : value.toFixed(2).replace(/\.?0+$/, '');
  
  return `${formatted} ${unit}`;
}

/**
 * Formate un pourcentage
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calcule l'âge à partir d'une date de naissance
 */
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  
  return age;
}
