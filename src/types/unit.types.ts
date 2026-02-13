// ============================================================
// SUPREMIA Platform - Production Unit Type Definitions
// ============================================================

export type PlantId = 'jorf_lasfar' | 'safi';

export type UnitStatus = 'operational' | 'degraded' | 'shutdown' | 'maintenance' | 'alarm';

export interface ProductionUnit {
  id: string;
  name: string;
  code: string;              // e.g., "JFC-01", "SAP-03"
  plantId: PlantId;
  description: string;
  type: string;              // e.g., "Phosphoric Acid", "Fertilizer", "Sulfuric Acid"
  status: UnitStatus;
  healthScore: number;       // 0-100
  sensors: string[];         // Sensor IDs
  cameras: string[];         // Camera IDs
  location: {
    zone: string;
    building: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
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
  units: string[];           // Unit IDs
  totalSensors: number;
  totalCameras: number;
  overallHealthScore: number;
  activeAlerts: number;
}

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