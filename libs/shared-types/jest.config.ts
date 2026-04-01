/* eslint-disable */
const path = require('path');

export default {
  displayName: 'shared-types',
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
  coverageDirectory: path.join(__dirname, '../../coverage/libs/shared-types'),
  testEnvironment: 'node',
  rootDir: __dirname,
};
