import { UserRole, ROLE_PERMISSIONS, RolePermissions } from '@/types/user.types';

export function hasPermission(role: UserRole, category: keyof RolePermissions, action: string): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  const cat = perms[category] as Record<string, boolean>;
  return cat?.[action] === true;
}

export function isAdmin(role: UserRole): boolean { return role === 'admin'; }
export function isSupervisor(role: UserRole): boolean { return role === 'admin' || role === 'supervisor'; }
export function canManage(role: UserRole): boolean { return role === 'admin' || role === 'supervisor'; }
export function canAcknowledgeAlerts(role: UserRole): boolean { return role !== 'viewer'; }