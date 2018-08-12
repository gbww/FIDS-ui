'use strict';

angular.module('com.app').controller('ReportInspectionCtrl', function ($rootScope, $state, $stateParams, $q, $filter, api, toastr, ReportService, users, templates) {
  var vm = this;
  $rootScope.loading = false;

  vm.status = $stateParams.status;
  vm.type = $stateParams.type;
  vm.taskId = $stateParams.taskId;
  vm.users = users;

  var businessBC = api.breadCrumbMap.business;
  var report = angular.copy(businessBC.report.root);
  report.params = {
    status: vm.status,
    pageSize: $stateParams.pageSize,
    pageNum: $stateParams.pageNum,
    orderBy: $stateParams.orderBy,
    reverse: $stateParams.reverse,
    reportId: $stateParams.reportId,
    sampleName: $stateParams.sampleName,
    entrustedUnit: $stateParams.entrustedUnit,
    inspectedUnit: $stateParams.inspectedUnit,
    productionUnit: $stateParams.productionUnit,
    receiveSampleId: $stateParams.receiveSampleId,
    executeStandard: $stateParams.executeStandard,
    sampleType: $stateParams.sampleType,
    checkType: $stateParams.checkType,
    startTime: $stateParams.startTime,
    endTime: $stateParams.endTime
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
      report: ReportService.getReportInfo($stateParams.id),
      checkItem: ReportService.getReportCi($stateParams.id)
    }).then(function (response) {
      if (response.report.data.success) {
        vm.report = response.report.data.entity.receiveSample;

        var reportExtend = response.report.data.entity.reportExtend;
        if (reportExtend) {
          angular.forEach(templates, function (item) {
            if (item.id === reportExtend.templateId) {
              vm.template = item.name;
            }
          });
        }
      } else {
        toastr.error(response.report.data.message);
      }

      if (response.checkItem.data.success) {
        vm.checkItems = response.checkItem.data.entity;
      } else {
        toastr.error(response.checkItem.data.message);
      }
      if (vm.report.reportProcessId) {
        return ReportService.getComments(vm.report.reportProcessId)
      } else {
        return {
          data: {
            entity: [],
            success: true
          }
        }
      }
    }).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        var data = $filter('orderBy')(response.data.entity, 'time', false);
        var res = '';
        angular.forEach(data, function (item) {
          res += item.time + '  ' + item.message + '\r\n'
        })
        vm.comments = res;
        // var commentDict = {};
        // angular.forEach(response.data.entity, function (item) {
        //   if (!commentDict[item.fullMessage.split(':')[0]]) {
        //     commentDict[item.fullMessage.split(':')[0]] = [];
        //   }
        //   commentDict[item.fullMessage.split(':')[0]].push(item.fullMessage.split(':')[0]);
        // })
        // vm.bzComment = commentDict['编制意见'];
        // vm.shComment = commentDict['审核意见'];
        // vm.pzComment = commentDict['批准意见'];
      } else {
        toastr.error(response.data.message);
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

  vm.ok = function (form) {
    if (form.$invalid) {
      vm.submitted = true;
      return;
    }
    if (vm.type === 'sh') {
      var data = {
        approvePersonName: vm.report.approvalUser,
        reportId: vm.report.reportId,
        reportProcessId: vm.report.reportProcessId,
        pass: vm.pass === 'true' ? true : false,
        comment: vm.comment,
      };
      if (!data.pass && !vm.report.approvalUser) {
        delete data.approvePersonName;
      }

      ReportService.updateReport(vm.report).then(function (response) {
        return ReportService.runExamineTask(vm.taskId, data);
      }).then(function (response) {
        if (response.data.success) {
          $state.go('app.business.report', { status: vm.status });
        } else {
          toastr.error(response.data.message);
        }
      });
    } else if (vm.type === 'pz') {
      var data = {
        pass: vm.pass === 'true' ? true : false,
        reportId: vm.report.reportId,
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
