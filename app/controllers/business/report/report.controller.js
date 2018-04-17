'use strict';

angular.module('com.app').controller('ReportCtrl', function ($stateParams, $q, api, toastr, dialog, ReportService) {
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

  vm.startProcess = function (report) {
    var result = dialog.confirm('确认启动报告 ' + report.reportId + ' 流程？');
    result.then(function (res) {
      if (res) {
        ReportService.startProcess(report.receiveSampleId).then(function (response) {
          if (response.data.success) {
            toastr.success('报告 ' + report.reportId + ' 流程已启动!')
            vm.refreshTable();
          }
        });
      }
    });
  }


  vm.export = function (report) {
    var link = document.createElement('a');
    link.href = '/api/v1/ahgz/report/export?receiveSampleId=' + report.receiveSampleId;
    link.download = report.reportId;
    link.click();
  }

  var LODOP;
  vm.preview = function (report) {
    ReportService.getReportHtml(report.receiveSampleId).then(function (response) {
      LODOP = getLodop();
      LODOP.PRINT_INIT('lodop');	
      LODOP.SET_PRINT_PAGESIZE(1,0,0,"A4")
      createOneTask(response.data);
      LODOP.PREVIEW();
    });
  }

  vm.print = function (report) {
    ReportService.getReportHtml(report.receiveSampleId).then(function (response) {
      LODOP = getLodop();
      LODOP.PRINT_INIT('lodop');	
      LODOP.SET_PRINT_PAGESIZE(1,0,0,"A4")
      createOneTask(response.data);
      LODOP.PRINT();
    });
  }

  vm.batchPrint = function () {
    var promiseArr = [];
    angular.forEach(vm.selectedItems, function (id) {
      promiseArr.push(ReportService.getReportHtml(id));
    })
    $q.all(promiseArr).then(function (responses) {
      LODOP = getLodop();
      LODOP.PRINT_INIT('lodop');	
      LODOP.SET_PRINT_PAGESIZE(1,0,0,"A4")

      angular.forEach(responses, function (item) {
        createOneTask(item.data);
      })

      LODOP.PREVIEW();
      // LODOP.PRINT();
    })
  }

  function createOneTask (data) {
    LODOP.NewPageA();
    LODOP.ADD_PRINT_HTM('0', '0', '100%', '100%', replaceStr(data));
  }

  function replaceStr (str) {
    str = str.replace(/\<div.+background\-image\:\s?url\(\'(.+)\'\).+?\<\/div\>/g, function (a, b, c, d) {
      // var src = 'http://10.139.7.88:8089' + b.substring(b.indexOf('/'));
      var src = location.origin + b.substring(b.indexOf('/'));
      return '<img src="' + src + '" />';
    });
    // return str.replace(/(\<br\/\>)+/g, '<div style="page-break-after:always"></div>');
    // return str.replace(/(width\:\s?595px)/g, '$1; height\: 1048px');
    return str.replace(/(width\:\s?595px)/g, 'width: 758px; height\: 1050px');
  }

  // 单选、复选
  vm.itemSelected = [];
  vm.selectedItems = [];
  vm.selectAll = function () {
    if (vm.allSelected){
      vm.selectedItems = [];
      angular.forEach(vm.reports, function (item, idx) {
        vm.selectedItems.push(item.receiveSampleId);
        vm.itemSelected[idx] = true;
      });
    } else {
      vm.selectedItems = [];
      angular.forEach(vm.reports, function (item, idx) {
        vm.itemSelected[idx] = false;
      });
    }
  }

  vm.selectItem = function (event, idx, item) {
    if(event.target.checked){
      vm.selectedItems.push(item.receiveSampleId);
      vm.itemSelected[idx] = true;
      if(vm.selectedItems.length == vm.reports.length){
        vm.allSelected = true;
      }
    } else {
      for (var i=0,len=vm.selectedItems.length; i<len; i++){
        if (item.receiveSampleId == vm.selectedItems[i]) {
          vm.selectedItems.splice(i, 1);
          break;
        }
      };
      vm.itemSelected[idx] = false;
      vm.allSelected = false;
    }
  }
});
