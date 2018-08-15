'use strict';

angular.module('com.app').controller('ReportCtrl', function ($rootScope, $stateParams, $cookies, $q, $uibModal, $interval, api, toastr, dialog, ReportService) {
  var vm = this;
  vm.hasCheckAuth = api.permissionArr.indexOf('REPORT-DETAIL-1') != -1;

  vm.hasAllAuth = api.permissionArr.indexOf('REPORT-LIST-ALL-GET-1') != -1;
  vm.hasEditAuth = api.permissionArr.indexOf('REPORT-LIST-EDIT-GET-1') != -1;
  vm.hasExamineAuth = api.permissionArr.indexOf('REPORT-LIST-EXAMINE-GET-1') != -1;
  vm.hasApproveAuth = api.permissionArr.indexOf('REPORT-LIST-APPROVE-GET-1') != -1;
  vm.hasPrintAuth = api.permissionArr.indexOf('REPORT-LIST-PRINT-GET-1') != -1;
  vm.hasFinishAuth = api.permissionArr.indexOf('REPORT-LIST-FINISH-GET-1') != -1;

  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.report.root];

  vm.searchObject = {}

  vm.refreshTable = function (flag) {
    vm.allSelected = false;
    vm.itemSelected = [];
    vm.selectedItems = [];
    vm.searchObject.timestamp = new Date();
    if (flag == 'reset') {
      vm.searchObject.reset = true;
    }
  }


  vm.pageNum = parseInt($stateParams.pageNum) || null
  vm.pageSize = parseInt($stateParams.pageSize) || null
  vm.orderBy = $stateParams.orderBy || null
  vm.reverse = $stateParams.reverse === 'true'

  vm.searchConditions = {
    reportId: $stateParams.reportId || null,
    sampleName: $stateParams.sampleName || null,
    entrustedUnit: $stateParams.entrustedUnit || null,
    inspectedUnit: $stateParams.inspectedUnit || null,
    productionUnit: $stateParams.productionUnit || null,
    receiveSampleId: $stateParams.receiveSampleId || null,
    executeStandard: $stateParams.executeStandard || null,
    sampleType: $stateParams.sampleType || null,
    checkType: $stateParams.checkType || null,
    startTime: $stateParams.startTime || null,
    endTime: $stateParams.endTime || null
  };
  vm.reportIdArr = [], vm.sampleNameArr = [], vm.entrustedUnitArr = [], vm.inspectedUnitArr = [],
    vm.productionUnitArr = [], vm.sampleIdArr = [], vm.exeStandardArr = [], vm.sampleTypeArr = [], vm.checkTypeArr = [];

  var status = 4;
  if (!vm.hasPrintAuth) {
    status = 0; 
  } else if (!vm.hasEditAuth) {
    status = 1;
  } else if (!vm.hasExamineAuth) {
    status = 2;
  } else if (!vm.hasApproveAuth) {
    status = 3;
  } else if (!vm.hasAllAuth) {
    status = 5;
  }

  if ($stateParams.status === 0) {
    vm.status = 0;
  } else {
    vm.status = !!$stateParams.status ? parseInt($stateParams.status) : status;
  }
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
    } else if (orderBy === 'sampleName') {
      orderBy = 'sample_name'
    } else if (orderBy === 'entrustedUnit') {
      orderBy = 'entrusted_unit'
    } else if (orderBy === 'receiveDate') {
      orderBy = 'receive_date'
    } else if (orderBy === 'finishDate') {
      orderBy = 'finish_date'
    }
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
      "order": orderBy ? [orderBy, reverse].join(' ') : null
    };
    var isHandle = null;
    if (vm.status === 0 || vm.status === 1 || vm.status === 2) {
      isHandle = vm.showHandled ? '1' : '0';
    }

    vm.pageNum = tableParams.pageNum
    vm.pageSize = tableParams.pageSize
    vm.orderBy = tableState.sort.predicate
    vm.reverse = tableState.sort.reverse
    vm.reportId = vm.searchConditions.reportId
    vm.sampleName = vm.searchConditions.sampleName
    vm.entrustedUnit = vm.searchConditions.entrustedUnit
    vm.inspectedUnit = vm.searchConditions.inspectedUnit
    vm.productionUnit = vm.searchConditions.productionUnit
    vm.receiveSampleId = vm.searchConditions.receiveSampleId
    vm.executeStandard = vm.searchConditions.executeStandard
    vm.sampleType = vm.searchConditions.sampleType
    vm.checkType = vm.searchConditions.checkType
    vm.startTime = vm.searchConditions.startTime
    vm.endTime = vm.searchConditions.endTime

    ReportService.getReportList(tableParams, vm.searchConditions, vm.status, isHandle).then(function (response) {
      vm.loading = false;
      var tempReports = [];
      if (response.data.success) {
        if (vm.status === 0 || vm.status === 1 || vm.status === 2) {
          angular.forEach(response.data.entity.list, function (item) {
            if (!vm.showHandled) {
              tempReports.push(angular.merge({}, item.report, {task: item.task[0]}));
            } else {
              tempReports.push(item.report);
            }
          });
        } else {
          tempReports = response.data.entity.list;
        }

        vm.reports = tempReports;
        vm.total = response.data.entity.total;
        tableState.pagination.numberOfPages = response.data.entity.pages;

        angular.forEach(vm.reports, function (item) {
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
        vm.total = 0;
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
      vm.refreshTable('reset');
    }
  }

  vm.toggleTable = function () {
    vm.showHandled = !vm.showHandled;
    vm.refreshTable('reset');
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
    vm.refreshTable('reset')
  }

  vm.eventSearch = function (e) {
    var keycode = window.event ? e.keyCode : e.which;
    if (keycode == 13) {
      vm.search()
    }
  }

  vm.startProcess = function (report) {
    var result = dialog.confirm('确认启动报告 ' + report.reportId + ' 流程？');
    result.then(function (res) {
      if (res) {
        ReportService.startProcess(report.reportId).then(function (response) {
          if (response.data.success) {
            toastr.success('报告 ' + report.reportId + ' 流程已启动!')
            vm.refreshTable();
          }
        });
      }
    });
  }


  vm.export = function (report) {
    var xhr;
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.onload = function () {
      var data = new Uint8Array(xhr.response);
      var blob = new Blob([data], {type: 'application/pdf;charset=utf-8'})
      var downloadUrl = window.URL.createObjectURL(blob);  
      var anchor = document.createElement("a");  
      anchor.href = downloadUrl;  
      anchor.download = report.reportId + ".pdf";  
      anchor.click();  
      window.URL.revokeObjectURL(data);
    };

    xhr.open('GET', '/api/v1/ahgz/report/export?reportId=' + report.reportId);
    xhr.setRequestHeader('Authorization', 'Bearer ' + $cookies.get('token'))
    xhr.responseType = 'arraybuffer';
    xhr.send();
  }

  vm.preview = function (report) {
    vm.printedIds = [report.reportId];
    window.DEFAULT_URL = '/api/v1/ahgz/report/preview?type=pdf&reportId=' + report.reportId;

    vm.previewModal = $uibModal.open({
      animation: true,
      windowClass: 'pdf-preview',
      templateUrl: 'controllers/business/report/preview/preview.html',
      controller: 'PDFPreviewCtrl as vm',
    });
  }

  vm.print = function (report) {
    vm.printedIds = [report.reportId];
    $rootScope.loading = true;
    var iframe = document.createElement('iframe');
    window.DEFAULT_URL = '/api/v1/ahgz/report/preview?type=pdf&reportId=' + report.reportId;
    // iframe.style.display = 'none';
    iframe.style.opacity = '0';
    iframe.style.height = '1px';
    iframe.id = 'printIframe';
    iframe.src = 'http://' + location.host + '/pdfjs/web/viewer.html';
    document.body.appendChild(iframe);
    var iwin = document.getElementById('printIframe').contentWindow;

    var interval = $interval(function () {
      var isReady = iwin.PDFViewerApplication && iwin.PDFViewerApplication.pdfViewer && iwin.PDFViewerApplication.pdfViewer._pageViewsReady;
      if (isReady) {
        $rootScope.loading = false;
        iwin.print();
        $interval.cancel(interval);
      }
    }, 100)
  }

  vm.batchPrint = function () {
    vm.printedIds = angular.copy(vm.selectedItems);
    $rootScope.loading = true;

    var xhr;
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.onload = function () {
      window.DEFAULT_URL = new Uint8Array(xhr.response);
      var iframe = document.createElement('iframe');
      // iframe.style.display = 'none';
      iframe.style.opacity = '0';
      iframe.style.height = '1px';
      iframe.id = 'printIframe';
      iframe.src = 'http://' + location.host + '/pdfjs/web/viewer.html';
      document.body.appendChild(iframe);
      var iwin = document.getElementById('printIframe').contentWindow;

      var interval = $interval(function () {
        var isReady = iwin.PDFViewerApplication && iwin.PDFViewerApplication.pdfViewer && iwin.PDFViewerApplication.pdfViewer._pageViewsReady;
        if (isReady) {
          $rootScope.loading = false;
          vm.itemSelected = [], vm.selectedItems = [], vm.allSelected = false;
          iwin.print();
          $interval.cancel(interval);
        }
      }, 100)
    };

    xhr.open('POST', '/api/v1/ahgz/report/preview');
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.responseType = 'arraybuffer';
    xhr.send(JSON.stringify(vm.selectedItems));
  }

  vm.finishPrint = function (report) {
    var result = dialog.confirm('确认已完成报告的打印工作?');
    result.then(function (res) {
      if (res) {
        ReportService.batchUpdateReportStatus([report.reportId], '4').then(function (response) {
          if (response.data.success) {
            vm.refreshTable();
          }
        });
      }
    });
  }

  function afterPrint () {
    return
    if (document.getElementById('printIframe')) {
      document.body.removeChild(document.getElementById('printIframe'));
    }
    if (vm.previewModal) {
      vm.previewModal.close();
    }
    var isReportReady = true
    angular.forEach(vm.printedIds, function (printedId) {
      angular.forEach(vm.reports, function (report) {
        if (report.reportId === printedId && report.reportStatus < 3) {
          isReportReady = false
          return
        }
      })
    })
    if (!isReportReady) return
    var result = dialog.confirm('是否已完成报告的所有打印工作?');
    result.then(function (res) {
      if (res) {
        ReportService.batchUpdateReportStatus(vm.printedIds, '4').then(function (response) {
          if (response.data.success) {
            vm.refreshTable();
          }
        });
      }
    });
  };
  window.afterPrint = afterPrint;



/*
  var LODOP;
  vm.preview = function (report) {
    ReportService.getReportData(report.receiveSampleId, 'html').then(function (response) {
      LODOP = getLodop();
      LODOP.PRINT_INIT('lodop');	
      LODOP.SET_PRINT_PAGESIZE(1,0,0,"A4")
      createOneTask(response.data);
      LODOP.PREVIEW();
    });
  }

  vm.print = function (report) {
    ReportService.getReportData(report.receiveSampleId, 'html').then(function (response) {
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
      promiseArr.push(ReportService.getReportData(id, 'html'));
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
*/

  // 单选、复选
  vm.itemSelected = [];
  vm.selectedItems = [];
  vm.selectAll = function () {
    if (vm.allSelected){
      vm.selectedItems = [];
      angular.forEach(vm.reports, function (item, idx) {
        vm.selectedItems.push(item.reportId);
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
      vm.selectedItems.push(item.reportId);
      vm.itemSelected[idx] = true;
      if(vm.selectedItems.length == vm.reports.length){
        vm.allSelected = true;
      }
    } else {
      for (var i=0,len=vm.selectedItems.length; i<len; i++){
        if (item.reportId == vm.selectedItems[i]) {
          vm.selectedItems.splice(i, 1);
          break;
        }
      };
      vm.itemSelected[idx] = false;
      vm.allSelected = false;
    }
  }
});
