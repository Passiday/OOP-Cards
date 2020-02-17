module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "indent": ["error", "tab", { "SwitchCase": 1 }],
    "no-tabs": ["error", { "allowIndentationTabs": true }],
    "quotes": ["error", "double"],
    "max-classes-per-file": 0,
    "no-plusplus": 0,
    "no-console": 0,
  },
};
