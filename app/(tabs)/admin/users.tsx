// ============================================================
// SUPREMIA Platform - Admin: Gestion des Utilisateurs
// ============================================================

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Text, Card, Searchbar, Chip, IconButton, Menu, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { UserProfile, UserRole } from '@/types/user.types';

const ROLE_COLORS: Record<UserRole, string> = { admin: '#F44336', supervisor: '#FF9800', operator: '#2196F3', viewer: '#9E9E9E' };
const ROLE_LABELS: Record<UserRole, string> = { admin: 'Administrateur', supervisor: 'Superviseur', operator: 'Opérateur', viewer: 'Lecteur' };

const MOCK_USERS: Partial<UserProfile>[] = [
  { uid: 'u1', displayName: 'Ahmed Benali', email: 'a.benali@ocp.ma', role: 'admin', department: 'Sécurité HSE', title: 'Responsable HSE', isActive: true, lastLoginAt: '2025-12-20T14:30:00Z', authProvider: 'google' },
  { uid: 'u2', displayName: 'Fatima Zahra El Idrissi', email: 'f.zahra@ocp.ma', role: 'supervisor', department: 'Production', title: 'Chef d\'unité', isActive: true, lastLoginAt: '2025-12-20T09:15:00Z', authProvider: 'email' },
  { uid: 'u3', displayName: 'Karim Tazi', email: 'k.tazi@ocp.ma', role: 'operator', department: 'Maintenance', title: 'Technicien', isActive: true, lastLoginAt: '2025-12-19T16:45:00Z', authProvider: 'email' },
  { uid: 'u4', displayName: 'Nadia Amrani', email: 'n.amrani@ocp.ma', role: 'operator', department: 'Instrumentation', title: 'Technicienne', isActive: true, lastLoginAt: '2025-12-18T11:20:00Z', authProvider: 'google' },
  { uid: 'u5', displayName: 'Youssef Bennani', email: 'y.bennani@ocp.ma', role: 'viewer', department: 'Direction', title: 'Directeur adjoint', isActive: true, lastLoginAt: '2025-12-15T08:00:00Z', authProvider: 'google' },
  { uid: 'u6', displayName: 'Mohammed Fikri', email: 'm.fikri@ocp.ma', role: 'operator', department: 'Maintenance', title: 'Technicien Électrique', isActive: false, lastLoginAt: '2025-11-01T10:00:00Z', authProvider: 'email' },
];

export default function AdminUsersScreen() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const filtered = users.filter(u =>
    (u.displayName || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.department || '').toLowerCase().includes(search.toLowerCase())
  );

  const changeRole = (uid: string, role: UserRole) => {
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role } : u));
    setMenuVisible(null);
  };

  const toggleActive = (uid: string) => {
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, isActive: !u.isActive } : u));
  };

  const roleCounts = { admin: users.filter(u => u.role === 'admin').length, supervisor: users.filter(u => u.role === 'supervisor').length, operator: users.filter(u => u.role === 'operator').length, viewer: users.filter(u => u.role === 'viewer').length };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Gestion des Utilisateurs', headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff' }} />
      <View style={s.container}>
        <Searchbar placeholder="Rechercher un utilisateur..." value={search} onChangeText={setSearch} style={s.search} inputStyle={{ color: '#fff' }} iconColor="#aaa" placeholderTextColor="#666" />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.statsRow}>
          {(Object.keys(roleCounts) as UserRole[]).map(role => (
            <Chip key={role} style={[s.statChip, { borderColor: ROLE_COLORS[role], borderWidth: 1 }]}>
              <Text style={{ color: ROLE_COLORS[role], fontSize: 11 }}>{ROLE_LABELS[role]}: {roleCounts[role]}</Text>
            </Chip>
          ))}
          <Chip style={s.statChip}><Text style={{ color: '#aaa', fontSize: 11 }}>Total: {users.length}</Text></Chip>
        </ScrollView>

        <ScrollView style={s.scroll}>
          {filtered.map(user => (
            <Card key={user.uid} style={[s.card, !user.isActive && s.inactiveCard]}>
              <Card.Content>
                <View style={s.userRow}>
                  <View style={s.avatar}>
                    <Text style={s.avatarTxt}>{(user.displayName || '?')[0].toUpperCase()}</Text>
                  </View>

                  <View style={s.userInfo}>
                    <View style={s.nameRow}>
                      <Text variant="titleSmall" style={[s.userName, !user.isActive && { opacity: 0.5 }]}>{user.displayName}</Text>
                      {!user.isActive && <Chip compact style={s.inactiveChip}><Text style={s.inactiveTxt}>Désactivé</Text></Chip>}
                    </View>
                    <Text style={s.email}>{user.email}</Text>
                    <Text style={s.dept}>{user.title} · {user.department}</Text>
                    <View style={s.metaRow}>
                      <MaterialCommunityIcons name={user.authProvider === 'google' ? 'google' : 'email'} size={12} color="#666" />
                      <Text style={s.metaTxt}>{user.authProvider === 'google' ? 'Google' : 'Email'}</Text>
                      <Text style={s.metaTxt}> · Dernière connexion: {new Date(user.lastLoginAt || '').toLocaleDateString('fr-FR')}</Text>
                    </View>
                  </View>

                  <View style={s.userActions}>
                    <Menu
                      visible={menuVisible === user.uid}
                      onDismiss={() => setMenuVisible(null)}
                      anchor={
                        <Chip compact style={{ backgroundColor: ROLE_COLORS[user.role || 'viewer'] + '33' }} onPress={() => setMenuVisible(user.uid)}>
                          <Text style={{ color: ROLE_COLORS[user.role || 'viewer'], fontSize: 10 }}>{ROLE_LABELS[user.role || 'viewer']} ▾</Text>
                        </Chip>
                      }
                    >
                      {(Object.keys(ROLE_LABELS) as UserRole[]).map(role => (
                        <Menu.Item key={role} title={ROLE_LABELS[role]} onPress={() => changeRole(user.uid!, role)} leadingIcon={user.role === role ? 'check' : undefined} />
                      ))}
                    </Menu>
                    <IconButton
                      icon={user.isActive ? 'account-check' : 'account-off'}
                      iconColor={user.isActive ? '#4CAF50' : '#F44336'}
                      size={20}
                      onPress={() => toggleActive(user.uid!)}
                    />
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
          {filtered.length === 0 && <View style={s.empty}><Text style={s.emptyTxt}>Aucun utilisateur trouvé</Text></View>}
        </ScrollView>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  search: { margin: 12, backgroundColor: '#16213e', borderRadius: 12 },
  statsRow: { paddingHorizontal: 12, gap: 8, marginBottom: 8, height: 36 },
  statChip: { backgroundColor: '#16213e' },
  scroll: { flex: 1, paddingHorizontal: 8 },
  card: { backgroundColor: '#16213e', borderRadius: 12, marginBottom: 8, marginHorizontal: 4 },
  inactiveCard: { opacity: 0.7 },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0f3460', justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { color: '#e94560', fontWeight: 'bold', fontSize: 18 },
  userInfo: { flex: 1, marginLeft: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  userName: { color: '#fff', fontWeight: 'bold' },
  inactiveChip: { backgroundColor: '#F4433622', height: 18 }, inactiveTxt: { color: '#F44336', fontSize: 9 },
  email: { color: '#888', fontSize: 12 },
  dept: { color: '#666', fontSize: 11, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  metaTxt: { color: '#555', fontSize: 10 },
  userActions: { alignItems: 'flex-end', gap: 4 },
  empty: { alignItems: 'center', paddingTop: 60 }, emptyTxt: { color: '#555' },
});