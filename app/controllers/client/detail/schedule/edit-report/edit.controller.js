'use strict';

angular.module('com.app').controller('ClientReportEditCtrl', function ($uibModalInstance, toastr, ClientService, report) {
  var vm = this;

  vm.report = report;

  vm.ok = function () {
  	ClientService.updateScheduleReport(vm.report).then(function () {
	  	$uibModalInstance.close();
  	})
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }

});
