'use strict';

angular.module('com.app').controller('PrivilegeOrganizationEditCtrl', function ($uibModalInstance, PrivilegeService, toastr, organization) {
  var vm = this;

  vm.organization = angular.copy(organization);

  vm.ok = function () {
    var data = {
      name: vm.organization.name,
      description: vm.organization.description,
      parent: vm.organization.parent
    };
  	PrivilegeService.editOrganization(vm.organization.id, data).then(function (response) {
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
