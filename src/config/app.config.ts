export const APP_CONFIG = {
  name: 'SUPREMIA',
  version: '1.0.0',
  description: 'Plateforme de monitoring industriel IoT pour OCP Morocco',
  developer: 'ACT4INNOV',
  compliance: 'ISO 45001',
  plants: {
    jorfLasfar: { id: 'jorf_lasfar', name: 'Jorf Lasfar', code: 'JFC' },
    safi: { id: 'safi', name: 'Safi', code: 'SAP' },
  },
  theme: {
    primary: '#e94560',
    secondary: '#0f3460',
    background: '#1a1a2e',
    surface: '#16213e',
    text: '#e0e0e0',
    accent: '#e94560',
  },
  refreshIntervals: {
    dashboard: 30000,
    sensors: 5000,
    cameras: 10000,
    alerts: 15000,
  },
  roles: ['admin', 'supervisor', 'operator', 'viewer'] as const,
} as const;

export type UserRole = typeof APP_CONFIG.roles[number];
export default APP_CONFIG;