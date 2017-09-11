'use strict';

angular.module('com.app').controller('PrivilegeUserAssignRoleCtrl', function ($uibModalInstance, PrivilegeService, toastr, user, roles) {
  var vm = this;

  vm.user = user;
  vm.roles = roles;

  vm.ok = function () {
  	PrivilegeService.modifyUserRole(vm.user.organizationId, vm.user.id, vm.user.roleId).then(function (response) {
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
