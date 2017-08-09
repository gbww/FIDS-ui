'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider.state('app.dashboard', {
		url: '/dashboard',
		templateUrl: 'controllers/dashboard/dashboard.html',
		controller: 'DashboardCtrl as vm'
	});

});
