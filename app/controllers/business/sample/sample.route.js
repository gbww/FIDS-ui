'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider.state('app.business.sample', {
		url: '/sample',
		params: {status: null, pageSize: null, pageNum: null, orderBy: null, reverse: null,
			reportId: null, sampleName: null, entrustedUnit: null, inspectedUnit: null, productionUnit: null, receiveSampleId: null, executeStandard: null
		},
		templateUrl: 'controllers/business/sample/sample.html',
		controller: 'SampleCtrl as vm'
	});

	$stateProvider.state('app.business.sample.create', {
		url: '/:status/create',
		views: {
			'@app.business': {
				templateUrl: 'controllers/business/sample/create/create.html',
				controller: 'SampleCreateCtrl as vm'
			}
		}
	});

	$stateProvider.state('app.business.sample.detail', {
		url: '/:status/:pageNum/:pageSize/:orderBy/:reverse/:reportId/:sampleName/:entrustedUnit/:inspectedUnit/:productionUnit/:receiveSampleId/:executeStandard/:id',
		views: {
			'@app.business': {
				templateUrl: 'controllers/business/sample/detail/detail.html',
				controller: 'SampleDetailCtrl as vm'
			}
		},
		abstract: true
	});

	$stateProvider.state('app.business.sample.detail.info', {
		url: '/info',
		templateUrl: 'controllers/business/sample/detail/info/info.html',
		controller: 'SampleDetailInfoCtrl as vm'
	});

	$stateProvider.state('app.business.sample.detail.ci', {
		url: '/ci',
		templateUrl: 'controllers/business/sample/detail/ci/ci.html',
		controller: 'SampleDetailCiCtrl as vm'
	});
});
