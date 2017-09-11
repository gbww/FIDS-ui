'use strict';

angular.module('com.app').controller('DistributeEmployeeCtrl', function ($scope, $uibModalInstance) {
  var vm = this;

  vm.employees = ['张三', '李四', '王五'];

  vm.ok = function () {
  	$uibModalInstance.close();
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
