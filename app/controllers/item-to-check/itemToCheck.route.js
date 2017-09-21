'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider.state('app.itemToCheck', {
		url: '/itemToCheck',
		templateUrl: 'controllers/item-to-check/itemToCheck.html',
		controller: 'ItemToCheckCtrl as vm'
	});


});
