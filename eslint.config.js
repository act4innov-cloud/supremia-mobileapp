const { FlatCompat } = require('@eslint/eslintrc');
const expo = require('eslint-config-expo');
const globals = require('globals');

const compat = new FlatCompat();

module.exports = [
  ...compat.extends('expo'),
  {
    ignores: ['dist/**'],
    rules: {
      // your rules here
    },
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.browser,
        ...globals['react-native'],
      },
    },
  },
];
