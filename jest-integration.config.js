const coverageThresholdValues = {
  branches: 70,
  functions: 70,
  lines: 70,
  statements: 70
}

const coverageRoutes = [
  '**/graphql/resolvers/**/*',
  '**/handlers/**/*',
  '**/routes/**/*'
]

const coverageThreshold = coverageRoutes.reduce((accumulator, coverageRoute) => {
  accumulator[coverageRoute] = coverageThresholdValues
  return accumulator
}, {})

module.exports = {
  roots: ['dist-tests'],
  testMatch: ['**/integration-tests/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverage: true,
  coverageThreshold: coverageThreshold,
  collectCoverageFrom: coverageRoutes,
  testEnvironment: 'node'
}
