const gulp = require("gulp"),
	ts = require("gulp-typescript"),
	merge = require("merge2"),
	plumber = require("gulp-plumber"),
	jestCli = require("jest-cli"),
	jestConfig = require("../../jest.config");

gulp.task("develop:build:package", () => {
	gulp.watch([
		"./package.json"
	], gulp.series("build:package"));
});

gulp.task("develop:build:ts", () => {
	const tsProject = ts.createProject("tsconfig.build.json", {
		isolatedModules: true
	});

	const build = () => {
		const tsResult = gulp.src([
				"./src/**/*.ts",
				"!./src/**/tests/**/*.ts",
				"!./src/**/*.spec.ts"
			])
			.pipe(plumber())
			.pipe(tsProject());

		return merge([
			tsResult.dts,
			tsResult.js
		]).pipe(gulp.dest("dist"));
	};
	build.displayName = "develop:build:ts:execution";

	gulp.watch([
		"./src/**/*.ts",
		"!./src/**/tests/**/*.ts",
		"!./src/**/*.spec.ts"
	], build);
});

gulp.task("develop:test:jest", () => {
	return jestCli.runCLI({
		config: jestConfig,
		watchAll: true
	}, ["."]);
});

gulp.task("develop", gulp.series(
	"build",
	gulp.parallel(
		"develop:build:ts",
		"develop:build:package"
		// "develop:test:jest"
	)
));
