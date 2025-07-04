module.exports = {
  env: {
    node: true,
    es2020: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'warn',
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
  ],
};