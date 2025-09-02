import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.{ts,js}', '!src/scripts/**'],
  coverageDirectory: 'coverage',
  maxWorkers: 1
};
export default config;
