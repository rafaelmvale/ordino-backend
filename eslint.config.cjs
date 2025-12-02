// eslint.config.cjs — flat config (apenas TS em src e testes)
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  {
    // rodar somente nos TS do src e nos testes
    files: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/__tests__/**/*.ts', 'src/**/__tests__/**/*.tsx'],

    // ignora dist e node_modules
    ignores: ['dist/**', 'node_modules/**'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 2022
      }
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin
    },

    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-misused-promises': 'warn',
      'prettier/prettier': 'warn'
    }
  }
];
