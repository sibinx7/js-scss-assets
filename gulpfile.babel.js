const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const gulpConcat = require('gulp-concat');
const gulpRename = require('gulp-rename');
const babel           = require("gulp-babel");
const gulpBrowserify  = require("gulp-browserify");
const browserify      = require("browserify");
const babelify        = require("babelify");
const source          = require("vinyl-source-stream")
const buffer          = require('vinyl-buffer');
const typeScript      = require('gulp-typescript');
const gulpPostCSS     = require('gulp-postcss');
const plumber         = require('gulp-plumber');

/* POST CSS plugin */
const autoprefixer 		= require('autoprefixer');
const cssnano 				= require('cssnano');


const node_modules_path = `${__dirname}/node_modules`;

const es6functionSRC = `${__dirname}/js/es6/main.js`;


require('dotenv').config();

let FRAMEWORK = process.env.FRAMEWORK;
let CSS_FRAMEWORK = process.env.CSS_FRAMEWORK || 'bootstrap'



const middlemanTargets = `${__driname}/source`;
const spikeTargets = `${__dirname}/assets`;

let jsTarget, scssTarget, esTarget, fontsTarget, imageTarget;

if(FRAMEWORK === 'middleman'){
	jsTarget = `${middlemanTargets}/javascripts/`;
	scssTarget = `${middlemanTargets}/stylesheets/`;
	esTarget = `${middlemanTargets}/javascripts/`;
	fontsTarget = `${middlemanTargets}/fonts/`;
	imageTarget = `${middlemanTargets}/images/`;
}else if(FRAMEWORK == 'wordpress'){
	jsTarget = './source/javascripts/';
	scssTarget = './source/stylesheets/';
	esTarget = './source/javascripts/';
}else if(FRAMEWORK == 'spike'){ 
	jsTarget = `${spikeTargets}/vendor`;
	fontsTarget = `${spikeTargets}/fonts`;
	imageTarget = `${spikeTargets}/img`;
}


if(FRAMEWORK != 'middleman'
&& FRAMEWORK != 'spike'){
	const scssFilePath = './scss/main.scss';
	gulp.task('scss', function(){
			return gulp.src(scssFilePath)
			.pipe(plumber())
			.pipe(gulpSass())
			.pipe(gulp.dest('./css/main.css'));
	});
}


const jquerySRC = `${node_modules_path}/jquery/dist/jquery.min.js`;
const popper = `${node_modules_path}/popper/dist/umd/popper.min.js`;
const bootstrapSRC = `${node_modules_path}/bootstrap/dist/js/bootstrap.min.js`;
const foundationSRC = `${node_modules_path}/foundation-sites/dist/foundation.min.js`;

gulp.task('concatLibs', function(){
		let requiredPlugins = [jquerySRC];
		let outputName = 'bootstrap-libs.js';
		if(CSS_FRAMEWORK==='bootstrap'){
			requiredPlugins = [...requiredPlugins,, popper,  bootstrapSRC]
		}else{
			requiredPlugins = [...requiredPlugins,foundationSRC];
			outputName = 'foundation-libs.js';
		}

		return gulp.src(requiredPlugins)
		.pipe(gulpConcat(outputName))
    .pipe(gulp.dest(jsTarget));
});


const slickCarouselSRC = `${node_modules_path}/slick-carousel/slick/slick.min.js`;
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


const postcssPlugins = [
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
		if(FRAMEWORK != 'middleman'){
			gulp.watch('./scss/**/*.scss',['sass']);
		}
})




gulp.task('copySlickCarouselFonts', () => {
	const slickCarouselFonts = `${node_modules_path}/slick-carousel/slick/fonts/**`;
	gulp.src(slickCarouselFonts)
	.pipe(gulp.dest(fontsTarget))
});


gulp.task('runBeforeGulp', () => {
	const fontAwesomeFonts = `${node_modules_path}/font-awesome/fonts/**`;
	gulp.src(fontAwesomeFonts)
	.pipe(gulp.dest(fontsTarget))


	const slickCarouselFonts = `${node_modules_path}/slick-carousel/slick/fonts/**`;
	gulp.src(slickCarouselFonts)
	.pipe(gulp.dest(fontsTarget))


	const rateyoCSS = `${node_modules_path}/rateyo/`;
	gulp.src([
		`${rateyoCSS}/min/jquery.rateyo.min.css`
	]).pipe(gulpRename((path) => {
		path.dirname +='/scss';
		path.extname = '.scss'
	})).pipe(gulp.dest(rateyoCSS))


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

const commonTaskes = ['concatLibs','concatFunctions','concatBabelScript'];
if(FRAMEWORK != 'middleman' && FRAMEWORK != 'spike'){
	commonTaskes.push('scss');
}

gulp.task('default', commonTaskes);