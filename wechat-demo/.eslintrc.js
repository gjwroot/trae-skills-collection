module.exports = {
  extends: ['eslint:recommended'],
  env: {
    es6: true,
    node: true,
    browser: true
  },
  globals: {
    wx: true,
    App: true,
    Page: true,
    Component: true,
    Behavior: true,
    getApp: true,
    getCurrentPages: true
  },
  rules: {
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-console': 'off',
    'no-unused-vars': 'warn'
  }
}