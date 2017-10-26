'use strict';

angular.module('com.app').controller('ReportPreviewCtrl', function ($uibModalInstance, $sce, SampleService, toastr) {
  var vm = this;
  var filepath = '/opt/test.pdf';
  vm.url = $sce.trustAsResourceUrl('http://' + location.host + '/pdfjs/web/viewer.html?file=' + filepath);
});
