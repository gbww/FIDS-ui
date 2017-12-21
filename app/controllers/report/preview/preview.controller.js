'use strict';

angular.module('com.app').controller('ReportPreviewCtrl', function ($uibModalInstance, $uibModal, $sce, SampleService, toastr, sampleId, templateMap) {
  var vm = this;

  vm.sampleId = sampleId;
  vm.category = '0';
  vm.templates = [];

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
    SampleService.previewReport(sampleId, vm.templateName).then(function (response) {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'pdf-preview',
        templateUrl: 'controllers/report/preview/pdf/pdf.html',
        controller: 'PDFPreviewCtrl as vm',
        resolve: {
          sampleId: function () {return vm.sampleId;},
          filepath: function () {return response.data.entity;}
        }
      });
      modalInstance.result.then(function (res) {
        if (res) {
          $uibModalInstance.close();
        } else {
          $uibModalInstance.dismiss();
        }
      })
    })
	}

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
