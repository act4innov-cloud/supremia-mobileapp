import { useState, useCallback } from 'react';
import { Camera, PTZCommand, PTZPosition } from '@/types/camera.types';
import { useMQTT } from '@/contexts/MQTTContext';

export function useCameras(plantId?: string) {
  const { publish, isConnected } = useMQTT();
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

  const sendPTZCommand = useCallback((cameraId: string, command: PTZCommand) => {
    if (!isConnected || !plantId) return;
    publish(`supremia/plant/${plantId}/camera/${cameraId}/command`, command as any);
  }, [isConnected, plantId, publish]);

  const goToPreset = useCallback((cameraId: string, presetId: string) => {
    sendPTZCommand(cameraId, { action: 'preset', presetId });
  }, [sendPTZCommand]);

  const goHome = useCallback((cameraId: string) => {
    sendPTZCommand(cameraId, { action: 'home' });
  }, [sendPTZCommand]);

  return { cameras, selectedCamera, setSelectedCamera, sendPTZCommand, goToPreset, goHome, isConnected };
}
export default useCameras;