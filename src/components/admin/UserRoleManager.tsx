import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Surface, Chip, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserProfile, UserRole } from '@/types/user.types';

interface Props { users: UserProfile[]; onChangeRole?: (uid: string, role: UserRole) => void; onToggleActive?: (uid: string) => void; }

const ROLE_COLORS: Record<UserRole, string> = { admin: '#F44336', supervisor: '#FF9800', operator: '#2196F3', viewer: '#9E9E9E' };

export default function UserRoleManager({ users, onChangeRole, onToggleActive }: Props) {
  return (
    <View style={s.w}>
      <Text variant="titleMedium" style={s.t}>Gestion des utilisateurs</Text>
      {users.map(u => (
        <Surface key={u.uid} style={s.card} elevation={1}>
          <View style={s.row}>
            <MaterialCommunityIcons name="account" size={24} color="#aaa" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={s.name}>{u.displayName}</Text>
              <Text style={s.email}>{u.email}</Text>
            </View>
            <Chip compact style={{ backgroundColor: ROLE_COLORS[u.role] + '33' }}>
              <Text style={{ color: ROLE_COLORS[u.role], fontSize: 10 }}>{u.role}</Text>
            </Chip>
            {onToggleActive && <IconButton icon={u.isActive ? 'account-check' : 'account-off'} iconColor={u.isActive ? '#4CAF50' : '#F44336'} size={20} onPress={() => onToggleActive(u.uid)} />}
          </View>
        </Surface>
      ))}
    </View>
  );
}
const s = StyleSheet.create({ w: { padding: 16 }, t: { color: '#fff', fontWeight: 'bold', marginBottom: 12 }, card: { backgroundColor: '#16213e', borderRadius: 10, padding: 12, marginBottom: 8 }, row: { flexDirection: 'row', alignItems: 'center' }, name: { color: '#fff', fontWeight: 'bold' }, email: { color: '#888', fontSize: 12 } });