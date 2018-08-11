'use strict';

angular.module('com.app').controller('RecordCiResultCtrl', function ($uibModalInstance, CiResultRecordService, toastr, checkItems, units) {
  var vm = this;
  vm.characterArr = units;

  vm.resultArr = ['合格', '不合格'];
  vm.checkItem = angular.copy(checkItems[0]);
  vm.checkItem.itemResult = vm.resultArr[0];

  vm.ok = function () {
    var data = angular.copy(checkItems);
    angular.forEach(data, function (item) {
      angular.merge(item, {
        detectionLimit: vm.checkItem.detectionLimit,
        quantitationLimit: vm.checkItem.quantitationLimit,
        device: vm.checkItem.device,
        unit: vm.checkItem.unit,
        standardValue: vm.checkItem.standardValue,
        measuredValue: vm.checkItem.measuredValue,
        itemResult: vm.checkItem.itemResult,
        // status: 2
      });
    });
    CiResultRecordService.batchRecordCiResult(data).then(function (response) {
  		if (response.data.success) {
		  	$uibModalInstance.close();
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
