'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider.state('app.business.distribute', {
		url: '/distribute',
		templateUrl: 'controllers/business/distribute/distribute.html',
		controller: 'CheckItemDistributeCtrl as vm',
		abstract: true
	});


	$stateProvider.state('app.business.distribute.sample', {
		url: '/sample',
		templateUrl: 'controllers/business/distribute/sample-category/sampleCategory.html',
		controller: 'CheckItemDistributeSampleCtrl as vm'
	});

	$stateProvider.state('app.business.distribute.list', {
		url: '/list',
		templateUrl: 'controllers/business/distribute/list/list.html',
		controller: 'CheckItemDistributeListCtrl as vm'
	});

});
