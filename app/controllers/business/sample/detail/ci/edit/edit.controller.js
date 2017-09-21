'use strict';

angular.module('com.app').controller('EditSampleCiCtrl', function ($uibModalInstance, SampleService, toastr, sampleId, checkItem) {
  var vm = this;

  vm.ok = function () {
  	SampleService.updateSampleCi(sampleId, [vm.checkItem]).then(function (response) {
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
