var gulp = require('gulp');
var gulpSass = require('gulp-sass');
var gulpConcat = require('gulp-concat');
var gulpRename = require('gulp-rename');


var scssFilePath = './scss/main.scss';
gulp.task('sass', function(){
    return gulp.src(scssFilePath).pipe(gulpSass())
    .pipe(gulp.dest('./css/main.css'));
});


var jquerySRC = './node_modules/jquery/dist/jquery.min.js';
var tetherSRC = './node_modules/tether/dist/tether.min.js';
var bootstrapSRC = './node_modules/bootstrap/dist/js/bootstrap.min.js'
gulp.task('concatLibs', function(){
    return gulp.src([]).pipe(gulpConcat('main-libs.js'))
    .pipe(gulp.dest('./js/'));
});

gulp.task('concatFunctions', function(){
    return gulp.src([]).pipe(gulpConcat('functions.js'))
    .pipe(gulp.dest('./js'))
})


gulp.task('watch', function(){
    gulp.watch('./source/**/*.js',['concatFunctions']);
    gulp.watch('./scss/**/*.scss',['sass']);
})

gulp.task('default',['sass','concatLibs','concatFunctions']);