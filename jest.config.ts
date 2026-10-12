import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'CommonJS',
          moduleResolution: 'Node',
          jsx: 'react-jsx',
          esModuleInterop: true,
          strict: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss)$': '<rootDir>/src/test/style-mock.cjs',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/interfaces/generated/**',
    '!src/main.tsx',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
export default config;
