'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {
	$stateProvider.state('app.report', {
		url: '/report',
		templateUrl: 'controllers/report/report.html',
		controller: 'ReportCtrl as vm'
	});

	$stateProvider.state('app.report.detail', {
		url: '/detail/{:id}',
		views: {
			'@app': {
				templateUrl: 'controllers/report/detail/detail.html',
				controller: 'ReportDetailCtrl as vm'
			}
		}
	});

});
