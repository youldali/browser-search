module.exports = {
  preset: "jest-puppeteer",
  rootDir: '.',
  modulePaths: ["<rootDir>"],
  testPathIgnorePatterns: ["/node_modules/", "/__fixtures__/"],
  transform: {
		"^.+\\.ts?$": "ts-jest"
	},
};