'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider.state('app.business', {
		url: '/business',
		template: '<div ui-view></div>',
		abstract: true
	});

});
