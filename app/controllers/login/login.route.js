'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider.state('login', {
		url: '/login',
		templateUrl: 'controllers/login/login.html',
		controller: 'LoginController as vm'
	});

});
