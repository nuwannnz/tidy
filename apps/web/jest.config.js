module.exports = {
  displayName: 'web',
  rootDir: '.',
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/web',
  testMatch: ['<rootDir>/src/**/*.spec.tsx', '<rootDir>/src/**/*.spec.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/setup-tests.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/setup-tests.ts',
    '!**/*.spec.{ts,tsx}',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@tidy/shared-types$': '<rootDir>/../../libs/shared-types/src/index.ts',
  },
};
