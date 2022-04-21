module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': 'off',
    'no-console': 'off',
    'class-methods-use-this': 'off',
  },
};
