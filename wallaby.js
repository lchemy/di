module.exports = () => {
	return {
		files: [
			"tsconfig.json",
			{ pattern: "src/tests/**/*.ts", instrument: false },
			"src/**/*.ts",
			"!src/**/*.spec.ts"
		],
		tests: [
			"src/**/*.spec.ts"
		],
		env: {
			type: "node",
			runner: "node"
		},
		testFramework: "jest",
		setup: (wallaby) => {
			const path = require("path");
			wallaby.testFramework.configure({
				setupTestFrameworkScriptFile: path.join(wallaby.projectCacheDir, "src/tests/bootstrap.js")
			});
		}
	};
};
