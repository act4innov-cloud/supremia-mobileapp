const expoConfig = require('eslint-config-expo/flat');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

/**
 * ESLint 9 utilise une configuration plate (`eslint.config.js`) : le format
 * `.eslintrc.js` est ignoré. `eslint-config-expo/flat` fournit les mêmes règles
 * que la configuration historique d'Expo (React Hooks compris).
 */
module.exports = [
  {
    ignores: ['dist-check/**', 'node_modules/**', 'android/**', 'ios/**', '.expo/**'],
  },
  ...expoConfig,
  {
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      // Un `any` implicite est plus dangereux qu'un `unknown` : on le signale
      // pour forcer un typage explicite aux frontières de données (payload MQTT,
      // réponses API).
      '@typescript-eslint/no-explicit-any': 'warn',

      // L'interface est en français : les apostrophes droites dans le texte JSX
      // (« l'app n'a pas encore ete reliee ») sont la norme typographique
      // francaise la plus repandue, et les echapper toutes en `&apos;`
      // rendrait le code illisible. La regle reste active sur `>`, `"` et `}`.
      'react/no-unescaped-entities': ['error', { forbid: ['>', '"', '}'] }],
    },
  },
];
