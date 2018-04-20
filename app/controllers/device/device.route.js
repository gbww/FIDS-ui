'user strict';

angular.module('com.app').config(function ($stateProvider) {

	$stateProvider.state('app.device', {
		url: '/device',
		templateUrl: 'controllers/device/device.html',
		controller: 'DeviceCtrl as vm'
  });
  
});