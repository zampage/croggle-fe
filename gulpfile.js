const gulp = require('gulp');
const twig = require('gulp-twig');
const sass = require('gulp-sass');

//directories
const dir = {
	src: {
		twig: 'src/templates/page/**/*.twig',
		twigWatch: 'src/templates/**/*.twig',
	},
	dist: 'dist',
}

//workers
const buildTwig = () => {
	return gulp.src(dir.src.twig)
		.pipe(twig({data: {}, extname: ''}))
		.pipe(gulp.dest(dir.dist));
}

//watches
const watch = () => {
	gulp.watch(dir.src.twigWatch, buildTwig);
}

//tasks
gulp.task('build', gulp.parallel(buildTwig));
gulp.task('watch', gulp.parallel(watch));
gulp.task('default', gulp.series('build', 'watch'));
