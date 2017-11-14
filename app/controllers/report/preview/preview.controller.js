'use strict';

angular.module('com.app').controller('ReportPreviewCtrl', function ($uibModalInstance, $uibModal, $sce, SampleService, toastr, sampleId, templateMap) {
  var vm = this;
  // var filepath = '/opt/test.pdf';
  // vm.url = $sce.trustAsResourceUrl('http://' + location.host + '/pdfjs/web/viewer.html?file=' + filepath);

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

  function base64ToBlob (dataURI) {
		var mimeString =  dataURI.match(/:(.*?);/)[1]; // mime类型
		var byteString = atob(dataURI.split(',')[1]); //base64 解码
		var arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
		var intArray = new Uint8Array(arrayBuffer); //创建视图
		for (var i=0,len=byteString.length; i<len; i++) {
			intArray[i] = byteString.charCodeAt(i);
		}
		return new Blob([intArray], {type: mimeString});
  }

  vm.ok = function () {
	  // var reader = new FileReader();
	  // reader.onload = function () {
			// var blob = base64ToBlob(this.result);
			// $uibModalInstance.dismiss();
			// $uibModal.open({
	  //     animation: true,
	  //     windowClass: 'pdf-preview',
	  //     templateUrl: 'controllers/report/preview/pdf/pdf.html',
	  //     controller: 'PDFPreviewCtrl as vm',
	  //     resolve: {
	  //     	blobData: blob
	  //     }
	  //   });
	  // }
	  // reader.readAsDataURL(vm.file);

    SampleService.previewReport(sampleId, vm.templateName).then(function (response) {
      $uibModalInstance.dismiss();
      $uibModal.open({
        animation: true,
        windowClass: 'pdf-preview',
        templateUrl: 'controllers/report/preview/pdf/pdf.html',
        controller: 'PDFPreviewCtrl as vm',
        resolve: {
         filepath: function () {return response.data}
         // filepath: function () { return '/opt/test.pdf' }
        }
      });
    })
	}

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
