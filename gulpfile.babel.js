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
var gulpPostCSS     = require('gulp-postcss');
var plumber         = require('gulp-plumber');

/* POST CSS plugin */
var autoprefixer 		= require('autoprefixer');
var cssnano 				= require('cssnano');


var node_modules_path = `${__dirname}/node_modules`;

const es6functionSRC = `${__dirname}/js/es6/main.js`;


require('dotenv').config();



const middlemanTargets = `${__driname}/source`;


let jsTarget, scssTarget, esTarget, fontsTarget, imageTarget;

if(process.env.FRAMEWORK === 'middleman'){
	jsTarget = `${middlemanTargets}/javascripts/`;
	scssTarget = `${middlemanTargets}/stylesheets/`;
	esTarget = `${middlemanTargets}/javascripts/`;
	fontsTarget = `${middlemanTargets}/fonts/`;
	imageTarget = `${middlemanTargets}/images/`;
}else if(process.env.FRAMEWORK == 'wordpress'){
	jsTarget = './source/javascripts/';
	scssTarget = './source/stylesheets/';
	esTarget = './source/javascripts/';
}else{

}




console.log(process.env.FRAMEWORK)

if(process.env.FRAMEWORK != 'middleman'){
	var scssFilePath = './scss/main.scss';
	gulp.task('scss', function(){
			return gulp.src(scssFilePath)
			.pipe(plumber())
			.pipe(gulpSass())
			.pipe(gulp.dest('./css/main.css'));
	});
}


var jquerySRC = `${node_module_path}/jquery/dist/jquery.min.js`;
var popper = `${node_module_path}/popper/dist/umd/popper.min.js`;
var bootstrapSRC = `${node_module_path}/bootstrap/dist/js/bootstrap.min.js`
gulp.task('concatLibs', function(){
		return gulp.src([])
		.pipe(gulpConcat('bootstrap-libs.js'))
    .pipe(gulp.dest(jsTarget));
});


const slickCarouselSRC = `${node_modules_path}/slick-carousel/slick.min.js`;
const highChartSRC = `${node_modules_path}/highcharts/highcharts.js`;
const jquerySlimScrollSRC = `${node_modules_path}/jquery-slimscroll/jquery.slimscroll.min.js`
const dropzoneJSSRC = `${node_modules_path}/dropzone/dist/min/dropzone.min.js`;


gulp.task('concatCommonLibs', () =>{
	return gulp.src([

	])
	.pipe(plumber())
	.pipe(gulpConcat('common-3rd-libs'))
	.pipe(gulp.dest(jsTarget));
});


gulp.task('concatFunctions', function(){
		return gulp.src([])
		.pipe(plumber())
		.pipe(gulpConcat('functions.js'))
    .pipe(gulp.dest(jsTarget))
})

gulp.task('concatBabelScript', function() {
  return browserify({entries:`${es6functionSRC}`})
    .transform("babelify",{
      presets:["es2015","latest"]
    })
		.bundle()
		.pipe(plumber())
    .pipe(source("main-es6.js"))
    .pipe(gulp.dest(esTarget))
});


var postcssPlugins = [
	autoprefixer({browsers: ['last 1 version']}),
	cssnano()
];
gulp.task('postcss', function(){
	return gulp.src('./postcss/**/*.css')
		.pipe(plumber())
		.pipe(gulpPostCSS(postcssPlugins))
		.pipe(gulp.dest('./source/postcss'));
});


gulp.task('watch', function(){
		gulp.watch('./source/**/*.js',['concatFunctions']);
		if(process.env.FRAMEWORK != 'middleman'){
			gulp.watch('./scss/**/*.scss',['sass']);
		}
})



const slickCarouselFonts = `${node_modules_path}/slick-carousel/fonts/**`;
gulp.task('copySlickCarouselFonts', () => {
	gulp.src(slickCarouselFonts)
	.pipe(gulp.dest(fontsTarget))
});


gulp.task('runBeforeGulp', () => {
	const dropzoneDIR = `${node_modules_path}/dropzone/`;
	const dropzoneBasicSRC = `${node_modules_path}/dropzone/dist/basic.css`;
	const dropzoneSRC = `${node_modules_path}/dropzone/dist/dropzpne.css`;
	gulp.src(`${dropzoneDIR}/dist/min/*.css`)
		.pipe(gulpRename((path) => {
			path.dirname += '/scss';
			path.extname = '.scss'
		}))
		.pipe(gulp.dest(dropzoneDIR))
})

var commonTaskes = ['concatLibs','concatFunctions','concatBabelScript'];
if(process.env.FRAMEWORK != 'middleman'){
	commonTaskes.push('scss');
}

gulp.task('default', commonTaskes);