// @ts-check

import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
  },
  prettierConfig,
  {
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'require-await': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      camelcase: [
        'error',
        {
          properties: 'always',
          ignoreImports: true,
          ignoreDestructuring: true,
          allow: [
            'max_messages',
            'max_body_length',
            'durable_name',
            'ack_policy',
            'status_code',
          ],
        },
      ],
      '@typescript-eslint/no-unnecessary-condition': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'none',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    ignores: [
      'eslint.config.js',
      '.DS_Store',
      'node_modules',
      'build',
      '.env',
      '.env.*',
      '!.env.example',
      'pnpm-lock.yaml',
      'package-lock.json',
      'yarn.lock',
    ],
  },
);
