
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
    // Allow JIRA ticket keys (e.g., PI-9) in the subject by disabling strict subject casing
    // This way subjects like "PI-9 implement X" or "implement X PI-9" won't be rejected
    'subject-case': [0],
  },
};