'use strict';

angular.module('com.app').controller('ContractSampleCtrl', function ($uibModalInstance, sample) {
  var vm = this;
  vm.sample = sample;

  vm.ok = function () {
    $uibModalInstance.close(vm.comment);
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
