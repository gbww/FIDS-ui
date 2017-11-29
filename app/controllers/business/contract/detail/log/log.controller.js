'use strict';

angular.module('com.app').controller('ContractDetailLogCtrl', function ($stateParams, toastr, ContractService) {
  var vm = this;
  var contractId = $stateParams.id;

  vm.page = 1;
  vm.hasMore = true;
  vm.logs = [];

  vm.getMoreLogs = function () {
  	vm.loading = true;
	 	ContractService.getContractLog(contractId, vm.page).then(function (response) {
	 		vm.loading = false;
	 		if (response.data.success) {
	 			vm.logs = vm.logs.concat(response.data.entity.list || []);
	 			if (vm.page >= response.data.entity.pages) {
	 				vm.hasMore = false;
	 			}
	 			vm.page += 1;
	 		} else {
	 			toastr.error(response.data.message);
	 		}
	 	})
	}

	vm.getMoreLogs();
});
