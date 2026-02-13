import { Camera, PTZCommand, PTZPosition, CameraSnapshot } from '@/types/camera.types';

const CAMERA_API = process.env.EXPO_PUBLIC_CAMERA_API_URL || 'https://cameras.supremia.ocp.ma';

export async function getCameras(plantId: string): Promise<Camera[]> {
  const res = await fetch(`${CAMERA_API}/api/plants/${plantId}/cameras`);
  if (!res.ok) throw new Error('Failed to fetch cameras');
  return res.json();
}

export async function sendPTZCommand(cameraId: string, command: PTZCommand): Promise<void> {
  await fetch(`${CAMERA_API}/api/cameras/${cameraId}/ptz`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(command) });
}

export async function captureSnapshot(cameraId: string): Promise<CameraSnapshot> {
  const res = await fetch(`${CAMERA_API}/api/cameras/${cameraId}/snapshot`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to capture snapshot');
  return res.json();
}

export function getStreamUrl(camera: Camera): string {
  return camera.rtspUrl || `${CAMERA_API}/api/cameras/${camera.id}/stream`;
}