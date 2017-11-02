'use strict';

angular.module('com.app').controller('ReportExportCtrl', function ($uibModalInstance, SampleService, toastr, sampleId, templateMap) {
  var vm = this;

  vm.sampleId = sampleId;
  vm.category = '0';
  vm.templates = [];
  vm.type = 'excel';

  vm.changeCategory = function (category) {
    if (vm.category == '0') {
      vm.templates = templateMap.coverTemplates;
    } else if (vm.category == '1') {
      vm.templates = templateMap.reportTemplates;
    } else if (vm.category == '2') {
      vm.templates = templateMap.bothTemplates;
    }
    if (vm.templates.length == 0) {
      toastr.error('请先上传模板！');
    }
    vm.templateName = vm.templates.length>0 ? vm.templates[0].excelName : null;
  }
  vm.changeCategory('0');


  vm.ok = function () {
    $uibModalInstance.close({
      name: vm.templateName,
      type: vm.type
    });
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
