module.exports = {
	testEnvironment: "node",
	transform: {
		"^.+\\.ts$": "ts-jest"
	},
	testRegex: "^.+\.spec\.ts$",
	moduleFileExtensions: ["ts", "js"],
	setupTestFrameworkScriptFile: "<rootDir>/src/tests/bootstrap.ts",
	collectCoverage: true,
	collectCoverageFrom: [
		"src/**/*.ts",
		"!src/**/*.spec.ts",
		"!src/**/tests/**/*.ts"
	],
	coverageDirectory: "<rootDir>/coverage",
	coverageReporters: ["lcov", "text", "text-summary"]
};
