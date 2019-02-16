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