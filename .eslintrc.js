module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always']
  },
  overrides: [
    {
      files: ['**/test-*.js', '**/debug-*.js', '**/validate-*.js'],
      rules: {
        'no-unused-vars': 'off'
      }
    }
  ]
};