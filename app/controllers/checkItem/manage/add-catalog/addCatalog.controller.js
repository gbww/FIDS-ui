'use strict';

angular.module('com.app').controller('CustomAddCatalogCtrl', function ($scope, $uibModalInstance, isCatalog) {
  var vm = this;
  vm.isCatalog = isCatalog;
  if (isCatalog === null || isCatalog === true) {
    vm.catalog = {
      isCatalog: '1'
    }
  } else {
    vm.catalog = {
      isCatalog: '0'
    }
  }

  vm.ok = function () {
  	$uibModalInstance.close(vm.catalog);
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
