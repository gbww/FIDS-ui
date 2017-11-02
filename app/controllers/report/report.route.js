'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {
	$stateProvider.state('app.report', {
		url: '/report',
		templateUrl: 'controllers/report/report.html',
		controller: 'ReportCtrl as vm'
	});

	$stateProvider.state('app.report.detail', {
		url: '/{:id}',
		views: {
			'@app': {
				templateUrl: 'controllers/report/detail/detail.html',
				controller: 'ReportDetailCtrl as vm'
			}
		},
		abstract: true
	});

	$stateProvider.state('app.report.detail.info', {
		url: '/info',
		templateUrl: 'controllers/report/detail/info/info.html',
		controller: 'ReportDetailInfoCtrl as vm'
	});

	$stateProvider.state('app.report.detail.ci', {
		url: '/ci',
		templateUrl: 'controllers/report/detail/ci/ci.html',
		controller: 'ReportDetailCiCtrl as vm'
	});
});
