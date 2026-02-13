import { formatNumber, formatPercentage, formatFileSize } from '../src/utils/formatters';

describe('Formatters', () => {
  describe('formatNumber', () => {
    test('formats with default decimals', () => {
      expect(formatNumber(3.14159)).toBe('3.1');
    });
    test('formats with custom decimals', () => {
      expect(formatNumber(3.14159, 3)).toBe('3.142');
    });
    test('handles zero', () => {
      expect(formatNumber(0)).toBe('0.0');
    });
  });

  describe('formatPercentage', () => {
    test('rounds to integer', () => {
      expect(formatPercentage(85.7)).toBe('86%');
    });
    test('handles 100', () => {
      expect(formatPercentage(100)).toBe('100%');
    });
  });

  describe('formatFileSize', () => {
    test('formats bytes', () => {
      expect(formatFileSize(500)).toBe('500 B');
    });
    test('formats KB', () => {
      expect(formatFileSize(2048)).toBe('2.0 KB');
    });
    test('formats MB', () => {
      expect(formatFileSize(5242880)).toBe('5.0 MB');
    });
  });
});