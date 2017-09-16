'use strict';

angular.module('com.app').controller('DBAddCheckItemCtrl', function ($scope, $uibModalInstance, CheckItemService, toastr) {
  var vm = this;
  vm.checkItem = {};

  vm.ok = function () {
  	CheckItemService.recordCheckItem(vm.checkItem).then(function (response) {
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
