'use strict';

angular.module('com.app').controller('TemplateEditCtrl', function ($uibModalInstance, TemplateService, toastr, template) {
  var vm = this;
  vm.template = template;

  vm.ok = function () {
  	TemplateService.editTemplate(vm.template).then(function (response) {
  		if (response.data.success) {
		  	$uibModalInstance.close();
  		} else {
  			toastr.error(response.data.message);
  		}
  	}).catch(function (err) {
  		toastr.error(err.data);
  	});
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }



});
