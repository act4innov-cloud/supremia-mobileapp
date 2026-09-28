import { GAS_DISPLAY_MAX, GAS_THRESHOLDS } from '~/config/gas.config';
import type { GasKind, GasStatus } from '~/types/sensor.types';

/**
 * Calculs de supervision des gaz.
 *
 * Ce module ne contient que des fonctions pures : aucun accès réseau, aucun
 * état React. C'est ce qui permet de les tester directement (voir
 * `__tests__/gasCalculations.test.ts`) et de garantir qu'une valeur affichée
 * est bien déduite de la mesure, jamais d'un cache ou d'un état d'interface.
 */

/** Gravité, de la plus grave à la plus rassurante. */
const SEVERITY: Record<GasStatus, number> = {
  alarm: 0,
  warning: 1,
  normal: 2,
  unknown: 3,
};

/** Résultat d'un décompte par statut. */
export type StatusCount = Record<GasStatus, number>;

/**
 * Traduit le statut textuel envoyé par le capteur.
 *
 * Le vocabulaire exact n'est pas documenté par le firmware, d'où l'approche
 * tolérante. Le statut **affiché** reste néanmoins calculé à partir des seuils :
 * celui rapporté par le capteur sert seulement à signaler une divergence, ce qui
 * est plus prudent que d'écouter un statut envoyé par un appareil
 * potentiellement mal configuré.
 */
export function normalizeStatus(raw: string | number | undefined | null): GasStatus {
  if (raw === undefined || raw === null) return 'unknown';
  if (typeof raw === 'number') {
    if (raw <= 0) return 'normal';
    if (raw === 1) return 'warning';
    return 'alarm';
  }
  const value = raw.trim().toLowerCase();
  if (value === '') return 'unknown';
  if (['ok', 'normal', 'safe', 'good', 'nominal', '0'].includes(value)) return 'normal';
  if (['warn', 'warning', 'alert', 'alerte', 'attention', '1'].includes(value)) {
    return 'warning';
  }
  if (['alarm', 'danger', 'critical', 'critique', 'dangerous', '2', '3'].includes(value)) {
    return 'alarm';
  }
  return 'unknown';
}

/** Statut calculé à partir de la valeur mesurée et des seuils configurés. */
export function statusFor(kind: GasKind, value: number | null): GasStatus {
  if (value === null || !Number.isFinite(value)) return 'unknown';
  const { warning, alarm } = GAS_THRESHOLDS[kind];
  if (value >= alarm) return 'alarm';
  if (value >= warning) return 'warning';
  return 'normal';
}

/** Le statut le plus grave d'un ensemble. */
export function worstStatus(statuses: GasStatus[]): GasStatus {
  for (const candidate of ['alarm', 'warning', 'normal'] as const) {
    if (statuses.includes(candidate)) return candidate;
  }
  return 'unknown';
}

/**
 * Marge restante avant le seuil d'alerte, en ppm.
 *
 * Une marge négative signifie que le seuil est dépassé. Renvoie `null` si la
 * mesure est inconnue : afficher « marge : 0 » pour une mesure absente
 * présenterait une absence de donnée comme une mesure à la limite.
 */
export function marginToWarning(kind: GasKind, value: number | null): number | null {
  if (value === null || !Number.isFinite(value)) return null;
  return GAS_THRESHOLDS[kind].warning - value;
}

/**
 * Position dans l'échelle de jauge, entre 0 et 1.
 *
 * Sature à 1 au-delà de l'échelle d'affichage : au-delà, la jauge n'apporte
 * plus d'information, et une barre qui déborde de son cadre signale moins
 * clairement la gravité qu'une barre pleine.
 */
export function fillRatio(kind: GasKind, value: number | null): number {
  if (value === null || !Number.isFinite(value) || value <= 0) return 0;
  return Math.min(1, value / GAS_DISPLAY_MAX[kind]);
}

/** Position du seuil d'alerte dans l'échelle de jauge, entre 0 et 1. */
export function warningRatio(kind: GasKind): number {
  return Math.min(1, GAS_THRESHOLDS[kind].warning / GAS_DISPLAY_MAX[kind]);
}

/** Décompte des statuts, pour les synthèses du tableau de bord. */
export function countByStatus(statuses: GasStatus[]): StatusCount {
  const counts: StatusCount = { normal: 0, warning: 0, alarm: 0, unknown: 0 };
  for (const status of statuses) counts[status] += 1;
  return counts;
}

/**
 * Statut global d'un site à partir de celui de ses capteurs.
 *
 * Un capteur hors ligne dégrade le statut global en `warning` même si toutes les
 * mesures connues sont normales : une installation dont on a perdu la vue n'est
 * pas une installation conforme.
 */
export function siteStatus(readings: { status: GasStatus; isOnline: boolean }[]): GasStatus {
  if (readings.length === 0) return 'unknown';
  const worst = worstStatus(
    readings.filter((reading) => reading.isOnline).map((reading) => reading.status),
  );
  if (worst === 'alarm' || worst === 'warning') return worst;
  return readings.some((reading) => !reading.isOnline) ? 'warning' : 'normal';
}

/** Trie des statuts du plus grave au plus rassurant. */
export function compareStatus(a: GasStatus, b: GasStatus): number {
  return SEVERITY[a] - SEVERITY[b];
}
