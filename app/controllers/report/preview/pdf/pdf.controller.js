'use strict';

angular.module('com.app').controller('PDFPreviewCtrl', function ($uibModalInstance, $sce, filepath) {
  var vm = this;

  // vm.url = $sce.trustAsResourceUrl('http://' + location.host + '/pdfjs/web/viewer.html?file=' + encodeURIComponent(URL.createObjectURL(blobData)));
  vm.url = $sce.trustAsResourceUrl('http://' + location.host + '/pdfjs/web/viewer.html?file=' + filepath);

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
})
