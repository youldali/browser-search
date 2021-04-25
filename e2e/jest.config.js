module.exports = {
  preset: "jest-puppeteer",
  rootDir: '.',
  modulePaths: ["<rootDir>"],
  testPathIgnorePatterns: ["/node_modules/", "/__fixtures__/"]
};