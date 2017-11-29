'use strict';

angular.module('com.app').controller('ContractDetailCommentCtrl', function ($stateParams, toastr, ContractService) {
  var vm = this;

  var contractId = $stateParams.id;
  vm.loading = true;
	ContractService.getCommentList(contractId).then(function (response) {
		vm.loading = false;
		if (response.data.success) {
			vm.comments = response.data.entity;
		} else {
			toastr.error(response.data.message);
		}
	}).catch(function (err) {
		vm.loading = false;
		toastr.error(err.data);
	})

});
