'use strict';

angular.module('com.app').config(function ($stateProvider) {

	$stateProvider.state('app.business.distribute', {
		url: '/distribute',
    templateUrl: 'controllers/business/distribute/distribute.html',
    controller: 'DistributeCtrl as vm'
	});

});
