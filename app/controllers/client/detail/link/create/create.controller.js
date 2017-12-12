'use strict';

angular.module('com.app').controller('ClientLinkCreateCtrl', function ($uibModalInstance, toastr, ClientService, clientId) {
  var vm = this;

  vm.link = {clientNum: clientId};
  vm.ok = function () {
  	ClientService.addClientLink(vm.link).then(function () {
	  	$uibModalInstance.close();
  	})
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }

});
