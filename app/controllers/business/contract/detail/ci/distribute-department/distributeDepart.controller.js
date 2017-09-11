'use strict';

angular.module('com.app').controller('CiDistributeDepartCtrl', function ($scope, $uibModalInstance) {
  var vm = this;

  vm.departments = ['检测一部', '检测二部', '检测三部'];

  vm.ok = function () {
  	$uibModalInstance.close();
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
