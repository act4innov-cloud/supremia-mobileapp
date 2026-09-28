/**
 * Unités de production, sites et synthèse de santé.
 *
 * L'unité de production (« JFC-01 ») est l'échelle à laquelle un responsable
 * raisonne : un capteur appartient à une unité, une caméra à une unité, un
 * rapport porte sur des unités. Le rattachement au site (« plante ») permet
 * ensuite d'agréger.
 */

/** Sites connus. Union explicite : un identifiant erroné devient une erreur de compilation. */
export type PlantId = 'jorf_lasfar' | 'safi';

/** État opérationnel d'une unité. */
export type UnitStatus = 'operational' | 'degraded' | 'shutdown' | 'maintenance' | 'alarm';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ProductionUnit {
  id: string;
  name: string;
  /** Code court affiché partout : `JFC-01`, `SAP-03`. */
  code: string;
  plantId: PlantId;
  description: string;
  /** Filière produite, ex. « Acide phosphorique ». */
  type: string;
  status: UnitStatus;
  /** Score de santé agrégé, 0-100. */
  healthScore: number;
  /** Identifiants des capteurs rattachés. */
  sensors: string[];
  /** Identifiants des caméras rattachées. */
  cameras: string[];
  location: {
    zone: string;
    building: string;
    coordinates: Coordinates;
  };
  capacity: {
    nominal: number;
    current: number;
    unit: string;
  };
  responsiblePerson: string;
  contactEmail: string;
  lastInspectionDate: string;
  nextInspectionDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Plant {
  id: PlantId;
  name: string;
  fullName: string;
  city: string;
  /** Identifiants des unités du site. */
  units: string[];
  totalSensors: number;
  totalCameras: number;
  overallHealthScore: number;
  activeAlerts: number;
}

/** Synthèse affichable sur la carte de supervision. */
export interface UnitHealthSummary {
  unitId: string;
  unitName: string;
  healthScore: number;
  status: UnitStatus;
  activeSensors: number;
  totalSensors: number;
  activeAlerts: number;
  criticalAlerts: number;
  lastUpdate: string;
}
