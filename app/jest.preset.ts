const nxPreset = require('@nrwl/jest/preset');

module.exports = {
  ...nxPreset,
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{ts,tsx}'],
};
