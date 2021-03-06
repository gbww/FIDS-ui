'use strict';

angular.module('com.app').controller('CiDistributeActionCtrl', function ($rootScope, $scope, $uibModalInstance, CiDistributeService, PrivilegeService, checkItems, departments) {
  var vm = this;
  $rootScope.loading = false;

  vm.checkItem = angular.copy(checkItems[0]);
  vm.departments = departments;


  vm.getDepartmentUsers = function () {
    vm.users = [];
    PrivilegeService.getOrganizationUsers(vm.testRoomId).then(function (response) {
      if (response.data.success) {
        vm.users = response.data.entity;
        vm.testUser = vm.checkItem.testUser;
        var users = vm.users.map(function (user) {
          return user.name
        })
        if (vm.users.length > 0 && users.indexOf(vm.testUser) === -1) {
          vm.testUser = vm.users[0].name;
        }
      } else {
        vm.users = [];
      }
    })
  }


  if (vm.checkItem.testRoom) {
    angular.forEach(vm.departments, function (department) {
      if (department.name == vm.checkItem.testRoom) {
        vm.testRoomId = department.id;
      }
    })
  } else {
    vm.testRoomId = vm.departments[0].id;
  }

  vm.users = [];

  if (vm.testRoomId) {
    vm.getDepartmentUsers();
  }

  vm.ok = function () {
    var testRoom = '';
    angular.forEach(vm.departments, function (department) {
      if (department.id == vm.testRoomId) {
        testRoom = department.name;
      }
    })
    var data = angular.copy(checkItems);
    angular.forEach(data, function (item) {
    	angular.merge(item, {
    		testRoom: testRoom,
    		testUser: vm.testUser,
        status: 1
    	});
    })
  	CiDistributeService.distributeSampleCi(data).then(function (response) {
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
