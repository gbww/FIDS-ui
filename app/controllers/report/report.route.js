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
		controller: 'ReportDetailInfoCtrl as vm',
		resolve: {
			templateMap: ['$rootScope', '$q', 'TemplateService', function ($rootScope, $q, TemplateService) {
				$rootScope.loading = true;
				var deferred = $q.defer();

				TemplateService.filterTemplate().then(function (response) {
					$rootScope.loading = false;
					var coverType = [], reportType = [];
					if (response.data.success) {
						var templates = response.data.entity.list;
						angular.forEach(templates, function (item) {
							if (item.category == '0' && coverType.indexOf(item.type) == -1) {
								coverType.push(item.type);
							} else if (item.category == '1' && reportType.indexOf(item.type) == -1) {
								reportType.push(item.type);
							}
						})
					}
					deferred.resolve({
						coverType: coverType,
						reportType: reportType
					})
				}).catch(function (){
					$rootScope.loading = false;
					deferred.resolve({
						coverType: [],
						reportType: []
					})
				});
				return deferred.promise;
			}]
		}
	});

	$stateProvider.state('app.report.detail.ci', {
		url: '/ci',
		templateUrl: 'controllers/report/detail/ci/ci.html',
		controller: 'ReportDetailCiCtrl as vm'
	});
});
