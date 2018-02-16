const gulp = require("gulp"),
	jestCli = require("jest-cli"),
	jestConfig = require("../../jest.config");

gulp.task("test:jest", () => {
	return jestCli.runCLI({
		config: jestConfig
	}, ["."]).then(({ results }) => {
		if (!results.success) {
			return Promise.reject(new Error(`Failed running ${ results.numFailedTests } test(s)`));
		}
	});
});

gulp.task("test", gulp.series([
	"clean:test",
	"test:jest"
]));
