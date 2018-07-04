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
		twig: 'src/templates/page/**/*.twig',
		twigWatch: 'src/templates/**/*.twig',
		sass: 'src/scss/*.scss',
		sassWatch: 'src/scss/**/*.scss',
		img: 'src/img/**/*',
		js: 'src/js/app.js',
		jsWatch: 'src/js/**/*.js',
	},
	dist: {
		base: 'dist',
		css: 'dist/css',
		img: 'dist/img',
		js: 'dist/js',
	},
}

//namings
const name = {
	js: 'app.js'
}

//workers
const clean = (done) => {
	fs.remove(dir.dist.base, done);
}
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
const buildImages = () => {
	return gulp.src(dir.src.img)
		.pipe(gulp.dest(dir.dist.img));
}
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
		.pipe(gulp.dest(dir.dist.js));
}

//watches
const watch = () => {
	gulp.watch(dir.src.twigWatch, buildTwig);
	gulp.watch(dir.src.sassWatch, buildSass);
	gulp.watch(dir.src.img, buildImages);
	gulp.watch(dir.src.jsWatch, buildJs);
}

//tasks
gulp.task('build', gulp.series(clean, gulp.parallel(
	buildImages, gulp.series(buildSass, buildJs, buildTwig)
)));
gulp.task(watch);
gulp.task('default', gulp.series('build', 'watch'));
