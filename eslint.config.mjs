import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
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
            {
              // other libs cannot depend on service libs
              sourceTag: '*',
              notDependOnLibsWithTags: ['scope:service'],
            },
            {
              sourceTag: 'scope:web',
              onlyDependOnLibsWithTags: ['type:*', 'scope:*'],
            },
            {
              sourceTag: 'scope:service',
              onlyDependOnLibsWithTags: ['type:*'],
            },
            {
              sourceTag: 'type:*',
              onlyDependOnLibsWithTags: ['type:*'],
            },
            
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
