'use strict';

angular.module('com.app').controller('ReviewCompanyReportEditCtrl', function ($uibModalInstance, ReviewService, toastr, report) {
  var vm = this;

  vm.report = report;

  vm.ok = function () {
  	ReviewService.editReport(vm.report).then(function (response) {
  		if (response.data.success) {
		  	$uibModalInstance.close();
  		} else {
  			toastr.error(response.data.message);
  		}
  	})
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
