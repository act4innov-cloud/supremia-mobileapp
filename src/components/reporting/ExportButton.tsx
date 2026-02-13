import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { ExportFormat } from '@/types/dashboard.types';

interface Props { format: ExportFormat; onExport: (format: ExportFormat) => void; loading?: boolean; }

const FORMAT_CONFIG: Record<ExportFormat, { icon: string; label: string; color: string }> = {
  pdf: { icon: 'file-pdf-box', label: 'Export PDF', color: '#F44336' },
  xlsx: { icon: 'microsoft-excel', label: 'Export Excel', color: '#4CAF50' },
  csv: { icon: 'file-delimited', label: 'Export CSV', color: '#2196F3' },
};

export default function ExportButton({ format, onExport, loading = false }: Props) {
  const cfg = FORMAT_CONFIG[format];
  return (
    <Button mode="outlined" icon={cfg.icon} onPress={() => onExport(format)} loading={loading} textColor={cfg.color} style={[s.btn, { borderColor: cfg.color }]} compact>
      {cfg.label}
    </Button>
  );
}
const s = StyleSheet.create({ btn: { borderRadius: 8, marginRight: 8 } });