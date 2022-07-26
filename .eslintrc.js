module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended', 'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    "@typescript-eslint/ban-types": [
      "error",
      {
        "types": {
            "object": false,
            "Function": false,
        },
        "extendDefaults": true
      }
  ],
  "@typescript-eslint/ban-ts-comment": "warn",
  "no-unused-vars": "off",
    '@typescript-eslint/no-unused-vars': [
      'warn', // or error
      { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
  ignorePatterns: ['*.test.ts, **/worker.util.ts'],
}
