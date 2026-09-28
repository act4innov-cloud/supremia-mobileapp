import {
  GAS_THRESHOLDS as DOMAIN_GAS_THRESHOLDS,
  SENSOR_STALE_AFTER_MS as DOMAIN_SENSOR_STALE_AFTER_MS,
} from '@supremia/domain';

import type { GasKind, GasStatus } from '~/types/sensor.types';

/**
 * Seuils de détection et de déclenchement des alertes, pour l'app Android.
 *
 * Ce module ne contient que des données : les calculs vivent dans
 * `src/utils/gasCalculations.ts`, ce qui permet de les tester isolément et
 * d'éviter qu'une valeur affichée dépende d'un état d'interface.
 *
 * ## Relation avec le cœur de domaine partagé
 *
 * Les valeurs limites canoniques (TWA / STEL / IDLH) vivent dans
 * `@supremia/domain`, avec la plateforme web. Les seuils d'affichage ci-dessous
 * s'y réfèrent par leur nom de niveau quand ils coïncident, ce qui évite deux
 * copies divergentes du même chiffre.
 *
 * ⚠️ Ils ne coïncident pas tous, et c'est un sujet ouvert :
 *
 *   - H₂S et CO : l'app affiche la TWA puis la STEL. Le domaine expose en plus
 *     l'IDLH, que l'app n'affiche pas.
 *   - CO₂ : l'app alerte à 1 000 ppm, qui est un **seuil de gêne** et non une
 *     valeur limite d'exposition. La VLE du domaine est à 5 000 ppm, et son
 *     IDLH à 40 000 ppm. L'app est donc plus sensible que le modèle ISO sur ce
 *     gaz — c'est le seul cas où elle est plus stricte, et c'est un choix
 *     d'affichage assumé, pas une erreur.
 *
 * Je n'ai volontairement **pas**aligné le CO₂ sur la TWA : cela rendrait
 * l'application moins alerte qu'aujourd'hui, sans validation. Décider dans quel
 * sens arbitrer relève de la sécurité des personnes, pas du développement.
 * Voir `packages/domain/README.md`.
 *
 * ⚠️ À FAIRE VALIDER PAR VOTRE RESPONSABLE HSE AVANT TOUT DÉPLOIEMENT.
 *
 * Aucun de ces chiffres n'est une consigne validée pour votre site. Un écran de
 * supervision qui affiche « conforme » sur la base d'un seuil faux est plus
 * dangereux qu'un écran qui n'affiche rien. Remplacez-les par les valeurs de
 * votre document unique d'intervention avant d'utiliser l'app en astreinte.
 */
export const GAS_THRESHOLDS: Record<GasKind, { warning: number; alarm: number }> = {
  // H2S — VLE-PEL OSHA 10 ppm ; l'app alerte à la VLE puis à la STEL NIOSH
  // (15 ppm), plus sensible que l'IDLH à 100 ppm, volontairement non affiché.
  h2s: {
    warning: DOMAIN_GAS_THRESHOLDS.H2S.twa,
    alarm: DOMAIN_GAS_THRESHOLDS.H2S.stel,
  },
  // CO — VLE-PEL OSHA 25 ppm ; STEL NIOSH 200 ppm, IDLH 1 200 ppm.
  co: {
    warning: DOMAIN_GAS_THRESHOLDS.CO.twa,
    alarm: DOMAIN_GAS_THRESHOLDS.CO.stel,
  },
  // CO2 — seuil de gêne 1 000 ppm, puis VLE-PEL 5 000 ppm (la TWA du domaine).
  // Divergence assumée et documentée ci-dessus.
  co2: { warning: 1000, alarm: DOMAIN_GAS_THRESHOLDS.CO2.twa },
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
 *
 * Les ESP publient en continu : 90 s est généreux, et évite qu'un capteur
 * clignote « hors ligne » sur un simple saut de réseau.
 *
 * La valeur vient du cœur de domaine, pour que l'app et la plateforme web
 * ne dérivent pas sur la définition d'un capteur absent.
 */
export const SENSOR_STALE_AFTER_MS = DOMAIN_SENSOR_STALE_AFTER_MS;
