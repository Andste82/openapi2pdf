import globals from 'globals';
import js from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      // ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
  js.configs.recommended,
  prettierRecommended,
  {
    rules: {
      // https://eslint.org/docs/latest/rules/
      'no-console': 'warn',
      'prefer-const': [
        'error',
        {
          destructuring: 'any',
          ignoreReadBeforeAssign: false,
        },
      ],
      'no-promise-executor-return': ['error', { allowVoid: true }],

      // 'no-magic-numbers': 'off',
      // 'sort-keys': 'off',
      // 'capitalized-comments': 'off',
      // 'id-length': 'off',
      // 'no-ternary': 'off',

      // https://prettier.io/docs/en/options.html
      'prettier/prettier': [
        'warn',
        {
          tabWidth: 2,
          arrowParens: 'always',
          printWidth: 120,
          semicolons: true,
          singleQuote: true,
          trailingComma: 'es5',
          endOfLine: 'auto',
        },
      ],
    },
  },
];
