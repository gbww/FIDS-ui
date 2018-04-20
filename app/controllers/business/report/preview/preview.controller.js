'use strict';

angular.module('com.app').controller('PDFPreviewCtrl', function ($scope, $timeout, $uibModalInstance, $sce, SampleService, dialog) {
  var vm = this;
  vm.url = $sce.trustAsResourceUrl('http://' + location.host + '/pdfjs/web/viewer.html');

  vm.cancel = function () {
    $uibModalInstance.close(false);
  }
})
