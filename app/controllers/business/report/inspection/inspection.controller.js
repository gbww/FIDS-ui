'use strict';

angular.module('com.app').controller('ReportInspectionCtrl', function ($state, $stateParams, $q, api, toastr, SampleService, ReportService, users) {
  var vm = this;

  vm.status = $stateParams.status;
  vm.type = $stateParams.type;
  vm.taskId = $stateParams.taskId;
  vm.users = users;

  var businessBC = api.breadCrumbMap.business;
  var report = angular.copy(businessBC.report.root);
  report.params = {
    status: vm.status
  }
  vm.breadCrumbArr = [businessBC.root, report, businessBC.report.inspection];

  if (vm.type === 'sh' || vm.type === 'pz') {
    vm.pass = 'true';
  }

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

  vm.ok = function () {
    if (vm.type === 'sh') {
      var data = {
        approvePersonName: vm.report.approvalUser,
        receiveSampleId: vm.report.receiveSampleId,
        reportProcessId: vm.report.reportProcessId,
        pass: vm.pass === 'true' ? true : false,
        comment: vm.comment,
      };
      if (!data.pass && !vm.approvalUser) {
        delete data.approvePersonName;
      }
      ReportService.runExamineTask(vm.taskId, data).then(function (response) {
        if (response.data.success) {
          if (vm.report.approvalUser) {
            ReportService.updateReport(angular.merge(vm.report, {reportStatus: 2})).then(function (response) {
              $state.go('app.business.report', { status: vm.status });
            })
          }
        } else {
          toastr.error(response.data.message);
        }
      })
    } else if (vm.type === 'pz') {
      var data = {
        pass: vm.pass === 'true' ? true : false,
        receiveSampleId: vm.report.receiveSampleId,
        reportProcessId: vm.report.reportProcessId,
        comment: vm.comment,
      };
      ReportService.runApproveTask(vm.taskId, data).then(function (response) {
        if (response.data.success) {
          $state.go('app.business.report', { status: vm.status });
        } else {
          toastr.error(response.data.message);
        }
      });
    }
  }

});
