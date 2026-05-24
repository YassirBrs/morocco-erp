module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.dto.ts'],
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
