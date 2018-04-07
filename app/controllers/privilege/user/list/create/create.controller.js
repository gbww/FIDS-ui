'use strict';

angular.module('com.app').controller('PrivilegeUserCreateCtrl', function ($rootScope, $uibModalInstance, PrivilegeService, toastr, organizations, roles) {
  var vm = this;
  $rootScope.loading = false;

  vm.user = {};
  vm.organizations = organizations;
  vm.user.organizationId = vm.organizations[0].id;
  vm.roles = roles;
  vm.user.roleId = vm.roles[0].id;

  vm.ok = function () {
  	var data = {
  		username: vm.user.username,
      name: vm.user.name,
  		password: vm.user.password,
  		roleId: vm.user.roleId,
  		phone: vm.user.phone,
  		email: vm.user.email,
      description: vm.user.description
  	}
  	PrivilegeService.createUser(vm.user.organizationId, data).then(function (response) {
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
