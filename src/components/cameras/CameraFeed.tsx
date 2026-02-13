import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
interface Props { cameraId: string; cameraName: string; isOnline: boolean; rtspUrl?: string; height?: number; }
export default function CameraFeed({ cameraName, isOnline, height = 240 }: Props) {
  return (<View style={[s.w, { height }]}><MaterialCommunityIcons name={isOnline ? 'video' : 'video-off'} size={48} color={isOnline ? '#444' : '#F44336'} /><Text style={s.n}>{cameraName}</Text><Text style={s.st}>{isOnline ? 'Flux RTSP' : 'Hors ligne'}</Text></View>);
}
const s = StyleSheet.create({ w: { backgroundColor: '#0f3460', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }, n: { color: '#aaa', marginTop: 8, fontWeight: 'bold' }, st: { color: '#666', marginTop: 4, fontSize: 12 } });