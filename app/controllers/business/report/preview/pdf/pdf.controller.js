'use strict';

angular.module('com.app').controller('PDFPreviewCtrl', function ($scope, $timeout, $uibModalInstance, $sce, SampleService, dialog, sampleId, filepath) {
  var vm = this;
  vm.show = false;

  vm.url = $sce.trustAsResourceUrl('http://' + location.host + '/pdfjs/web/viewer.html?file=' + filepath);

  $timeout(function () {
    var iwin = document.getElementById('pdfIframe').contentWindow;
    var afterPrint = function () {
      if (vm.show) {
        return;
      }
      vm.show = true;
      var result = dialog.confirm('是否已完成报告的所有打印工作?');
      result.then(function (res) {
        vm.show = false;
        if (res) {
          SampleService.getSampleInfo(sampleId).then(function (response) {
            if (response.data.success) {
              var data = response.data.entity;
              data.reportStatus = 4;
              SampleService.editSample(data).then(function () {
                $uibModalInstance.close(true);
              });
            }
          });
        }
      });
    };

    var matchFunc = function (e) {
      if (e.matches) {
        afterPrint();
      }
    }

    if (iwin.matchMedia) {
      var mediaQueryList = iwin.matchMedia('print');
      mediaQueryList.addListener(matchFunc);
    } else {
      iwin.addEventListener('afterprint', afterPrint);
    }

    $scope.$on('$stateChangeStart', function (event, toState) {
      if (toState.name.indexOf('report') === -1) {
        if (iwin.matchMedia) {
          var mediaQueryList = iwin.matchMedia('print');
          mediaQueryList.removeListener(matchFunc);
        } else{
          iwin.removeEventListener('afterprint', afterPrint);
        }
      }
    });
  }, 100);

  vm.cancel = function () {
    $uibModalInstance.close(false);
  }
})
