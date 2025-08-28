
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // new feature
        'fix',  // bug fix
        'docs', // documentation
        'style', // formatting, missing semi-colons etc
        'refactor', // code change that neither fixes a bug nor adds a feature
        'perf', // performance improvements
        'test', // add or update tests
        'build', // build system changes
        'ci', // CI/CD config
        'chore', // maintenance
        'revert' // revert a commit
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'web',
        'api',
        'shared',
        'infra'
      ],
    ],
    // Allow multiple scopes: feat(web,api): ...
    'scope-case': [2, 'always', 'kebab-case'],
  },
};