'use strict';

angular.module('com.app').controller('TemplateEditCtrl', function ($uibModalInstance, TemplateService, toastr, template, typeMap) {
  var vm = this;

  vm.coverTypeArr = angular.merge([], typeMap.coverType);
  vm.reportTypeArr = angular.merge(['单页版', '委托版', '标准版', '绿色版', ], typeMap.reportType);

  vm.template = template;
  if (vm.template.category == '0') {
    vm.typeArr = vm.coverTypeArr;
  } else {
    vm.typeArr = vm.reportTypeArr;
  }

  vm.changeCategory = function (category) {
    if (category == '0') {
      vm.typeArr = vm.coverTypeArr;
    } else {
      vm.typeArr = vm.reportTypeArr;
    }
    if (vm.typeArr.length > 0) {
      vm.template.type = vm.typeArr[0];
    }
  }

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
