module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  parser: 'babel-eslint',
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true
    },
    sourceType: 'module'
  },
  rules: {
    'no-console': 'off',
    'linebreak-style': ['error', 'unix'],
    'no-unused-vars': ['error', { args: 'none' }],
    strict: 0,
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'always']
  }
};
