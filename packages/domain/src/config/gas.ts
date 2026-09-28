/**
 * Valeurs limites d'exposition et classification d'un gaz.
 *
 * Modèle à trois niveaux, plus informatif qu'un simple couple « seuil d'alerte /
 * seuil de danger » :
 *
 *   - `twa`  : Valeur limite d'exposition, moyenne sur 8 h. C'est le seuil
 *              d'alerte : au-delà, l'exposition est dangereuse même si elle
 *              paraît faible à l'instant présent.
 *   - `stel` : Limite d'exposition de courte durée, moyenne sur 15 min. Un
 *              dépassement est une alerte immédiate, même si la moyenne
 *              journalière reste acceptable.
 *   - `idlh` : Immediately Dangerous To Life or Health. Seuil de retrait.
 *              Au-delà, il faut évacuer, pas seulement prévenir.
 *
 * ⚠️ Ces valeurs sont issues de publications reconnues (NIOSH/OSHA). Elles
 * ne constituent pas une validation pour votre site : un document unique
 * d'intervention peut être plus strict. Faites-les valider par votre
 * responsable HSE avant tout usage en astreinte.
 *
 * Origine : règles écrites sur la branche `develop`, désormais partagées.
 */

export type GasType = 'H2S' | 'CO2' | 'CO' | 'NH3' | 'SO2' | 'NO2' | 'O2' | 'CH4';

/** Niveaux de gravité, du moins grave au plus grave. */
export type AlertLevel = 'normal' | 'warning' | 'critical' | 'danger';

/** Les trois valeurs limites d'un gaz. */
export interface GasThreshold {
  type: GasType;
  name: string;
  unit: string;
  /** Valeur limite d'exposition, moyenne sur 8 h (ppm, ou % pour O₂). */
  twa: number;
  /** Limite d'exposition de courte durée, moyenne sur 15 min. */
  stel: number;
  /** Immediately Dangerous To Life or Health — seuil de retrait. */
  idlh: number;
  color: string;
  icon: string;
}

export const GAS_THRESHOLDS: Record<GasType, GasThreshold> = {
  H2S: { type: 'H2S', name: 'Hydrogène sulfure', unit: 'ppm', twa: 10, stel: 15, idlh: 100, color: '#FF5722', icon: 'skull-crossbones' },
  CO2: { type: 'CO2', name: 'Dioxyde de carbone', unit: 'ppm', twa: 5000, stel: 30000, idlh: 40000, color: '#607D8B', icon: 'cloud' },
  CO: { type: 'CO', name: 'Monoxyde de carbone', unit: 'ppm', twa: 25, stel: 200, idlh: 1200, color: '#F44336', icon: 'fire' },
  NH3: { type: 'NH3', name: 'Ammoniac', unit: 'ppm', twa: 25, stel: 35, idlh: 300, color: '#4CAF50', icon: 'flask' },
  SO2: { type: 'SO2', name: 'Dioxyde de soufre', unit: 'ppm', twa: 2, stel: 5, idlh: 100, color: '#FF9800', icon: 'alert-circle' },
  NO2: { type: 'NO2', name: 'Dioxyde d\'azote', unit: 'ppm', twa: 3, stel: 5, idlh: 20, color: '#9C27B0', icon: 'alert-octagon' },
  O2: { type: 'O2', name: 'Oxygène', unit: '%', twa: 20.9, stel: 23.5, idlh: 16, color: '#2196F3', icon: 'weather-windy' },
  CH4: { type: 'CH4', name: 'Méthane', unit: '% LEL', twa: 10, stel: 25, idlh: 50, color: '#795548', icon: 'gas-cylinder' },
};

/**
 * Bornes du risque d'asphyxie par déficit d'oxygène, en pourcentage.
 *
 * L'oxygène est le seul gaz du tableau où un niveau *trop bas* est grave. Le
 * `twa` de 20,9 % est la valeur atmosphérique normale : en dessous, l'air est
 * déjà appauvri, ce qui est bien plus dangereux qu'un léger excès.
 */
const O2_DEFICIENCY_CRITICAL = 19.5;
const O2_DEFICIENCY_WARNING = 20.0;

/**
 * Classe une mesure par rapport aux valeurs limites d'un gaz.
 *
 * @param type  Gaz concerné.
 * @param value Mesure, dans l'unité du gaz (`ppm`, `%` ou `% LEL`).
 * @returns Le niveau de gravité correspondant.
 */
export function getAlertLevel(type: GasType, value: number): AlertLevel {
  const t = GAS_THRESHOLDS[type];

  // Une concentration négative est physiquement impossible. La traiter comme
  // « normale » ferait qu'un capteur qui publie une valeur aberrante — bug de
  // firmware, champ corrompu,.payload mal décodé — afficherait un site
  // « conforme ». On classe donc l'impossible au plus grave, jamais en dessous.
  if (value < 0) return 'danger';

  if (type === 'O2') {
    // Un manque d'oxygène est plus grave qu'un excès.
    if (value < t.idlh) return 'danger';
    if (value < O2_DEFICIENCY_CRITICAL) return 'critical';
    if (value < O2_DEFICIENCY_WARNING || value > t.stel) return 'warning';
    return 'normal';
  }

  if (value >= t.idlh) return 'danger';
  if (value >= t.stel) return 'critical';
  if (value >= t.twa) return 'warning';
  return 'normal';
}

/** Correspondance entre le libellé d'un capteur ESP et le gaz canonique. */
const GAS_ALIASES: Record<string, GasType> = {
  h2s: 'H2S',
  co: 'CO',
  co2: 'CO2',
  nh3: 'NH3',
  so2: 'SO2',
  no2: 'NO2',
  o2: 'O2',
  ch4: 'CH4',
};

/**
 * Traduit un identifiant de capteur en gaz canonique.
 *
 * Accepte aussi bien le nom court (`h2s`) que le nom de champ du payload ESP
 * (`h2s_ppm`), car c'est sous cette forme que les clés arrivent du broker.
 *
 * @returns Le gaz correspondant, ou `null` si l'identifiant n'est pas reconnu.
 */
export function resolveGasType(raw: string): GasType | null {
  const normalized = raw.trim().toLowerCase().replace(/_ppm$/, '');
  return GAS_ALIASES[normalized] ?? null;
}

/** Un niveau de gravité est-il au moins aussi grave que le seuil fourni ? */
export function isAtLeast(level: AlertLevel, threshold: AlertLevel): boolean {
  const rank: Record<AlertLevel, number> = {
    normal: 0,
    warning: 1,
    critical: 2,
    danger: 3,
  };
  return rank[level] >= rank[threshold];
}

export default GAS_THRESHOLDS;
