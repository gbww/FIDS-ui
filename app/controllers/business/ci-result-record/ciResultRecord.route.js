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
		params: {status: null, pageSize: null, pageNum: null, orderBy: null, reverse: null,
			reportId: null, sampleName: null, name: null, receiveSampleId: null, method: null
		},
		templateUrl: 'controllers/business/ci-result-record/list/list.html',
		controller: 'CiResultListCtrl as vm'
	});

	$stateProvider.state('app.business.itemToCheck.detail', {
		url: '/:status/:pageNum/:pageSize/:orderBy/:reverse/:reportId/:receiveSampleId/:sampleName/:name/:method/:id',
		views: {
			'@app.business': {
				templateUrl: 'controllers/business/ci-result-record/list/detail/detail.html',
				controller: 'CiSampleDetailCtrl as vm'
			}
		}
	});

});
