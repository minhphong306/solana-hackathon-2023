module.exports = {
  testEnvironment: 'node',
  displayName: 'service-graphql-gateway',

  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/service-graphql-gateway',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
  collectCoverage: true,
  coverageReporters: ['clover', 'json', 'lcov', 'html', ['text', { skipFull: true }]],
  preset: '../../jest.preset.ts',
};
