'use strict';

angular.module('com.app').controller('RecordCiResultCtrl', function ($uibModalInstance, SampleService, toastr, checkItem) {
  var vm = this;
  vm.checkItem = angular.copy(checkItem);

  vm.ok = function () {
    var data = angular.merge({}, vm.checkItem, {status: 2});
  	SampleService.updateSampleCi(vm.checkItem.receiveSampleId, [data]).then(function (response) {
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
