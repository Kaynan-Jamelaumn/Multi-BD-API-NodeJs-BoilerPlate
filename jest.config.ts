import type { Config } from 'jest';

const config: Config = {
  // Use the default ESM preset for ts-jest to support ES Modules
  preset: 'ts-jest/presets/default-esm',

  // Specify the test environment (Node.js in this case)
  testEnvironment: 'node',

  // Define the file extensions Jest should handle
  moduleFileExtensions: ['ts', 'js', 'json'],

  // Specify the pattern for locating test files
  testMatch: ['**/__tests__/**/*.test.ts'],

  // Configure how TypeScript files are transformed for Jest
  transform: {
    '^.+\\.ts$': [
      'ts-jest', // Use ts-jest for transforming TypeScript files
      {
        tsconfig: 'tsconfig.jest.json', // Use the Jest-specific TS config file
        useESM: true, // Enable ES Module support
      },
    ],
  },

  // Map module paths to their corresponding locations
  moduleNameMapper: {
    // Handle file extensions for relative imports (e.g., './file.js' -> './file')
    '^(\\.{1,2}/.*)\\.js$': '$1',

    // Map custom paths (e.g., '@/module' -> '<rootDir>/src/module')
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Treat .ts files as ES Modules
  extensionsToTreatAsEsm: ['.ts'],

  // Ignore these directories when running tests
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;