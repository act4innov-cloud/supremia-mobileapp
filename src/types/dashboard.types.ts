// ============================================================
// SUPREMIA Platform - Dashboard & Report Type Definitions
// ============================================================

// --- Dashboard Types ---

export type WidgetType =
  | 'health_gauge'
  | 'gas_level'
  | 'sensor_chart'
  | 'alerts_list'
  | 'unit_status'
  | 'camera_feed'
  | 'plant_map'
  | 'statistics';

export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  position: { row: number; col: number };
  config: Record<string, unknown>;
  unitId?: string;
  sensorIds?: string[];
  cameraId?: string;
  refreshInterval: number; // seconds
}

export interface DashboardLayout {
  id: string;
  name: string;
  userId: string;
  isDefault: boolean;
  widgets: DashboardWidget[];
  columns: number;
  theme: 'light' | 'dark' | 'system';
  createdAt: string;
  updatedAt: string;
}

// --- Report Types ---

export type ReportType = 'daily' | 'weekly' | 'monthly' | 'custom' | 'incident';

export type ReportStatus = 'draft' | 'generated' | 'reviewed' | 'archived';

export type ExportFormat = 'pdf' | 'xlsx' | 'csv';

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  status: ReportStatus;
  plantId: string;
  unitIds: string[];
  dateRange: {
    start: string;
    end: string;
  };
  generatedBy: string;
  generatedAt: string;
  fileUrl?: string;
  format: ExportFormat;
  summary: {
    totalAlerts: number;
    criticalEvents: number;
    averageHealthScore: number;
    sensorUptime: number; // percentage
    complianceScore: number;
  };
  sections: ReportSection[];
  createdAt: string;
}

export interface ReportSection {
  title: string;
  type: 'summary' | 'chart' | 'table' | 'text';
  data: Record<string, unknown>;
}

export interface ArchiveEntry {
  id: string;
  reportId: string;
  title: string;
  type: ReportType;
  dateRange: { start: string; end: string };
  fileUrl: string;
  fileSize: number;
  format: ExportFormat;
  archivedAt: string;
  archivedBy: string;
  tags: string[];
}