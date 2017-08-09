'use strict';

angular.module('com.app').controller('ContractJudgeCtrl', function ($scope, $uibModalInstance) {
  var vm = this;

  vm.ok = function () {
  	$uibModalInstance.close();
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss('abc');
  }
});
