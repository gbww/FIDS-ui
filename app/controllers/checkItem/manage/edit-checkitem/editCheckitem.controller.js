'use strict';

angular.module('com.app').controller('ManageEditCheckItemCtrl', function ($rootScope, $scope, $uibModalInstance, CheckItemService, toastr, checkItem, units, organizations) {
	var vm = this;
	$rootScope.loading = false;
	vm.checkItem = angular.merge({}, checkItem, {
		catalogId: checkItem.catalog_id,
		checkItemId: checkItem.check_item_id,
		standardValue: checkItem.standard_value,
		detectionLimit: checkItem.detection_limit,
		quantitationLimit: checkItem.quantitation_limit,
		defaultPrice: checkItem.default_price,
		updatedAt: checkItem.updated_at,
		createdAt: checkItem.created_at
	});
	delete vm.checkItem.catalog_id;
	delete vm.checkItem.check_item_id;
	delete vm.checkItem.standard_value;
	delete vm.checkItem.detection_limit;
	delete vm.checkItem.quantitation_limit;
	delete vm.checkItem.default_price;
	delete vm.checkItem.updated_at;
	delete vm.checkItem.created_at;
	vm.organizations = organizations;
  vm.characterArr = units;

  vm.ok = function () {
  	CheckItemService.editCatalogCi(vm.checkItem).then(function (response) {
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
