'use strict';

angular.module('com.app').controller('ClientScheduleEditCtrl', function ($uibModalInstance, toastr, ClientService, schedule) {
  var vm = this;

  vm.schedule = schedule;

  vm.ok = function () {
  	ClientService.updateClientSchedule(vm.schedule).then(function () {
	  	$uibModalInstance.close();
  	})
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }

});
