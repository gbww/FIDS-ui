'use strict';

angular.module('com.app').controller('CiSampleDetailCtrl', function ($stateParams, $q, api, toastr, SampleService, ReportService) {
  var vm = this;

  vm.status = $stateParams.status;

  var businessBC = api.breadCrumbMap.business;
  var itemToCheck = angular.copy(businessBC.itemToCheck.root);
  itemToCheck.params = {
    status: vm.status
  }
  vm.breadCrumbArr = [businessBC.root, itemToCheck, businessBC.itemToCheck.detail];

  vm.showReport = true;
  vm.showReportCi = true;


  vm.getReportInfo = function () {
    vm.loading = true;
    $q.all({
      report: SampleService.getSampleInfo($stateParams.id),
      checkItem: ReportService.getReportCi($stateParams.id)
    }).then(function (response) {
      vm.loading = false;
      if (response.report.data.success) {
        vm.report = response.report.data.entity;
      } else {
        toastr.error(response.report.data.message);
      }

      if (response.checkItem.data.success) {
        vm.checkItems = response.checkItem.data.entity;
      } else {
        toastr.error(response.checkItem.data.message);
      }
    }).catch(function (err) {
      vm.loading = false;
      toastr.error(err.data);
    });
  };
  vm.getReportInfo();


  vm.downloadFile = function (filepath) {
    var filename = filepath.substring(filepath.lastIndexOf('/')+1);
    var link = document.createElement('a');
    link.href = '/api/v1/ahgz/receive/attachment/download?path=' + filepath;
    link.download = filename;
    link.click();
  };

});

