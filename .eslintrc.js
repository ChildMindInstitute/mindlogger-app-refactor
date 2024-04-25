module.exports = {
  root: true,
  extends: '@react-native',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/no-unstable-nested-components': 'off',
        'react/jsx-newline': [2, { prevent: true, allowMultilines: true }],
        'import/order': [
          'error',
          {
            groups: [
              ['external', 'builtin'],
              'internal',
              ['sibling', 'parent'],
              'index',
            ],
            pathGroups: [
              {
                pattern: '@(react|react-native)',
                group: 'external',
                position: 'before',
              },
              {
                pattern:
                  '@(@app|@shared|@features|@screens|@entities|@assets|@jobs|@widgets)/**',
                group: 'internal',
              },
              {
                pattern: '@(@images)',
                group: 'internal',
                position: 'after',
              },
            ],
            pathGroupsExcludedImportTypes: ['internal', 'react'],
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
      },
    },
  ],
};
