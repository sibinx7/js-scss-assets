findWeekInMonth = function(momentObject){
	var momentObjectCopy = _.clone(momentObject);
	var yearFirst = moment().startOf("year");
	// var currentMonthWeekStart = _.clone(moment(momentObject, "DD/MM/YYYY").startOf("month"));
	// var currentDayWeek = _.clone(moment(momentObject, "DD/MM/YYYY"));
	var currentMonthWeekStart = moment(momentObject).startOf("month");
	var currentDayWeek = moment(momentObject)
	var currentMonthWeekStartNumber = currentMonthWeekStart.week();
	var currentDayWeekNumber = currentDayWeek.week();
	var weekStartDay = currentMonthWeekStart.format("d");
	var currentDay = currentDayWeek.format("d")
	var requiredWeek = null;
	console.log(weekStartDay, currentDay)
	requiredWeek = ( currentDayWeekNumber - currentMonthWeekStartNumber) + 1;
	return !!(requiredWeek) ? requiredWeek : 1;
}
