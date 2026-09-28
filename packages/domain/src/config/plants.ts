/**
 * Sites industriels et rythme de rafraîchissement.
 *
 * TypeScript pur : cette table est identique dans l'application Android et dans
 * la plateforme web. Changer une période de rafraîchissement ici change le
 * comportement des deux côtés, ce qui évite que l'une des deuxinterfaces
 * interroge le broker dix fois plus souvent que l'autre.
 */

import type { PlantId } from '../types/unit';

export interface PlantDescriptor {
  id: PlantId;
  name: string;
  fullName: string;
  code: string;
  city: string;
}

export const PLANTS: readonly PlantDescriptor[] = [
  {
    id: 'jorf_lasfar',
    name: 'Jorf Lasfar',
    fullName: 'Complexe de Jorf Lasfar',
    code: 'JFC',
    city: 'Jorf Lasfar',
  },
  {
    id: 'safi',
    name: 'Safi',
    fullName: 'Complexe de Safi',
    code: 'SAP',
    city: 'Safi',
  },
] as const;

/** Périodes de rafraîchissement, en millisecondes. */
export const REFRESH_INTERVALS = {
  dashboard: 30_000,
  sensors: 5_000,
  cameras: 10_000,
  alerts: 15_000,
} as const;

/** Retenu avant qu'un capteur soit considéré hors ligne. Aligné sur l'app. */
export const SENSOR_STALE_AFTER_MS = 90_000;

/**
 * Retrouve un site par identifiant.
 *
 * @returns Le site, ou `undefined` si l'identifiant n'est pas connu.
 */
export function findPlant(id: string): PlantDescriptor | undefined {
  return PLANTS.find((plant) => plant.id === id);
}
