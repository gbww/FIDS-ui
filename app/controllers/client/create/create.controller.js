'use strict';

angular.module('com.app').controller('ClientCreateCtrl', function ($uibModalInstance, toastr, ClientService) {
  var vm = this;

  vm.bankArr = ['人民银行', '工商银行', '农业银行', '建设银行', '招商银行', '交通银行'];

  vm.client = {};
  vm.ok = function () {
  	vm.client.clientAddress = angular.copy(vm.address);
  	ClientService.addClient(vm.client).then(function () {
	  	$uibModalInstance.close();
  	})
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }

});
