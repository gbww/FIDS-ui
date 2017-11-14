'use strict';

angular.module('com.app').controller('DBEditCheckItemCtrl', function ($scope, $uibModalInstance, CheckItemService, toastr, checkItem) {
  var vm = this;
  vm.checkItem = angular.copy(checkItem);

  vm.characterArr = ['>', '>=', '<', '<=', '~', '!', '/', '$', '%', '^', '*', '(', ')', '[', ']'];

  vm.ok = function () {
  	CheckItemService.editCheckItem(vm.checkItem.id, vm.checkItem).then(function (response) {
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
