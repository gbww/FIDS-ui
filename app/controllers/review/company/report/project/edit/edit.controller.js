'use strict';

angular.module('com.app').controller('CompanyReportProjectEditCtrl', function ($uibModalInstance, ReviewService, toastr, project) {
  var vm = this;

	vm.project = project;
	vm.levelArr = ['符合', '不符合', 'N/A']

  vm.ok = function () {
  	ReviewService.editReportProject(vm.project).then(function (response) {
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
