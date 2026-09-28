import type { GasKind, GasStatus } from '~/types/sensor.types';

/**
 * Seuils de détection et de déclenchement des alertes.
 *
 * Ce module ne contient que des données : les calculs vivent dans
 * `src/utils/gasCalculations.ts`, ce qui permet de les tester isolément et
 * d'éviter qu'une valeur affichée dépende d'un état d'interface.
 *
 * ⚠️ À FAIRE VALIDER PAR VOTRE RESPONSABLE HSE AVANT TOUT DÉPLOIEMENT.
 *
 * Les valeurs ci-dessous sont des **valeurs par défaut issues de publications
 * reconnues** (OSHA, NIOSH) et non des consignes validées pour votre site. Un
 * écran de supervision qui affiche « conforme » sur la base d'un seuil faux
 * est plus dangereux qu'un écran qui n'affiche rien. Remplacez-les par les
 * valeurs de votre document unique d'intervention avant d'utiliser l'app en
 * astreinte.
 *
 * `warning` correspond à la valeur limite d'exposition, `alarm` au seuil de
 * retrait / danger. L'unité est le ppm pour les trois gaz.
 */
export const GAS_THRESHOLDS: Record<GasKind, { warning: number; alarm: number }> = {
  // VLE-PEL OSHA : 10 ppm. NIOSH IDLH : 100 ppm (5 min).
  h2s: { warning: 10, alarm: 20 },
  // NIOSH REL : 35 ppm (moyenne 10 h). OSHA PEL : 50 ppm (moyenne 8 h).
  co: { warning: 25, alarm: 50 },
  // Seuil de gêne : 1 000 ppm. OSHA PEL : 5 000 ppm (moyenne 8 h).
  co2: { warning: 1000, alarm: 5000 },
};

/**
 * Échelle des jauges. Au-delà, la jauge sature : afficher 10 000 et 20 000 ppm
 * sur la même largeur n'apporte rien et écrase l'information utile.
 */
export const GAS_DISPLAY_MAX: Record<GasKind, number> = {
  h2s: 100,
  co: 200,
  co2: 10000,
};

/** Couleur d'un statut, alignée sur la charte de l'application. */
export const STATUS_COLORS: Record<GasStatus, string> = {
  normal: '#22C55E',
  warning: '#F59E0B',
  alarm: '#EF4444',
  unknown: '#6B7280',
};

/** Libellé lisible d'un statut. */
export const STATUS_LABELS: Record<GasStatus, string> = {
  normal: 'Normal',
  warning: 'Alerte',
  alarm: 'Critique',
  unknown: 'Inconnu',
};

/**
 * Délai au-delà duquel un capteur est considéré hors ligne.
 * Les ESP publient en continu : 90 s est generous, et évite qu'un capteur
 * clignote « hors ligne » sur un simple saut de réseau.
 */
export const SENSOR_STALE_AFTER_MS = 90_000;
