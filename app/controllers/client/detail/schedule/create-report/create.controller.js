'use strict';

angular.module('com.app').controller('ClientReportCreateCtrl', function ($uibModalInstance, toastr, ClientService, scheduleId) {
  var vm = this;

  vm.report = {clientSchedulerId: scheduleId};
  vm.ok = function () {
  	ClientService.addScheduleReport(vm.report).then(function () {
	  	$uibModalInstance.close();
  	})
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }

});
