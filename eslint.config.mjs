import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            // {
            //   sourceTag: '*',
            //   onlyDependOnLibsWithTags: ['*'],
            // },
            {
              sourceTag: 'scope:web',
              onlyDependOnLibsWithTags: ['type:*', 'scope:*'],
            },
            {
              sourceTag: 'scope:service',
              onlyDependOnLibsWithTags: ['type:*'],
            },
            { sourceTag: 'type:ui', onlyDependOnLibsWithTags: ['type:utils', 'type:types'] },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
