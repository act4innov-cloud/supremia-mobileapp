import { hasPermission, isAdmin, canAcknowledgeAlerts } from '../src/utils/permissions';

describe('Permissions', () => {
  test('admin has all permissions', () => {
    expect(hasPermission('admin', 'admin', 'manageUsers')).toBe(true);
    expect(hasPermission('admin', 'sensors', 'configure')).toBe(true);
  });

  test('viewer cannot manage', () => {
    expect(hasPermission('viewer', 'admin', 'manageUsers')).toBe(false);
    expect(hasPermission('viewer', 'sensors', 'configure')).toBe(false);
  });

  test('viewer cannot acknowledge alerts', () => {
    expect(canAcknowledgeAlerts('viewer')).toBe(false);
    expect(canAcknowledgeAlerts('operator')).toBe(true);
  });

  test('isAdmin checks', () => {
    expect(isAdmin('admin')).toBe(true);
    expect(isAdmin('supervisor')).toBe(false);
  });
});