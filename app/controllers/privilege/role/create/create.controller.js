'use strict';

angular.module('com.app').controller('PrivilegeRoleCreateCtrl', function ($uibModalInstance, PrivilegeService, toastr) {
  var vm = this;

  vm.role = {};

  vm.ok = function () {
    var data = angular.merge({}, vm.role, {organizationId: -1})
  	PrivilegeService.createRole(data).then(function (response) {
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
