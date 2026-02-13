import { validateEmail, validatePassword } from '../src/utils/validators';

describe('Validators', () => {
  describe('validateEmail', () => {
    test('accepts valid email', () => {
      expect(validateEmail('user@ocp.ma')).toBeNull();
    });
    test('rejects invalid email', () => {
      expect(validateEmail('invalid')).not.toBeNull();
    });
    test('rejects empty string', () => {
      expect(validateEmail('')).not.toBeNull();
    });
  });

  describe('validatePassword', () => {
    test('accepts strong password', () => {
      expect(validatePassword('Supremia2026!')).toBeNull();
    });
    test('rejects short password', () => {
      expect(validatePassword('Ab1')).not.toBeNull();
    });
    test('rejects no uppercase', () => {
      expect(validatePassword('password123')).not.toBeNull();
    });
    test('rejects no digits', () => {
      expect(validatePassword('Password')).not.toBeNull();
    });
  });
});