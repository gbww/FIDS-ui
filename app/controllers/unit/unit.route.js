'user strict';

angular.module('com.app').config(function ($stateProvider) {

	$stateProvider.state('app.unit', {
		url: '/unit',
		templateUrl: 'controllers/unit/unit.html',
		controller: 'UnitCtrl as vm'
	});

})
