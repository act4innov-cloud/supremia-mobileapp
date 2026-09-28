/**
 * Configuration Jest pour Expo / React Native.
 *
 * `jest-expo` fournit la transformation Babel et le mapping d'alias (`~/`),
 * ce qui évite de dupliquer la configuration Metro.
 */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // Les tests de logique (parsing MQTT, seuils, formatage) ne dépendent d'aucun
  // module natif : on les exécute en Node pour rester rapide.
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/services/**/*.ts',
    'src/config/**/*.ts',
    'src/utils/**/*.ts',
  ],
};
