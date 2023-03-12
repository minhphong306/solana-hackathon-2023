module.exports = {
  displayName: 'ui-penguin-ui-material-ui-extension',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/ui-penguin-ui-material-ui-extension',
};
