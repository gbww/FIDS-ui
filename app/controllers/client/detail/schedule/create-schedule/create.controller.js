'use strict';

angular.module('com.app').controller('ClientScheduleCreateCtrl', function ($uibModalInstance, toastr, ClientService, clientId) {
  var vm = this;

  vm.schedule = {
    clientNum: clientId,
    schedulerRepetition: '无'
  };
  vm.ok = function () {
  	ClientService.addClientSchedule(vm.schedule).then(function () {
	  	$uibModalInstance.close();
  	})
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }

});
