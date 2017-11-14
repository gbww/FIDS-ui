'use strict';

angular.module('com.app').controller('RecordCiResultCtrl', function ($uibModalInstance, SampleService, toastr, checkItems) {
  var vm = this;

  vm.checkItem = angular.copy(checkItems[0]);
  vm.resultArr = ['合格', '不合格'];

  vm.changeResult = function () {
    // if ($scope.$eval(vm.checkItem.measuredValue + vm.checkItem.standardValue)) {
    if (vm.checkItem.measuredValue <= vm.checkItem.standardValue.replace(/[^\d\.]/g, '')) {
      vm.checkItem.itemResult = '合格';
    } else {
      vm.checkItem.itemResult = '不合格';
    }
  }

  vm.ok = function () {
    var data = angular.copy(checkItems);
    angular.forEach(data, function (item) {
      angular.merge(item, {
        measuredValue: vm.checkItem.measuredValue,
        itemResult: vm.checkItem.itemResult,
        status: 2
      })
    })
    // var data = angular.merge({}, vm.checkItem, {status: 2});
  	// SampleService.updateSampleCi(vm.checkItem.receiveSampleId, [data]).then(function (response) {
    SampleService.batchRecordCiResult(data).then(function (response) {
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
