'use strict';

angular.module('com.app').config(function ($stateProvider) {
	$stateProvider.state('app.business.report', {
		url: '/report',
		params: {status: null, pageSize: null, pageNum: null, orderBy: null, reverse: null,
			reportId: null, sampleName: null, entrustedUnit: null, inspectedUnit: null, productionUnit: null, receiveSampleId: null, executeStandard: null,
    	sampleType: null, checkType: null, startTime: null, endTime: null
		},
		templateUrl: 'controllers/business/report/report.html',
		controller: 'ReportCtrl as vm'
	});

	$stateProvider.state('app.business.report.inspection', {
		url: '/inspection/:status/:type/:pageNum/:pageSize/:orderBy/:reverse/:reportId/:sampleName/:entrustedUnit/:inspectedUnit/:productionUnit/:receiveSampleId/:executeStandard/:sampleType/:checkType/:startTime/:endTime/:id/:taskId',
		views: {
			'@app.business': {
				templateUrl: 'controllers/business/report/inspection/inspection.html',
				controller: 'ReportInspectionCtrl as vm'
			}
		},
		resolve: {
			users: ['$rootScope', '$q', '$stateParams', 'PrivilegeService', 'toastr', function ($rootScope, $q, $stateParams, PrivilegeService, toastr) {
				if ($stateParams.type === 'ck') {
					return [];
				}
				$rootScope.loading = true;
				var deferred = $q.defer();

				PrivilegeService.getAllTypeUser('批准人').then(function (response) {
					if (response.data.success) {
						var users = response.data.entity;
						if (users.length === 0) {
							$rootScope.loading = false;
							toastr.warning('请先新建批准人！');
							deferred.reject();
						} else {
							deferred.resolve(users);
						}
					}
				}).catch(function () {
					deferred.reject();
					$rootScope.loading = false;
					toastr.error('请求批准人列表失败！');
				});

				return deferred.promise;
			}],
			templates: ['$rootScope', '$q', '$stateParams', 'TemplateService', function ($rootScope, $q, $stateParams, TemplateService) {
				$rootScope.loading = true;
				var deferred = $q.defer();

				TemplateService.filterTemplate().then(function (response) {
					if (response.data.success) {
						var templates = [];
						angular.forEach(response.data.entity.list, function (item) {
							templates.push(item)
						})
						if (templates.length === 0) {
							deferred.resolve([]);
						} else {
							deferred.resolve(templates);
						}
					}
				}).catch(function () {
					deferred.resolve([]);
				});

				return deferred.promise;
			}]
		}
	});

	$stateProvider.state('app.business.report.detail', {
		url: '/:status/:type/:pageNum/:pageSize/:orderBy/:reverse/:reportId/:sampleName/:entrustedUnit/:inspectedUnit/:productionUnit/:receiveSampleId/:executeStandard/:sampleType/:checkType/:startTime/:endTime/:id/:taskId',
		views: {
			'@app.business': {
				templateUrl: 'controllers/business/report/detail/detail.html',
				controller: 'ReportDetailCtrl as vm'
			}
		},
		resolve: {
			drawUsers: ['$rootScope', '$q', '$stateParams', 'PrivilegeService', 'toastr', function ($rootScope, $q, $stateParams, PrivilegeService, toastr) {
				if ($stateParams.type === 'bz') {
					return [];
				}
				$rootScope.loading = true;
				var deferred = $q.defer();

				PrivilegeService.getAllTypeUser('编制人').then(function (response) {
					if (response.data.success) {
						var users = response.data.entity;
						if (users.length === 0) {
							$rootScope.loading = false;
							deferred.resolve([]);
						} else {
							deferred.resolve(users);
						}
					}
				}).catch(function () {
					deferred.resolve([]);
					$rootScope.loading = false;
				});

				return deferred.promise;
			}],
			examineUsers: ['$rootScope', '$q', '$stateParams', 'PrivilegeService', 'toastr', function ($rootScope, $q, $stateParams, PrivilegeService, toastr) {
				if ($stateParams.type !== 'bz') {
					return [];
				}
				$rootScope.loading = true;
				var deferred = $q.defer();

				PrivilegeService.getAllTypeUser('审核人').then(function (response) {
					if (response.data.success) {
						var users = response.data.entity;
						if (users.length === 0) {
							$rootScope.loading = false;
							toastr.warning('请先新建审核人！');
							deferred.reject();
						} else {
							deferred.resolve(users);
						}
					}
				}).catch(function () {
					deferred.reject();
					$rootScope.loading = false;
					toastr.error('请求审核人列表失败！');
				});

				return deferred.promise;
			}],
			templates: ['$rootScope', '$q', '$stateParams', 'TemplateService', function ($rootScope, $q, $stateParams, TemplateService) {
				$rootScope.loading = true;
				var deferred = $q.defer();

				TemplateService.filterTemplate().then(function (response) {
					if (response.data.success) {
						var templates = [];
						angular.forEach(response.data.entity.list, function (item) {
							templates.push(item)
						})
						if (templates.length === 0) {
							deferred.resolve([]);
						} else {
							deferred.resolve(templates);
						}
					}
				}).catch(function () {
					deferred.resolve([]);
				});

				return deferred.promise;
			}]
		}
	});

});
