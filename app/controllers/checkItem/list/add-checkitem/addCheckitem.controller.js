'use strict';

angular.module('com.app').controller('DBAddCheckItemCtrl', function ($scope, $uibModalInstance, CheckItemService, toastr, organizations) {
  var vm = this;
	vm.checkItem = {
		subpackage: 0
	};
	vm.organizations = organizations;

  vm.characterArr = ['>', '>=', '<', '<=', '~', '!', '/', '$', '%', '^', '*', '(', ')', '[', ']'];

  vm.ok = function () {
  	CheckItemService.recordCheckItem(vm.checkItem).then(function (response) {
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
