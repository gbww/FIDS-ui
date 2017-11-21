'use strict';

angular.module('com.app').controller('PrivilegeRoleEditCtrl', function ($uibModalInstance, PrivilegeService, toastr, role) {
  var vm = this;

  vm.role = angular.copy(role);

  vm.ok = function () {
    var data = {
      name: vm.role.name,
      description: vm.role.description,
      organizationId: vm.role.organizationId
    };
  	PrivilegeService.editRole(vm.role.id, data).then(function (response) {
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
