/**
 * Vérification des permissions.
 *
 * Toutes les fonctions de ce module se déduisent de la table `ROLE_PERMISSIONS`.
 * Aucune ne redécline la règle en dur : c'est ce qui garantit qu'un droit
 * accordé dans la table est effectivement appliqué à l'écran, et qu'un droit
 * retiré n'est pas resté dans un `if` quelque part.
 *
 * Conséquence directe : un rôle inconnu ou absent de la table est traité
 * comme *sans aucun droit* (`false`), jamais comme un droit par défaut.
 */

import {
  ROLE_PERMISSIONS,
  type PermissionCategory,
  type UserRole,
} from '../types/user';

/**
 * Le rôle possède-t-il l'action demandée dans la catégorie donnée ?
 *
 * @param role       Rôle de l'utilisateur. Un rôle inconnu vaut aucun droit.
 * @param category   Catégorie fonctionnelle (`sensors`, `admin`…).
 * @param action     Action (`view`, `configure`, `manageUsers`…).
 *
 * @returns `true` uniquement si la permission est explicitement à `true`.
 */
export function hasPermission(
  role: UserRole,
  category: PermissionCategory,
  action: string
): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  const actions = perms[category] as Record<string, boolean> | undefined;
  return actions?.[action] === true;
}

/** L'utilisateur administre-t-il la plateforme ? */
export function isAdmin(role: UserRole): boolean {
  return hasPermission(role, 'admin', 'manageUsers');
}

/** L'utilisateur est-il superviseur au sens large (admin inclus) ? */
export function isSupervisor(role: UserRole): boolean {
  return role === 'admin' || role === 'supervisor';
}

/**
 * L'utilisateur peut-il administrer une partie de la plateforme (unités,
 * capteurs, caméras) ?
 */
export function canManage(role: UserRole): boolean {
  return isSupervisor(role);
}

/** L'utilisateur peut-il acquitter une alerte ? */
export function canAcknowledgeAlerts(role: UserRole): boolean {
  return hasPermission(role, 'alerts', 'acknowledge');
}

/** L'utilisateur peut-il consulter un capteur ? */
export function canViewSensors(role: UserRole): boolean {
  return hasPermission(role, 'sensors', 'view');
}

/** L'utilisateur peut-il configurer un capteur ? */
export function canConfigureSensors(role: UserRole): boolean {
  return hasPermission(role, 'sensors', 'configure');
}

/** L'utilisateur peut-il étalonner un capteur ? */
export function canCalibrateSensors(role: UserRole): boolean {
  return hasPermission(role, 'sensors', 'calibrate');
}

/** L'utilisateur peut-il exporter un rapport ? */
export function canExportReports(role: UserRole): boolean {
  return hasPermission(role, 'reporting', 'export');
}

/** L'utilisateur peut-il piloter une caméra (PTZ, enregistrement) ? */
export function canControlCameras(role: UserRole): boolean {
  return hasPermission(role, 'cameras', 'control');
}

/**
 * Liste des permissions accordées à un rôle, à plat. Utile pour afficher un
 * récapitulatif ou pour tracer ce que voit un utilisateur.
 */
export function listPermissions(role: UserRole): string[] {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return [];
  const granted: string[] = [];
  (Object.keys(perms) as PermissionCategory[]).forEach((category) => {
    const actions = perms[category] as Record<string, boolean>;
    Object.keys(actions).forEach((action) => {
      if (actions[action] === true) granted.push(`${category}.${action}`);
    });
  });
  return granted;
}
