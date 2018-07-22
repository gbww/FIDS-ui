'use strict';

angular.module('com.app').controller('EditReportCiCtrl', function ($rootScope, $uibModalInstance, ReportService, toastr, reportId, checkItem, units, organizations) {
	var vm = this;
	$rootScope.loading = false;
  vm.checkItem = angular.copy(checkItem);
	vm.organizations = organizations;

  vm.characterArr = units;

  vm.ok = function () {
  	ReportService.updateReportCi(reportId, [vm.checkItem]).then(function (response) {
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
