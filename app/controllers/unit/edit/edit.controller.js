'use strict';

angular.module('com.app').controller('UnitEditCtrl', function ($uibModalInstance, UnitService, toastr, unit) {
  var vm = this;

  vm.unit = angular.copy(unit);

  vm.ok = function () {
  	UnitService.updateUnit(vm.unit).then(function (response) {
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
