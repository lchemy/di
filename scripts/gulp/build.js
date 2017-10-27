const gulp = require("gulp"),
	ts = require("gulp-typescript"),
	map = require("vinyl-map"),
	merge = require("merge2");

gulp.task("build:ts", () => {
	const tsProject = ts.createProject("tsconfig.build.json");

	const tsResult = gulp.src("./src/**/*.ts")
		.pipe(tsProject());

	return merge([
		tsResult.dts,
		tsResult.js
	]).pipe(gulp.dest("dist"));
});

gulp.task("build:package", () => {
	return gulp.src("package.json").pipe(map((pkgJson) => {
		const pkg = JSON.parse(pkgJson);

		delete pkg.private;
		delete pkg.scripts;
		delete pkg.devDependencies;

		pkg.main = "index.js";
		pkg.types = "index.d.ts";

		return JSON.stringify(pkg, undefined, 2) + "\n";
	})).pipe(gulp.dest("dist"));
});

gulp.task("build", gulp.series(
	"clean:dist",
	gulp.parallel(
		"build:ts",
		"build:package"
	)
));
