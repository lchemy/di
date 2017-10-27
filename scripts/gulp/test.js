const gulp = require("gulp"),
	jestCli = require("jest-cli"),
	jestConfig = require("../../jest.config");

gulp.task("test", () => {
	return jestCli.runCLI({
		config: jestConfig
	}, ["."]);
});
