'use strict';

angular.module('com.app').config(function ($stateProvider) {

	$stateProvider.state('app.notFound', {
		url: '/notFound',
		templateUrl: 'controllers/notFound/notFound.html'
	});

});
