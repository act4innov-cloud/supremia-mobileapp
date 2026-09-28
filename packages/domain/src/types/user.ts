/**
 * Rôles, profils utilisateurs et permissions.
 *
 * Ce fichier est du TypeScript pur : il ne dépend ni de React, ni d'Expo, ni
 * du MQTT. C'est volontaire — le cœur de domaine est consommé à l'identique
 * par l'application Android et par la plateforme web, qui n'ont ni le même SDK
 * ni les mêmes dépendances.
 *
 * Origine : règles écrites sur la branche `develop`. Elles sont maintenant la
 * source de vérité unique, partagées par les deux cibles.
 */

/** Rôle applicatif. L'ordre reflète la hiérarchie, du plus large au plus étroit. */
export type UserRole = 'admin' | 'supervisor' | 'operator' | 'viewer';

/** Mode d'authentification d'un profil. */
export type AuthProvider = 'google' | 'email';

/** Toutes les permissions, regroupées par domaine fonctionnel. */
export interface RolePermissions {
  dashboard: { view: boolean; customize: boolean };
  sensors: { view: boolean; configure: boolean; calibrate: boolean };
  cameras: { view: boolean; control: boolean; record: boolean };
  reporting: { view: boolean; create: boolean; export: boolean };
  admin: {
    manageUnits: boolean;
    manageSensors: boolean;
    manageCameras: boolean;
    manageUsers: boolean;
    manageSettings: boolean;
  };
  alerts: { view: boolean; acknowledge: boolean; configure: boolean };
}

/** Catégories de permissions, telles qu'attendues par `hasPermission`. */
export type PermissionCategory = keyof RolePermissions;

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    dashboard: { view: true, customize: true },
    sensors: { view: true, configure: true, calibrate: true },
    cameras: { view: true, control: true, record: true },
    reporting: { view: true, create: true, export: true },
    admin: {
      manageUnits: true,
      manageSensors: true,
      manageCameras: true,
      manageUsers: true,
      manageSettings: true,
    },
    alerts: { view: true, acknowledge: true, configure: true },
  },
  supervisor: {
    dashboard: { view: true, customize: true },
    sensors: { view: true, configure: true, calibrate: false },
    cameras: { view: true, control: true, record: true },
    reporting: { view: true, create: true, export: true },
    admin: {
      // Le superviseur pilote les capteurs du site, mais ne gère ni les
      // comptes ni les paramètres de la plateforme.
      manageUnits: false,
      manageSensors: true,
      manageCameras: false,
      manageUsers: false,
      manageSettings: false,
    },
    alerts: { view: true, acknowledge: true, configure: true },
  },
  operator: {
    dashboard: { view: true, customize: false },
    sensors: { view: true, configure: false, calibrate: false },
    cameras: { view: true, control: true, record: false },
    reporting: { view: true, create: false, export: false },
    admin: {
      manageUnits: false,
      manageSensors: false,
      manageCameras: false,
      manageUsers: false,
      manageSettings: false,
    },
    alerts: { view: true, acknowledge: true, configure: false },
  },
  viewer: {
    dashboard: { view: true, customize: false },
    sensors: { view: true, configure: false, calibrate: false },
    cameras: { view: true, control: false, record: false },
    reporting: { view: true, create: false, export: false },
    admin: {
      manageUnits: false,
      manageSensors: false,
      manageCameras: false,
      manageUsers: false,
      manageSettings: false,
    },
    alerts: { view: true, acknowledge: false, configure: false },
  },
};

/** Profil applicatif, tel que stocké côté plateforme. */
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  /** Site auquel l'utilisateur est rattaché. */
  plantId: string;
  /** Unités de production accessibles. Une liste vide = accès au site entier. */
  unitIds: string[];
  phone?: string;
  department: string;
  title: string;
  authProvider: AuthProvider;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}
