const gulp = require("gulp"),
	ts = require("gulp-typescript"),
	map = require("vinyl-map"),
	merge = require("merge2"),
	path = require("path");

gulp.task("build:package", () => {
	return gulp.src("package.json").pipe(map((pkgJson) => {
		const pkg = JSON.parse(pkgJson);

		delete pkg.private;
		delete pkg.scripts;
		delete pkg.devDependencies;
		pkg.main = "index.js";

		const dependencies = pkg.dependencies;
		pkg.dependencies = Object.keys(dependencies).reduce((memo, key) => {
			if (dependencies[key].startsWith("file:")) {
				const file = dependencies[key].substr(5);
				memo[key] = `file:${ path.join("..", file) }`;
			} else {
				memo[key] = dependencies[key];
			}
			return memo;
		}, {});

		return JSON.stringify(pkg, undefined, 2) + "\n";
	})).pipe(gulp.dest("dist"));
});

gulp.task("build:ts", () => {
	const tsProject = ts.createProject("tsconfig.build.json");

	const tsResult = gulp.src([
			"./src/**/*.ts",
			"!./src/**/tests/**/*.ts",
			"!./src/**/*.spec.ts"
		])
		.pipe(tsProject());

	return merge([
		tsResult.dts,
		tsResult.js
	]).pipe(gulp.dest("dist"));
});

gulp.task("build", gulp.series(
	"clean:dist",
	"build:package",
	"build:ts"
));
