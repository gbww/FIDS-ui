'use strict';

angular.module('com.app').controller('BusinessAddCatalogCtrl', function ($scope, $uibModalInstance) {
  var vm = this;
  vm.catalog = {
  	isCatalog: '1'
  }

  vm.ok = function () {
  	$uibModalInstance.close(vm.catalog);
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
