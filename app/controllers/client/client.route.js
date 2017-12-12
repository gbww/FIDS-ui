'user strict';

angular.module('com.app').config(function ($stateProvider) {

	$stateProvider.state('app.client', {
		url: '/client',
		templateUrl: 'controllers/client/client.html',
		controller: 'ClientCtrl as vm'
	});

	$stateProvider.state('app.client.detail', {
		url: '/detail/{:id}',
		views: {
			'@app': {
				templateUrl: 'controllers/client/detail/detail.html',
				controller: 'ClientDetailCtrl as vm',
			}
		},
		abstract: true
	});


	$stateProvider.state('app.client.detail.link', {
		url: '/link',
		templateUrl: 'controllers/client/detail/link/link.html',
		controller: 'ClientDetailLinkCtrl as vm'
	});

	$stateProvider.state('app.client.detail.schedule', {
		url: '/schedule',
		templateUrl: 'controllers/client/detail/schedule/schedule.html',
		controller: 'ClientDetailScheduleCtrl as vm'
	});

})
