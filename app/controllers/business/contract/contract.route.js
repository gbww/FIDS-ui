'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {

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

});
