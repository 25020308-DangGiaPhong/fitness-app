const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const moduleBoundaries = require('./scripts/eslint-module-boundaries');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['.expo/**', 'dist/**', 'coverage/**', '.codex/**'],
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: { globals: { __dirname: 'readonly' } },
  },
  {
    files: ['app/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
    plugins: { architecture: moduleBoundaries },
    rules: {
      'architecture/module-boundaries': 'error',
    },
  },
]);
