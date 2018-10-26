const gulp = require('gulp');
const twig = require('gulp-twig');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCss = require('gulp-clean-css');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const babel = require('babelify');
const fs = require('fs-extra');

//directories
const dir = {
	src: {
		sass: 'scss/*.scss',
		sassWatch: 'scss/**/*.scss',
		js: 'js/app.js',
		jsWatch: 'js/**/*.js',
	},
	dist: {
		base: 'dist',
	},
	sassPaths: [
		'node_modules'
	]
};

//namings
const name = {
	js: 'app.js'
};

//workers
const clean = (done) => {
	fs.remove(dir.dist.base, done);
};
const buildSass = () => {
	return gulp.src(dir.src.sass)
		.pipe(sourcemaps.init())
		.pipe(sass({includePaths: dir.sassPaths})
		.on('error', sass.logError))
		.pipe(autoprefixer({
				browsers: ['defaults', 'not ie < 9']
		}))
		.pipe(cleanCss({compability: 'ie9'}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dir.dist.base));
};
const buildJs = () => {
	return browserify(dir.src.js).transform(
		babel.configure({presets:['es2015']})
	)
		.bundle()
		.on('error', function(err){console.error(err); this.emit('end')})
		.pipe(source(name.js))
		.pipe(buffer())
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dir.dist.base));
};

//watches
const watch = () => {
	gulp.watch(dir.src.sassWatch, buildSass);
	gulp.watch(dir.src.jsWatch, buildJs);
};

//tasks
gulp.task('build', gulp.series(clean, buildSass, buildJs));
gulp.task(watch);
gulp.task('default', gulp.series('build', 'watch'));
