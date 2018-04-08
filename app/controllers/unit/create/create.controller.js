'use strict';

angular.module('com.app').controller('UnitCreateCtrl', function ($uibModalInstance, UnitService, toastr) {
  var vm = this;

  vm.unit = {};

  vm.ok = function () {
  	UnitService.addUnit(vm.unit).then(function (response) {
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
