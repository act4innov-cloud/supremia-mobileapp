// ============================================================
// SUPREMIA Platform — Seed Firestore Database
// ============================================================
// Usage: node scripts/seed-firestore.js
//
// Prérequis:
//   1. npm install firebase-admin
//   2. Télécharger serviceAccountKey.json depuis Firebase Console
//      → Paramètres → Comptes de service → Générer une nouvelle clé privée
//   3. Placer serviceAccountKey.json dans le dossier scripts/
// ============================================================

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// Initialiser Firebase Admin
try {
  initializeApp({
    credential: cert(require('./serviceAccountKey.json'))
  });
} catch (e) {
  console.error('❌ Erreur: serviceAccountKey.json introuvable dans scripts/');
  console.error('   Téléchargez-le depuis Firebase Console → Paramètres → Comptes de service');
  process.exit(1);
}

const db = getFirestore();
const now = new Date().toISOString();

// ══════════════════════════════════════════════════
// DATA DEFINITIONS
// ══════════════════════════════════════════════════

const plants = [
  {
    id: 'jorf_lasfar',
    name: 'Complexe Jorf Lasfar',
    code: 'JFC',
    location: {
      city: 'El Jadida',
      region: 'Casablanca-Settat',
      coordinates: { latitude: 33.1167, longitude: -8.6333 }
    },
    description: 'Complexe industriel de production d\'acide phosphorique et d\'engrais',
    totalUnits: 3,
    status: 'operational',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'safi',
    name: 'Complexe Safi',
    code: 'SAP',
    location: {
      city: 'Safi',
      region: 'Marrakech-Safi',
      coordinates: { latitude: 32.2994, longitude: -9.2372 }
    },
    description: 'Complexe industriel de production d\'engrais et de granulation',
    totalUnits: 1,
    status: 'operational',
    createdAt: now,
    updatedAt: now,
  }
];

const units = [
  {
    id: 'jfc-01',
    plantId: 'jorf_lasfar',
    name: 'Unité Acide Phosphorique',
    code: 'JFC-01',
    type: 'Phosphoric Acid',
    status: 'operational',
    healthScore: 92,
    description: 'Production d\'acide phosphorique 54% — Ligne principale',
    responsiblePerson: 'Ahmed Benali',
    contactEmail: 'a.benali@ocp.ma',
    sensors: [],
    cameras: [],
    capacity: { nominal: 1500, current: 1380, unit: 't/j' },
    location: { zone: 'Zone A', building: 'Bâtiment 1', coordinates: { latitude: 33.1170, longitude: -8.6330 } },
    lastInspectionDate: '2025-11-15',
    nextInspectionDate: '2026-02-15',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'jfc-02',
    plantId: 'jorf_lasfar',
    name: 'Unité Acide Sulfurique',
    code: 'JFC-02',
    type: 'Sulfuric Acid',
    status: 'degraded',
    healthScore: 74,
    description: 'Production d\'acide sulfurique — Contact simple',
    responsiblePerson: 'Fatima Zahra El Idrissi',
    contactEmail: 'f.zahra@ocp.ma',
    sensors: [],
    cameras: [],
    capacity: { nominal: 3300, current: 2800, unit: 't/j' },
    location: { zone: 'Zone B', building: 'Bâtiment 3', coordinates: { latitude: 33.1175, longitude: -8.6340 } },
    lastInspectionDate: '2025-10-20',
    nextInspectionDate: '2026-01-20',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'jfc-03',
    plantId: 'jorf_lasfar',
    name: 'Unité Engrais DAP',
    code: 'JFC-03',
    type: 'Fertilizer',
    status: 'operational',
    healthScore: 88,
    description: 'Production de diammonium phosphate (DAP)',
    responsiblePerson: 'Karim Idrissi',
    contactEmail: 'k.idrissi@ocp.ma',
    sensors: [],
    cameras: [],
    capacity: { nominal: 2000, current: 1850, unit: 't/j' },
    location: { zone: 'Zone C', building: 'Bâtiment 5', coordinates: { latitude: 33.1180, longitude: -8.6350 } },
    lastInspectionDate: '2025-12-01',
    nextInspectionDate: '2026-03-01',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'sap-01',
    plantId: 'safi',
    name: 'Unité Granulation',
    code: 'SAP-01',
    type: 'Granulation',
    status: 'operational',
    healthScore: 81,
    description: 'Granulation des engrais — Ligne TSP/MAP',
    responsiblePerson: 'Youssef Tazi',
    contactEmail: 'y.tazi@ocp.ma',
    sensors: [],
    cameras: [],
    capacity: { nominal: 1200, current: 960, unit: 't/j' },
    location: { zone: 'Zone D', building: 'Bâtiment 2', coordinates: { latitude: 32.3000, longitude: -9.2380 } },
    lastInspectionDate: '2025-11-01',
    nextInspectionDate: '2026-02-01',
    createdAt: now,
    updatedAt: now,
  }
];

const sensors = [
  {
    id: 'h2s-jfc01-001', unitId: 'jfc-01', plantId: 'jorf_lasfar',
    name: 'H2S-JFC01-001', type: 'H2S',
    model: 'Dräger X-am 8000', serialNumber: 'DRG-2024-001', firmwareVersion: '3.2.1',
    status: 'online', batteryLevel: 85, signalStrength: -42,
    location: { zone: 'Zone A', building: 'Bâtiment 1', coordinates: { latitude: 33.1170, longitude: -8.6330 } },
    lastCalibrationDate: '2025-11-01', nextCalibrationDate: '2026-02-01',
    installedDate: '2024-03-15',
    mqttTopic: 'ocp/jorf_lasfar/jfc-01/sensors/h2s-jfc01-001/data',
    createdAt: now, updatedAt: now,
  },
  {
    id: 'co2-jfc01-002', unitId: 'jfc-01', plantId: 'jorf_lasfar',
    name: 'CO2-JFC01-002', type: 'CO2',
    model: 'Honeywell BW Ultra', serialNumber: 'HWL-2024-015', firmwareVersion: '2.8.0',
    status: 'online', batteryLevel: 92, signalStrength: -38,
    location: { zone: 'Zone A', building: 'Bâtiment 1', coordinates: { latitude: 33.1171, longitude: -8.6331 } },
    lastCalibrationDate: '2025-10-15', nextCalibrationDate: '2026-01-15',
    installedDate: '2024-04-20',
    mqttTopic: 'ocp/jorf_lasfar/jfc-01/sensors/co2-jfc01-002/data',
    createdAt: now, updatedAt: now,
  },
  {
    id: 'co-jfc01-003', unitId: 'jfc-01', plantId: 'jorf_lasfar',
    name: 'CO-JFC01-003', type: 'CO',
    model: 'MSA ALTAIR 5X', serialNumber: 'MSA-2024-010', firmwareVersion: '4.1.0',
    status: 'online', batteryLevel: 78, signalStrength: -45,
    location: { zone: 'Zone A', building: 'Bâtiment 1', coordinates: { latitude: 33.1172, longitude: -8.6332 } },
    lastCalibrationDate: '2025-09-01', nextCalibrationDate: '2025-12-01',
    installedDate: '2024-05-10',
    mqttTopic: 'ocp/jorf_lasfar/jfc-01/sensors/co-jfc01-003/data',
    createdAt: now, updatedAt: now,
  },
  {
    id: 'o2-jfc01-004', unitId: 'jfc-01', plantId: 'jorf_lasfar',
    name: 'O2-JFC01-004', type: 'O2',
    model: 'BW Clip4', serialNumber: 'BW4-2024-011', firmwareVersion: '2.3.0',
    status: 'online', batteryLevel: 65, signalStrength: -50,
    location: { zone: 'Zone A', building: 'Bâtiment 1', coordinates: { latitude: 33.1173, longitude: -8.6333 } },
    lastCalibrationDate: '2025-07-15', nextCalibrationDate: '2025-10-15',
    installedDate: '2024-06-01',
    mqttTopic: 'ocp/jorf_lasfar/jfc-01/sensors/o2-jfc01-004/data',
    createdAt: now, updatedAt: now,
  },
  {
    id: 'nh3-jfc02-001', unitId: 'jfc-02', plantId: 'jorf_lasfar',
    name: 'NH3-JFC02-001', type: 'NH3',
    model: 'RAE Systems MiniRAE', serialNumber: 'RAE-2024-008', firmwareVersion: '1.5.3',
    status: 'online', batteryLevel: 88, signalStrength: -35,
    location: { zone: 'Zone B', building: 'Bâtiment 3', coordinates: { latitude: 33.1175, longitude: -8.6340 } },
    lastCalibrationDate: '2025-09-20', nextCalibrationDate: '2025-12-20',
    installedDate: '2024-07-15',
    mqttTopic: 'ocp/jorf_lasfar/jfc-02/sensors/nh3-jfc02-001/data',
    createdAt: now, updatedAt: now,
  },
  {
    id: 'so2-jfc02-002', unitId: 'jfc-02', plantId: 'jorf_lasfar',
    name: 'SO2-JFC02-002', type: 'SO2',
    model: 'Crowcon T4x', serialNumber: 'CRW-2024-022', firmwareVersion: '5.0.2',
    status: 'online', batteryLevel: 95, signalStrength: -30,
    location: { zone: 'Zone B', building: 'Bâtiment 3', coordinates: { latitude: 33.1176, longitude: -8.6341 } },
    lastCalibrationDate: '2025-12-01', nextCalibrationDate: '2026-03-01',
    installedDate: '2024-08-20',
    mqttTopic: 'ocp/jorf_lasfar/jfc-02/sensors/so2-jfc02-002/data',
    createdAt: now, updatedAt: now,
  },
  {
    id: 'h2s-jfc03-001', unitId: 'jfc-03', plantId: 'jorf_lasfar',
    name: 'H2S-JFC03-001', type: 'H2S',
    model: 'Dräger X-am 8000', serialNumber: 'DRG-2024-005', firmwareVersion: '3.2.1',
    status: 'online', batteryLevel: 72, signalStrength: -48,
    location: { zone: 'Zone C', building: 'Bâtiment 5', coordinates: { latitude: 33.1180, longitude: -8.6350 } },
    lastCalibrationDate: '2025-11-15', nextCalibrationDate: '2026-02-15',
    installedDate: '2024-09-01',
    mqttTopic: 'ocp/jorf_lasfar/jfc-03/sensors/h2s-jfc03-001/data',
    createdAt: now, updatedAt: now,
  },
  {
    id: 'h2s-sap01-001', unitId: 'sap-01', plantId: 'safi',
    name: 'H2S-SAP01-001', type: 'H2S',
    model: 'MSA ALTAIR 5X', serialNumber: 'MSA-2024-003', firmwareVersion: '4.1.0',
    status: 'online', batteryLevel: 80, signalStrength: -40,
    location: { zone: 'Zone D', building: 'Bâtiment 2', coordinates: { latitude: 32.3000, longitude: -9.2380 } },
    lastCalibrationDate: '2025-11-01', nextCalibrationDate: '2026-02-01',
    installedDate: '2024-06-15',
    mqttTopic: 'ocp/safi/sap-01/sensors/h2s-sap01-001/data',
    createdAt: now, updatedAt: now,
  }
];

const cameras = [
  {
    id: 'cam-jfc01-001',
    unitId: 'jfc-01', plantId: 'jorf_lasfar',
    name: 'CAM-JFC01-PTZ-001',
    type: 'PTZ',
    model: 'Hikvision DS-2DE4425IW-DE',
    status: 'online',
    streamUrl: 'rtsp://cameras.jfc.ocp.ma:554/cam-jfc01-001/stream',
    location: { zone: 'Zone A', building: 'Bâtiment 1', coordinates: { latitude: 33.1170, longitude: -8.6330 } },
    capabilities: { ptz: true, zoom: { min: 1, max: 25 }, nightVision: true, motionDetection: true },
    presets: [
      { id: 'p1', name: 'Vue générale', pan: 0, tilt: -15, zoom: 1 },
      { id: 'p2', name: 'Zone réacteurs', pan: 45, tilt: -25, zoom: 8 },
      { id: 'p3', name: 'Zone stockage', pan: -60, tilt: -10, zoom: 5 },
    ],
    createdAt: now, updatedAt: now,
  },
  {
    id: 'cam-jfc01-002',
    unitId: 'jfc-01', plantId: 'jorf_lasfar',
    name: 'CAM-JFC01-FIX-002',
    type: 'Fixed',
    model: 'Hikvision DS-2CD2T87G2-L',
    status: 'online',
    streamUrl: 'rtsp://cameras.jfc.ocp.ma:554/cam-jfc01-002/stream',
    location: { zone: 'Zone A', building: 'Bâtiment 1', coordinates: { latitude: 33.1171, longitude: -8.6331 } },
    capabilities: { ptz: false, nightVision: true, motionDetection: true },
    presets: [],
    createdAt: now, updatedAt: now,
  },
  {
    id: 'cam-jfc02-001',
    unitId: 'jfc-02', plantId: 'jorf_lasfar',
    name: 'CAM-JFC02-PTZ-001',
    type: 'PTZ',
    model: 'Dahua SD6AL245XA-HNR',
    status: 'online',
    streamUrl: 'rtsp://cameras.jfc.ocp.ma:554/cam-jfc02-001/stream',
    location: { zone: 'Zone B', building: 'Bâtiment 3', coordinates: { latitude: 33.1175, longitude: -8.6340 } },
    capabilities: { ptz: true, zoom: { min: 1, max: 45 }, nightVision: true, motionDetection: true },
    presets: [
      { id: 'p1', name: 'Vue panoramique', pan: 0, tilt: -10, zoom: 1 },
      { id: 'p2', name: 'Cheminée', pan: 30, tilt: -40, zoom: 12 },
    ],
    createdAt: now, updatedAt: now,
  },
  {
    id: 'cam-sap01-001',
    unitId: 'sap-01', plantId: 'safi',
    name: 'CAM-SAP01-PTZ-001',
    type: 'PTZ',
    model: 'Hikvision DS-2DE7A425IW-AEB',
    status: 'online',
    streamUrl: 'rtsp://cameras.sap.ocp.ma:554/cam-sap01-001/stream',
    location: { zone: 'Zone D', building: 'Bâtiment 2', coordinates: { latitude: 32.3000, longitude: -9.2380 } },
    capabilities: { ptz: true, zoom: { min: 1, max: 25 }, nightVision: true, motionDetection: true },
    presets: [
      { id: 'p1', name: 'Vue d\'ensemble', pan: 0, tilt: -20, zoom: 1 },
      { id: 'p2', name: 'Zone granulation', pan: 90, tilt: -30, zoom: 10 },
    ],
    createdAt: now, updatedAt: now,
  }
];

// ══════════════════════════════════════════════════
// SEED FUNCTION
// ══════════════════════════════════════════════════

async function seed() {
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🏭 SUPREMIA — Seed Firestore Database');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  // Batch write for performance
  const batch1 = db.batch();

  // 1. PLANTS
  for (const plant of plants) {
    const ref = db.collection('plants').doc(plant.id);
    batch1.set(ref, plant);
  }
  await batch1.commit();
  console.log(`✅ Plants:   ${plants.length} créées (Jorf Lasfar, Safi)`);

  // 2. UNITS
  const batch2 = db.batch();
  for (const unit of units) {
    const ref = db.collection('units').doc(unit.id);
    batch2.set(ref, unit);
  }
  await batch2.commit();
  console.log(`✅ Units:    ${units.length} créées`);

  // 3. SENSORS
  const batch3 = db.batch();
  const sensorIds = {};
  for (const sensor of sensors) {
    const ref = db.collection('sensors').doc(sensor.id);
    batch3.set(ref, sensor);
    // Track sensor IDs per unit
    if (!sensorIds[sensor.unitId]) sensorIds[sensor.unitId] = [];
    sensorIds[sensor.unitId].push(sensor.id);
  }
  await batch3.commit();
  console.log(`✅ Sensors:  ${sensors.length} créés`);

  // 4. CAMERAS
  const batch4 = db.batch();
  const cameraIds = {};
  for (const camera of cameras) {
    const ref = db.collection('cameras').doc(camera.id);
    batch4.set(ref, camera);
    if (!cameraIds[camera.unitId]) cameraIds[camera.unitId] = [];
    cameraIds[camera.unitId].push(camera.id);
  }
  await batch4.commit();
  console.log(`✅ Cameras:  ${cameras.length} créées`);

  // 5. UPDATE UNIT REFERENCES (sensor & camera IDs)
  const batch5 = db.batch();
  for (const unit of units) {
    const ref = db.collection('units').doc(unit.id);
    batch5.update(ref, {
      sensors: sensorIds[unit.id] || [],
      cameras: cameraIds[unit.id] || [],
    });
  }
  await batch5.commit();
  console.log('✅ Units:    références capteurs/caméras mises à jour');

  // 6. SAMPLE ALERTS
  const alerts = [
    {
      id: 'alert-001',
      sensorId: 'h2s-jfc01-001', unitId: 'jfc-01', plantId: 'jorf_lasfar',
      type: 'H2S', level: 'warning',
      message: 'Concentration H2S élevée détectée — 12.5 ppm (seuil TWA: 10 ppm)',
      value: 12.5, threshold: 10, unit: 'ppm',
      acknowledged: false, acknowledgedBy: null, acknowledgedAt: null,
      resolved: false, resolvedAt: null,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      createdAt: now,
    },
    {
      id: 'alert-002',
      sensorId: 'nh3-jfc02-001', unitId: 'jfc-02', plantId: 'jorf_lasfar',
      type: 'NH3', level: 'info',
      message: 'Calibration automatique effectuée — NH3-JFC02-001',
      value: 0, threshold: 0, unit: 'ppm',
      acknowledged: true, acknowledgedBy: 'system', acknowledgedAt: now,
      resolved: true, resolvedAt: now,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      createdAt: now,
    },
  ];

  const batch6 = db.batch();
  for (const alert of alerts) {
    const ref = db.collection('alerts').doc(alert.id);
    batch6.set(ref, alert);
  }
  await batch6.commit();
  console.log(`✅ Alerts:   ${alerts.length} exemples créés`);

  // 7. AUDIT LOG ENTRY
  await db.collection('audit_log').add({
    action: 'SEED_DATABASE',
    userId: 'system',
    details: `Base de données initialisée : ${plants.length} plants, ${units.length} units, ${sensors.length} sensors, ${cameras.length} cameras`,
    timestamp: now,
  });
  console.log('✅ Audit:    entrée de log créée');

  // Summary
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 Seed terminé avec succès !');
  console.log('');
  console.log('📊 Résumé :');
  console.log(`   Plants:   ${plants.length}`);
  console.log(`   Units:    ${units.length}`);
  console.log(`   Sensors:  ${sensors.length}`);
  console.log(`   Cameras:  ${cameras.length}`);
  console.log(`   Alerts:   ${alerts.length}`);
  console.log('');
  console.log('📌 Prochaine étape :');
  console.log('   1. Créer un utilisateur dans Firebase Auth (Console)');
  console.log('   2. Exécuter : node scripts/create-admin.js <uid>');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

seed().catch(err => {
  console.error('❌ Erreur pendant le seed :', err.message);
  process.exit(1);
});