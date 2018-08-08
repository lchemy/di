module.exports = () => {
	return {
		files: [
			"tsconfig.json",
			"src/**/*.ts",
			"!src/**/*.spec.ts",
			"!dist/**/*.*"
		],
		tests: [
			"src/**/*.spec.ts"
		],
		filesWithNoCoverageCalculated: [
			"src/tests/**/*.ts"
		],
		env: {
			type: "node",
			runner: "node"
		},
		testFramework: "jest",
		setup: (wallaby) => {
			const path = require("path");
			wallaby.testFramework.configure({
				testEnvironment: "node",
				setupTestFrameworkScriptFile: path.join(wallaby.projectCacheDir, "src/tests/bootstrap.js")
			});
		}
	};
};
