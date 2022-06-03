module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  modulePaths: ["<rootDir>"],
  testPathIgnorePatterns: ["/node_modules/", "/__fixtures__/"]
};