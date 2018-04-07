'use strict';

angular.module('com.app').controller('PrivilegeUserEditCtrl', function ($uibModalInstance, PrivilegeService, toastr, user) {
  var vm = this;

  vm.user = user;

  vm.ok = function () {
  	var data = {
  		phone: vm.user.phone,
  		email: vm.user.email,
      description: vm.user.description
  	}
  	PrivilegeService.editUser(vm.user.organizationId, vm.user.id, data).then(function (response) {
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
