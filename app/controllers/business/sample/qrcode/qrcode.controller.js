'use strict';

angular.module('com.app').controller('QrcodeCtrl', function ($uibModalInstance, reportId) {
  var vm = this;
  vm.reportId = reportId

  setTimeout(function (){
    var qrcode = new QRCode(document.getElementById("qrcode"), {
      width: 128,
      height: 128,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });
    qrcode.makeCode("http://47.96.92.187:8080/WebReport/ReportServer?reportlet=erweima.cpt&reportId=" + reportId)
  }, 0)

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }

})