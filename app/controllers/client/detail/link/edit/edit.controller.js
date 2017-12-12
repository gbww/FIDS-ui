'use strict';

angular.module('com.app').controller('ClientLinkEditCtrl', function ($uibModalInstance, toastr, ClientService, link) {
  var vm = this;

  vm.link = link;

  vm.ok = function () {
  	ClientService.updateClientLink(vm.link).then(function () {
	  	$uibModalInstance.close();
  	})
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }

});
