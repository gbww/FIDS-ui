'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider.state('app.business', {
		url: '/business',
		template: '<div ui-view></div>',
		abstract: true
	});

	$stateProvider.state('app.business.contract', {
		url: '/contract',
		templateUrl: 'controllers/business/contract/contract.html',
		controller: 'BusinessContractCtrl as vm'
	});

	$stateProvider.state('app.business.contract.detail', {
		url: '/:type/:id',
		views: {
			'@app.business': {
				templateUrl: 'controllers/business/contract/detail/detail.html',
				controller: 'BusinessContractDetailCtrl as vm'
			}
		},
		resolve: {
			id: ['$stateParams', function ($stateParams) {
				var type = $stateParams.type;
				var contract_id = $stateParams.id;
				if (type == 'create') {
					return (Math.random() * 100000).toFixed(0)
				} else {
					return contract_id;
				}
			}],
			contract: ['$rootScope', '$q', '$stateParams', 'ContractService', function ($rootScope, $q, $stateParams, ContractService) {
				var defered = $q.defer();
				var type = $stateParams.type;
				var contract_id = $stateParams.id;
				if (type == 'create') {
					defered.resolve(null);
				} else {
					$rootScope.loading = true;
					ContractService.getContractInfo(contract_id).then(function (response) {
						$rootScope.loading = false;
						defered.resolve(response.data.contractList[0]);
					}).catch(function () {
						$rootScope.loading = false;
						defered.reject();
					});
				}
				return defered.promise;
			}]
		}
	});

});
