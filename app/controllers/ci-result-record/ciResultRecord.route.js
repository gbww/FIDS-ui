'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider.state('app.itemToCheck', {
		url: '/result-record',
		templateUrl: 'controllers/ci-result-record/ciResultRecord.html',
		controller: 'CiResultRecordCtrl as vm'
	});


});
