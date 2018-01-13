'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider.state('app.business.itemToCheck', {
		url: '/itemToCheck',
		templateUrl: 'controllers/business/ci-result-record/ciResultRecord.html',
		controller: 'CiResultRecordCtrl as vm',
		abstract: true
	});


	$stateProvider.state('app.business.itemToCheck.sample', {
		url: '/sample',
		templateUrl: 'controllers/business/ci-result-record/sample-category/sampleCategory.html',
		controller: 'CiResultSampleCategoryCtrl as vm'
	});

	$stateProvider.state('app.business.itemToCheck.sample.list', {
		url: '/:id/list',
		views: {
			'@app.business.itemToCheck': {
				templateUrl: 'controllers/business/ci-result-record/sample-category/list/list.html',
				controller: 'CiResultSampleDetailListCtrl as vm'
			}
		}
	});

	$stateProvider.state('app.business.itemToCheck.list', {
		url: '/list',
		templateUrl: 'controllers/business/ci-result-record/list/list.html',
		controller: 'CiResultListCtrl as vm'
	});


});
