'use strict';

angular.module('com.app').controller('BusinessEditCatalogCtrl', function ($scope, $uibModalInstance, node) {
  var vm = this;

  vm.catalog = {
    id: node.id,
    productId: node.productId,
    productName: node.name,
    parentId: node.parentId,
    isCatalog: node.isCatalog
  }

  vm.ok = function () {
  	$uibModalInstance.close(vm.catalog);
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
