'use strict';

angular.module('com.app').controller('StartCommentProcessCtrl', function ($rootScope, $scope, $uibModalInstance, api, toastr, ContractService, contractId, users) {
  var vm = this;
  $rootScope.loading = false;
  vm.availUsers = users;

  vm.ok = function () {
    var approveUsers = [];
    angular.forEach(vm.users, function (user) {
      approveUsers.push(user.id);
    })
  	var data = {
  		approveUsers: approveUsers,
  		contractId: contractId,
  		updateContractUser: api.userInfo.id
  	};
  	ContractService.startCommentTask(data).then(function (response) {
  		if (response.data.success) {
  			$uibModalInstance.close();
  		} else {
  			toastr.error(response.data.message);
  		}
  	})

  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
