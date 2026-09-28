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
  // Le cœur de domaine est résolu comme le fait Metro, via les chemins du
  // tsconfig. Sans ce mapping, Jest ne le trouverait pas alors que le bundle
  // Android le trouve : les tests valideraient autre chose que l'app.
  moduleNameMapper: {
    '^@supremia/domain$': '<rootDir>/packages/domain/src/index.ts',
    '^@supremia/domain/(.*)$': '<rootDir>/packages/domain/src/$1',
  },
  collectCoverageFrom: [
    'src/services/**/*.ts',
    'src/config/**/*.ts',
    'src/utils/**/*.ts',
  ],
};
