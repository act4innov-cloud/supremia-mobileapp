/**
 * Caméras de surveillance et commandes PTZ.
 *
 * Les URL `rtsp` / `onvif` ne sont jamais stockées en clair côté client : elles
 * contiennent les identifiants de la caméra. Elles sont ici uniquement comme
 * contrat de forme — la résolution effective doit passer par le backend, qui
 * les délivre après contrôle de permission.
 */

export type CameraStatus = 'online' | 'offline' | 'recording' | 'error';

export type CameraType = 'ptz' | 'fixed' | 'dome' | 'bullet';

/** Position de la tête d'une caméra orientable. */
export interface PTZPosition {
  /** -180 à 180. */
  pan: number;
  /** -90 à 90. */
  tilt: number;
  /** 0 à 100. */
  zoom: number;
}

export interface CameraPreset {
  id: string;
  name: string;
  position: PTZPosition;
  description: string;
}

export interface Camera {
  id: string;
  name: string;
  type: CameraType;
  unitId: string;
  plantId: string;
  model: string;
  ipAddress: string;
  port: number;
  /** ⚠️ Ne jamais exposer au client : contient les identifiants. */
  rtspUrl: string;
  onvifUrl: string;
  status: CameraStatus;
  isPTZ: boolean;
  currentPosition?: PTZPosition;
  presets: CameraPreset[];
  location: {
    zone: string;
    description: string;
    coordinates: { latitude: number; longitude: number };
  };
  resolution: string;
  fps: number;
  nightVision: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CameraSnapshot {
  cameraId: string;
  imageUrl: string;
  timestamp: string;
  takenBy: string;
}

/** Commande envoyée à une caméra orientable. */
export interface PTZCommand {
  action: 'move' | 'stop' | 'preset' | 'home';
  pan?: number;
  tilt?: number;
  zoom?: number;
  presetId?: string;
  speed?: number;
}
