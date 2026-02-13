import React from 'react';
import { View, StyleSheet, useWindowDimensions, Pressable } from 'react-native';
import CameraFeed from './CameraFeed';
import { Camera } from '@/types/camera.types';

interface Props { cameras: Camera[]; onCameraPress?: (id: string) => void; }

export default function CameraGrid({ cameras, onCameraPress }: Props) {
  const { width } = useWindowDimensions();
  const cols = width >= 1024 ? 3 : width >= 768 ? 2 : 1;
  const itemWidth = (width - 32 - (cols - 1) * 8) / cols;
  return (
    <View style={s.grid}>
      {cameras.map(cam => (
        <Pressable key={cam.id} style={{ width: itemWidth, marginBottom: 8 }} onPress={() => onCameraPress?.(cam.id)}>
          <CameraFeed cameraId={cam.id} cameraName={cam.name} isOnline={cam.status !== 'offline'} height={itemWidth * 0.6} />
        </Pressable>
      ))}
    </View>
  );
}
const s = StyleSheet.create({ grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 8 } });