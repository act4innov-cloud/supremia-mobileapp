// ============================================================
// SUPREMIA Platform - User & Role Type Definitions
// ============================================================

export type UserRole = 'admin' | 'supervisor' | 'operator' | 'viewer';

export type AuthProvider = 'google' | 'email';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  plantId: string;          // Assigned plant
  unitIds: string[];        // Accessible units
  phone?: string;
  department: string;
  title: string;
  authProvider: AuthProvider;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

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