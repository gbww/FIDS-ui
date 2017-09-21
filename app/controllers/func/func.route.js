'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider.state('app.func', {
		url: '/func',
		template: '<div ui-view></div>',
		abstract: true
	});

	$stateProvider.state('app.func.template', {
		url: '/template',
		templateUrl: 'controllers/func/template/template.html',
		controller: 'TemplateListCtrl as vm'
	});


});
