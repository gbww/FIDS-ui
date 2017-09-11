'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider.state('app.business', {
		url: '/business',
		template: '<div ui-view></div>',
		abstract: true
	});

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


	$stateProvider.state('app.business.checkItem', {
		url: '/checkItem',
		templateUrl: 'controllers/business/checkItem/checkItem.html',
		controller: 'CheckItemCtrl as vm'
	});

	$stateProvider.state('app.business.checkItem.list', {
		url: '/list',
		templateUrl: 'controllers/business/checkItem/list/list.html',
		controller: 'CheckItemListCtrl as vm'
	});

	$stateProvider.state('app.business.checkItem.manage', {
		url: '/manage',
		templateUrl: 'controllers/business/checkItem/manage/manage.html',
		controller: 'CheckItemManageCtrl as vm'
	});


	$stateProvider.state('app.business.inspection', {
		url: '/inspection',
		templateUrl: 'controllers/business/inspection/inspection.html',
		controller: 'BusinessInspectionCtrl as vm'
	});

});
