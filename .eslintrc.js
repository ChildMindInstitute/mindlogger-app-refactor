module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['import', 'react', 'react-hooks', 'unused-imports', 'jest'],
  rules: {
    // Error
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

    // Warn
    'react-hooks/rules-of-hooks': 'warn',
    'import/no-cycle': 'warn',
    'constructor-super': 'warn',
    'no-this-before-super': 'warn',
    'no-useless-computed-key': 'warn',
    'no-useless-constructor': 'off',
    'no-useless-rename': 'warn',
    'no-var': 'warn',
    'object-shorthand': 'warn',
    'prefer-template': 'warn',
    'no-restricted-syntax': ['warn', 'ForInStatement', 'SequenceExpression'],
    'no-caller': 'warn',
    'no-template-curly-in-string': 'warn',
    'array-callback-return': 'warn',
    'no-eval': 'warn',
    'no-extend-native': 'warn',
    eqeqeq: ['warn', 'always'],
    'no-lone-blocks': 'warn',
    'no-proto': 'warn',
    'no-script-url': 'warn',
    'no-self-compare': 'warn',
    'no-sequences': 'warn',
    'no-throw-literal': 'warn',
    'no-undef-init': 'warn',
    'no-nested-ternary': 'warn',
    'no-unneeded-ternary': 'warn',
    'no-debugger': 'warn',
    'no-empty': 'warn',
    'no-unused-labels': 'warn',
    'prefer-const': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'react-hooks/exhaustive-deps': 'warn',
    'react/display-name': 'warn',
    'no-unused-vars': 'warn',
    'no-case-declarations': 'warn',
    'no-unsafe-optional-chaining': 'warn',
    'react/prop-types': 'warn',
    'react/jsx-key': 'warn',

    // Off
    'no-shadow': 'off',
    'no-undef': 'off',
    'prefer-destructuring': 0,
    'padding-line-between-statements': ['off'],
    'no-extra-semi': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
      },
      plugins: ['@typescript-eslint'],
      extends: [
        '@react-native-community',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
      ],
      rules: {
        // Error
        '@typescript-eslint/no-shadow': ['error'],

        // Warn
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-duplicate-enum-values': 'warn',
        '@typescript-eslint/no-floating-promises': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/require-await': 'warn',
        '@typescript-eslint/no-misused-promises': 'warn',
        '@typescript-eslint/await-thenable': 'warn',
        '@typescript-eslint/unbound-method': 'warn',
        '@typescript-eslint/restrict-plus-operands': 'warn',
        '@typescript-eslint/no-unsafe-return': 'warn',
        'prefer-const': 'warn',
        'react/display-name': 'warn',
        'react/prop-types': 'warn',
        'react/jsx-key': 'warn',

        // Off
        '@typescript-eslint/no-unused-vars': 'off',
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
      },
    },
  ],
};
