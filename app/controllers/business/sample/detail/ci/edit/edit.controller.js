'use strict';

angular.module('com.app').controller('EditSampleCiCtrl', function ($rootScope, $uibModalInstance, SampleService, PrivilegeService, toastr, reportId, checkItem, units, organizations) {
	var vm = this;
	$rootScope.loading = false;
	vm.checkItem = angular.copy(checkItem);
	vm.organizations = organizations;
	vm.characterArr = units;
	
	vm.getDepartmentUsers = function () {
		vm.users = [];
		if (vm.checkItem.testRoom) {
			angular.forEach(vm.organizations, function (organization) {
				if (organization.name == vm.checkItem.testRoom) {
					vm.testRoomId = organization.id;
				}
			})
		} else {
			vm.testRoomId = organizations[0].id	
		}
    PrivilegeService.getOrganizationUsers(vm.testRoomId).then(function (response) {
      if (response.data.success) {
        vm.users = response.data.entity;
        if (vm.users.length > 0) {
          vm.checkItem.testUser = vm.users[0].name;
        }
      } else {
        vm.users = [];
      }
    })
	}
	
	vm.users = [];
	vm.getDepartmentUsers();

  vm.ok = function () {
  	SampleService.updateSampleCi(reportId, [vm.checkItem]).then(function (response) {
  		if (response.data.success) {
		  	$uibModalInstance.close(vm.checkItem);
  		} else {
  			toastr.error(response.data.message);
  		}
  	}).catch(function (err) {
  		toastr.error(err.data);
  	})
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
