const gulp = require("gulp"),
	tslint = require("tslint"),
	gulpTslint = require("gulp-tslint");

gulp.task("tslint", () => {
	const program = tslint.Linter.createProgram("./tsconfig.json");
	return gulp.src("src/**/*.ts")
		.pipe(gulpTslint({
			program,
			formatter: "verbose"
		}))
		.pipe(gulpTslint.report())
});
