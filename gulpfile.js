var gulp = require('gulp');
var gulpSass = require('gulp-sass');
var gulpConcat = require('gulp-concat');
var gulpRename = require('gulp-rename');
var babel           = require("gulp-babel");
var gulpBrowserify  = require("gulp-browserify");
var browserify      = require("browserify");
var babelify        = require("babelify");
var source          = require("vinyl-source-stream")
var buffer          = require('vinyl-buffer');
var typeScript      = require('gulp-typescript');
var plumber         = require('gulp-plumber');


var scssFilePath = './scss/main.scss';
gulp.task('sass', function(){
		return gulp.src(scssFilePath)
		.pipe(plumber())
		.pipe(gulpSass())
    .pipe(gulp.dest('./css/main.css'));
});


var jquerySRC = './node_modules/jquery/dist/jquery.min.js';
var tetherSRC = './node_modules/popper/dist/popper.min.js';
var bootstrapSRC = './node_modules/bootstrap/dist/js/bootstrap.min.js'
gulp.task('concatLibs', function(){
		return gulp.src([])
		.pipe(gulpConcat('main-libs.js'))
    .pipe(gulp.dest('./js/'));
});

gulp.task('concatFunctions', function(){
		return gulp.src([])
		.pipe(plumber())
		.pipe(gulpConcat('functions.js'))
    .pipe(gulp.dest('./js'))
})

gulp.task('concatBabelScript', function() {
  return browserify({entries:'./source/js-scss-assets/es6/main.js'})
    .transform("babelify",{
      presets:["es2015","latest"]
    })
		.bundle()
		.pipe(plumber())
    .pipe(source("main-es6.js"))
    .pipe(gulp.dest('./source/javascripts'))
});

gulp.task('watch', function(){
    gulp.watch('./source/**/*.js',['concatFunctions']);
    gulp.watch('./scss/**/*.scss',['sass']);
})

gulp.task('default',['sass','concatLibs','concatFunctions']);