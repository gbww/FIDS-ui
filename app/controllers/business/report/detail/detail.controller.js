'use strict';

angular.module('com.app').controller('ReportDetailCtrl', function ($rootScope, $state, $stateParams, $q, $uibModal, api, toastr, SampleService, ReportService, drawUsers, examineUsers, templates) {
  var vm = this;
  $rootScope.loading = false;

  vm.type = $stateParams.type;
  vm.status = $stateParams.status;
  vm.taskId = $stateParams.taskId;
  vm.templates = templates;
  vm.drawUsers = drawUsers;
  vm.examineUsers = examineUsers;

  var businessBC = api.breadCrumbMap.business;
  var report = angular.copy(businessBC.report.root);
  report.params = {
    status: vm.status
  }
  var detail = angular.copy(businessBC.report.detail);
  if (vm.type === 'bz') {
    detail.name = '编制报告';
  }
  vm.breadCrumbArr = [businessBC.root, report, detail];

  vm.showReport = true;
  vm.showReportCi = true;

  vm.getReportInfo = function () {
    vm.loading = true;
    $q.all({
      report: ReportService.getReportInfo($stateParams.id),
      checkItem: ReportService.getReportCi($stateParams.id)
    }).then(function (response) {
      vm.loading = false;
      if (response.report.data.success) {
        vm.report = response.report.data.entity.receiveSample;
        var flag = false;
        angular.forEach(vm.drawUsers, function (user) {
          if (user.name === vm.report.drawUser) {
            flag = true;
          }
        })
        !flag && vm.drawUsers.push({name: vm.report.drawUser});
        vm.initDrawUser = vm.report.drawUser;

        var reportExtend = response.report.data.entity.reportExtend;
        if (reportExtend) {
          vm.tmplId = reportExtend.id;
          vm.templateId = reportExtend.templateId
          vm.initTemplateId = reportExtend.templateId
        }
      } else {
        toastr.error(response.report.data.message);
      }

      if (response.checkItem.data.success) {
        vm.checkItems = response.checkItem.data.entity;
      } else {
        toastr.error(response.checkItem.data.message);
      }

      if (!vm.report.dataRemarks && vm.checkItems) {
        completeDataRemarks();
      }
      if (!vm.report.devices && vm.checkItems && vm.type === 'bz') {
        completeDevices();
      }
    }).catch(function (err) {
      vm.loading = false;
      toastr.error(err.data);
    });
  };
  vm.getReportInfo();


  function completeDataRemarks() {
    var str = '', idx = 1;
    var measureFlag = false, kqslFlag = false, halFlag1 = false, halFlag2 = false, halFlag3 = false;
    angular.forEach(vm.checkItems, function (checkItem) {
      if (checkItem.measuredValue === '未检出') {
        measureFlag = true
      }
      if (checkItem.name === '磺胺类（总量）') {
        if (checkItem.method === 'GB/T 21316') {
          halFlag2 = true
        } else if (checkItem.method === '农业部 1025 号公告-23-2008以及农业部 1077 号公告-1-2008') {
          halFlag3 = true
        } else {
          halFlag1 = true
        }
      }
    })
    if (measureFlag) {
      str += (idx++) + '、“未检出”表示实测值小于检出限/定量限。'
    }
    if (kqslFlag) {
      str += (idx++) + '、孔雀石绿系指孔雀石绿及其代谢物隐色孔雀石绿残留量之和，以孔雀石绿表示。'
    }
    if (halFlag1) {
      str += (idx++) + '、磺胺类（总量）项目包括：磺胺嘧啶、磺胺二甲嘧啶、磺胺甲基嘧啶、磺胺甲恶唑、磺胺间二甲氧嘧啶、磺胺邻二甲氧嘧啶、磺胺间甲氧嘧啶、磺胺氯哒嗪、磺胺喹恶啉之和。检验结果以上述 9 种磺胺的测定结果之和表示。'
    }
    if (halFlag2) {
      str += (idx++) + '、磺胺类（总量）项目包括：磺胺甲基嘧啶（磺胺甲嘧啶）、磺胺甲恶唑（磺胺甲鯻唑）、磺胺二甲嘧啶、磺胺间二甲氧嘧啶（磺胺地索辛）、磺胺间甲氧嘧啶、磺胺喹恶啉（磺胺喹沙啉）、甲氧苄啶。'
    }
    if (halFlag3) {
      str += (idx++) + '、磺胺类（总量）项目包括：磺胺嘧啶、磺胺二甲嘧啶、磺胺甲基嘧啶、磺胺甲恶唑、磺胺间二甲氧嘧啶、磺胺邻二甲氧嘧啶、磺胺间甲氧嘧啶、磺胺氯哒嗪、磺胺喹恶啉之和。'
    }
    vm.report.dataRemarks = str;
  }
  /**
   * 根据检测项自动填充数据页备注
   */
  // function completeDataRemarks() {
  //   var quantitationLimitStr = [], detectionLimitStr = [];
  //   angular.forEach(vm.checkItems, function (checkItem) {
  //     if (checkItem.measuredValue === '未检出') {
  //       var str = checkItem.name + ' ' + checkItem.standardValue + checkItem.unit;
  //       if (checkItem.quantitationLimit) {
  //         quantitationLimitStr.push(str)
  //       } else if (checkItem.detectionLimit) {
  //         detectionLimitStr.push(str)
  //       }
  //     }
  //   });
  //   var str = '';
  //   if (quantitationLimitStr.length > 0) {
  //     str += '1、方法定量限：' + quantitationLimitStr.join('，') + '。';
  //     if (detectionLimitStr.length > 0) {
  //       str += '2、方法检出限：' + detectionLimitStr.join('，') + '。';
  //     }
  //   } else if (detectionLimitStr.length > 0) {
  //     str += '1、方法检出限：' + detectionLimitStr.join('，') + '。';
  //   }
  //   vm.report.dataRemarks = str;
  // }


  /**
   * 根据检测项自动填充所用设备
   */
  function completeDevices () {
    var deviceArr = [];
    angular.forEach(vm.checkItems, function (checkItem) {
      if (checkItem.device) {
        deviceArr.push(checkItem.device);
      }
    })
    vm.report.devices = deviceArr.join('，');
  }

  vm.changeContract = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'lg',
      backdrop: 'static',
      templateUrl: 'controllers/business/sample/create/select-contract/selectContract.html',
      controller: 'SelectContractCtrl as vm'
    });

    modalInstance.result.then(function (res) {
      vm.report.protocolId = res;
    })
  }


  /**
   * 附件操作
   */
  vm.deleteAppendix = function () {
    delete vm.report.appendix;
  }
  vm.file = null;
  vm.addFile = function (event) {
    vm.file = event.target.files[0];
    vm.deleteAppendix();
  }
  vm.deleteFile = function () {
    vm.file = null;
  }

  vm.downloadFile = function (filepath) {
    var filename = filepath.substring(filepath.lastIndexOf('/') + 1);
    var link = document.createElement('a');
    link.href = '/api/v1/ahgz/receive/attachment/download?path=' + filepath;
    link.download = filename;
    link.click();
  };


  
  /**
   * 确认时同时更新报告内容和模板信息
   */

  vm.updateReport = function () {
    ReportService.updateReport(vm.report).then(function (response) {
      if (response.data.success) {
        toastr.success('报告修改成功！');
        $state.go('app.business.report', { status: vm.status });
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      toastr.error(err.data);
    })
  }

  vm.updateDrawUser = function () {
    var data = {
      processId: vm.report.reportProcessId,
      reportId: vm.report.reportId,
      newDrawUser: vm.report.drawUser
    };
    var reportData = angular.copy(vm.report);
    delete reportData.drawUser
    ReportService.updateReport(reportData).then(function () {
      return ReportService.updateDrawUser(data);
    }).then(function (response) {
      if (response.data.success) {
        toastr.success('报告修改成功！');
        $state.go('app.business.report', { status: vm.status });
      } else {
        toastr.error(response.data.message);
      }
    });
  }

  vm.runEditTask = function () {
    var data = {
      examinePersonName: vm.report.examineUser,
      reportProcessId: vm.report.reportProcessId,
      reportId: vm.report.reportId,
      comment: vm.comment,
    };
    ReportService.updateReport(vm.report).then(function () {
      return ReportService.runEditTask(vm.taskId, data);
    }).then(function (response) {
      if (response.data.success) {
        toastr.success('报告修改成功！');
        $state.go('app.business.report', { status: vm.status + 1 });
      } else {
        toastr.error(response.data.message);
      }
    });
  }

  vm.ok = function (form) {
    if (form.$invalid) {
      vm.submitted = true;
      return;
    }

    /**   
     * 上传、修改附件
     */
    if (vm.file) {
      var formData = new FormData();
      formData.append('file', vm.file);
      formData.append('reportId', vm.report.reportId);
      SampleService.uploadSampleAppendix(formData).catch(function (err) {
        toastr.error(err.data);
      })
    }

    // 没有template表明是在编制状态下进行编辑
    if (!vm.templateId) {
      vm.report.drawUser !== vm.initDrawUser ? vm.updateDrawUser() : vm.updateReport();
    } else {
      var templateData = {
        reportId: vm.report.reportId
      };
      angular.forEach(vm.templates, function (item) {
        if (item.id === vm.templateId) {
          angular.merge(templateData, {
            templateId: vm.templateId,
            templateName: item.name,
            templateDesc: item.description
          })
        }
      });

      // 绑定模板
      if (!vm.initTemplateId) {
        ReportService.bindReportTmpl(templateData).then(function () {
          vm.type === 'bj' ? (vm.report.drawUser !== vm.initDrawUser ? vm.updateDrawUser() : vm.updateReport()) : vm.runEditTask();
        }).catch(function (err) {
          toastr.error(err.data);
        })
      } else {
        // 更新模板
        if (!angular.equals(vm.templateId, vm.initTemplateId)) {
          ReportService.updateReportTmpl(vm.tmplId, templateData).then(function () {
            vm.type === 'bj' ? vm.updateReport() : vm.runEditTask();
          }).catch(function (err) {
            toastr.error(err.data);
          })
        } else {
          vm.type === 'bj' ? vm.updateReport() : vm.runEditTask();
        }
      }
    }
  }


  /** 
   * 检测项操作
  */

  function getSampleCi () {
    ReportService.getReportCi($stateParams.id).then(function (response) {
      if (response.data.success) {
        vm.checkItems = response.data.entity;
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      toastr.error(err.data);
    });
  }

  vm.edit = function (ci) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/business/report/detail/edit/edit.html',
      controller: 'EditReportCiCtrl as vm',
      resolve: {
        reportId: function () { return vm.report.reportId; },
        checkItem: function () { return ci; },
        units: ['$rootScope', '$q', 'UnitService', function ($rootScope, $q, UnitService) {
          $rootScope.loading = true;
          var deferred = $q.defer();
          UnitService.getUnitList().then(function (response) {
            if (response.data.success) {
              var res = [];
              angular.forEach(response.data.entity, function (item) {
                res.push(item.unitName);
              })
              deferred.resolve(res);
            } else {
              deferred.resolve([]);
            }
          });
          return deferred.promise;
        }],
        organizations: ['$rootScope', '$q', 'PrivilegeService', function ($rootScope, $q, PrivilegeService) {
          $rootScope.loading = true;
          var deferred = $q.defer();
          PrivilegeService.getOrganizationList().then(function (response) {
            if (response.data.success) {
              deferred.resolve(response.data.entity);
            } else {
              deferred.reject();
            }
          });
          return deferred.promise;
        }]
      }
    });

    modalInstance.result.then(function (res) {
      toastr.success('检测项修改成功！');
      getSampleCi();
    });
  }

  vm.delete = function (ci) {
    var result = dialog.confirm('确认从接样单中删除检测项 ' + ci.name + ' ?');
    result.then(function (res) {
      if (res) {
        SampleService.deleteSampleCi(vm.report.reportId, [ci.id]).then(function (response) {
          if (response.data.success) {
            getSampleCi();
            toastr.success('接样单检测项删除成功！');
          } else {
            toastr.error(response.data.message);
          }
        }).catch(function (error) {
          toastr.error(error.data.message)
        });
      }
    })
  }

  // 判定结论
  vm.determineArr = [' ', '/', '合格', '不合格'];
  vm.resultDict = {
    ' ': ['该样品按照 标准检验，结果见附页。'],
    '/': ['详见“检测结果”。'],
    '合格': [
      '该批次产品经检验，符合《 》标准的要求。',
      '该批次产品依据“农业部办公厅关于印发茄果类蔬菜等58类无公害农产品检测目录的通知（农质部[2015]4号）”中\'     \'的要求检验，结果符合规定。',
      '该样品按照&[检验依据]标准检验，所检项目均合格。',
      '经抽样检验，所检项目符合 标准要求。'
    ],
    '不合格': [
      '该批次产品依据“农业部办公厅关于印发茄果类蔬菜等58类无公害农产品检测目录的通知（农质部[2015]4号）”中\'     \'的要求检验，结果不符合规定。',
      '该样品按照&[检验依据]标准检验，不合格。',
      '经抽样检验，    项目不符合《》标准要求，检验结论为不合格。'
    ]
  }
  

  vm.checkTypeArr = ['监督检验', '委托检验', '发证检验', '认证检验', '省级抽检', '风险监测'];
  vm.reportLinkArr = ['流通环节', '餐饮环节', '生产环节'];

  vm.reportLxArr = ['食用农产品', '工业加工食品', '餐饮加工食品', '保健食品', '食品添加剂', '食品相关产品', '其他'];
  vm.packageClassifyArr = ['预包装', '散装'];

  vm.reportWayArr = ['随机抽样', '掷骰抽样'];
  vm.specificationModelArr = ['计量称重', '散装', 'kg/袋', 'g/袋', 'ml/瓶', 'L/瓶', 'L/桶', 'g/盒', 'kg/盒', 'ml/盒', 'L/盒'];
  vm.executeStandardArr = ['GB/T 23587-2009'];
  vm.processingTechnologyArr = ['合格品', '优等品', '一等品', '二等品', '三等品', '四等品',];
  vm.closedStatusArr = ['封样完好', '封样破损'];
  vm.reportStatusArr = ['固体', '液体', '半固体', '气体', '完好、新鲜、无异味', '腐烂、有异味'];
  vm.reportBasenumberArr = ['瓶', '袋', 'g', 'kg', 'L', 'ml'];
  vm.saveWayArr = ['常温', '冷冻', '冷藏'];
  vm.reportNamesArr = ['鲍仕峰 陶云飞', '杨洋 李振凡', '张磊 徐斌'];
  vm.responsiblePersonArr = [];
  vm.receiveUserArr = [];
});
