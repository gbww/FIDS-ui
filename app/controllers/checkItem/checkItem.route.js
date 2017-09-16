'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider.state('app.checkItem', {
		url: '/checkItem',
		template: '<div ui-view></div>',
		abstract: true
	});

	$stateProvider.state('app.checkItem.list', {
		url: '/list',
		templateUrl: 'controllers/checkItem/list/list.html',
		controller: 'DBCheckItemListCtrl as vm'
	});

	$stateProvider.state('app.checkItem.manage', {
		url: '/manage',
		templateUrl: 'controllers/checkItem/manage/manage.html',
		controller: 'DBCheckItemManageCtrl as vm'
	});

});
