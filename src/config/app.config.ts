// ============================================================
// SUPREMIA Platform - App Configuration Constants
// ============================================================

export const APP_CONFIG = {
    name: 'SUPREMIA Platform',
    version: '1.0.0',
    company: 'OCP Morocco',
    developer: 'ACT4INNOV',
  
    // Plants
    plants: {
      JORF_LASFAR: 'jorf_lasfar',
      SAFI: 'safi',
    } as const,
  
    // Default settings
    defaults: {
      plantId: 'jorf_lasfar',
      language: 'fr',
      theme: 'dark' as const,
      dashboardRefreshInterval: 5000,   // ms
      sensorHistoryDays: 30,
      maxAlertsInMemory: 500,
      chartDataPoints: 60,
    },
  
    // Pagination
    pagination: {
      sensorsPerPage: 20,
      reportsPerPage: 15,
      alertsPerPage: 25,
      usersPerPage: 20,
    },
  
    // Timeouts
    timeouts: {
      apiRequest: 15000,    // 15s
      mqttConnect: 30000,   // 30s
      mqttReconnect: 5000,  // 5s
      sensorOffline: 120000, // 2min without data = offline
    },
  
    // Notifications
    notifications: {
      channels: {
        CRITICAL_ALERT: 'critical-alerts',
        WARNING_ALERT: 'warning-alerts',
        SYSTEM: 'system-notifications',
      },
    },
  
    // File export
    export: {
      maxReportSizeMB: 50,
      supportedFormats: ['pdf', 'xlsx', 'csv'] as const,
    },
  } as const;
  
  export const PLANT_NAMES: Record<string, string> = {
    jorf_lasfar: 'Jorf Lasfar',
    safi: 'Safi',
  };
  
  export const LANGUAGES = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
  ] as const;
  
  export default APP_CONFIG;