module.exports = {
  roots: ['dist-tests'],
  collectCoverage: true,
  testPathIgnorePatterns: ['/node_modules/', '/integration-tests/', '/generated/'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '**/handlers/**/*'
  ],
  testEnvironment: 'node'
}
