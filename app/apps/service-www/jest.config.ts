export default {
  displayName: 'service-www',
  coveragePathIgnorePatterns: [
    'node_modules',
    '<rootDir>/components'
  ],
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      {cwd: __dirname, configFile: './babel-jest.config.json'},
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/service-www',
  preset: '../../jest.preset.ts',
  setupFilesAfterEnv: ['<rootDir>/specs/setJestEnv.ts']
};
