module.exports = {
  displayName: 'api',
  rootDir: '.',
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: '../../coverage/apps/api',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts', '!**/*.spec.ts', '!**/*.d.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '^@tidy/shared-types$': '<rootDir>/../../libs/shared-types/src/index.ts',
  },
};
