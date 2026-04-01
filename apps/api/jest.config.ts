/* eslint-disable */
const path = require('path');

export default {
  displayName: 'api',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['@swc/jest', {
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: false,
        },
      },
    }],
  },
  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: path.join(__dirname, '../../coverage/apps/api'),
  testEnvironment: 'node',
  rootDir: __dirname,
};
