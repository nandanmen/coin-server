module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/test-setup.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
