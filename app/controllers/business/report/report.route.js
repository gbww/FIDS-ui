'use strict';

angular.module('com.app').config(function ($stateProvider) {
	$stateProvider.state('app.business.report', {
		url: '/report',
		params: {status: null},
		templateUrl: 'controllers/business/report/report.html',
		controller: 'ReportCtrl as vm'
	});

	$stateProvider.state('app.business.report.detail', {
		url: ':status/:id',
		views: {
			'@app.business': {
				templateUrl: 'controllers/business/report/detail/detail.html',
				controller: 'ReportDetailCtrl as vm'
			}
		},
		abstract: true
	});


	$stateProvider.state('app.business.report.detail.info', {
		url: '/info',
		templateUrl: 'controllers/business/report/detail/info/info.html',
		controller: 'ReportDetailInfoCtrl as vm'
	});

	$stateProvider.state('app.business.report.detail.ci', {
		url: '/ci',
		templateUrl: 'controllers/business/report/detail/ci/ci.html',
		controller: 'ReportDetailCiCtrl as vm'
	});

});
