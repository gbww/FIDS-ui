'use strict';

angular.module('com.app').controller('PrivilegeUserTypeEditCtrl', function ($rootScope, $uibModalInstance, PrivilegeService, toastr, user) {
  var vm = this;
  vm.userTypeArr = ['编制人', '审核人', '批准人'];
  vm.user = {type: user.type};

  vm.ok = function () {
    var data = {
      id: user.id,
  		userId: user.userId,
  		name: user.name,
      type: vm.user.type
  	}
  	PrivilegeService.editUserType(data).then(function (response) {
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

})