import globals from 'globals';
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    ignores: ['node_modules', 'dist', 'build', 'coverage'],
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      // Code style
      semi: ['error', 'always'],
      quotes: ['warn', 'single'],
      indent: ['warn', 2],
      'comma-dangle': ['warn', 'always-multiline'],
      'object-curly-spacing': ['warn', 'always'],
      'array-bracket-spacing': ['warn', 'never'],

      // Best practices
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-undef': 'error',
      'no-console': 'warn',
      'prefer-const': 'warn',
      'no-var': 'error',
      'no-empty': 'warn',

      // Node.js specific
      'no-process-exit': 'warn',
      'no-path-concat': 'warn',
    },
  },
];
