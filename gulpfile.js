const gulp = require('gulp');
const twig = require('gulp-twig');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCss = require('gulp-clean-css');

//directories
const dir = {
	src: {
		twig: 'src/templates/page/**/*.twig',
		twigWatch: 'src/templates/**/*.twig',
		sass: 'src/scss/*.scss',
		sassWatch: 'src/scss/**/*.scss',
	},
	dist: {
		base: 'dist',
		css: 'dist/css',
	},
}

//workers
const buildTwig = () => {
	return gulp.src(dir.src.twig)
		.pipe(twig({data: {}, extname: ''}))
		.pipe(gulp.dest(dir.dist.base));
}
const buildSass = () => {
	return gulp.src(dir.src.sass)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
				browsers: ['defaults', 'not ie < 9']
		}))
		.pipe(cleanCss({compability: 'ie9'}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dir.dist.css));
}

//watches
const watch = () => {
	gulp.watch(dir.src.twigWatch, buildTwig);
	gulp.watch(dir.src.sassWatch, buildSass);
}

//tasks
gulp.task('build', gulp.parallel(buildTwig, buildSass));
gulp.task('watch', gulp.parallel(watch));
gulp.task('default', gulp.series('build', 'watch'));
