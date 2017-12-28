'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider.state('app.business.itemToCheck', {
		url: '/result-record',
		templateUrl: 'controllers/business/ci-result-record/ciResultRecord.html',
		controller: 'CiResultRecordCtrl as vm'
	});


});
