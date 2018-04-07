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
		url: '/list/:reportId/:receiveSampleId',
		views: {
			'@app.business.itemToCheck': {
				templateUrl: 'controllers/business/ci-result-record/list/list.html',
				controller: 'CiResultListCtrl as vm'
			}
		}
	});

	$stateProvider.state('app.business.itemToCheck.list', {
		url: '/list',
		params: {status: null},
		templateUrl: 'controllers/business/ci-result-record/list/list.html',
		controller: 'CiResultListCtrl as vm'
	});

	$stateProvider.state('app.business.itemToCheck.detail', {
		url: ':status/:id',
		views: {
			'@app.business': {
				templateUrl: 'controllers/business/ci-result-record/list/detail/detail.html',
				controller: 'CiSampleDetailCtrl as vm'
			}
		},
		abstract: true
	});

	$stateProvider.state('app.business.itemToCheck.detail.info', {
		url: '/info',
		templateUrl: 'controllers/business/ci-result-record/list/detail/info/info.html',
		controller: 'CiSampleDetailInfoCtrl as vm'
	});

	$stateProvider.state('app.business.itemToCheck.detail.ci', {
		url: '/ci',
		templateUrl: 'controllers/business/ci-result-record/list/detail/ci/ci.html',
		controller: 'CiSampleDetailCiCtrl as vm'
	});


});
