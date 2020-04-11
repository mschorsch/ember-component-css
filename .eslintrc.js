'use strict';

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  plugins: [
    'ember',
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  env: {
    browser: true
  },
  rules: {
    'ember/no-jquery': 'error',
    'quotes': 'off', // note you must disable the base rule as it can report incorrect errors
    'no-unused-vars': 'off', // note you must disable the base rule as it can report incorrect errors
    '@typescript-eslint/quotes': ['error', 'single'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {'argsIgnorePattern': '^_'}],
  },
  settings: {
    node: {
      // Honor both extensions when enforcing e.g. `node/no-missing-require`
      tryExtensions: ['.js', '.ts'],
    },
  },
  overrides: [
    // node files
    {
      files: [
        'lib/**/*.js',
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'index.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'tests/dummy/config/**/*.js'
      ],
      excludedFiles: [
        'addon/**',
        'addon-test-support/**',
        'app/**',
        'tests/dummy/app/**'
      ],
      parserOptions: {
        sourceType: 'script'
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ['node'],
      rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
        // add your custom rules and overrides for node files here
        'node/no-missing-require': 'off',
        'node/no-unpublished-require': ['error', {
          'allowModules': ['ts-node']
        }],
        '@typescript-eslint/no-var-requires': 'off',
      })
    },

    // test files
    {
      files: ['tests/**/*.{js,ts}'],
      excludedFiles: ['tests/dummy/**/*.{js,ts}'],
      env: {
        embertest: true,
      },
    },

    // all Javascript files
    {
      files: ['**/*.js'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },

    // all TypeScript files
    {
      files: ['**/*.ts'],
      rules: {
        // These are covered by tsc
        'no-undef': 'off',
        'no-unused-vars': 'off',
      },
    },
  ]
};
