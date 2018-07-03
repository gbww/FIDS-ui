'use strict';

angular.module('com.app').config(function ($stateProvider) {

	$stateProvider.state('app.review', {
		url: '/review',
		template: '<div ui-view></div>',
		abstract: true
	});

	$stateProvider.state('app.review.company', {
		url: '/company',
		templateUrl: 'controllers/review/company/company.html',
		controller: 'ReviewCompanyCtrl as vm'
	});

	$stateProvider.state('app.review.company.report', {
		url: '/:companyId/report',
		views: {
			'@app.review': {
				templateUrl: 'controllers/review/company/report/report.html',
				controller: 'ReviewCompanyReportCtrl as vm'
			}
		}
	});

	$stateProvider.state('app.review.company.report.project', {
		url: '/:reportId/project',
		views: {
			'@app.review': {
				templateUrl: 'controllers/review/company/report/project/project.html',
				controller: 'ReviewCompanyReportProjectCtrl as vm'
			}
		}
	});

	$stateProvider.state('app.review.project', {
		url: '/project',
		templateUrl: 'controllers/review/project/project.html',
		controller: 'ReviewProjectCtrl as vm'
	});


});
