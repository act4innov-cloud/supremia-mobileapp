/**
 * Rapports, sections et archives.
 *
 * Un rapport est un document figé : il porte son propre résumé statistique,
 * de sorte que l'archive reste lisible même si les capteurs qui l'ont produit
 * sont supprimés ou re-calibrés ensuite. C'est la raison d'être du champ
 * `summary`, qui duplique des valeurs par ailleurs calculées en direct.
 */

export type ReportType = 'daily' | 'weekly' | 'monthly' | 'custom' | 'incident';

export type ReportStatus = 'draft' | 'generated' | 'reviewed' | 'archived';

export type ExportFormat = 'pdf' | 'xlsx' | 'csv';

export interface DateRange {
  /** ISO 8601. */
  start: string;
  /** ISO 8601. */
  end: string;
}

export interface ReportSection {
  title: string;
  type: 'summary' | 'chart' | 'table' | 'text';
  data: Record<string, unknown>;
}

export interface ReportSummary {
  totalAlerts: number;
  criticalEvents: number;
  /** 0-100. */
  averageHealthScore: number;
  /** Pourcentage de disponibilité des capteurs sur la période. */
  sensorUptime: number;
  /** 0-100. */
  complianceScore: number;
}

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  status: ReportStatus;
  plantId: string;
  unitIds: string[];
  dateRange: DateRange;
  generatedBy: string;
  generatedAt: string;
  fileUrl?: string;
  format: ExportFormat;
  summary: ReportSummary;
  sections: ReportSection[];
  createdAt: string;
}

export interface ArchiveEntry {
  id: string;
  reportId: string;
  title: string;
  type: ReportType;
  dateRange: DateRange;
  fileUrl: string;
  /** En octets. */
  fileSize: number;
  format: ExportFormat;
  archivedAt: string;
  archivedBy: string;
  tags: string[];
}
