'use strict';

angular.module('com.app').controller('ReportCtrl', function ($scope, $state, $stateParams, $uibModal, $timeout, api, toastr, ReportService) {
  var vm = this;
  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.report.root];

  vm.searchObject = {}

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'toggle') {
      vm.searchObject.toggle = true;
    }
  }

  vm.searchConditions = {
    reportId: null,
    receiveSampleId: null,
    sampleName: null,
    entrustedUnit: null,
    inspectedUnit: null,
    productionUnit: null,
    executeStandard: null,
    sampleType: null,
    checkType: null,
    startTime: null,
    endTime: null
  };
  vm.reportIdArr = [], vm.sampleNameArr = [], vm.entrustedUnitArr = [], vm.inspectedUnitArr = [],
    vm.productionUnitArr = [], vm.sampleIdArr = [], vm.exeStandardArr = [], vm.sampleTypeArr = [], vm.checkTypeArr = [];

  vm.status = !!$stateParams.status ? parseInt($stateParams.status) : 5;
  // 是否显示已处理任务
  vm.showHandled = false;
  vm.reports = [];
  vm.loading = true;
  vm.getReportList = function (tableState) {
    var orderBy = tableState.sort.predicate;
    var reverse = tableState.sort.reverse ? 'desc' : 'asc';
    if (orderBy == 'reportId') {
      orderBy = 'report_id'
    } else if (orderBy == 'createdAt') {
      orderBy = 'created_at'
    }
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
      "order": orderBy ? [orderBy, reverse].join(' ') : null
    }, tempTotal = 0;
    ReportService.getReportList(tableParams, vm.searchObject, vm.status).then(function (response) {
      if (response.data.success) {
        vm.tempReports = response.data.entity.list;
        tempTotal = response.data.entity.total;
        tableState.pagination.numberOfPages = response.data.entity.pages;
      } else {
        tempTotal = 0;
        toastr.error(response.data.message);
      }

      if (vm.status === 0 || vm.status === 1 || vm.status === 2) {
        if (!vm.showHandled) {
          return ReportService.getUserTask('0');
        } else {
          return ReportService.getUserTask('1');
        }
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
        vm.userTasks = response.data.entity;
        /*
         ** 若用户有任务，则将任务信息放入报告中，
         ** 即报告存在task，则表明该报告是用户的代办项
         */
        angular.forEach(vm.tempReports, function (report) {
          angular.forEach(vm.userTasks, function (task) {
            if (report.reportProcessId == task.processInstanceId) {
              report.task = task;
            }
          })
        });
        /* 列出所有报告，不过滤 */
        if (vm.status === 5 || vm.status === 4 || vm.status === 3) {
          vm.reports = angular.copy(vm.tempReports);
        } else {
          vm.reports = [];
          angular.forEach(vm.tempReports, function (report) {
            if (report.task) {
              vm.reports.push(report);
            } else {
              tempTotal -= 1;
            }
          })
        }
        vm.total = tempTotal;
        angular.forEach(vm.tempReports, function (item) {
          if (vm.reportIdArr.indexOf(item.reportId) == -1) {
            vm.reportIdArr.push(item.reportId);
          }
          if (vm.sampleIdArr.indexOf(item.receiveSampleId) == -1) {
            vm.sampleIdArr.push(item.receiveSampleId);
          }
          if (item.sampleName && vm.sampleNameArr.indexOf(item.sampleName) == -1) {
            vm.sampleNameArr.push(item.sampleName);
          }
          if (item.entrustedUnit && vm.entrustedUnitArr.indexOf(item.entrustedUnit) == -1) {
            vm.entrustedUnitArr.push(item.entrustedUnit);
          }
          if (item.inspectedUnit && vm.inspectedUnitArr.indexOf(item.inspectedUnit) == -1) {
            vm.inspectedUnitArr.push(item.inspectedUnit);
          }
          if (item.productionUnit && vm.productionUnitArr.indexOf(item.productionUnit) == -1) {
            vm.productionUnitArr.push(item.productionUnit);
          }
          if (item.executeStandard && vm.exeStandardArr.indexOf(item.executeStandard) == -1) {
            vm.exeStandardArr.push(item.executeStandard);
          }
          if (item.sampleType && vm.sampleTypeArr.indexOf(item.sampleType) == -1) {
            vm.sampleTypeArr.push(item.sampleType);
          }
          if (item.checkType && vm.checkTypeArr.indexOf(item.checkType) == -1) {
            vm.checkTypeArr.push(item.checkType);
          }
        })
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      vm.loading = false;
      toastr.error(err.data);
    })
  }

  vm.searchStatus = function (filter) {
    if (vm.status != filter) {
      vm.status = filter;
      vm.showHandled = false;
      vm.refreshTable('toggle');
    }
  }

  vm.toggleTable = function () {
    vm.showHandled = !vm.showHandled;
    vm.refreshTable('toggle');
  }

  vm.back = function () {
    vm.advance = false;
    angular.merge(vm.searchConditions, {
      receiveSampleId: null,
      sampleName: null,
      entrustedUnit: null,
      inspectedUnit: null,
      productionUnit: null,
      executeStandard: null,
      sampleType: null,
      checkType: null,
      startTime: null,
      endTime: null
    });
  }

  vm.reset = function () {
    angular.merge(vm.searchConditions, {
      reportId: null,
      receiveSampleId: null,
      sampleName: null,
      entrustedUnit: null,
      inspectedUnit: null,
      productionUnit: null,
      executeStandard: null,
      sampleType: null,
      checkType: null,
      startTime: null,
      endTime: null
    });
  }

  vm.search = function () {
    vm.searchObject = angular.copy(vm.searchConditions);
  }

  vm.eventSearch = function (e) {
    var keycode = window.event ? e.keyCode : e.which;
    if (keycode == 13) {
      vm.searchObject.searchKeywords = vm.query;
    }
  }


  vm.export = function (report) {
    var link = document.createElement('a');
    link.href = '/api/v1/ahgz/report/export?receiveSampleId=' + report.receiveSampleId;
    link.download = report.reportId;
    link.click();
  }



  vm.preview = function (sample) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      templateUrl: 'controllers/business/report/preview/preview.html',
      controller: 'ReportPreviewCtrl as vm',
      resolve: {
        sampleId: function () {
          return sample.receiveSampleId;
        }
      }
    });
    modalInstance.result.then(function () {
      vm.refreshTable();
    });
  }
});
