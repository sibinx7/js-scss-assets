const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const gulpSassVariable = require("gulp-sass-variables");
const gulpConcat = require('gulp-concat');
const gulpRename = require('gulp-rename');
const babel = require("gulp-babel");
const gulpBrowserify = require("gulp-browserify");
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream")
const buffer = require('vinyl-buffer');
const typeScript = require('gulp-typescript');
const gulpPostCSS = require('gulp-postcss');
const plumber = require('gulp-plumber');
const gulpSourcemap = require('gulp-sourcemaps');
const preCSS = require('precss')

/* POST CSS plugin */
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');


const node_modules_path = `${__dirname}/node_modules`;

let es6functionSRC = `${__dirname}/js/es6/main.js`;
let scssSRC, dashboardSCSSSRC;


require('dotenv').config();

let FRAMEWORK = process.env.FRAMEWORK;
let CSS_FRAMEWORK = process.env.CSS_FRAMEWORK || 'bootstrap'

/* Middleman Paths */
const middlemanTargets = `${__dirname}/source`;
const middlemanCSSTarget = `${middlemanTargets}/stylesheets`;
const middlemanJSTarget = `${middlemanTargets}/javascripts`;
const middlemanSRC = `${__dirname}/js-scss-assets`;
const middlemanSCSSSRC = `${middlemanSRC}/scss/**/*.*`;
const middlemanJSSRC = `${middlemanSRC}/js/es6/**/*.*`;
/* End Middleman Paths */

const spikeTargets = `${__dirname}/assets`;
const spikeSRC = `${__dirname}/js-scss-assets`;

/* WordPress Paths */

const wordpressSRC = `./js-scss-assets`;
const wordpressSCSSPath = `./js-scss-assets/scss/**/*.scss`;
const wordpressES6Path = `./js-scss-assets/js/es6/**/*.js`;
const wordpressJSPath = `./js-scss-assets/js/js/**/*.js`;
/* End WordPress Paths */

let jsTarget, scssTarget, esTarget, fontsTarget, imageTarget, postCSSSRC, postCSSTarget;


/* Dashboard Section */
let middlemanDashboardCSSTarget, middlemanDashboardJSTarget;
if (FRAMEWORK === 'middleman') {
	middlemanDashboardCSSTarget = `${middlemanCSSTarget}/dashboard.css`;
	middlemanDashboardJSTarget = `${middlemanJSTarget}/dashboard.js`;
}


/* End Dashboard Section */


if (FRAMEWORK === 'middleman') {
	jsTarget = `${middlemanTargets}/javascripts/`;
	scssTarget = `${middlemanTargets}/stylesheets/`;
	esTarget = `${middlemanTargets}/javascripts/`;
	fontsTarget = `${middlemanTargets}/fonts/`;
	imageTarget = `${middlemanTargets}/images/`;
	es6functionSRC = `${middlemanSRC}/js/es6/main.js`;
	postCSSSRC = `${middlemanSRC}/postcss/main.css`;
	postCSSTarget = `${middlemanTargets}/stylesheets/postcss`;
	scssSRC = `${middlemanSRC}/scss/main.scss`;
	dashboardSCSSSRC = `${middlemanSRC}/scss/dashboard.scss`;

} else if (FRAMEWORK === 'wordpress') {
	jsTarget = './javascripts/';
	scssTarget = './stylesheets/';
	esTarget = './javascripts/';
	es6functionSRC = `${__dirname}/js-scss-assets/js/es6/main.js`;
	scssSRC = `${__dirname}/js-scss-assets/scss/main.scss`;
	es6functionSRC = `${wordpressSRC}/js/es6/main.js`;
	postCSSSRC = `${wordpressSRC}/postcss/main.css`;
	postCSSTarget = `./stylesheets/postcss/`;
} else if (FRAMEWORK === 'spike') {
	jsTarget = `${spikeTargets}/vendor`;
	fontsTarget = `${spikeTargets}/fonts`;
	imageTarget = `${spikeTargets}/img`;
	es6functionSRC = `${spikeSRC}/js/es6/main.js`;
	postCSSSRC = `${spikeSRC}/postcss/main.css`;
	postCSSTarget = `${spikeTargets}/css/postcss`;
}


if (FRAMEWORK != 'spike') {
	let styleTarget = `${scssTarget}/`;
	if (FRAMEWORK === 'middleman') {
		styleTarget = `${scssTarget}`;
	}
	const scssFilePath = scssSRC;
	gulp.task('scss', function (done) {
		gulp.src(scssFilePath)
			.pipe(gulpSassVariable({
				$framwork: process.env.FRAMEWORK ? process.env.FRAMEWORK : 'middleman'
			}))
			.pipe(plumber())
			.pipe(gulpSass())
			.pipe(gulp.dest(styleTarget));
		done();
	});

	gulp.task('dashboardSCSS', (done) => {
		gulp.src(dashboardSCSSSRC)
			.pipe(plumber())
			.pipe(gulpSass({outputStyle: 'compressed'}))
			.pipe(gulpRename((path) => {
				path.extname = '.css';
			}))
			.pipe(gulp.dest(`${scssTarget}`));
		done();
	})
}


const jquerySRC = `${node_modules_path}/jquery/dist/jquery.min.js`;
const popper = `${node_modules_path}/popper.js/dist/umd/popper.min.js`;
const bootstrapSRC = `${node_modules_path}/bootstrap/dist/js/bootstrap.min.js`;
const foundationSRC = `${node_modules_path}/foundation-sites/dist/foundation.min.js`;

gulp.task('concatLibs', function (done) {
	let requiredPlugins = [jquerySRC];
	let outputName = 'bootstrap-libs.js';
	if (CSS_FRAMEWORK === 'bootstrap') {
		requiredPlugins = [...requiredPlugins, popper, bootstrapSRC]
	} else {
		requiredPlugins = [...requiredPlugins, foundationSRC];
		outputName = 'foundation-libs.js';
	}
	gulp.src(requiredPlugins)
		.pipe(gulpConcat(outputName))
		.pipe(gulp.dest(jsTarget));
	done()
});


const slickCarouselSRC = `${node_modules_path}/slick-carousel/slick/slick.min.js`;
const highChartSRC = `${node_modules_path}/highcharts/highcharts.js`;
const jquerySlimScrollSRC = `${node_modules_path}/jquery-slimscroll/jquery.slimscroll.min.js`
const dropzoneJSSRC = `${node_modules_path}/dropzone/dist/min/dropzone.min.js`;


gulp.task('concatCommonLibs', (done) => {
	gulp.src([
		slickCarouselSRC
	])
		.pipe(plumber())
		.pipe(gulpConcat('common-3rd-libs.js'))
		.pipe(gulp.dest(jsTarget));
	done();
});

const smartWizardDir = `${node_modules_path}/smartwizard/dist`;
const smartWizardSRC = `${smartWizardDir}/js/jquery.smartWizard.min.js`;
const smartWizardCSSFolder = `${smartWizardDir}/css`;
gulp.task("gulpSmartWizardSRC", () => {
	gulp.src(smartWizardSRC)
		.pipe(gulp.dest(jsTarget));
	gulp.src(smartWizardCSSFolder)
		.pipe(plumber())
		.pipe(gulpRename((path) => {
			path.dirname += '/scss';
			path.extname = '.scss'
		})).pipe(gulp.dest(smartWizardDir));
});


// gulp.task('concatFunctions', function (done) {
// 	gulp.src([])
// 		.pipe(plumber())
// 		.pipe(gulpConcat('functions.js'))
// 		.pipe(gulp.dest(jsTarget));
// 	done();
// })

gulp.task('concatBabelScript', function (done) {
	browserify({entries: `${es6functionSRC}`})
		.transform("babelify", {
			presets: [
				"@babel/preset-env",
				"@babel/preset-react"
			]
		})
		.bundle()
		.pipe(plumber())
		.pipe(source("main-es6.js"))
		.pipe(gulp.dest(esTarget))
	done();
});


const postcssPlugins = [
	require('precss'),
	require('autoprefixer'),
	require('postcss-custom-properties'),
	require('postcss-apply'),
	require('postcss-extend'),
	// require('postcss-calc'),
	require('postcss-custom-media'),
	require('postcss-media-minmax'),
	require('postcss-nesting'),

	require('postcss-scss'),
	require('postcss-simple-vars'),
	require('postcss-color-function')

];
gulp.task('postcss', function () {
	return gulp.src('./postcss/**/*.css')
		.pipe(plumber())
		.pipe(gulpSourcemap.init())
		.pipe(gulpPostCSS(postcssPlugins))
		.pipe(gulpSourcemap.write('.'))
		.pipe(gulp.dest(postCSSTarget));
});


gulp.task('watch', function (done) {
	if (FRAMEWORK === 'wordpress') {
		console.log("WordPress watch")
		// gulp.watch(`${wordpressJSPath}`, gulp.parallel('concatFunctions'));
		gulp.watch(`${wordpressES6Path}`, gulp.parallel('concatBabelScript'));
		gulp.watch(`./js-scss-assets/scss/**/*.*`, gulp.parallel('scss'));
	}

	/* Middleman use old Ruby SASS, Node SASS is upto date and new */
	if (FRAMEWORK === 'middleman') {
		gulp.watch(`${middlemanJSSRC}`, gulp.parallel('concatBabelScript'));
		// gulp.watch(`${middlemanSCSSSRC}`, gulp.parallel.apply(this, ['scss', 'dashboardSCSS']))
	}

	/* No need any watch functions */
	if (FRAMEWORK === 'spike') {

	}

	return done()
})


gulp.task('copySlickCarouselFonts', () => {
	const slickCarouselFonts = `${node_modules_path}/slick-carousel/slick/fonts/**`;
	const slickCarouselImage = `${node_modules_path}/slick-carousel/slick/ajax-loader.gif`;
	gulp.src(slickCarouselFonts)
		.pipe(gulp.dest(fontsTarget))
	gulp.src(slickCarouselImage)
		.pipe(gulp.dest(imageTarget))
});


gulp.task('rateYoSRC', () => {
	const rateyoCSS = `${node_modules_path}/rateyo/`;
	gulp.src([
		`${rateyoCSS}/min/jquery.rateyo.min.css`
	]).pipe(gulpRename((path) => {
		path.dirname += '/scss';
		path.extname = '.scss'
	})).pipe(gulp.dest(rateyoCSS))
})

gulp.task('dropZoneTask', () => {
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


const commonTasks = ['concatLibs', 'concatBabelScript'];
if (FRAMEWORK !== 'spike') {
	commonTasks.push('scss');
	// commonTasks.push('dashboardSCSS')
}

gulp.task('default', gulp.parallel.apply(this, commonTasks));