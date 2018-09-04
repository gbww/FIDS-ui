'use strict';

angular.module('com.app').config(function ($stateProvider) {

	$stateProvider.state('app.statistic', {
		url: '/statistic/:name/:visitUrl',
    templateUrl: 'controllers/statistic/statistic.html',
		controller: 'StatisticCtrl as vm'
	});

});
