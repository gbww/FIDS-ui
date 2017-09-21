'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider.state('app.business', {
		url: '/business',
		template: '<div ui-view></div>',
		abstract: true
	});

	/*
	 ****************合同******************************************
	 */
	$stateProvider.state('app.business.contract', {
		url: '/contract',
		templateUrl: 'controllers/business/contract/contract.html',
		controller: 'ContractCtrl as vm'
	});

	$stateProvider.state('app.business.contract.create', {
		url: '/create',
		views: {
			'@app.business': {
				templateUrl: 'controllers/business/contract/create/create.html',
				controller: 'ContractCreateCtrl as vm'
			}
		},
	});

	$stateProvider.state('app.business.contract.detail', {
		url: '/:id',
		views: {
			'@app.business': {
				templateUrl: 'controllers/business/contract/detail/detail.html',
				controller: 'ContractDetailCtrl as vm'
			}
		},
		abstract: true
	});

	$stateProvider.state('app.business.contract.detail.info', {
		url: '/info',
		templateUrl: 'controllers/business/contract/detail/info/info.html',
		controller: 'ContractDetailInfoCtrl as vm'
	});

	$stateProvider.state('app.business.contract.detail.ci', {
		url: '/ci',
		templateUrl: 'controllers/business/contract/detail/ci/ci.html',
		controller: 'ContractDetailCiCtrl as vm'
	});

	$stateProvider.state('app.business.contract.detail.comment', {
		url: '/comment',
		templateUrl: 'controllers/business/contract/detail/comment/comment.html',
		controller: 'ContractDetailCommentCtrl as vm'
	});

	$stateProvider.state('app.business.contract.detail.sample', {
		url: '/sample',
		templateUrl: 'controllers/business/contract/detail/sample/sample.html',
		controller: 'ContractDetailSampleCtrl as vm'
	});


	/*
	 ****************接样******************************************
	 */
	$stateProvider.state('app.business.sample', {
		url: '/sample',
		templateUrl: 'controllers/business/sample/sample.html',
		controller: 'SampleCtrl as vm'
	});

	$stateProvider.state('app.business.sample.create', {
		url: '/create',
		views: {
			'@app.business': {
				templateUrl: 'controllers/business/sample/create/create.html',
				controller: 'SampleCreateCtrl as vm'
			}
		},
	});

	$stateProvider.state('app.business.sample.detail', {
		url: '/{:id}',
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

	/*
	 ****************报告管理******************************************
	 */
	$stateProvider.state('app.business.report', {
		url: '/report',
		templateUrl: 'controllers/business/report/report.html',
		controller: 'BusinessReportCtrl as vm'
	});

	// $stateProvider.state('app.business.report.detail', {
	// 	url: '/:id',
	// 	views: {
	// 		'@app.business': {
	// 			templateUrl: 'controllers/business/report/detail/detail.html',
	// 			controller: 'ReportDetailCtrl as vm'
	// 		}
	// 	},
	// 	resolve: {
	// 		report: ['$rootScope', '$q', '$stateParams', 'SampleService', 'toastr', function ($rootScope, $q, $stateParams, SampleService, toastr) {
	// 			var deferred = $q.defer();
	// 			var sampleId = $stateParams.id;
	// 			$rootScope.loading = true;
	// 			SampleService.getSampleInfo(sampleId).then(function (response) {
	// 				$rootScope.loading = false;
	// 				if (response.data.success) {
	// 					deferred.resolve(response.data.entity);
	// 				} else {
	// 					deferred.reject();
	// 					toastr.error(response.data.message);
	// 				}
	// 			}).catch(function (err) {
	// 				$rootScope.loading = false;
	// 				deferred.reject();
	// 				toastr.error(err.data);
	// 			});
	// 			return deferred.promise;
	// 		}]
	// 	}
	// });

	$stateProvider.state('app.business.report.detail', {
		url: '/{:id}',
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
