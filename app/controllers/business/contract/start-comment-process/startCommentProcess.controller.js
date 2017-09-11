'use strict';

angular.module('com.app').controller('StartCommentProcessCtrl', function ($scope, $uibModalInstance, api, toastr, ContractService, contractId) {
  var vm = this;
  var user = api.userInfo;
  vm.availUsers = [{
    name: user.username,
    id: user.id
  }];

  vm.ok = function () {
  	$uibModalInstance.close();
    var approveUsers = [];
    angular.forEach(vm.users, function (user) {
      approveUsers.push(user.id);
    })
  	var data = {
  		approveUsers: approveUsers,
  		contractId: contractId,
  		updateContractUser: api.userInfo.username
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
