const gulp = require('gulp');
const gulpSass = require('gulp-sass');
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
let scssSRC;


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
const wordpressSRC = `${__dirname}/js-scss-assets`;
const wordpressSCSSPath = `${__dirname}/js-scss-assets/scss/**/*.scss`;
const wordpressES6Path = `${__dirname}/js-scss-assets/js/es6/**/*.js`;
const wordpressJSPath = `${__dirname}/js-scss-assets/js/js/**/*.js`;
/* End WordPress Paths */

let jsTarget, scssTarget, esTarget, fontsTarget, imageTarget, postCSSSRC, postCSSTarget;


/* Dashboard Section */
let middlemanDashboardCSSTarget, middlemanDashboardJSTarget;
if(FRAMEWORK === 'middleman'){
    middlemanDashboardCSSTarget = `${middlemanCSSTarget}/dashboard.css`;
    middlemanDashboardJSTarget  = `${middlemanJSTarget}/dashboard.js`;
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
		let styleTarget = `${scssTarget}/main.css`;
		if(FRAMEWORK === 'middleman'){
			styleTarget = `${scssTarget}/main.css.scss`;
		}
    const scssFilePath = scssSRC;
    gulp.task('scss', function() {
        return gulp.src(scssFilePath)
            .pipe(plumber())
            .pipe(gulpSass())
            .pipe(gulp.dest(styleTarget));
    });
}


const jquerySRC = `${node_modules_path}/jquery/dist/jquery.min.js`;
const popper = `${node_modules_path}/popper.js/dist/umd/popper.min.js`;
const bootstrapSRC = `${node_modules_path}/bootstrap/dist/js/bootstrap.min.js`;
const foundationSRC = `${node_modules_path}/foundation-sites/dist/foundation.min.js`;

gulp.task('concatLibs', function() {
    let requiredPlugins = [jquerySRC];
    let outputName = 'bootstrap-libs.js';
    if (CSS_FRAMEWORK === 'bootstrap') {
        requiredPlugins = [...requiredPlugins, popper, bootstrapSRC]
    } else {
        requiredPlugins = [...requiredPlugins, foundationSRC];
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


gulp.task('concatCommonLibs', () => {
    return gulp.src([

        ])
        .pipe(plumber())
        .pipe(gulpConcat('common-3rd-libs.js'))
        .pipe(gulp.dest(jsTarget));
});


gulp.task('concatFunctions', function() {
    return gulp.src([])
        .pipe(plumber())
        .pipe(gulpConcat('functions.js'))
        .pipe(gulp.dest(jsTarget))
})

gulp.task('concatBabelScript', function() {
    return browserify({ entries: `${es6functionSRC}` })
        .transform("babelify", {
            presets: ["es2017", "latest"]
        })
        .bundle()
        .pipe(plumber())
        .pipe(source("main-es6.js"))
        .pipe(gulp.dest(esTarget))
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
gulp.task('postcss', function() {
    return gulp.src('./postcss/**/*.css')
        .pipe(plumber())
        .pipe(gulpSourcemap.init())
        .pipe(gulpPostCSS(postcssPlugins))
        .pipe(gulpSourcemap.write('.'))
        .pipe(gulp.dest(postCSSTarget));
});


gulp.task('watch', function() {
    if (FRAMEWORK === 'wordpress') {
        gulp.watch(`${wordpressJSPath}`, ['concatFunctions']);
        gulp.watch(`${wordpressES6Path}`, ['concatBabelScript']);
        gulp.watch(`${wordpressSCSSPath}`, ['scss']);
    }

    /* Middleman use old Ruby SASS, Node SASS is upto date and new */
    if (FRAMEWORK === 'middleman') {
        gulp.watch(`${middlemanJSSRC}`, ['concatBabelScripts']);
        gulp.watch(`${middlemanSCSSSRC}`, ['scss'])
    }

    /* No need any watch functions */
    if (FRAMEWORK === 'spike') {

    }
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

/**
 * Bootstrap Date picker 
 */
gulp.task('bootstrapDatePickerTask', () => {
    const bootstrapDatePickerDir = `${node_modules_path}/bootstrap-datepicker`
    const bootstrapDatePickerJSSRC = `${bootstrapDatePickerDir}/dist/js/bootstrap-datepicker.min.js`;
    const bootstrapDatePickerCSSSRC = `${bootstrapDatePickerDir}/dist/css`
        // Save JS File
    gulp.src(bootstrapDatePickerJSSRC)
        .pipe(gulp.dest(jsTarget));
    // Convert CSS TO SASS
    gulp.src(`${bootstrapDatePickerCSSSRC}/*.min.css`)
        .pipe(gulpRename((path) => {
            path.dirname += '/scss';
            path.extname = '.scss';
        })).pipe(gulp.dest(bootstrapDatePickerDir))
})

/**
 * Data Table CSS, SCSS and JS
 */
gulp.task('renameAndCopyDataTable', () => {
    const dataTable = `${node_modules_path}/datatables.net/js/jquery.dataTables.js`;
    const dataTableBootstrap = `${node_modules_path}/datatables.net-bs4/js/dataTables.bootstrap4.js`;
    const dataTableImages = `${node_modules_path}/datatables.net-dt/images/*.*`;
    const dataTableCSSSRC = `${node_modules_path}/datatables.net-dt/`;
    const dataTableBootstrapSRC = `${node_modules_path}/datatables.net-bs4/`;
    const dataTableDestination = `./assets/images`
    gulp.src([
            dataTable, dataTableBootstrap
        ])
        .pipe(gulpConcat('datatable-min.js'))
        .pipe(gulp.dest(jsTarget))
    gulp.src(dataTableImages)
        .pipe(gulp.dest(dataTableDestination))
    gulp.src(`${dataTableCSSSRC}css/jquery.dataTables.css`)
        .pipe(gulpRename((path) => {
            path.dirname += '/scss';
            path.extname = ".scss"
        }))
        .pipe(gulp.dest(dataTableCSSSRC))
    gulp.src(`${dataTableBootstrapSRC}css/dataTables.bootstrap4.css`)
        .pipe(gulpRename((path) => {
            path.dirname += '/scss';
            path.extname = ".scss"
        }))
        .pipe(gulp.dest(dataTableBootstrapSRC))
});


const commonTaskes = ['concatLibs', 'concatFunctions', 'concatBabelScript'];
if (FRAMEWORK != 'spike') {
    commonTaskes.push('scss');
}

gulp.task('default', commonTaskes);