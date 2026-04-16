module.exports = {
  displayName: 'shared-types',
  rootDir: '.',
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: '../../coverage/libs/shared-types',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts', '!**/*.spec.ts', '!**/*.d.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
