// ============================================================
// SUPREMIA Platform - Camera Type Definitions
// ============================================================

export type CameraStatus = 'online' | 'offline' | 'recording' | 'error';

export type CameraType = 'ptz' | 'fixed' | 'dome' | 'bullet';

export interface PTZPosition {
  pan: number;    // -180 to 180
  tilt: number;   // -90 to 90
  zoom: number;   // 0 to 100
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
  rtspUrl: string;
  onvifUrl: string;
  status: CameraStatus;
  isPTZ: boolean;
  currentPosition?: PTZPosition;
  presets: CameraPreset[];
  location: {
    zone: string;
    description: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
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

export interface PTZCommand {
  action: 'move' | 'stop' | 'preset' | 'home';
  pan?: number;
  tilt?: number;
  zoom?: number;
  presetId?: string;
  speed?: number;
}