// ============================================================
// SUPREMIA Platform - Archives Screen
// ============================================================

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Surface, Searchbar, Chip, IconButton, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import ExportButton from '@/components/reporting/ExportButton';
import { ArchiveEntry, ExportFormat } from '@/types/dashboard.types';

// Mock data - Replace with Firestore queries
const MOCK_ARCHIVES: ArchiveEntry[] = [
  {
    id: 'arch-001',
    reportId: 'rpt-001',
    title: 'Rapport mensuel - Janvier 2026',
    type: 'monthly',
    dateRange: { start: '2026-01-01', end: '2026-01-31' },
    plantId: 'jorf_lasfar',
    format: 'pdf',
    fileSize: 2450000,
    downloadUrl: '#',
    archivedAt: '2026-02-01T08:00:00Z',
    archivedBy: 'admin',
  },
  {
    id: 'arch-002',
    reportId: 'rpt-002',
    title: 'Rapport hebdomadaire - S04 2026',
    type: 'weekly',
    dateRange: { start: '2026-01-20', end: '2026-01-26' },
    plantId: 'jorf_lasfar',
    format: 'xlsx',
    fileSize: 1800000,
    downloadUrl: '#',
    archivedAt: '2026-01-27T08:00:00Z',
    archivedBy: 'admin',
  },
  {
    id: 'arch-003',
    reportId: 'rpt-003',
    title: 'Incident H₂S - Ligne PAP 3',
    type: 'incident',
    dateRange: { start: '2026-01-15', end: '2026-01-15' },
    plantId: 'jorf_lasfar',
    format: 'pdf',
    fileSize: 3200000,
    downloadUrl: '#',
    archivedAt: '2026-01-16T10:30:00Z',
    archivedBy: 'supervisor',
  },
];

const TYPE_ICONS: Record<string, { icon: string; color: string }> = {
  daily: { icon: 'calendar-today', color: '#2196F3' },
  weekly: { icon: 'calendar-week', color: '#4CAF50' },
  monthly: { icon: 'calendar-month', color: '#FF9800' },
  incident: { icon: 'alert-circle', color: '#F44336' },
  custom: { icon: 'calendar-range', color: '#AB47BC' },
};

export default function ArchiveScreen() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [archives] = useState<ArchiveEntry[]>(MOCK_ARCHIVES);

  const filtered = archives.filter((a) => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || a.type === filterType;
    return matchSearch && matchType;
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownload = useCallback((archive: ArchiveEntry) => {
    // TODO: Implement file download via expo-sharing
    console.log('Download:', archive.title);
  }, []);

  const handleExport = useCallback((archive: ArchiveEntry, format: ExportFormat) => {
    console.log('Export:', archive.title, 'as', format);
  }, []);

  const renderArchive = ({ item }: { item: ArchiveEntry }) => {
    const typeInfo = TYPE_ICONS[item.type] || TYPE_ICONS.custom;
    return (
      <Surface style={styles.archiveCard} elevation={1}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons
            name={typeInfo.icon as any}
            size={28}
            color={typeInfo.color}
          />
          <View style={styles.cardInfo}>
            <Text variant="titleSmall" style={styles.cardTitle}>
              {item.title}
            </Text>
            <Text variant="bodySmall" style={styles.cardDate}>
              {item.dateRange.start} → {item.dateRange.end}
            </Text>
          </View>
          <View style={styles.cardMeta}>
            <Chip compact style={styles.formatChip}>
              <Text style={styles.formatText}>{item.format.toUpperCase()}</Text>
            </Chip>
            <Text style={styles.fileSize}>{formatFileSize(item.fileSize)}</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.cardActions}>
          <Text style={styles.archivedAt}>
            Archivé le {new Date(item.archivedAt).toLocaleDateString('fr-FR')}
          </Text>
          <View style={styles.actionButtons}>
            <IconButton
              icon="download"
              iconColor="#2196F3"
              size={20}
              onPress={() => handleDownload(item)}
            />
            <IconButton
              icon="share-variant"
              iconColor="#aaa"
              size={20}
              onPress={() => handleExport(item, item.format as ExportFormat)}
            />
          </View>
        </View>
      </Surface>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <Searchbar
        placeholder="Rechercher dans les archives..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchbar}
        inputStyle={styles.searchInput}
        iconColor="#aaa"
        placeholderTextColor="#666"
      />

      {/* Type Filters */}
      <View style={styles.filters}>
        {Object.entries(TYPE_ICONS).map(([type, info]) => (
          <Chip
            key={type}
            selected={filterType === type}
            onPress={() => setFilterType(filterType === type ? null : type)}
            style={[
              styles.filterChip,
              filterType === type && { backgroundColor: info.color + '33' },
            ]}
            textStyle={{
              color: filterType === type ? info.color : '#aaa',
              fontSize: 12,
            }}
            icon={() => (
              <MaterialCommunityIcons
                name={info.icon as any}
                size={14}
                color={filterType === type ? info.color : '#666'}
              />
            )}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Chip>
        ))}
      </View>

      {/* Archive Count */}
      <Text style={styles.count}>{filtered.length} archive(s)</Text>

      {/* Archives List */}
      <FlatList
        data={filtered}
        renderItem={renderArchive}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="archive-off" size={48} color="#333" />
            <Text style={styles.emptyText}>Aucune archive trouvée</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  searchbar: {
    margin: 12,
    backgroundColor: '#16213e',
    borderRadius: 10,
  },
  searchInput: { color: '#fff' },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: '#16213e',
  },
  count: {
    color: '#666',
    fontSize: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  list: { padding: 12 },
  archiveCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: { color: '#fff', fontWeight: 'bold' },
  cardDate: { color: '#888', marginTop: 2 },
  cardMeta: { alignItems: 'flex-end' },
  formatChip: { backgroundColor: '#0f3460' },
  formatText: { color: '#aaa', fontSize: 10 },
  fileSize: { color: '#666', fontSize: 11, marginTop: 4 },
  divider: { backgroundColor: '#0f3460', marginVertical: 10 },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  archivedAt: { color: '#666', fontSize: 11 },
  actionButtons: { flexDirection: 'row' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: '#666', marginTop: 12 },
});