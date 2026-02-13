// ============================================================
// SUPREMIA Platform - Camera Control Screen (Full)
// ============================================================

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Text, Surface, IconButton, Chip, Button } from 'react-native-paper';
import { useLocalSearchParams, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CAMERA = {
  id: 'c1', name: 'CAM-JFC01-PTZ01', type: 'PTZ', model: 'Hikvision DS-2DE4425IW',
  status: 'online', resolution: '1080p', fps: 25, nightVision: true,
  unitName: 'Unité Acide Phosphorique', zone: 'Zone A - Attaque',
  presets: [
    { id: 'p1', name: 'Vue générale' },
    { id: 'p2', name: 'Réacteur R-101' },
    { id: 'p3', name: 'Entrée zone' },
    { id: 'p4', name: 'Tuyauterie nord' },
  ],
};

export default function CameraControlScreen() {
  const { cameraId } = useLocalSearchParams<{ cameraId: string }>();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [ptzSpeed, setPtzSpeed] = useState(5);

  const feedHeight = isTablet ? 400 : 220;

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: CAMERA.name, headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff',
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <IconButton icon={isRecording ? 'record-circle' : 'record'} iconColor={isRecording ? '#F44336' : '#aaa'} size={20} onPress={() => setIsRecording(!isRecording)} />
            <IconButton icon="fullscreen" iconColor="#aaa" size={20} onPress={() => {}} />
          </View>
        ),
      }} />
      <ScrollView style={s.ctn}>
        {/* Video Feed */}
        <View style={[s.feed, { height: feedHeight }]}>
          <MaterialCommunityIcons name="video" size={64} color="#333" />
          <Text style={s.feedTxt}>Flux vidéo RTSP en direct</Text>
          <Text style={s.feedRes}>{CAMERA.resolution} @ {CAMERA.fps}fps</Text>
          {isRecording && (
            <View style={s.recBadge}><View style={s.recDot} /><Text style={s.recTxt}>REC</Text></View>
          )}
          {/* Live overlay info */}
          <View style={s.overlay}>
            <Text style={s.overlayTxt}>{CAMERA.name}</Text>
            <Text style={s.overlayTxt}>{new Date().toLocaleTimeString('fr-FR')}</Text>
          </View>
        </View>

        <View style={[s.body, isTablet && { flexDirection: 'row', gap: 16 }]}>
          {/* PTZ Controls */}
          <Surface style={[s.ptzBox, isTablet && { flex: 1 }]} elevation={2}>
            <Text variant="titleSmall" style={s.secTitle}>Contrôles PTZ</Text>

            <View style={s.ptzPad}>
              <View style={s.ptzRow}>
                <View style={s.ptzSpacer} />
                <IconButton icon="arrow-up-bold" iconColor="#fff" size={30} style={s.ptzBtn} onPress={() => {}} />
                <View style={s.ptzSpacer} />
              </View>
              <View style={s.ptzRow}>
                <IconButton icon="arrow-left-bold" iconColor="#fff" size={30} style={s.ptzBtn} onPress={() => {}} />
                <IconButton icon="home" iconColor="#e94560" size={26} style={s.ptzBtnCenter} onPress={() => {}} />
                <IconButton icon="arrow-right-bold" iconColor="#fff" size={30} style={s.ptzBtn} onPress={() => {}} />
              </View>
              <View style={s.ptzRow}>
                <View style={s.ptzSpacer} />
                <IconButton icon="arrow-down-bold" iconColor="#fff" size={30} style={s.ptzBtn} onPress={() => {}} />
                <View style={s.ptzSpacer} />
              </View>
            </View>

            {/* Zoom */}
            <View style={s.zoomRow}>
              <IconButton icon="magnify-minus" iconColor="#fff" size={26} style={s.ptzBtn} onPress={() => {}} />
              <View style={s.zoomBar}>
                <View style={[s.zoomLevel, { width: '60%' }]} />
              </View>
              <IconButton icon="magnify-plus" iconColor="#fff" size={26} style={s.ptzBtn} onPress={() => {}} />
            </View>

            {/* Quick Actions */}
            <View style={s.quickActions}>
              <Button mode="outlined" icon="camera" textColor="#4CAF50" style={s.actionBtn} onPress={() => {}}>Capture</Button>
              <Button mode="outlined" icon={isRecording ? 'stop' : 'record'} textColor={isRecording ? '#F44336' : '#fff'} style={s.actionBtn} onPress={() => setIsRecording(!isRecording)}>
                {isRecording ? 'Stop' : 'Enregistrer'}
              </Button>
            </View>
          </Surface>

          {/* Presets & Info */}
          <View style={[isTablet && { flex: 1 }]}>
            {/* Presets */}
            <Surface style={s.presetBox} elevation={2}>
              <Text variant="titleSmall" style={s.secTitle}>Presets</Text>
              <View style={s.presetGrid}>
                {CAMERA.presets.map(p => (
                  <Chip
                    key={p.id}
                    selected={activePreset === p.id}
                    onPress={() => setActivePreset(p.id)}
                    style={[s.presetChip, activePreset === p.id && s.presetActive]}
                    textStyle={{ color: activePreset === p.id ? '#fff' : '#aaa', fontSize: 12 }}
                    icon={activePreset === p.id ? 'check' : 'camera-marker'}
                  >
                    {p.name}
                  </Chip>
                ))}
              </View>
            </Surface>

            {/* Camera Info */}
            <Surface style={s.infoBox} elevation={2}>
              <Text variant="titleSmall" style={s.secTitle}>Informations</Text>
              <InfoRow label="Modèle" value={CAMERA.model} />
              <InfoRow label="Type" value={CAMERA.type} />
              <InfoRow label="Résolution" value={CAMERA.resolution} />
              <InfoRow label="FPS" value={`${CAMERA.fps}`} />
              <InfoRow label="Vision nocturne" value={CAMERA.nightVision ? 'Oui' : 'Non'} />
              <InfoRow label="Unité" value={CAMERA.unitName} />
              <InfoRow label="Zone" value={CAMERA.zone} />
              <InfoRow label="Statut" value={CAMERA.status === 'online' ? '🟢 En ligne' : '🔴 Hors ligne'} />
            </Surface>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <View style={s.infoRow}><Text style={s.infoLbl}>{label}</Text><Text style={s.infoVal}>{value}</Text></View>;
}

const s = StyleSheet.create({
  ctn: { flex: 1, backgroundColor: '#1a1a2e' },
  feed: { backgroundColor: '#0a0f1e', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  feedTxt: { color: '#333', marginTop: 8, fontSize: 14 }, feedRes: { color: '#222', fontSize: 11, marginTop: 2 },
  recBadge: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F4433688', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  recDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F44336' }, recTxt: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  overlay: { position: 'absolute', bottom: 8, left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between' },
  overlayTxt: { color: '#ffffff88', fontSize: 11 },
  body: { padding: 12 },
  ptzBox: { backgroundColor: '#16213e', borderRadius: 12, padding: 16, marginBottom: 12, alignItems: 'center' },
  secTitle: { color: '#fff', fontWeight: 'bold', marginBottom: 12, alignSelf: 'flex-start' },
  ptzPad: { alignItems: 'center', marginBottom: 16 },
  ptzRow: { flexDirection: 'row', alignItems: 'center' },
  ptzSpacer: { width: 52 },
  ptzBtn: { backgroundColor: '#0f3460', margin: 3, borderRadius: 12 },
  ptzBtnCenter: { backgroundColor: '#1a1a2e', borderWidth: 2, borderColor: '#e94560', margin: 3, borderRadius: 12 },
  zoomRow: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%', marginBottom: 16 },
  zoomBar: { flex: 1, height: 6, backgroundColor: '#0f3460', borderRadius: 3 },
  zoomLevel: { height: 6, backgroundColor: '#e94560', borderRadius: 3 },
  quickActions: { flexDirection: 'row', gap: 8, width: '100%' },
  actionBtn: { flex: 1, borderColor: '#0f3460', borderRadius: 8 },
  presetBox: { backgroundColor: '#16213e', borderRadius: 12, padding: 16, marginBottom: 12 },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  presetChip: { backgroundColor: '#0f3460' }, presetActive: { backgroundColor: '#e94560' },
  infoBox: { backgroundColor: '#16213e', borderRadius: 12, padding: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#0f346033' },
  infoLbl: { color: '#888', fontSize: 13 }, infoVal: { color: '#fff', fontSize: 13 },
});