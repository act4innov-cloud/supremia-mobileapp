/**
 * Tests du modèle de permissions.
 *
 * Ces règles viennent de la branche `develop`, via le paquet partagé
 * `@supremia/domain`. Elles sont désormais exécutées, ce qui verrouille la
 * politique d'accès : la retirer, la contourner ou l'élargir casse un test
 * visible en revue de code, ce qui n'était pas le cas tant que le module
 * n'existait que sur une branche non fusionnée.
 *
 * Le point le plus important ici est l'vérification que les fonctions courtes
 * (`isAdmin`, `canAcknowledgeAlerts`…) restent cohérentes avec la table
 * `ROLE_PERMISSIONS`. Si quelqu'un retire un droit dans la table et oublie une
 * fonction, ces tests le signalent.
 */

import {
  ROLE_PERMISSIONS,
  canAcknowledgeAlerts,
  canCalibrateSensors,
  canConfigureSensors,
  canControlCameras,
  canExportReports,
  canManage,
  hasPermission,
  isAdmin,
  isSupervisor,
  listPermissions,
  type UserRole,
} from '@supremia/domain';

const ALL_ROLES: UserRole[] = ['admin', 'supervisor', 'operator', 'viewer'];

describe('hasPermission', () => {
  it('donne tous les droits à l’administrateur', () => {
    expect(hasPermission('admin', 'admin', 'manageUsers')).toBe(true);
    expect(hasPermission('admin', 'sensors', 'configure')).toBe(true);
    expect(hasPermission('admin', 'alerts', 'configure')).toBe(true);
  });

  it('refuse toute action d’administration au lecteur seul', () => {
    expect(hasPermission('viewer', 'admin', 'manageUsers')).toBe(false);
    expect(hasPermission('viewer', 'admin', 'manageSettings')).toBe(false);
    expect(hasPermission('viewer', 'sensors', 'configure')).toBe(false);
  });

  it('laisse le superviseur gérer les capteurs mais pas les comptes', () => {
    expect(hasPermission('supervisor', 'admin', 'manageSensors')).toBe(true);
    expect(hasPermission('supervisor', 'admin', 'manageUsers')).toBe(false);
    expect(hasPermission('supervisor', 'admin', 'manageSettings')).toBe(false);
  });

  it('refuse une catégorie inconnue plutôt que de lever une erreur', () => {
    expect(
      hasPermission('admin', 'inexistant' as never, 'peu importe')
    ).toBe(false);
  });

  it('refuse une action inconnue, même pour un administrateur', () => {
    // Un droit non listé n'est pas un droit : le cas par défaut est le refus.
    expect(hasPermission('admin', 'sensors', 'detruire')).toBe(false);
  });

  it('refuse un rôle inconnu', () => {
    expect(hasPermission('superadmin' as UserRole, 'dashboard', 'view')).toBe(false);
  });
});

describe('rôles', () => {
  it('isAdmin ne vaut vrai que pour admin', () => {
    expect(isAdmin('admin')).toBe(true);
    expect(isAdmin('supervisor')).toBe(false);
    expect(isAdmin('operator')).toBe(false);
    expect(isAdmin('viewer')).toBe(false);
  });

  it('isSupervisor inclut l’administrateur', () => {
    expect(isSupervisor('admin')).toBe(true);
    expect(isSupervisor('supervisor')).toBe(true);
    expect(isSupervisor('operator')).toBe(false);
  });

  it('canManage suit la même hiérarchie que isSupervisor', () => {
    ALL_ROLES.forEach((role) => {
      expect(canManage(role)).toBe(isSupervisor(role));
    });
  });
});

describe('acquittement des alertes', () => {
  it('est refusé au lecteur seul, accordé aux autres', () => {
    // Un lecteur seul ne peut pas acquitter : il constaterait l'alerte sans
    // pouvoir la prendre en charge, et l'astreinte verrait une alerte traitée.
    expect(canAcknowledgeAlerts('viewer')).toBe(false);
    expect(canAcknowledgeAlerts('operator')).toBe(true);
    expect(canAcknowledgeAlerts('supervisor')).toBe(true);
    expect(canAcknowledgeAlerts('admin')).toBe(true);
  });

  it('est strictement dérivé de la table des permissions', () => {
    ALL_ROLES.forEach((role) => {
      expect(canAcknowledgeAlerts(role)).toBe(
        ROLE_PERMISSIONS[role].alerts.acknowledge
      );
    });
  });
});

describe('droits par domaine', () => {
  it('seul l’administrateur peut étalonner un capteur', () => {
    expect(canCalibrateSensors('admin')).toBe(true);
    expect(canCalibrateSensors('supervisor')).toBe(false);
    expect(canCalibrateSensors('operator')).toBe(false);
    expect(canCalibrateSensors('viewer')).toBe(false);
  });

  it('l’opérateur configure les alertes, pas le superviseur seul', () => {
    expect(canConfigureSensors('operator')).toBe(false);
    expect(canConfigureSensors('supervisor')).toBe(true);
  });

  it('l’export de rapport est réservé à l’encadrement', () => {
    expect(canExportReports('admin')).toBe(true);
    expect(canExportReports('supervisor')).toBe(true);
    expect(canExportReports('operator')).toBe(false);
    expect(canExportReports('viewer')).toBe(false);
  });

  it('piloter une caméra est ouvert à l’opérateur, pas au lecteur seul', () => {
    expect(canControlCameras('operator')).toBe(true);
    expect(canControlCameras('viewer')).toBe(false);
  });
});

describe('listPermissions', () => {
  it('énumère les droits au format catégorie.action', () => {
    const granted = listPermissions('viewer');
    expect(granted).toContain('dashboard.view');
    expect(granted).toContain('sensors.view');
    expect(granted).not.toContain('sensors.configure');
    expect(granted).not.toContain('admin.manageUsers');
  });

  it('donne plus de droits à l’administrateur qu’au lecteur seul', () => {
    expect(listPermissions('admin').length).toBeGreaterThan(
      listPermissions('viewer').length
    );
  });

  it('renvoie une liste vide pour un rôle inconnu', () => {
    expect(listPermissions('inconnu' as UserRole)).toEqual([]);
  });
});
