'use strict';

angular.module('com.app').controller('ReportExportCtrl', function ($uibModalInstance, SampleService, toastr, templateMap) {
  var vm = this;

  vm.category = '0';
  vm.templates = [];

  vm.changeCategory = function (category) {
    if (vm.category == '0') {
      vm.templates = templateMap.coverTemplates;
    } else {
      vm.templates = templateMap.reportTemplates;
    }
    if (vm.templates.length == 0) {
      toastr.error('请先上传模板！');
    }
    vm.templateName = vm.templates.length>0 ? vm.templates[0].excelName : null;
  }
  vm.changeCategory('0');


  vm.ok = function () {
    $uibModalInstance.close(vm.templateName);
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
