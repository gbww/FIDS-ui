'use strict';

angular.module('com.app').controller('EditReportCiCtrl', function ($uibModalInstance, ReportService, toastr, sampleId, checkItem) {
  var vm = this;
  vm.checkItem = angular.copy(checkItem);

  vm.characterArr = ['>', '>=', '<', '<=', '~', '!', '/', '$', '%', '^', '*', '(', ')', '[', ']'];

  vm.ok = function () {
  	ReportService.updateReportCi(sampleId, [vm.checkItem]).then(function (response) {
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
