'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider.state('app.privilege', {
		url: '/privilege',
		template: '<div ui-view></div>',
		abstract: true
	});

	$stateProvider.state('app.privilege.organization', {
		url: '/organization',
		templateUrl: 'controllers/privilege/organization/organization.html',
		controller: 'PrivilegeOrganizationCtrl as vm'
	});

	$stateProvider.state('app.privilege.user', {
		url: '/user',
		templateUrl: 'controllers/privilege/user/user.html',
		controller: 'PrivilegeUserCtrl as vm',
		abstract: true
	});

	$stateProvider.state('app.privilege.user.list', {
		url: '/list',
		templateUrl: 'controllers/privilege/user/list/list.html',
		controller: 'PrivilegeUserListCtrl as vm'
	});

	$stateProvider.state('app.privilege.user.category', {
		url: '/category',
		templateUrl: 'controllers/privilege/user/category/category.html',
		controller: 'PrivilegeUserCategoryCtrl as vm'
	});

	$stateProvider.state('app.privilege.role', {
		url: '/role',
		templateUrl: 'controllers/privilege/role/role.html',
		controller: 'PrivilegeRoleCtrl as vm'
	});


	$stateProvider.state('app.privilege.currentUser', {
		url: '/currentUser',
		templateUrl: 'controllers/privilege/current-user/currentUser.html',
		controller: 'PrivilegeCurrentUserCtrl as vm'
	});

});
