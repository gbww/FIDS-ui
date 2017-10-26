'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider.state('app.file', {
		url: '/file',
		template: '<div ui-view></div>',
		abstract: true
	});

	$stateProvider.state('app.file.template', {
		url: '/template',
		templateUrl: 'controllers/file/template/template.html',
		controller: 'TemplateListCtrl as vm'
	});


});
