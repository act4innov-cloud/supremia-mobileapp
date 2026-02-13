const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Utiliser les credentials du projet Firebase Studio
const admin = require('firebase-admin');
if (!admin.apps.length) {
  initializeApp({ projectId: 'supremia-mobileapp' });
}
const db = getFirestore();
const now = new Date().toISOString();

async function seedAll() {
  console.log('\n🏭 SUPREMIA — Seed complet de la base Firestore\n');

  // ═══════════════════════════════════════
  // 1. PLANTS (2 complexes OCP)
  // ═══════════════════════════════════════
  const plants = [
    { id: 'jorf_lasfar', name: 'Complexe Jorf Lasfar', code: 'JFC', location: { city: 'El Jadida', region: 'Casablanca-Settat', coordinates: { latitude: 33.1167, longitude: -8.6333 } }, description: 'Production acide phosphorique et engrais', totalUnits: 3, status: 'operational', createdAt: now, updatedAt: now },
    { id: 'safi', name: 'Complexe Safi', code: 'SAP', location: { city: 'Safi', region: 'Marrakech-Safi', coordinates: { latitude: 32.2994, longitude: -9.2372 } }, description: 'Production engrais et granulation', totalUnits: 1, status: 'operational', createdAt: now, updatedAt: now }
  ];
  for (const p of plants) { await db.collection('plants').doc(p.id).set(p); }
  console.log('✅ 2 Plants creees');

  // ═══════════════════════════════════════
  // 2. UNITS (4 unites)
  // ═══════════════════════════════════════
  const units = [
    { id: 'jfc-01', plantId: 'jorf_lasfar', name: 'Unite Acide Phosphorique', code: 'JFC-01', type: 'Phosphoric Acid', status: 'operational', healthScore: 92, sensorCount: 12, cameraCount: 4, alertCount: 0, responsiblePerson: 'Ahmed Benali', contactEmail: 'a.benali@ocp.ma', capacity: { nominal: 1500, current: 1380, unit: 't/j' }, lastInspectionDate: '2025-11-15', nextInspectionDate: '2026-02-15', createdAt: now, updatedAt: now },
    { id: 'jfc-02', plantId: 'jorf_lasfar', name: 'Unite Acide Sulfurique', code: 'JFC-02', type: 'Sulfuric Acid', status: 'degraded', healthScore: 74, sensorCount: 8, cameraCount: 3, alertCount: 2, responsiblePerson: 'Fatima Zahra El Idrissi', contactEmail: 'f.zahra@ocp.ma', capacity: { nominal: 3300, current: 2800, unit: 't/j' }, lastInspectionDate: '2025-10-20', nextInspectionDate: '2026-01-20', createdAt: now, updatedAt: now },
    { id: 'jfc-03', plantId: 'jorf_lasfar', name: 'Unite Engrais DAP', code: 'JFC-03', type: 'Fertilizer', status: 'operational', healthScore: 88, sensorCount: 10, cameraCount: 3, alertCount: 0, responsiblePerson: 'Karim Idrissi', contactEmail: 'k.idrissi@ocp.ma', capacity: { nominal: 2000, current: 1850, unit: 't/j' }, lastInspectionDate: '2025-12-01', nextInspectionDate: '2026-03-01', createdAt: now, updatedAt: now },
    { id: 'sap-01', plantId: 'safi', name: 'Unite Granulation', code: 'SAP-01', type: 'Granulation', status: 'critical', healthScore: 45, sensorCount: 6, cameraCount: 2, alertCount: 3, responsiblePerson: 'Youssef Tazi', contactEmail: 'y.tazi@ocp.ma', capacity: { nominal: 1200, current: 960, unit: 't/j' }, lastInspectionDate: '2025-11-01', nextInspectionDate: '2026-02-01', createdAt: now, updatedAt: now }
  ];
  for (const u of units) { await db.collection('units').doc(u.id).set(u); }
  console.log('✅ 4 Unites creees');

  // ═══════════════════════════════════════
  // 3. SENSORS (36 capteurs)
  // ═══════════════════════════════════════
  const sensorDefs = [
    // JFC-01: 12 capteurs
    { id: 'h2s-jfc01-001', unitId: 'jfc-01', plantId: 'jorf_lasfar', name: 'H2S-JFC01-001', type: 'H2S', model: 'Drager X-am 8000', status: 'online', batteryLevel: 85, signalStrength: -42, currentValue: 4.2, lastCalibrationDate: '2025-11-01', nextCalibrationDate: '2026-02-01' },
    { id: 'h2s-jfc01-002', unitId: 'jfc-01', plantId: 'jorf_lasfar', name: 'H2S-JFC01-002', type: 'H2S', model: 'Drager X-am 8000', status: 'online', batteryLevel: 78, signalStrength: -45, currentValue: 3.8, lastCalibrationDate: '2025-10-15', nextCalibrationDate: '2026-01-15' },
    { id: 'co2-jfc01-001', unitId: 'jfc-01', plantId: 'jorf_lasfar', name: 'CO2-JFC01-001', type: 'CO2', model: 'Honeywell BW Ultra', status: 'online', batteryLevel: 92, signalStrength: -38, currentValue: 850, lastCalibrationDate: '2025-10-15', nextCalibrationDate: '2026-01-15' },
    { id: 'co2-jfc01-002', unitId: 'jfc-01', plantId: 'jorf_lasfar', name: 'CO2-JFC01-002', type: 'CO2', model: 'Honeywell BW Ultra', status: 'online', batteryLevel: 88, signalStrength: -40, currentValue: 920, lastCalibrationDate: '2025-11-01', nextCalibrationDate: '2026-02-01' },
    { id: 'co-jfc01-001', unitId: 'jfc-01', plantId: 'jorf_lasfar', name: 'CO-JFC01-001', type: 'CO', model: 'MSA ALTAIR 5X', status: 'online', batteryLevel: 76, signalStrength: -48, currentValue: 8.5, lastCalibrationDate: '2025-09-01', nextCalibrationDate: '2025-12-01' },
    { id: 'co-jfc01-002', unitId: 'jfc-01', plantId: 'jorf_lasfar', name: 'CO-JFC01-002', type: 'CO', model: 'MSA ALTAIR 5X', status: 'online', batteryLevel: 82, signalStrength: -44, currentValue: 6.2, lastCalibrationDate: '2025-10-01', nextCalibrationDate: '2026-01-01' },
    { id: 'o2-jfc01-001', unitId: 'jfc-01', plantId: 'jorf_lasfar', name: 'O2-JFC01-001', type: 'O2', model: 'BW Clip4', status: 'online', batteryLevel: 65, signalStrength: -50, currentValue: 20.8, lastCalibrationDate: '2025-07-15', nextCalibrationDate: '2025-10-15' },
    { id: 'o2-jfc01-002', unitId: 'jfc-01', plantId: 'jorf_lasfar', name: 'O2-JFC01-002', type: 'O2', model: 'BW Clip4', status: 'online', batteryLevel: 71, signalStrength: -46, currentValue: 20.9, lastCalibrationDate: '2025-08-01', nextCalibrationDate: '2025-11-01' },
    { id: 'nh3-jfc01-001', unitId: 'jfc-01', plantId: 'jorf_lasfar', name: 'NH3-JFC01-001', type: 'NH3', model: 'RAE Systems MiniRAE', status: 'online', batteryLevel: 90, signalStrength: -36, currentValue: 12.3, lastCalibrationDate: '2025-11-01', nextCalibrationDate: '2026-02-01' },
    { id: 'so2-jfc01-001', unitId: 'jfc-01', plantId: 'jorf_lasfar', name: 'SO2-JFC01-001', type: 'SO2', model: 'Crowcon T4x', status: 'online', batteryLevel: 95, signalStrength: -32, currentValue: 0.8, lastCalibrationDate: '2025-12-01', nextCalibrationDate: '2026-03-01' },
    { id: 'no2-jfc01-001', unitId: 'jfc-01', plantId: 'jorf_lasfar', name: 'NO2-JFC01-001', type: 'NO2', model: 'Drager X-am 5600', status: 'online', batteryLevel: 87, signalStrength: -41, currentValue: 1.2, lastCalibrationDate: '2025-10-15', nextCalibrationDate: '2026-01-15' },
    { id: 'ch4-jfc01-001', unitId: 'jfc-01', plantId: 'jorf_lasfar', name: 'CH4-JFC01-001', type: 'CH4', model: 'Crowcon Gas-Pro', status: 'online', batteryLevel: 80, signalStrength: -43, currentValue: 2.1, lastCalibrationDate: '2025-09-15', nextCalibrationDate: '2025-12-15' },

    // JFC-02: 8 capteurs
    { id: 'h2s-jfc02-001', unitId: 'jfc-02', plantId: 'jorf_lasfar', name: 'H2S-JFC02-001', type: 'H2S', model: 'Drager X-am 8000', status: 'warning', batteryLevel: 45, signalStrength: -55, currentValue: 12.5, lastCalibrationDate: '2025-08-01', nextCalibrationDate: '2025-11-01' },
    { id: 'so2-jfc02-001', unitId: 'jfc-02', plantId: 'jorf_lasfar', name: 'SO2-JFC02-001', type: 'SO2', model: 'Crowcon T4x', status: 'online', batteryLevel: 88, signalStrength: -38, currentValue: 3.8, lastCalibrationDate: '2025-12-01', nextCalibrationDate: '2026-03-01' },
    { id: 'so2-jfc02-002', unitId: 'jfc-02', plantId: 'jorf_lasfar', name: 'SO2-JFC02-002', type: 'SO2', model: 'Crowcon T4x', status: 'online', batteryLevel: 82, signalStrength: -42, currentValue: 4.1, lastCalibrationDate: '2025-11-15', nextCalibrationDate: '2026-02-15' },
    { id: 'co-jfc02-001', unitId: 'jfc-02', plantId: 'jorf_lasfar', name: 'CO-JFC02-001', type: 'CO', model: 'MSA ALTAIR 5X', status: 'online', batteryLevel: 74, signalStrength: -47, currentValue: 15.3, lastCalibrationDate: '2025-09-01', nextCalibrationDate: '2025-12-01' },
    { id: 'o2-jfc02-001', unitId: 'jfc-02', plantId: 'jorf_lasfar', name: 'O2-JFC02-001', type: 'O2', model: 'BW Clip4', status: 'online', batteryLevel: 60, signalStrength: -52, currentValue: 20.5, lastCalibrationDate: '2025-07-01', nextCalibrationDate: '2025-10-01' },
    { id: 'nh3-jfc02-001', unitId: 'jfc-02', plantId: 'jorf_lasfar', name: 'NH3-JFC02-001', type: 'NH3', model: 'RAE Systems MiniRAE', status: 'online', batteryLevel: 91, signalStrength: -35, currentValue: 18.7, lastCalibrationDate: '2025-10-01', nextCalibrationDate: '2026-01-01' },
    { id: 'co2-jfc02-001', unitId: 'jfc-02', plantId: 'jorf_lasfar', name: 'CO2-JFC02-001', type: 'CO2', model: 'Honeywell BW Ultra', status: 'offline', batteryLevel: 12, signalStrength: -70, currentValue: 0, lastCalibrationDate: '2025-06-01', nextCalibrationDate: '2025-09-01' },

    // JFC-03: 10 capteurs
    { id: 'h2s-jfc03-001', unitId: 'jfc-03', plantId: 'jorf_lasfar', name: 'H2S-JFC03-001', type: 'H2S', model: 'Drager X-am 8000', status: 'online', batteryLevel: 72, signalStrength: -48, currentValue: 5.1, lastCalibrationDate: '2025-11-15', nextCalibrationDate: '2026-02-15' },
    { id: 'h2s-jfc03-002', unitId: 'jfc-03', plantId: 'jorf_lasfar', name: 'H2S-JFC03-002', type: 'H2S', model: 'Drager X-am 8000', status: 'online', batteryLevel: 68, signalStrength: -50, currentValue: 6.3, lastCalibrationDate: '2025-10-01', nextCalibrationDate: '2026-01-01' },
    { id: 'nh3-jfc03-001', unitId: 'jfc-03', plantId: 'jorf_lasfar', name: 'NH3-JFC03-001', type: 'NH3', model: 'RAE Systems MiniRAE', status: 'online', batteryLevel: 85, signalStrength: -40, currentValue: 14.6, lastCalibrationDate: '2025-11-01', nextCalibrationDate: '2026-02-01' },
    { id: 'nh3-jfc03-002', unitId: 'jfc-03', plantId: 'jorf_lasfar', name: 'NH3-JFC03-002', type: 'NH3', model: 'RAE Systems MiniRAE', status: 'online', batteryLevel: 79, signalStrength: -44, currentValue: 16.2, lastCalibrationDate: '2025-10-15', nextCalibrationDate: '2026-01-15' },
    { id: 'co2-jfc03-001', unitId: 'jfc-03', plantId: 'jorf_lasfar', name: 'CO2-JFC03-001', type: 'CO2', model: 'Honeywell BW Ultra', status: 'online', batteryLevel: 93, signalStrength: -34, currentValue: 1200, lastCalibrationDate: '2025-12-01', nextCalibrationDate: '2026-03-01' },
    { id: 'co-jfc03-001', unitId: 'jfc-03', plantId: 'jorf_lasfar', name: 'CO-JFC03-001', type: 'CO', model: 'MSA ALTAIR 5X', status: 'online', batteryLevel: 77, signalStrength: -46, currentValue: 10.4, lastCalibrationDate: '2025-09-15', nextCalibrationDate: '2025-12-15' },
    { id: 'o2-jfc03-001', unitId: 'jfc-03', plantId: 'jorf_lasfar', name: 'O2-JFC03-001', type: 'O2', model: 'BW Clip4', status: 'online', batteryLevel: 58, signalStrength: -53, currentValue: 20.7, lastCalibrationDate: '2025-08-01', nextCalibrationDate: '2025-11-01' },
    { id: 'so2-jfc03-001', unitId: 'jfc-03', plantId: 'jorf_lasfar', name: 'SO2-JFC03-001', type: 'SO2', model: 'Crowcon T4x', status: 'online', batteryLevel: 86, signalStrength: -39, currentValue: 1.5, lastCalibrationDate: '2025-11-01', nextCalibrationDate: '2026-02-01' },
    { id: 'ch4-jfc03-001', unitId: 'jfc-03', plantId: 'jorf_lasfar', name: 'CH4-JFC03-001', type: 'CH4', model: 'Crowcon Gas-Pro', status: 'online', batteryLevel: 83, signalStrength: -41, currentValue: 3.7, lastCalibrationDate: '2025-10-01', nextCalibrationDate: '2026-01-01' },
    { id: 'no2-jfc03-001', unitId: 'jfc-03', plantId: 'jorf_lasfar', name: 'NO2-JFC03-001', type: 'NO2', model: 'Drager X-am 5600', status: 'online', batteryLevel: 75, signalStrength: -47, currentValue: 2.1, lastCalibrationDate: '2025-09-01', nextCalibrationDate: '2025-12-01' },

    // SAP-01: 6 capteurs
    { id: 'h2s-sap01-001', unitId: 'sap-01', plantId: 'safi', name: 'H2S-SAP01-001', type: 'H2S', model: 'MSA ALTAIR 5X', status: 'critical', batteryLevel: 25, signalStrength: -62, currentValue: 18.9, lastCalibrationDate: '2025-07-01', nextCalibrationDate: '2025-10-01' },
    { id: 'nh3-sap01-001', unitId: 'sap-01', plantId: 'safi', name: 'NH3-SAP01-001', type: 'NH3', model: 'RAE Systems MiniRAE', status: 'warning', batteryLevel: 40, signalStrength: -58, currentValue: 28.5, lastCalibrationDate: '2025-08-01', nextCalibrationDate: '2025-11-01' },
    { id: 'co2-sap01-001', unitId: 'sap-01', plantId: 'safi', name: 'CO2-SAP01-001', type: 'CO2', model: 'Honeywell BW Ultra', status: 'online', batteryLevel: 70, signalStrength: -49, currentValue: 3500, lastCalibrationDate: '2025-10-01', nextCalibrationDate: '2026-01-01' },
    { id: 'so2-sap01-001', unitId: 'sap-01', plantId: 'safi', name: 'SO2-SAP01-001', type: 'SO2', model: 'Crowcon T4x', status: 'online', batteryLevel: 81, signalStrength: -43, currentValue: 3.2, lastCalibrationDate: '2025-11-01', nextCalibrationDate: '2026-02-01' },
    { id: 'o2-sap01-001', unitId: 'sap-01', plantId: 'safi', name: 'O2-SAP01-001', type: 'O2', model: 'BW Clip4', status: 'warning', batteryLevel: 35, signalStrength: -60, currentValue: 19.2, lastCalibrationDate: '2025-06-15', nextCalibrationDate: '2025-09-15' },
    { id: 'co-sap01-001', unitId: 'sap-01', plantId: 'safi', name: 'CO-SAP01-001', type: 'CO', model: 'MSA ALTAIR 5X', status: 'online', batteryLevel: 67, signalStrength: -51, currentValue: 22.1, lastCalibrationDate: '2025-09-01', nextCalibrationDate: '2025-12-01' }
  ];

  for (const s of sensorDefs) {
    const sensor = {
      ...s,
      serialNumber: 'SN-' + s.id.toUpperCase(),
      firmwareVersion: '3.2.1',
      mqttTopic: 'ocp/' + s.plantId + '/' + s.unitId + '/sensors/' + s.id + '/data',
      installedDate: '2024-03-15',
      location: { zone: s.unitId.startsWith('jfc') ? 'Jorf Lasfar' : 'Safi', building: s.unitId.toUpperCase() },
      createdAt: now,
      updatedAt: now
    };
    await db.collection('sensors').doc(s.id).set(sensor);
  }
  console.log('✅ ' + sensorDefs.length + ' Capteurs crees');


  // ═══════════════════════════════════════
  // 4. CAMERAS (12 cameras)
  // ═══════════════════════════════════════
  const cameras = [
    { id: 'cam-jfc01-001', unitId: 'jfc-01', plantId: 'jorf_lasfar', name: 'CAM-JFC01-PTZ-001', type: 'PTZ', model: 'Hikvision DS-2DE4425IW', status: 'online', streamUrl: 'rtsp://cameras.jfc.ocp.ma:554/cam-jfc01-001', presets: [{id:'p1',name:'Vue generale',pan:0,tilt:-15,zoom:1},{id:'p2',name:'Zone reacteurs',pan:45,tilt:-25,zoom:8}] },
    { id: 'cam-jfc01-002', unitId: 'jfc-01', plantId: 'jorf_lasfar', name: 'CAM-JFC01-FIX-002', type: 'Fixed', model: 'Hikvision DS-2CD2T87G2', status: 'online', streamUrl: 'rtsp://cameras.jfc.ocp.ma:554/cam-jfc01-002', presets: [] },
    { id: 'cam-jfc01-003', unitId: 'jfc-01', plantId: 'jorf_lasfar', name: 'CAM-JFC01-PTZ-003', type: 'PTZ', model: 'Dahua SD6AL245XA', status: 'online', streamUrl: 'rtsp://cameras.jfc.ocp.ma:554/cam-jfc01-003', presets: [{id:'p1',name:'Entree',pan:-30,tilt:-10,zoom:3}] },
    { id: 'cam-jfc01-004', unitId: 'jfc-01', plantId: 'jorf_lasfar', name: 'CAM-JFC01-FIX-004', type: 'Fixed', model: 'Hikvision DS-2CD2T87G2', status: 'offline', streamUrl: 'rtsp://cameras.jfc.ocp.ma:554/cam-jfc01-004', presets: [] },
    { id: 'cam-jfc02-001', unitId: 'jfc-02', plantId: 'jorf_lasfar', name: 'CAM-JFC02-PTZ-001', type: 'PTZ', model: 'Dahua SD6AL245XA', status: 'online', streamUrl: 'rtsp://cameras.jfc.ocp.ma:554/cam-jfc02-001', presets: [{id:'p1',name:'Vue panoramique',pan:0,tilt:-10,zoom:1},{id:'p2',name:'Cheminee',pan:30,tilt:-40,zoom:12}] },
    { id: 'cam-jfc02-002', unitId: 'jfc-02', plantId: 'jorf_lasfar', name: 'CAM-JFC02-FIX-002', type: 'Fixed', model: 'Hikvision DS-2CD2T87G2', status: 'online', streamUrl: 'rtsp://cameras.jfc.ocp.ma:554/cam-jfc02-002', presets: [] },
    { id: 'cam-jfc02-003', unitId: 'jfc-02', plantId: 'jorf_lasfar', name: 'CAM-JFC02-PTZ-003', type: 'PTZ', model: 'Hikvision DS-2DE7A425IW', status: 'online', streamUrl: 'rtsp://cameras.jfc.ocp.ma:554/cam-jfc02-003', presets: [{id:'p1',name:'Zone stockage',pan:60,tilt:-20,zoom:5}] },
    { id: 'cam-jfc03-001', unitId: 'jfc-03', plantId: 'jorf_lasfar', name: 'CAM-JFC03-PTZ-001', type: 'PTZ', model: 'Hikvision DS-2DE4425IW', status: 'online', streamUrl: 'rtsp://cameras.jfc.ocp.ma:554/cam-jfc03-001', presets: [{id:'p1',name:'Zone engrais',pan:0,tilt:-15,zoom:1}] },
    { id: 'cam-jfc03-002', unitId: 'jfc-03', plantId: 'jorf_lasfar', name: 'CAM-JFC03-FIX-002', type: 'Fixed', model: 'Dahua IPC-HFW5442T', status: 'online', streamUrl: 'rtsp://cameras.jfc.ocp.ma:554/cam-jfc03-002', presets: [] },
    { id: 'cam-jfc03-003', unitId: 'jfc-03', plantId: 'jorf_lasfar', name: 'CAM-JFC03-FIX-003', type: 'Fixed', model: 'Hikvision DS-2CD2T87G2', status: 'online', streamUrl: 'rtsp://cameras.jfc.ocp.ma:554/cam-jfc03-003', presets: [] },
    { id: 'cam-sap01-001', unitId: 'sap-01', plantId: 'safi', name: 'CAM-SAP01-PTZ-001', type: 'PTZ', model: 'Hikvision DS-2DE7A425IW', status: 'online', streamUrl: 'rtsp://cameras.sap.ocp.ma:554/cam-sap01-001', presets: [{id:'p1',name:'Vue ensemble',pan:0,tilt:-20,zoom:1},{id:'p2',name:'Zone granulation',pan:90,tilt:-30,zoom:10}] },
    { id: 'cam-sap01-002', unitId: 'sap-01', plantId: 'safi', name: 'CAM-SAP01-FIX-002', type: 'Fixed', model: 'Dahua IPC-HFW5442T', status: 'online', streamUrl: 'rtsp://cameras.sap.ocp.ma:554/cam-sap01-002', presets: [] }
  ];

  for (const c of cameras) {
    const cam = { ...c, capabilities: { ptz: c.type === 'PTZ', nightVision: true, motionDetection: true }, createdAt: now, updatedAt: now };
    await db.collection('cameras').doc(c.id).set(cam);
  }
  console.log('✅ ' + cameras.length + ' Cameras creees');

  // ═══════════════════════════════════════
  // 5. ALERTS (5 alertes actives)
  // ═══════════════════════════════════════
  const alerts = [
    { id: 'alert-001', sensorId: 'h2s-jfc02-001', unitId: 'jfc-02', plantId: 'jorf_lasfar', type: 'H2S', level: 'warning', message: 'Concentration H2S elevee - 12.5 ppm (seuil TWA: 10 ppm)', value: 12.5, threshold: 10, unit: 'ppm', acknowledged: false, resolved: false, timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 'alert-002', sensorId: 'co2-jfc02-001', unitId: 'jfc-02', plantId: 'jorf_lasfar', type: 'CO2', level: 'critical', message: 'Capteur CO2-JFC02-001 hors ligne - batterie critique 12%', value: 0, threshold: 0, unit: 'ppm', acknowledged: false, resolved: false, timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 'alert-003', sensorId: 'h2s-sap01-001', unitId: 'sap-01', plantId: 'safi', type: 'H2S', level: 'critical', message: 'CRITIQUE: H2S a 18.9 ppm - depassement STEL (15 ppm)', value: 18.9, threshold: 15, unit: 'ppm', acknowledged: false, resolved: false, timestamp: new Date(Date.now() - 1800000).toISOString() },
    { id: 'alert-004', sensorId: 'nh3-sap01-001', unitId: 'sap-01', plantId: 'safi', type: 'NH3', level: 'warning', message: 'NH3 eleve - 28.5 ppm (seuil TWA: 25 ppm)', value: 28.5, threshold: 25, unit: 'ppm', acknowledged: false, resolved: false, timestamp: new Date(Date.now() - 5400000).toISOString() },
    { id: 'alert-005', sensorId: 'o2-sap01-001', unitId: 'sap-01', plantId: 'safi', type: 'O2', level: 'warning', message: 'Niveau O2 bas - 19.2% (seuil minimum: 19.5%)', value: 19.2, threshold: 19.5, unit: '%', acknowledged: false, resolved: false, timestamp: new Date(Date.now() - 9000000).toISOString() }
  ];

  for (const a of alerts) {
    const alert = { ...a, createdAt: now };
    await db.collection('alerts').doc(a.id).set(alert);
  }
  console.log('✅ ' + alerts.length + ' Alertes creees');

  // ═══════════════════════════════════════
  // 6. REPORTS (8 rapports)
  // ═══════════════════════════════════════
  const reports = [
    { id: 'rpt-001', title: 'Rapport Mensuel Janvier 2026 - Jorf Lasfar', type: 'monthly', plantId: 'jorf_lasfar', status: 'completed', format: 'PDF', createdBy: 'Ahmed Benali', createdAt: '2026-02-01T08:00:00Z', period: { start: '2026-01-01', end: '2026-01-31' }, summary: { totalAlerts: 12, criticalAlerts: 2, avgHealthScore: 85, sensorsOnline: 30, sensorsTotal: 30, incidents: 1 } },
    { id: 'rpt-002', title: 'Rapport Hebdomadaire S05 - Jorf Lasfar', type: 'weekly', plantId: 'jorf_lasfar', status: 'completed', format: 'PDF', createdBy: 'Fatima Zahra', createdAt: '2026-02-03T08:00:00Z', period: { start: '2026-01-27', end: '2026-02-02' }, summary: { totalAlerts: 3, criticalAlerts: 0, avgHealthScore: 88, sensorsOnline: 29, sensorsTotal: 30, incidents: 0 } },
    { id: 'rpt-003', title: 'Rapport Inspection Unite JFC-02', type: 'inspection', plantId: 'jorf_lasfar', unitId: 'jfc-02', status: 'completed', format: 'PDF', createdBy: 'Karim Idrissi', createdAt: '2026-01-20T14:00:00Z', period: { start: '2026-01-20', end: '2026-01-20' }, summary: { totalAlerts: 5, criticalAlerts: 1, avgHealthScore: 74, sensorsOnline: 7, sensorsTotal: 8, incidents: 1 } },
    { id: 'rpt-004', title: 'Rapport Mensuel Janvier 2026 - Safi', type: 'monthly', plantId: 'safi', status: 'completed', format: 'PDF', createdBy: 'Youssef Tazi', createdAt: '2026-02-01T09:00:00Z', period: { start: '2026-01-01', end: '2026-01-31' }, summary: { totalAlerts: 18, criticalAlerts: 5, avgHealthScore: 52, sensorsOnline: 5, sensorsTotal: 6, incidents: 3 } },
    { id: 'rpt-005', title: 'Rapport Incident H2S - SAP-01', type: 'incident', plantId: 'safi', unitId: 'sap-01', status: 'completed', format: 'PDF', createdBy: 'Youssef Tazi', createdAt: '2026-01-15T16:30:00Z', period: { start: '2026-01-15', end: '2026-01-15' }, summary: { totalAlerts: 1, criticalAlerts: 1, avgHealthScore: 45, sensorsOnline: 6, sensorsTotal: 6, incidents: 1 } },
    { id: 'rpt-006', title: 'Rapport Calibration Q4 2025', type: 'calibration', plantId: 'jorf_lasfar', status: 'completed', format: 'Excel', createdBy: 'Ahmed Benali', createdAt: '2026-01-10T10:00:00Z', period: { start: '2025-10-01', end: '2025-12-31' }, summary: { totalAlerts: 0, criticalAlerts: 0, avgHealthScore: 90, sensorsOnline: 36, sensorsTotal: 36, incidents: 0 } },
    { id: 'rpt-007', title: 'Rapport Hebdomadaire S06 - Jorf Lasfar', type: 'weekly', plantId: 'jorf_lasfar', status: 'in_progress', format: 'PDF', createdBy: 'Systeme', createdAt: '2026-02-10T08:00:00Z', period: { start: '2026-02-03', end: '2026-02-09' }, summary: { totalAlerts: 4, criticalAlerts: 1, avgHealthScore: 84, sensorsOnline: 28, sensorsTotal: 30, incidents: 0 } },
    { id: 'rpt-008', title: 'Rapport Annuel 2025 - Global OCP', type: 'annual', plantId: 'all', status: 'completed', format: 'PDF', createdBy: 'Direction HSE', createdAt: '2026-01-15T08:00:00Z', period: { start: '2025-01-01', end: '2025-12-31' }, summary: { totalAlerts: 156, criticalAlerts: 12, avgHealthScore: 82, sensorsOnline: 34, sensorsTotal: 36, incidents: 8 } }
  ];

  for (const r of reports) {
    const report = { ...r, updatedAt: now };
    await db.collection('reports').doc(r.id).set(report);
  }
  console.log('✅ ' + reports.length + ' Rapports crees');

  // ═══════════════════════════════════════
  // 7. SENSOR READINGS (historique 24h)
  // ═══════════════════════════════════════
  console.log('📊 Generation historique capteurs (24h)...');
  const keysSensors = ['h2s-jfc01-001', 'co2-jfc01-001', 'h2s-jfc02-001', 'h2s-sap01-001', 'nh3-sap01-001', 'so2-jfc02-001'];
  const baseValues = { 'h2s-jfc01-001': 4.2, 'co2-jfc01-001': 850, 'h2s-jfc02-001': 12.5, 'h2s-sap01-001': 18.9, 'nh3-sap01-001': 28.5, 'so2-jfc02-001': 3.8 };

  let readingCount = 0;
  for (const sId of keysSensors) {
    const base = baseValues[sId];
    for (let h = 23; h >= 0; h--) {
      for (let m = 0; m < 60; m += 15) {
        const ts = new Date(Date.now() - h * 3600000 - m * 60000);
        const variation = (Math.random() - 0.5) * base * 0.2;
        const value = Math.max(0, +(base + variation).toFixed(2));
        await db.collection('sensors').doc(sId).collection('readings').add({
          value: value,
          timestamp: ts.toISOString(),
          sensorId: sId
        });
        readingCount++;
      }
    }
  }
  console.log('✅ ' + readingCount + ' Readings crees');

  // ═══════════════════════════════════════
  // RESUME
  // ═══════════════════════════════════════
  console.log('\n========================================');
  console.log('🎉 Seed termine avec succes !');
  console.log('   Plants:   2');
  console.log('   Unites:   4');
  console.log('   Capteurs: ' + sensorDefs.length);
  console.log('   Cameras:  ' + cameras.length);
  console.log('   Alertes:  ' + alerts.length);
  console.log('   Rapports: ' + reports.length);
  console.log('   Readings: ' + readingCount);
  console.log('========================================\n');
}

seedAll().catch(err => { console.error('Erreur:', err.message); process.exit(1); });
