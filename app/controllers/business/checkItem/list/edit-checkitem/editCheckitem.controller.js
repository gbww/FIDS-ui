'use strict';

angular.module('com.app').controller('BusinessEditCheckItemCtrl', function ($scope, $uibModalInstance, CheckItemService, toastr, checkItem) {
  var vm = this;
  vm.checkItem = angular.merge({}, checkItem, {detectionLimit: new Date(checkItem.detectionLimit)});

  vm.ok = function () {
  	CheckItemService.editCheckItem(vm.checkItem.id, vm.checkItem).then(function (response) {
  		if (response.data.success) {
		  	$uibModalInstance.close(vm.checkItem);
  		} else {
  			toastr.error(response.data.message);
  		}
  	}).catch(function (err) {
  		toastr.error(err.data.message);
  	})
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
