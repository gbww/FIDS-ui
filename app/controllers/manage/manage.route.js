'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider.state('app.manage', {
		url: '/manage',
		template: '<div ui-view></div>',
		abstract: true
	});

	$stateProvider.state('app.manage.child1', {
		url: '/child1',
		templateUrl: 'controllers/manage/child1/child1.html',
		controller: 'ManageChild1Controller as vm'
	});

	$stateProvider.state('app.manage.child2', {
		url: '/child2',
		templateUrl: 'controllers/manage/child2/child2.html',
		controller: 'ManageChild2Controller as vm'
	});

});
