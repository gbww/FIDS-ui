'use strict';

angular.module('com.app').controller('PrivilegeOrganizationCreateCtrl', function ($uibModalInstance, PrivilegeService, toastr) {
  var vm = this;

  vm.organization = {};

  vm.ok = function () {
    var data = angular.merge({}, vm.organization, {parent: -1})
  	PrivilegeService.createOrganization(data).then(function (response) {
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
