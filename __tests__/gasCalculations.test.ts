import { getAlertLevel } from '../src/config/gas.config';
import { calculateTWA, isAboveThreshold } from '../src/utils/gasCalculations';

describe('Gas Alert Levels', () => {
  test('H2S below TWA returns null', () => {
    expect(getAlertLevel('H2S', 5)).toBeNull();
  });

  test('H2S at TWA returns warning', () => {
    expect(getAlertLevel('H2S', 10)).toBe('warning');
  });

  test('H2S above STEL returns critical', () => {
    expect(getAlertLevel('H2S', 16)).toBe('critical');
  });

  test('H2S above IDLH returns emergency', () => {
    expect(getAlertLevel('H2S', 105)).toBe('emergency');
  });

  test('O2 below IDLH returns emergency', () => {
    expect(getAlertLevel('O2', 15)).toBe('emergency');
  });

  test('O2 normal returns null', () => {
    expect(getAlertLevel('O2', 20.9)).toBeNull();
  });
});

describe('Threshold Checks', () => {
  test('isAboveThreshold works for H2S TWA', () => {
    expect(isAboveThreshold('H2S', 11, 'twa')).toBe(true);
    expect(isAboveThreshold('H2S', 5, 'twa')).toBe(false);
  });
});