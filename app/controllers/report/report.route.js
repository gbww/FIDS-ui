'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {
	$stateProvider.state('app.report', {
		url: '/report',
		templateUrl: 'controllers/report/report.html',
		controller: 'ReportCtrl as vm'
	});

	$stateProvider.state('app.report.detail', {
		url: '/{:id}',
		views: {
			'@app': {
				templateUrl: 'controllers/report/detail/detail.html',
				controller: 'ReportDetailCtrl as vm'
			}
		},
		abstract: true
	});


	$stateProvider.state('app.report.detail.info', {
		url: '/info',
		templateUrl: 'controllers/report/detail/info/info.html',
		controller: 'SampleDetailInfoCtrl as vm',
		resolve: {
			users: ['$rootScope', '$q', 'PrivilegeService', 'toastr', function ($rootScope, $q, PrivilegeService, toastr) {
				var deferred = $q.defer();
				$rootScope.loading = true;
				PrivilegeService.getUserList().then(function (response) {
					$rootScope.loading = false;
					if (response.data.success) {
						var res = [];
						angular.forEach(response.data.entity.list, function (user) {
							res.push(user.name);
						});
						deferred.resolve(res);
					} else {
						toastr.error(response.data.message);
					}
				}).catch(function (err) {
					$rootScope.loading = false;
					toastr.error(err.data);
				});
				return deferred.promise;
			}]
		}
	});

	$stateProvider.state('app.report.detail.ci', {
		url: '/ci',
		templateUrl: 'controllers/report/detail/ci/ci.html',
		controller: 'SampleDetailCiCtrl as vm'
	});

});
