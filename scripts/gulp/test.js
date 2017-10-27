const gulp = require("gulp"),
	jestCli = require("jest-cli"),
	jestConfig = require("../../jest.config");

gulp.task("test:jest", () => {
	return jestCli.runCLI({
		config: jestConfig
	}, ["."]);
});

gulp.task("test", gulp.series([
	"clean:test",
	"test:jest"
]));
