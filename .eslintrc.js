module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'import'],
  rules: {
    // NOTE: importのソート順
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
        pathGroups: [
          {
            pattern: '{react,react/**,react-dom/**,}',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '{~~/**,~/**}',
            group: 'parent',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always-and-inside-groups',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    // NOTE: 名前付きimportの並び順をアルファベット順にする
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true, // import/orderで制御するので無効にする
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],

    // NOTE: returnの前には改行を入れる
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
    ],

    // NOTE: 表示名がなくても関数名で判断できるため無効にする
    'react/display-name': 'off',

    // NOTE: Reactのコンポーネント定義を関数式、アロー関数を許可する
    'react/function-component-definition': [
      'error',
      {
        namedComponents: ['function-declaration', 'arrow-function'],
      },
    ],

    // NOTE: Reactのpropsをアルファベット順にソートする
    'react/jsx-sort-props': 'error',

    // NOTE: importにReactを含めないのを許可する
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
};
