'use strict';

angular.module('com.app').config(function ($stateProvider) {

	$stateProvider.state('welcome', {
		url: '/welcome',
		templateUrl: 'controllers/welcome/welcome.html',
		controller: 'WelcomeController as vm'
	});

});
