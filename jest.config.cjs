/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  projects: ['<rootDir>', '<rootDir>/apps/*', '<rootDir>/packages/*'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json' // Adjust the path as necessary
    }
  }
};